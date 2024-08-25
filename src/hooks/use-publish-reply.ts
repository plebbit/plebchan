import { useCallback } from 'react';
import { ChallengeVerification, Comment, PublishCommentOptions, usePublishComment } from '@plebbit/plebbit-react-hooks';
import { create } from 'zustand';
import { alertChallengeVerificationFailed } from '../lib/utils/challenge-utils';
import useChallengesStore from '../stores/use-challenges-store';
import useAnonMode from './use-anon-mode';

type SetReplyStoreData = {
  subplebbitAddress: string;
  parentCid: string;
  author?: any;
  displayName?: string;
  content: string;
  link?: string;
  signer?: any;
  spoiler: boolean;
};

type ReplyState = {
  author: { [parentCid: string]: any | undefined };
  displayName: { [parentCid: string]: string | undefined };
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
  displayName: {},
  content: {},
  link: {},
  signer: {},
  spoiler: {},
  publishCommentOptions: {},

  setReplyStore: (data: SetReplyStoreData) =>
    set((state) => {
      const { subplebbitAddress, parentCid, author, displayName, content, link, signer, spoiler } = data;
      const updatedAuthor = displayName ? { ...author, displayName } : author;

      const publishCommentOptions: PublishCommentOptions = {
        subplebbitAddress,
        parentCid,
        content,
        link,
        spoiler,
        ...(author && { author: updatedAuthor }),
        ...(signer && { signer }),
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
        author: { ...state.author, [parentCid]: updatedAuthor },
        displayName: { ...state.displayName, [parentCid]: displayName },
        content: { ...state.content, [parentCid]: content },
        link: { ...state.link, [parentCid]: link },
        signer: { ...state.signer, [parentCid]: signer },
        spoiler: { ...state.spoiler, [parentCid]: spoiler },
        publishCommentOptions: { ...state.publishCommentOptions, [parentCid]: publishCommentOptions },
      };
    }),

  resetReplyStore: (parentCid) =>
    set((state) => ({
      author: { ...state.author, [parentCid]: undefined },
      displayName: { ...state.displayName, [parentCid]: undefined },
      content: { ...state.content, [parentCid]: undefined },
      link: { ...state.link, [parentCid]: undefined },
      signer: { ...state.signer, [parentCid]: undefined },
      spoiler: { ...state.spoiler, [parentCid]: undefined },
      publishCommentOptions: { ...state.publishCommentOptions, [parentCid]: undefined },
    })),
}));

const useReply = ({ cid, subplebbitAddress }: { cid: string; subplebbitAddress: string }) => {
  const parentCid = cid;
  const { author, displayName, signer, content, link, spoiler, publishCommentOptions } = useReplyStore((state) => ({
    author: state.author[parentCid],
    displayName: state.displayName[parentCid],
    signer: state.signer[parentCid],
    content: state.content[parentCid],
    link: state.link[parentCid],
    spoiler: state.spoiler[parentCid],
    publishCommentOptions: state.publishCommentOptions[parentCid],
  }));

  const { anonMode } = useAnonMode();

  const setReplyStore = useReplyStore((state) => state.setReplyStore);
  const resetReplyStore = useReplyStore((state) => state.resetReplyStore);

  const setPublishReplyOptions = useCallback(
    (options: Partial<SetReplyStoreData>) => {
      const newOptions: Partial<SetReplyStoreData> = {
        subplebbitAddress,
        parentCid,
        content: options.content || content,
        displayName: options.displayName || displayName,
        link: options.link || link,
        spoiler: options.spoiler ?? spoiler,
        author: anonMode ? signer?.author || options.author || author || { displayName } : undefined,
        signer: anonMode ? signer || options.signer : undefined,
      };

      setReplyStore(newOptions as SetReplyStoreData);
    },
    [subplebbitAddress, parentCid, author, displayName, signer, content, link, spoiler, setReplyStore, anonMode],
  );

  const resetPublishReplyOptions = useCallback(() => resetReplyStore(parentCid), [parentCid, resetReplyStore]);

  const { index, publishComment } = usePublishComment(publishCommentOptions);

  return { setPublishReplyOptions, resetPublishReplyOptions, replyIndex: index, publishReply: publishComment, setReplyStore };
};

export default useReply;
