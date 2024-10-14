import { PublishCommentOptions } from '@plebbit/plebbit-react-hooks';
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
  setPublishPostStore: ({ author, displayName, signer, subplebbitAddress, title, content, link, spoiler }) =>
    set((state) => {
      const nextState = { ...state };
      if (author !== undefined) nextState.author = author;
      if (displayName !== undefined) nextState.displayName = displayName;
      if (signer !== undefined) nextState.signer = signer;
      if (subplebbitAddress !== undefined) nextState.subplebbitAddress = subplebbitAddress;
      if (title !== undefined) nextState.title = title || undefined;
      if (content !== undefined) nextState.content = content || undefined;
      if (link !== undefined) nextState.link = link || undefined;
      if (spoiler !== undefined) nextState.spoiler = spoiler || undefined;

      const publishCommentOptions: PublishCommentOptions = {
        subplebbitAddress: nextState.subplebbitAddress,
        title: nextState.title,
        content: nextState.content,
        link: nextState.link,
        spoiler: nextState.spoiler,
        onChallenge: (...args: any) => addChallenge(args),
        onChallengeVerification: alertChallengeVerificationFailed,
        onError: (error: Error) => {
          console.error(error);
          alert(error.message);
        },
      };

      if (nextState.signer) {
        publishCommentOptions.signer = nextState.signer;
      }

      if (nextState.author || nextState.displayName) {
        publishCommentOptions.author = {
          ...nextState.author,
          displayName: nextState.displayName,
        };
      }

      nextState.publishCommentOptions = publishCommentOptions;
      return nextState;
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
