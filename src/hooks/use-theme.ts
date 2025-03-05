import { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isAllView, isSubscriptionsView, isModView } from '../lib/utils/view-utils';
import useThemeStore from '../stores/use-theme-store';
import { useDefaultSubplebbits } from './use-default-subplebbits';
import useInitialTheme from './use-initial-theme';
import { nsfwTags } from '../constants/nsfwTags';
import { useAccountComment } from '@plebbit/plebbit-react-hooks';
import useSpecialThemeStore from '../stores/use-special-theme-store';
import { isChristmas } from '../lib/utils/time-utils';

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
  const { isEnabled, setIsEnabled } = useSpecialThemeStore();

  const setThemeStore = useThemeStore((state) => state.setTheme);
  const getTheme = useThemeStore((state) => state.getTheme);
  const loadThemes = useThemeStore((state) => state.loadThemes);
  const subplebbits = useDefaultSubplebbits();

  const initialTheme = useInitialTheme(pendingPostSubplebbitAddress);
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const isInAllView = isAllView(location.pathname);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);
  const isInModView = isModView(location.pathname);
  const subplebbitAddress = params?.subplebbitAddress || pendingPostSubplebbitAddress;

  // Check for Christmas and initialize special theme if needed
  useEffect(() => {
    const isChristmasTime = isChristmas();

    if (isChristmasTime && isEnabled === null && subplebbitAddress && !isInAllView && !isInSubscriptionsView && !isInModView) {
      setIsEnabled(true);
      setCurrentTheme('tomorrow');
      updateThemeClass('tomorrow');
    } else if (!isChristmasTime && isEnabled) {
      setIsEnabled(false);
    }
  }, [isEnabled, setIsEnabled, params, pendingPostSubplebbitAddress, location.pathname, isInAllView, isInSubscriptionsView, isInModView, subplebbitAddress]);

  const getCurrentTheme = useCallback(() => {
    const { isEnabled } = useSpecialThemeStore.getState();

    // Always use yotsuba for home page
    if (location.pathname === '/') {
      return 'yotsuba';
    }

    // If special theme is enabled, use tomorrow
    if (isEnabled) {
      return 'tomorrow';
    }

    let storedTheme = null;
    if (isInAllView || isInSubscriptionsView || isInModView) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (isInAllView || isInSubscriptionsView || isInModView) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname, params, setThemeStore, subplebbits, pendingPostSubplebbitAddress],
  );

  return [currentTheme, setSubplebbitTheme];
};

export default useTheme;
