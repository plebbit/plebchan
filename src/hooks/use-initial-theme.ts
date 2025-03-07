import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useThemeStore from '../stores/use-theme-store';
import { useDefaultSubplebbits } from './use-default-subplebbits';
import { isAllView, isHomeView, isNotFoundView, isPendingPostView, isSubscriptionsView, isModView } from '../lib/utils/view-utils';
import { nsfwTags } from '../constants/nsfwTags';
import { useAccountComment } from '@plebbit/plebbit-react-hooks';

const useInitialTheme = (pendingPostSubplebbitAddress?: string) => {
  const location = useLocation();
  const { subplebbitAddress: paramsSubplebbitAddress, accountCommentIndex } = useParams<{ subplebbitAddress: string; accountCommentIndex?: string }>();
  const commentIndex = accountCommentIndex ? parseInt(accountCommentIndex) : undefined;
  const pendingPost = useAccountComment({ commentIndex });
  const getTheme = useThemeStore((state) => state.getTheme);
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const subplebbits = useDefaultSubplebbits();
  const params = useParams();
  const isInHomeView = isHomeView(location.pathname);
  const isInNotFoundView = isNotFoundView(location.pathname, params);
  const isInAllView = isAllView(location.pathname);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);
  const isInModView = isModView(location.pathname);
  const isInPendingPostView = isPendingPostView(location.pathname, params);

  const initialTheme = useMemo(() => {
    let theme = 'yotsuba';

    if (isInPendingPostView) {
      const subplebbitAddress = pendingPostSubplebbitAddress || pendingPost?.subplebbitAddress;
      if (subplebbitAddress) {
        const subplebbit = subplebbits.find((s) => s.address === subplebbitAddress);
        if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag))) {
          theme = getTheme('nsfw', false) || 'yotsuba';
        } else {
          theme = getTheme('sfw', false) || 'yotsuba-b';
        }
      } else {
        theme = currentTheme || 'yotsuba';
      }
    } else if (isInAllView || isInSubscriptionsView || isInModView) {
      theme = getTheme('sfw', false) || 'yotsuba-b'; // Add 'false' parameter
    } else if (isInHomeView || isInNotFoundView) {
      theme = 'yotsuba';
    } else if (paramsSubplebbitAddress) {
      const subplebbit = subplebbits.find((s) => s.address === paramsSubplebbitAddress);
      if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag))) {
        theme = getTheme('nsfw', false) || 'yotsuba'; // Add 'false' parameter
      } else {
        theme = getTheme('sfw', false) || 'yotsuba-b'; // Add 'false' parameter
      }
    }

    return theme;
  }, [
    isInPendingPostView,
    isInAllView,
    isInSubscriptionsView,
    isInModView,
    isInHomeView,
    isInNotFoundView,
    paramsSubplebbitAddress,
    getTheme,
    currentTheme,
    subplebbits,
    pendingPostSubplebbitAddress,
    pendingPost,
  ]);

  return initialTheme;
};

export default useInitialTheme;
