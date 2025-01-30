import { useCallback } from 'react';
import { Comment, useAccount, usePublishComment } from '@plebbit/plebbit-react-hooks';
import useAnonMode from './use-anon-mode';
import usePublishPostStore from '../stores/use-publish-post-store';

const usePublishPost = ({ subplebbitAddress }: { subplebbitAddress?: string }) => {
  const account = useAccount();
  const { anonMode } = useAnonMode();

  const { author, signer, title, content, link, spoiler, publishCommentOptions } = usePublishPostStore((state) => ({
    author: state.author,
    signer: state.signer,
    title: state.title || undefined,
    content: state.content || undefined,
    link: state.link || undefined,
    spoiler: state.spoiler || false,
    publishCommentOptions: state.publishCommentOptions,
  }));

  const setPublishPostStore = usePublishPostStore((state) => state.setPublishPostStore);
  const resetPublishPostStore = usePublishPostStore((state) => state.resetPublishPostStore);

  const createBaseOptions = useCallback(() => {
    const baseOptions: Comment = {
      subplebbitAddress,
      title,
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
  }, [anonMode, author, content, link, signer, spoiler, subplebbitAddress, title, account]);

  const setPublishPostOptions = useCallback(
    (options: Partial<Comment>) => {
      const baseOptions = createBaseOptions();
      const sanitizedOptions = Object.entries(options).reduce((acc, [key, value]) => {
        acc[key] = value === '' ? undefined : value;
        return acc;
      }, {} as Partial<Comment>);

      const newOptions = { ...baseOptions, ...sanitizedOptions };
      setPublishPostStore(newOptions);
    },
    [createBaseOptions, setPublishPostStore],
  );

  const resetPublishPostOptions = useCallback(() => resetPublishPostStore(), [resetPublishPostStore]);

  const { index, publishComment } = usePublishComment(publishCommentOptions);

  return {
    setPublishPostOptions,
    resetPublishPostOptions,
    postIndex: index,
    publishPost: publishComment,
    publishPostOptions: publishCommentOptions,
  };
};

export default usePublishPost;
