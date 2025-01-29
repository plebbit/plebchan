import { useCallback } from 'react';
import { Comment, useAccount, usePublishComment } from '@plebbit/plebbit-react-hooks';
import useAnonMode from './use-anon-mode';
import usePublishReplyStore from '../stores/use-publish-reply-store';

const usePublishReply = ({ cid, subplebbitAddress, postCid }: { cid: string; subplebbitAddress: string; postCid?: string }) => {
  const parentCid = cid;
  const account = useAccount();
  const { anonMode } = useAnonMode(postCid);

  const { author, signer, content, link, spoiler, publishCommentOptions } = usePublishReplyStore((state) => ({
    author: state.author[parentCid],
    signer: state.signer[parentCid] || undefined,
    content: state.content[parentCid] || undefined,
    link: state.link[parentCid] || undefined,
    spoiler: state.spoiler[parentCid] || false,
    publishCommentOptions: state.publishCommentOptions[parentCid],
  }));

  const setReplyStore = usePublishReplyStore((state) => state.setReplyStore);
  const resetReplyStore = usePublishReplyStore((state) => state.resetReplyStore);

  const createBaseOptions = useCallback(() => {
    const baseOptions: Comment = {
      subplebbitAddress,
      parentCid,
      postCid: postCid ?? parentCid,
      content,
      link,
      spoiler,
    };

    if (anonMode) {
      baseOptions.author = {
        address: signer?.address,
        displayName: author?.displayName,
      };
      baseOptions.signer = signer;
    } else {
      baseOptions.author = {
        ...account?.author,
        displayName: author?.displayName || account?.author?.displayName,
      };
    }

    return baseOptions;
  }, [anonMode, author, content, link, parentCid, postCid, signer, spoiler, subplebbitAddress, account]);

  const setPublishReplyOptions = useCallback(
    (options: Partial<Comment>) => {
      const baseOptions = createBaseOptions();
      const sanitizedOptions = Object.entries(options).reduce((acc, [key, value]) => {
        acc[key] = value === '' ? undefined : value;
        return acc;
      }, {} as Partial<Comment>);

      const newOptions = { ...baseOptions, ...sanitizedOptions };
      setReplyStore(newOptions);
    },
    [createBaseOptions, setReplyStore],
  );

  const resetPublishReplyOptions = useCallback(() => resetReplyStore(parentCid), [parentCid, resetReplyStore]);

  const { index, publishComment } = usePublishComment(publishCommentOptions);

  return {
    setPublishReplyOptions,
    resetPublishReplyOptions,
    replyIndex: index,
    publishReply: publishComment,
  };
};

export default usePublishReply;
