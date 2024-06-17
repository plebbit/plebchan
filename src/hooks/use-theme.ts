import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useThemeStore from '../stores/use-theme-store';
import useDefaultSubplebbits from './use-default-subplebbits';
import { isHomeView } from '../lib/utils/view-utils';
import { nsfwTags } from '../views/home/home';

const useTheme = (): [string, (theme: string) => void] => {
  const location = useLocation();
  const isInHomeView = isHomeView(location.pathname);
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const getTheme = useThemeStore((state) => state.getTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const subplebbits = useDefaultSubplebbits();
  const [theme, setLocalTheme] = useState('yotsuba-b');

  useEffect(() => {
    let initialTheme = 'yotsuba-b';

    if (isInHomeView) {
      initialTheme = 'yotsuba';
    } else if (subplebbitAddress) {
      initialTheme = getTheme(subplebbitAddress);
      const subplebbit = subplebbits.find((s) => s.address === subplebbitAddress);

      if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag)) && initialTheme === 'yotsuba-b') {
        initialTheme = 'yotsuba';
        setTheme(subplebbitAddress, 'yotsuba');
      }
    }

    setLocalTheme(initialTheme);
    document.body.classList.remove('yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon');
    document.body.classList.add(initialTheme);
  }, [subplebbitAddress, subplebbits, getTheme, setTheme, isInHomeView, location.pathname]);

  const setSubplebbitTheme = (theme: string) => {
    if (subplebbitAddress) {
      setTheme(subplebbitAddress, theme);
      setLocalTheme(theme);
      document.body.classList.remove('yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon');
      document.body.classList.add(theme);
    }
  };

  return [theme, setSubplebbitTheme];
};

export default useTheme;
