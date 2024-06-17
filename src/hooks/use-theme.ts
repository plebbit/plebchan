import { useState, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useThemeStore from '../stores/use-theme-store';
import useDefaultSubplebbits from './use-default-subplebbits';
import { isAllView, isHomeView, isNotFoundView, isSubscriptionsView } from '../lib/utils/view-utils';
import { nsfwTags } from '../views/home/home';

const useTheme = (): [string, (theme: string) => void] => {
  const location = useLocation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const getTheme = useThemeStore((state) => state.getTheme);
  const setThemeStore = useThemeStore((state) => state.setTheme);
  const subplebbits = useDefaultSubplebbits();
  const params = useParams();
  const isInHomeView = isHomeView(location.pathname);
  const isInNotFoundView = isNotFoundView(location.pathname, params);
  const isInAllView = isAllView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

  const initialTheme = useMemo(() => {
    if (isInAllView || isInSubscriptionsView) {
      const userTheme = getTheme(isInAllView ? 'all' : 'subscriptions');
      return userTheme || 'yotsuba-b';
    } else if (isInHomeView || isInNotFoundView) {
      return 'yotsuba';
    } else if (subplebbitAddress) {
      const userTheme = getTheme(subplebbitAddress);
      if (userTheme) {
        return userTheme;
      }
      const subplebbit = subplebbits.find((s) => s.address === subplebbitAddress);
      if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag))) {
        return 'yotsuba';
      }
      return 'yotsuba-b';
    }
    return 'yotsuba';
  }, [subplebbitAddress, subplebbits, getTheme, isInAllView, isInHomeView, isInNotFoundView, isInSubscriptionsView]);

  const [theme, setLocalTheme] = useState(initialTheme);

  useMemo(() => {
    document.body.classList.remove('yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon');
    document.body.classList.add(initialTheme);
  }, [initialTheme]);

  const setSubplebbitTheme = (newTheme: string) => {
    if (subplebbitAddress) {
      setThemeStore(subplebbitAddress, newTheme);
    } else if (isInAllView) {
      setThemeStore('all', newTheme);
    } else if (isInSubscriptionsView) {
      setThemeStore('subscriptions', newTheme);
    }
    setLocalTheme(newTheme);
    document.body.classList.remove('yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon');
    document.body.classList.add(newTheme);
  };

  return [theme, setSubplebbitTheme];
};

export default useTheme;
