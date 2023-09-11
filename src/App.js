import React, { useEffect } from 'react';
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
import useError from "./hooks/useError";
import useInfo from "./hooks/useInfo";
import useSuccess from "./hooks/useSuccess";
import packageJson from '../package.json';
const commitRef = process?.env?.REACT_APP_COMMIT_REF || '';

export default function App() {
  const { 
    bodyStyle, setBodyStyle,
    setDefaultSubplebbits,
    isCaptchaOpen, setIsCaptchaOpen,
    setIsSettingsOpen,
    selectedStyle, setSelectedStyle,
    setShowPostForm,
    setShowPostFormLink,
  } = useGeneralStore(state => state);

  const location = useLocation();
  const isHomeRoute = location.pathname === "/";
  const isElectron = window.electron && window.electron.isElectron;

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();
  const [, setNewInfoMessage] = useInfo();


  useEffect(() => {
    const successToast = localStorage.getItem("successToast");
    const errorToast = localStorage.getItem("errorToast");
    const infoToast = localStorage.getItem("infoToast");
    if (successToast) {
      setNewSuccessMessage(successToast);
      localStorage.removeItem("successToast");
    } else if (errorToast) {
      setNewErrorMessage(errorToast);
      localStorage.removeItem("errorToast");
    } else if (infoToast) {
      setNewInfoMessage(infoToast);
      localStorage.removeItem("infoToast");
    } else {
      return;
    }
  }, [setNewErrorMessage, setNewSuccessMessage, setNewInfoMessage]);
  

  // check for new version
  // TODO: delete this code and toast when v1.0.0 is released
  useEffect(() => {
    const fetchVersionInfo = async () => {
      try {
        const packageRes = await fetch('https://raw.githubusercontent.com/plebbit/plebchan/master/package.json', { cache: 'no-cache' });
        const packageData = await packageRes.json();

        if (packageJson.version !== packageData.version) {
          const newVersionInfo = isElectron 
            ? `New version available, plebchan v${packageData.version}. Go to github.com/plebbit/plebchan/releases/latest to download the latest version.`
            : `New version available, plebchan v${packageData.version}. Refresh the page to update.`;
          localStorage.setItem('infoToast', newVersionInfo);
        }

        if (commitRef.length > 0) {
          const commitRes = await fetch('https://api.github.com/repos/plebbit/plebchan/commits?per_page=1&sha=development', { cache: 'no-cache' });
          const commitData = await commitRes.json();
          
          const latestCommitHash = commitData[0].sha;
          
          if (latestCommitHash.trim() !== commitRef.trim()) {
            const newVersionInfo = `New dev version available, commit ${latestCommitHash}. Refresh the page to update.`;
            localStorage.setItem('infoToast', newVersionInfo);
          }
        }
      } catch (error) {
        console.error('Failed to fetch latest version info:', error);
      }
    };

    fetchVersionInfo();
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


  // automatic dark mode without interefering with user's selected style
  useEffect(() => {
    if (isHomeRoute) return;
  
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = darkModeMediaQuery.matches;
  
    if (isDarkMode && !isHomeRoute) {
      setSelectedStyle('Tomorrow');
      setBodyStyle({
        background: '#1d1f21 none',
        color: '#c5c8c6',
        fontFamily: 'Arial, Helvetica, sans-serif'
      });
      localStorage.setItem('selectedStyle', 'Tomorrow');
    }
  
    const darkModeListener = (e) => {
      if (e.matches && !isHomeRoute) {
        setSelectedStyle('Tomorrow');
        setBodyStyle({
          background: '#1d1f21 none',
          color: '#c5c8c6',
          fontFamily: 'Arial, Helvetica, sans-serif'
        });
        localStorage.setItem('selectedStyle', 'Tomorrow');
      }
    };
  
    darkModeMediaQuery.addEventListener('change', darkModeListener);
  
    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeListener);
    };
  }, [isHomeRoute, setBodyStyle, setSelectedStyle]);
  
  // fetch default subplebbits
  useEffect(() => {
    let didCancel = false;
    fetch(
      "https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/subplebbits.json",
      { cache: "no-cache" }
    )
      .then((res) => res.json())
      .then(res => {
        if (!didCancel) {
          setDefaultSubplebbits(res);
        }
      });
    return () => {
      didCancel = true;
    };
  }, [setDefaultSubplebbits]);

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
      <link rel="apple-touch-icon" sizes="180x180" href="assets/logo/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="assets/logo/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="assets/logo/favicon-16x16.png" />
      <link rel="manifest" href="site.webmanifest" />
      <meta name="msapplication-TileColor" content="#fee9cd" />
      <meta name="theme-color" content="#ffffff" />
    </Helmet>
    <GlobalStyle 
      background={bodyStyle.background} 
      color={bodyStyle.color} 
      fontFamily={bodyStyle.fontFamily}
    />
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
        <Route path={`/p/:subplebbitAddress/catalog`} element={<Catalog setBodyStyle={setBodyStyle} /> }>
          <Route path='post' element={<Catalog />} />
          <Route path='settings' element={<Catalog />} />
        </Route>
        <Route path={`/p/:subplebbitAddress/description`} element={<Description setBodyStyle={setBodyStyle} /> }>
          <Route path='settings' element={<Description />} />
        </Route>
        <Route path={`/p/:subplebbitAddress/rules`} element={<Rules setBodyStyle={setBodyStyle} /> }>
          <Route path='settings' element={<Rules />} />
        </Route>
        <Route path={`/profile/c/:index`} element={<Pending setBodyStyle={setBodyStyle} /> }>
          <Route path='settings' element={<Pending />} />
        </Route>
        <Route path={`/p/subscriptions`} element={<Subscriptions setBodyStyle={setBodyStyle} /> }>
          <Route path='settings' element={<Subscriptions />} />
        </Route>
        <Route path={`p/subscriptions/catalog`} element={<SubscriptionsCatalog setBodyStyle={setBodyStyle} /> }>
          <Route path='settings' element={<SubscriptionsCatalog />} />
        </Route>
        <Route path={`p/all`} element={<All setBodyStyle={setBodyStyle} /> }>
          <Route path='settings' element={<All />} />
        </Route>
        <Route path={`p/all/catalog`} element={<AllCatalog setBodyStyle={setBodyStyle} /> }>
          <Route path='settings' element={<AllCatalog />} />
        </Route>
        <Route path='*' element={<NotFound setBodyStyle={setBodyStyle} />} />
      </Routes>
      <Toast />
      <CaptchaModal 
        selectedStyle={selectedStyle}
        isOpen={isCaptchaOpen} 
        closeModal={() => setIsCaptchaOpen(false)} 
      />
  </div>
)}