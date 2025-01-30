import { ChallengeVerification, Comment, PublishCommentOptions } from '@plebbit/plebbit-react-hooks';
import { create } from 'zustand';
import { alertChallengeVerificationFailed } from '../lib/utils/challenge-utils';
import useChallengesStore from './use-challenges-store';

type ReplyState = {
  author: { [parentCid: string]: any | undefined };
  displayName: { [parentCid: string]: string | undefined };
  content: { [parentCid: string]: string | undefined };
  link: { [parentCid: string]: string | undefined };
  signer: { [parentCid: string]: any | undefined };
  spoiler: { [parentCid: string]: boolean | undefined };
  publishCommentOptions: { [parentCid: string]: PublishCommentOptions | undefined };
  setPublishReplyStore: (comment: Comment) => void;
  resetPublishReplyStore: (parentCid: string) => void;
};

const { addChallenge } = useChallengesStore.getState();

const usePublishReplyStore = create<ReplyState>((set) => ({
  author: {},
  displayName: {},
  content: {},
  link: {},
  signer: {},
  spoiler: {},
  publishCommentOptions: {},

  setPublishReplyStore: (comment: Comment) =>
    set((state) => {
      const { subplebbitAddress, parentCid, author, content, link, signer, spoiler } = comment;

      const displayName = 'displayName' in comment ? comment.displayName || undefined : author?.displayName;

      const baseAuthor = author ? { ...author } : {};
      delete baseAuthor.displayName;

      const updatedAuthor = displayName ? { ...baseAuthor, displayName } : baseAuthor;

      const publishCommentOptions: PublishCommentOptions = {
        subplebbitAddress,
        parentCid,
        postCid: comment?.postCid || parentCid,
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

      if (Object.keys(updatedAuthor).length > 0) {
        publishCommentOptions.author = updatedAuthor;
      }

      if (signer) {
        publishCommentOptions.signer = signer;
      }

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

  resetPublishReplyStore: (parentCid) =>
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

export default usePublishReplyStore;
