import { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isAllView, isSubscriptionsView } from '../lib/utils/view-utils';
import useThemeStore from '../stores/use-theme-store';
import useDefaultSubplebbits from './use-default-subplebbits';
import useInitialTheme from './use-initial-theme';
import { nsfwTags } from '../views/home/home';

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
  const setThemeStore = useThemeStore((state) => state.setTheme);
  const getTheme = useThemeStore((state) => state.getTheme);
  const loadThemes = useThemeStore((state) => state.loadThemes);
  const subplebbits = useDefaultSubplebbits();

  const initialTheme = useInitialTheme();
  const [userSetTheme, setUserSetTheme] = useState<string | null>(null);

  const getCurrentTheme = useCallback(() => {
    const subplebbitAddress = params?.subplebbitAddress;
    const isInAllView = isAllView(location.pathname, params);
    const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

    let storedTheme = null;
    if (isInAllView || isInSubscriptionsView) {
      storedTheme = getTheme('sfw');
    } else if (subplebbitAddress) {
      const subplebbit = subplebbits.find((s) => s.address === subplebbitAddress);
      if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag))) {
        storedTheme = getTheme('nsfw');
      } else {
        storedTheme = getTheme('sfw');
      }
    }

    return storedTheme || initialTheme;
  }, [location.pathname, params, getTheme, subplebbits, initialTheme]);

  useEffect(() => {
    const initializeTheme = async () => {
      await loadThemes();
      const currentTheme = getCurrentTheme();
      updateThemeClass(currentTheme);
    };

    initializeTheme();
  }, [loadThemes, getCurrentTheme]);

  const setSubplebbitTheme = useCallback(
    async (newTheme: string) => {
      const subplebbitAddress = params?.subplebbitAddress;
      const isInAllView = isAllView(location.pathname, params);
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

      setUserSetTheme(newTheme);
      updateThemeClass(newTheme);
    },
    [location.pathname, params, setThemeStore, subplebbits],
  );

  const currentTheme = userSetTheme || getCurrentTheme();

  return [currentTheme, setSubplebbitTheme];
};

export default useTheme;
