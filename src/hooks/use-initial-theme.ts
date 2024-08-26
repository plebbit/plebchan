import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useThemeStore from '../stores/use-theme-store';
import useDefaultSubplebbits from './use-default-subplebbits';
import { isAllView, isHomeView, isNotFoundView, isPendingPostView, isSubscriptionsView } from '../lib/utils/view-utils';
import { nsfwTags } from '../views/home/home';

const useInitialTheme = () => {
  const location = useLocation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const getTheme = useThemeStore((state) => state.getTheme);
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const subplebbits = useDefaultSubplebbits();
  const params = useParams();
  const isInHomeView = isHomeView(location.pathname);
  const isInNotFoundView = isNotFoundView(location.pathname, params);
  const isInAllView = isAllView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);
  const isInPendingPostView = isPendingPostView(location.pathname, params);

  const initialTheme = useMemo(() => {
    let theme = 'yotsuba';

    if (isInPendingPostView) {
      theme = currentTheme || 'yotsuba';
    } else if (isInAllView || isInSubscriptionsView) {
      theme = getTheme('sfw', false) || 'yotsuba-b'; // Add 'false' parameter
    } else if (isInHomeView || isInNotFoundView) {
      theme = 'yotsuba';
    } else if (subplebbitAddress) {
      const subplebbit = subplebbits.find((s) => s.address === subplebbitAddress);
      if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag))) {
        theme = getTheme('nsfw', false) || 'yotsuba'; // Add 'false' parameter
      } else {
        theme = getTheme('sfw', false) || 'yotsuba-b'; // Add 'false' parameter
      }
    }

    return theme;
  }, [isInPendingPostView, isInAllView, isInSubscriptionsView, isInHomeView, isInNotFoundView, subplebbitAddress, getTheme, currentTheme, subplebbits]);

  return initialTheme;
};

export default useInitialTheme;
