import { useCallback } from 'react';
import { ChallengeVerification, Comment, PublishCommentOptions, usePublishComment } from '@plebbit/plebbit-react-hooks';
import { create } from 'zustand';
import { alertChallengeVerificationFailed } from '../lib/utils/challenge-utils';
import useChallengesStore from '../stores/use-challenges-store';

type SetReplyStoreData = {
  subplebbitAddress: string;
  parentCid: string;
  author: any | undefined;
  content: string | undefined;
  link: string | undefined;
  signer: any | undefined;
  spoiler: boolean | undefined;
};

type ReplyState = {
  author: { [parentCid: string]: any | undefined };
  content: { [parentCid: string]: string | undefined };
  link: { [parentCid: string]: string | undefined };
  signer: { [parentCid: string]: any | undefined };
  spoiler: { [parentCid: string]: boolean | undefined };
  publishCommentOptions: { [parentCid: string]: PublishCommentOptions | undefined };
  setReplyStore: (data: SetReplyStoreData) => void;
  resetReplyStore: (parentCid: string) => void;
};

const { addChallenge } = useChallengesStore.getState();

const useReplyStore = create<ReplyState>((set) => ({
  author: {},
  content: {},
  link: {},
  signer: {},
  spoiler: {},
  publishCommentOptions: {},
  setReplyStore: (data: SetReplyStoreData) =>
    set((state) => {
      const { subplebbitAddress, parentCid, author, content, link, signer, spoiler } = data;
      const publishCommentOptions = {
        subplebbitAddress,
        parentCid,
        author,
        signer,
        content,
        link,
        spoiler,
        onChallenge: (...args: any) => addChallenge(args),
        onChallengeVerification: (challengeVerification: ChallengeVerification, comment: Comment) => {
          alertChallengeVerificationFailed(challengeVerification, comment);
        },
        onError: (error: Error) => {
          console.error(error);
          alert(error.message);
        },
      };
      return {
        author: { ...state.author, [parentCid]: author },
        signer: { ...state.signer, [parentCid]: signer },
        content: { ...state.content, [parentCid]: content },
        link: { ...state.link, [parentCid]: link },
        spoiler: { ...state.spoiler, [parentCid]: spoiler },
        publishCommentOptions: { ...state.publishCommentOptions, [parentCid]: publishCommentOptions },
      };
    }),

  resetReplyStore: (parentCid) =>
    set((state) => ({
      author: { ...state.author, [parentCid]: undefined },
      signer: { ...state.signer, [parentCid]: undefined },
      content: { ...state.content, [parentCid]: undefined },
      link: { ...state.link, [parentCid]: undefined },
      spoiler: { ...state.spoiler, [parentCid]: undefined },
      publishCommentOptions: { ...state.publishCommentOptions, [parentCid]: undefined },
    })),
}));

const useReply = ({ cid, subplebbitAddress }: { cid: string; subplebbitAddress: string }) => {
  const parentCid = cid;
  const { author, signer, content, link, spoiler, publishCommentOptions } = useReplyStore((state) => ({
    author: state.author[parentCid],
    signer: state.signer[parentCid],
    content: state.content[parentCid],
    link: state.link[parentCid],
    spoiler: state.spoiler[parentCid],
    publishCommentOptions: state.publishCommentOptions[parentCid],
  }));

  const setReplyStore = useReplyStore((state) => state.setReplyStore);
  const resetReplyStore = useReplyStore((state) => state.resetReplyStore);

  const setPublishReplyOptions = useCallback(
    (options: Partial<SetReplyStoreData>) => {
      setReplyStore({
        subplebbitAddress,
        parentCid,
        author,
        signer,
        content,
        link,
        spoiler,
        ...options,
      });
    },
    [subplebbitAddress, parentCid, author, signer, content, link, spoiler, setReplyStore],
  );

  const resetPublishReplyOptions = useCallback(() => resetReplyStore(parentCid), [parentCid, resetReplyStore]);

  const { index, publishComment } = usePublishComment(publishCommentOptions);

  return { setPublishReplyOptions, resetPublishReplyOptions, replyIndex: index, publishReply: publishComment, setReplyStore };
};

export default useReply;
