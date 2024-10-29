import { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isAllView, isSubscriptionsView } from '../lib/utils/view-utils';
import useThemeStore from '../stores/use-theme-store';
import useDefaultSubplebbits from './use-default-subplebbits';
import useInitialTheme from './use-initial-theme';
import { nsfwTags } from '../views/home/home';
import { useAccountComment } from '@plebbit/plebbit-react-hooks';

const themeClasses = ['yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon'];

const updateThemeClass = (newTheme: string) => {
  document.body.classList.remove(...themeClasses);
  if (newTheme) {
    document.body.classList.add(newTheme);
  }
};

const useTheme = (): [string, (theme: string) => void] => {
  const location = useLocation();
  const params = useParams<{ subplebbitAddress: string }>();
  const pendingPostParams = useParams<{ accountCommentIndex?: string }>();
  const pendingPostCommentIndex = pendingPostParams?.accountCommentIndex ? parseInt(pendingPostParams.accountCommentIndex) : undefined;
  const pendingPost = useAccountComment({ commentIndex: pendingPostCommentIndex });
  const pendingPostSubplebbitAddress = pendingPost?.subplebbitAddress;

  const setThemeStore = useThemeStore((state) => state.setTheme);
  const getTheme = useThemeStore((state) => state.getTheme);
  const loadThemes = useThemeStore((state) => state.loadThemes);
  const subplebbits = useDefaultSubplebbits();

  const initialTheme = useInitialTheme(pendingPostSubplebbitAddress);
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const getCurrentTheme = useCallback(() => {
    const subplebbitAddress = params?.subplebbitAddress || pendingPostSubplebbitAddress;
    const isInAllView = isAllView(location.pathname);
    const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

    let storedTheme = null;
    if (isInAllView || isInSubscriptionsView) {
      storedTheme = getTheme('sfw', false);
    } else if (subplebbitAddress) {
      const subplebbit = subplebbits.find((s) => s.address === subplebbitAddress);
      if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag))) {
        storedTheme = getTheme('nsfw', false);
      } else {
        storedTheme = getTheme('sfw', false);
      }
    }

    return storedTheme || initialTheme;
  }, [location.pathname, params, getTheme, subplebbits, initialTheme, pendingPostSubplebbitAddress]);

  useEffect(() => {
    const newTheme = getCurrentTheme();
    if (newTheme !== currentTheme) {
      setCurrentTheme(newTheme);
      updateThemeClass(newTheme);
    }
  }, [getCurrentTheme, currentTheme]);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  const setSubplebbitTheme = useCallback(
    async (newTheme: string) => {
      const subplebbitAddress = params?.subplebbitAddress || pendingPostSubplebbitAddress;
      const isInAllView = isAllView(location.pathname);
      const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

      if (isInAllView || isInSubscriptionsView) {
        await setThemeStore('sfw', newTheme);
      } else if (subplebbitAddress) {
        const subplebbit = subplebbits.find((s) => s.address === subplebbitAddress);
        if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag))) {
          await setThemeStore('nsfw', newTheme);
        } else {
          await setThemeStore('sfw', newTheme);
        }
      }

      setCurrentTheme(newTheme);
      updateThemeClass(newTheme);
    },
    [location.pathname, params, setThemeStore, subplebbits, pendingPostSubplebbitAddress],
  );

  return [currentTheme, setSubplebbitTheme];
};

export default useTheme;
