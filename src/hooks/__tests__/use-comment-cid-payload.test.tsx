import * as React from 'react';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { decodeCommentCidCommunityAddress, useCommentCidPayload } from '../use-comment-cid-payload';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const act = (React as { act?: (cb: () => void | Promise<void>) => void | Promise<void> }).act as (cb: () => void | Promise<void>) => void | Promise<void>;

const testState = vi.hoisted(() => ({
  account: undefined as { pkc?: { fetchCid: ReturnType<typeof vi.fn> } } | undefined,
}));

vi.mock('@bitsocial/bitsocial-react-hooks', () => ({
  useAccount: () => testState.account,
}));

let container: HTMLDivElement;
let latestSnapshot: ReturnType<typeof useCommentCidPayload> | undefined;
let root: Root;

const HookHarness = ({ cid }: { cid?: string }) => {
  latestSnapshot = useCommentCidPayload(cid);
  return null;
};

const renderCid = async (cid?: string) => {
  await act(async () => {
    root.render(createElement(HookHarness, { cid }));
  });
};

describe('useCommentCidPayload', () => {
  beforeEach(() => {
    latestSnapshot = undefined;
    testState.account = undefined;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('decodes the community name from a fetched CID wrapper', () => {
    expect(
      decodeCommentCidCommunityAddress('comment-cid', {
        content: JSON.stringify({
          communityName: 'business-and-finance.bso',
          communityPublicKey: 'community-key',
          content: 'thread body',
        }),
      }),
    ).toBe('business-and-finance.bso');
  });

  it('falls back to the community public key for unnamed communities', () => {
    const encoded = new TextEncoder().encode(JSON.stringify({ communityPublicKey: 'community-key', content: 'thread body' }));

    expect(decodeCommentCidCommunityAddress('comment-cid', { content: encoded })).toBe('community-key');
  });

  it('accepts an already decoded comment payload', () => {
    expect(decodeCommentCidCommunityAddress('comment-cid', { communityName: 'outdoors.bso', content: 'thread body' })).toBe('outdoors.bso');
  });

  it('rejects CID payloads without a community identifier', () => {
    expect(() => decodeCommentCidCommunityAddress('comment-cid', { content: JSON.stringify({ content: 'thread body' }) })).toThrow(
      "CID 'comment-cid' did not contain a community identifier",
    );
  });

  it('fetches the immutable CID once and publishes its community address', async () => {
    const fetchCid = vi.fn().mockResolvedValue({
      content: JSON.stringify({ communityName: 'videogames-strategy.bso', content: 'thread body' }),
    });
    testState.account = { pkc: { fetchCid } };

    await act(async () => {
      root.render(createElement(React.Fragment, null, createElement(HookHarness, { cid: 'comment-cid' }), createElement(HookHarness, { cid: 'comment-cid' })));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(fetchCid).toHaveBeenCalledOnce();
    expect(fetchCid).toHaveBeenCalledWith({ cid: 'comment-cid' });
    expect(latestSnapshot).toEqual({ communityAddress: 'videogames-strategy.bso', state: 'succeeded' });
  });

  it('reuses the successful snapshot immediately after unmounting and revisiting a thread', async () => {
    const fetchCid = vi.fn().mockResolvedValue({ communityName: 'music.bso' });
    testState.account = { pkc: { fetchCid } };
    await renderCid('thread-cid');
    const successfulSnapshot = latestSnapshot;
    await act(async () => root.render(null));
    await renderCid('thread-cid');

    expect(fetchCid).toHaveBeenCalledOnce();
    expect(latestSnapshot).toBe(successfulSnapshot);
    expect(latestSnapshot?.state).toBe('succeeded');
  });

  it('keeps a pending request shared when its original subscriber leaves and another arrives', async () => {
    let resolveFetch!: (value: unknown) => void;
    const fetchCid = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    testState.account = { pkc: { fetchCid } };
    await renderCid('pending-cid');
    await act(async () => root.render(null));
    await renderCid('pending-cid');

    expect(fetchCid).toHaveBeenCalledOnce();
    expect(latestSnapshot?.state).toBe('fetching');
    await act(async () => resolveFetch({ communityName: 'music.bso' }));
    expect(latestSnapshot).toEqual({ communityAddress: 'music.bso', state: 'succeeded' });
  });

  it('retains a successful request that finishes after all subscribers leave', async () => {
    let resolveFetch!: (value: unknown) => void;
    const fetchCid = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    testState.account = { pkc: { fetchCid } };
    await renderCid('pending-cid');
    await act(async () => root.render(null));
    await act(async () => resolveFetch({ communityName: 'music.bso' }));
    await renderCid('pending-cid');

    expect(fetchCid).toHaveBeenCalledOnce();
    expect(latestSnapshot).toEqual({ communityAddress: 'music.bso', state: 'succeeded' });
  });

  it('retries a failed lookup after its last subscriber leaves', async () => {
    const fetchCid = vi.fn().mockRejectedValueOnce(new Error('temporary failure')).mockResolvedValueOnce({ communityName: 'music.bso' });
    testState.account = { pkc: { fetchCid } };
    await renderCid('retry-cid');
    expect(latestSnapshot?.state).toBe('failed');
    await act(async () => root.render(null));
    await renderCid('retry-cid');

    expect(fetchCid).toHaveBeenCalledTimes(2);
    expect(latestSnapshot).toEqual({ communityAddress: 'music.bso', state: 'succeeded' });
  });

  it('isolates cached results by client and stays idle without a client or CID', async () => {
    const firstClient = { fetchCid: vi.fn().mockResolvedValue({ communityName: 'first.bso' }) };
    const secondClient = { fetchCid: vi.fn().mockResolvedValue({ communityName: 'second.bso' }) };
    testState.account = { pkc: firstClient };
    await renderCid();
    expect(latestSnapshot).toEqual({ state: 'idle' });
    expect(firstClient.fetchCid).not.toHaveBeenCalled();
    await renderCid('shared-cid');
    expect(latestSnapshot?.communityAddress).toBe('first.bso');

    testState.account = { pkc: secondClient };
    await renderCid('shared-cid');
    expect(latestSnapshot?.communityAddress).toBe('second.bso');
    testState.account = undefined;
    await renderCid('shared-cid');
    expect(latestSnapshot).toEqual({ state: 'idle' });
    testState.account = { pkc: firstClient };
    await renderCid('shared-cid');
    expect(latestSnapshot?.communityAddress).toBe('first.bso');
    expect(firstClient.fetchCid).toHaveBeenCalledOnce();
    expect(secondClient.fetchCid).toHaveBeenCalledOnce();
  });

  it('bounds inactive successes and retains recently revisited threads', async () => {
    const fetchCid = vi.fn().mockResolvedValue({ communityName: 'music.bso' });
    testState.account = { pkc: { fetchCid } };
    for (let index = 0; index < 100; index++) await renderCid(`thread-${index}`);
    await renderCid('thread-0');
    await renderCid('thread-100');
    await renderCid('thread-0');
    expect(fetchCid).toHaveBeenCalledTimes(101);

    await renderCid('thread-1');
    expect(fetchCid).toHaveBeenCalledTimes(102);
  });
});
