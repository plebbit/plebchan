import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isAllView, isSubscriptionsView } from '../lib/utils/view-utils';
import useThemeStore from '../stores/use-theme-store';
import useInitialTheme from './use-initial-theme';

const themeClasses = ['yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon'];

const updateThemeClass = (newTheme: string) => {
  document.body.classList.remove(...themeClasses);
  if (newTheme) {
    document.body.classList.add(newTheme);
  }
};

const useTheme = (): [string, (theme: string) => void] => {
  const location = useLocation();
  const params = useParams();
  const setThemeStore = useThemeStore((state) => state.setTheme);
  const getTheme = useThemeStore((state) => state.getTheme);
  const loadThemes = useThemeStore((state) => state.loadThemes);

  const initialTheme = useInitialTheme();
  const [theme, setLocalTheme] = useState<string>(() => initialTheme);
  const [themesLoaded, setThemesLoaded] = useState(false);

  useEffect(() => {
    const loadAndApplyThemes = async () => {
      await loadThemes();
      setThemesLoaded(true);
    };

    loadAndApplyThemes();
  }, [loadThemes]);

  useEffect(() => {
    if (!themesLoaded) return;

    const subplebbitAddress = params?.subplebbitAddress;
    const isInAllView = isAllView(location.pathname, params);
    const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

    let storedTheme = null;
    if (subplebbitAddress) {
      storedTheme = getTheme(subplebbitAddress);
    } else if (isInAllView) {
      storedTheme = getTheme('all');
    } else if (isInSubscriptionsView) {
      storedTheme = getTheme('subscriptions');
    }

    const themeToSet = storedTheme || initialTheme;
    setLocalTheme(themeToSet);
    updateThemeClass(themeToSet);
  }, [initialTheme, location.pathname, params, getTheme, themesLoaded]);

  const setSubplebbitTheme = async (newTheme: string) => {
    const subplebbitAddress = params?.subplebbitAddress;
    const isInAllView = isAllView(location.pathname, params);
    const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

    if (subplebbitAddress) {
      await setThemeStore(subplebbitAddress, newTheme);
    } else if (isInAllView) {
      await setThemeStore('all', newTheme);
    } else if (isInSubscriptionsView) {
      await setThemeStore('subscriptions', newTheme);
    }

    setLocalTheme(newTheme);
    updateThemeClass(newTheme);
  };

  return [theme, setSubplebbitTheme];
};

export default useTheme;
