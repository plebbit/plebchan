import { useCallback } from 'react';
import { Comment, useAccount, usePublishComment } from '@plebbit/plebbit-react-hooks';
import useAnonMode from './use-anon-mode';
import usePublishReplyStore from '../stores/use-publish-reply-store';

const usePublishReply = ({ cid, subplebbitAddress }: { cid: string; subplebbitAddress: string }) => {
  const parentCid = cid;
  const account = useAccount();
  const { anonMode } = useAnonMode();

  const { author, signer, content, link, spoiler, publishCommentOptions } = usePublishReplyStore((state) => ({
    author: state.author[parentCid] || (account?.author ? { displayName: account.author.displayName || undefined } : undefined),
    displayName: state.displayName[parentCid] || account?.author?.displayName,
    signer: state.signer[parentCid] || undefined,
    content: state.content[parentCid] || undefined,
    link: state.link[parentCid] || undefined,
    spoiler: state.spoiler[parentCid] || false,
    publishCommentOptions: state.publishCommentOptions[parentCid],
  }));

  const setReplyStore = usePublishReplyStore((state) => state.setReplyStore);
  const resetReplyStore = usePublishReplyStore((state) => state.resetReplyStore);

  const setPublishReplyOptions = useCallback(
    (options: Comment) => {
      const newOptions: Comment = {
        subplebbitAddress,
        parentCid,
        content: options.content === '' ? undefined : options.content ?? content,
        link: options.link === '' ? undefined : options.link ?? link,
        spoiler: options.spoiler ?? spoiler,
        displayName: options.displayName === '' ? undefined : options.displayName ?? author?.displayName ?? account?.author?.displayName,
      };

      if ('displayName' in options) {
        newOptions.displayName = options.displayName === '' ? undefined : options.displayName;
      }

      if (anonMode) {
        newOptions.signer = signer || options.signer;
        newOptions.author = {
          ...(author || {}),
          address: newOptions.signer?.address,
          ...('displayName' in options && { displayName: options.displayName }),
        };
      } else {
        newOptions.signer = undefined;
        newOptions.author = {
          address: account?.author?.address,
          ...('displayName' in options && { displayName: options.displayName }),
        };
      }

      setReplyStore(newOptions);
    },
    [subplebbitAddress, parentCid, author, signer, content, link, spoiler, setReplyStore, anonMode, account],
  );

  const resetPublishReplyOptions = useCallback(() => resetReplyStore(parentCid), [parentCid, resetReplyStore]);

  const { index, publishComment } = usePublishComment(publishCommentOptions);

  return { setPublishReplyOptions, resetPublishReplyOptions, replyIndex: index, publishReply: publishComment, setReplyStore };
};

export default usePublishReply;
