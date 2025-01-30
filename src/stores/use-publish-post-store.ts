import { ChallengeVerification, Comment, PublishCommentOptions } from '@plebbit/plebbit-react-hooks';
import { create } from 'zustand';
import { alertChallengeVerificationFailed } from '../lib/utils/challenge-utils';
import useChallengesStore from './use-challenges-store';

type SubmitState = {
  author?: any | undefined;
  displayName?: string | undefined;
  signer?: any | undefined;
  subplebbitAddress: string | undefined;
  title: string | undefined;
  content: string | undefined;
  link: string | undefined;
  spoiler: boolean | undefined;
  publishCommentOptions: PublishCommentOptions;
  setPublishPostStore: (data: Partial<SubmitState>) => void;
  resetPublishPostStore: () => void;
};

const { addChallenge } = useChallengesStore.getState();

const usePublishPostStore = create<SubmitState>((set) => ({
  author: undefined,
  displayName: undefined,
  signer: undefined,
  subplebbitAddress: undefined,
  title: undefined,
  content: undefined,
  link: undefined,
  spoiler: undefined,
  publishCommentOptions: {},
  setPublishPostStore: (comment: Comment) =>
    set(() => {
      const { subplebbitAddress, author, content, link, signer, spoiler, title } = comment;

      const displayName = 'displayName' in comment ? comment.displayName || undefined : author?.displayName;

      const baseAuthor = author ? { ...author } : {};
      delete baseAuthor.displayName;

      const updatedAuthor = displayName ? { ...baseAuthor, displayName } : baseAuthor;

      const publishCommentOptions: PublishCommentOptions = {
        subplebbitAddress,
        title,
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
        author: updatedAuthor,
        displayName,
        signer,
        subplebbitAddress,
        title,
        content,
        link,
        spoiler,
        publishCommentOptions,
      };
    }),
  resetPublishPostStore: () =>
    set({
      author: undefined,
      displayName: undefined,
      signer: undefined,
      subplebbitAddress: undefined,
      title: undefined,
      content: undefined,
      link: undefined,
      spoiler: undefined,
      publishCommentOptions: {},
    }),
}));

export default usePublishPostStore;
