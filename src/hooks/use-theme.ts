import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isAllView, isSubscriptionsView } from '../lib/utils/view-utils';
import useThemeStore from '../stores/use-theme-store';
import determineInitialTheme from './use-initial-theme';

const useTheme = (): [string, (theme: string) => void] => {
  const location = useLocation();
  const params = useParams();
  const setThemeStore = useThemeStore((state) => state.setTheme);
  const loadThemes = useThemeStore((state) => state.loadThemes);

  const [themesLoaded, setThemesLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      await loadThemes();
      setThemesLoaded(true);
    };
    load();
  }, [loadThemes]);

  const initialTheme = determineInitialTheme();

  const [theme, setLocalTheme] = useState(initialTheme);

  useEffect(() => {
    document.body.classList.add(initialTheme);
    return () => {
      document.body.classList.remove(initialTheme);
    };
  }, [initialTheme]);

  useEffect(() => {
    if (themesLoaded) {
      document.body.classList.remove('yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon');
      document.body.classList.add(initialTheme);
      setLocalTheme(initialTheme);
    }
  }, [initialTheme, themesLoaded]);

  const setSubplebbitTheme = (newTheme: string) => {
    const subplebbitAddress = params?.subplebbitAddress;
    const isInAllView = isAllView(location.pathname, params);
    const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

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
