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

  if (isInPendingPostView) {
    return currentTheme || 'yotsuba';
  } else if (isInAllView) {
    return getTheme('all') || 'yotsuba-b';
  } else if (isInSubscriptionsView) {
    return getTheme('subscriptions') || 'yotsuba-b';
  } else if (isInHomeView || isInNotFoundView) {
    return 'yotsuba';
  } else if (subplebbitAddress) {
    const subplebbit = subplebbits.find((s) => s.address === subplebbitAddress);
    if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag))) {
      return getTheme('nsfw') || 'yotsuba';
    }
    return getTheme('sfw') || 'yotsuba-b';
  }
  return 'yotsuba';
};

export default useInitialTheme;
