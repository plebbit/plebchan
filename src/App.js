import React, { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';
import useGeneralStore from './hooks/stores/useGeneralStore';
import { GlobalStyle } from './components/styled/GlobalStyle.styled';
import { Toast } from './components/styled/Toast.styled';
import All from './components/views/All';
import AllCatalog from './components/views/AllCatalog';
import Board from './components/views/Board';
import Catalog from './components/views/Catalog';
import Description from './components/views/Description';
import Home from './components/views/Home';
import NotFound from './components/views/NotFound';
import Pending from './components/views/Pending';
import Rules from './components/views/Rules';
import Subscriptions from './components/views/Subscriptions';
import SubscriptionsCatalog from './components/views/SubscriptionsCatalog';
import Thread from './components/views/Thread';
import CaptchaModal from './components/modals/CaptchaModal';
import { importAll } from './components/ImageBanner';
import preloadImages from './utils/preloadImages';
import showNewVersionToast from './utils/showNewVersionToast';
import useError from './hooks/useError';
import useInfo from './hooks/useInfo';
import useSuccess from './hooks/useSuccess';
import packageJson from '../package.json';
const commitRef = process?.env?.REACT_APP_COMMIT_REF || '';

export default function App() {
  const {
    bodyStyle,
    setBodyStyle,
    setDefaultSubplebbits,
    setDefaultNsfwSubplebbits,
    isCaptchaOpen,
    setIsCaptchaOpen,
    setIsSettingsOpen,
    selectedStyle,
    setShowPostForm,
    setShowPostFormLink,
  } = useGeneralStore((state) => state);

  const location = useLocation();
  const isElectron = window.electron && window.electron.isElectron;

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();
  const [, setNewInfoMessage] = useInfo();

  useEffect(() => {
    const successToast = localStorage.getItem('successToast');
    const errorToast = localStorage.getItem('errorToast');
    if (successToast) {
      setNewSuccessMessage(successToast);
      localStorage.removeItem('successToast');
    } else if (errorToast) {
      setNewErrorMessage(errorToast);
      localStorage.removeItem('errorToast');
    } else {
      return;
    }
  }, [setNewErrorMessage, setNewSuccessMessage]);

  // TODO: delete this code and toast when v1.0.0 is released (minor updates expected)
  let hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      showNewVersionToast(setNewInfoMessage, isElectron, packageJson, commitRef);
      hasRun.current = true;
    }
  }, [setNewInfoMessage, isElectron]);

  // preload banners
  useEffect(() => {
    const loadImages = async () => {
      const images = await importAll(require.context('../public/assets', true, /\.(png|jpe?g|svg)$/));
      const imageUrls = images.map((image) => image.default);
      preloadImages(imageUrls);
    };

    loadImages();
  }, []);

  // fetch default subplebbits
  useEffect(() => {
    let didCancel = false;
    fetch('https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/multisub.json', { cache: 'no-cache' })
      .then((res) => res.json())
      .then((res) => {
        if (!didCancel) {
          setDefaultSubplebbits(res.subplebbits);
        }
      });
    return () => {
      didCancel = true;
    };
  }, [setDefaultSubplebbits]);

  // fetch default NSFW subplebbits
  useEffect(() => {
    let didCancel = false;
    fetch('https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/subplebbits-nsfw.json', { cache: 'no-cache' })
      .then((res) => res.json())
      .then((res) => {
        if (!didCancel) {
          setDefaultNsfwSubplebbits(res);
        }
      });
    return () => {
      didCancel = true;
    };
  }, [setDefaultNsfwSubplebbits]);

  // handle nested routes
  useEffect(() => {
    const path = location.pathname;
    if (path.endsWith('/post')) {
      setShowPostFormLink(false);
      setShowPostForm(true);
    } else {
      setShowPostFormLink(true);
      setShowPostForm(false);
    }

    if (path.endsWith('/settings')) {
      setIsSettingsOpen(true);
    } else {
      setIsSettingsOpen(false);
    }
  }, [location.pathname, setIsSettingsOpen, setShowPostForm, setShowPostFormLink]);

  return (
    <div>
      <Helmet>
        <link rel='apple-touch-icon' sizes='180x180' href='assets/logo/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='assets/logo/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='assets/logo/favicon-16x16.png' />
        <link rel='manifest' href='site.webmanifest' />
        <meta name='msapplication-TileColor' content='#fee9cd' />
        <meta name='theme-color' content='#ffffff' />
      </Helmet>
      <GlobalStyle background={bodyStyle.background} color={bodyStyle.color} fontFamily={bodyStyle.fontFamily} />
      <Routes>
        <Route exact path='/' element={<Home setBodyStyle={setBodyStyle} />} />
        <Route path={`/p/:subplebbitAddress`} element={<Board setBodyStyle={setBodyStyle} />}>
          <Route path='post' element={<Board />} />
          <Route path='settings' element={<Board />} />
        </Route>
        <Route path={`/p/:subplebbitAddress/c/:threadCid`} element={<Thread setBodyStyle={setBodyStyle} />}>
          <Route path='post' element={<Thread />} />
          <Route path='settings' element={<Thread />} />
        </Route>
        <Route path={`/p/:subplebbitAddress/catalog`} element={<Catalog setBodyStyle={setBodyStyle} />}>
          <Route path='post' element={<Catalog />} />
          <Route path='settings' element={<Catalog />} />
        </Route>
        <Route path={`/p/:subplebbitAddress/description`} element={<Description setBodyStyle={setBodyStyle} />}>
          <Route path='settings' element={<Description />} />
        </Route>
        <Route path={`/p/:subplebbitAddress/rules`} element={<Rules setBodyStyle={setBodyStyle} />}>
          <Route path='settings' element={<Rules />} />
        </Route>
        <Route path={`/profile/c/:index`} element={<Pending setBodyStyle={setBodyStyle} />}>
          <Route path='settings' element={<Pending />} />
        </Route>
        <Route path={`/p/subscriptions`} element={<Subscriptions setBodyStyle={setBodyStyle} />}>
          <Route path='settings' element={<Subscriptions />} />
        </Route>
        <Route path={`p/subscriptions/catalog`} element={<SubscriptionsCatalog setBodyStyle={setBodyStyle} />}>
          <Route path='settings' element={<SubscriptionsCatalog />} />
        </Route>
        <Route path={`p/all`} element={<All setBodyStyle={setBodyStyle} />}>
          <Route path='settings' element={<All />} />
        </Route>
        <Route path={`p/all/catalog`} element={<AllCatalog setBodyStyle={setBodyStyle} />}>
          <Route path='settings' element={<AllCatalog />} />
        </Route>
        <Route path='*' element={<NotFound setBodyStyle={setBodyStyle} />} />
      </Routes>
      <Toast />
      <CaptchaModal selectedStyle={selectedStyle} isOpen={isCaptchaOpen} closeModal={() => setIsCaptchaOpen(false)} />
    </div>
  );
}
