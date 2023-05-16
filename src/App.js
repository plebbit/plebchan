import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAccount, useBufferedFeeds } from '@plebbit/plebbit-react-hooks';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';
import useGeneralStore from './hooks/stores/useGeneralStore';
import { GlobalStyle } from './components/styled/GlobalStyle.styled';
import { Toast } from './components/styled/Toast.styled';
import All from './components/views/All';
import AllCatalog from './components/views/AllCatalog';
import Board from './components/views/Board';
import Catalog from './components/views/Catalog';
import Home from './components/views/Home';
import NotFound from './components/views/NotFound';
import Pending from './components/views/Pending';
import Subscriptions from './components/views/Subscriptions';
import SubscriptionsCatalog from './components/views/SubscriptionsCatalog';
import Thread from './components/views/Thread';
import CaptchaModal from './components/CaptchaModal';
import { importAll } from './components/ImageBanner';
import preloadImages from './utils/preloadImages';
import useError from "./hooks/useError";
import useSuccess from "./hooks/useSuccess";


export default function App() {
  const { 
    bodyStyle, setBodyStyle,
    defaultSubplebbits, setDefaultSubplebbits,
    isCaptchaOpen, setIsCaptchaOpen,
    setIsSettingsOpen,
    selectedStyle, setSelectedStyle,
    setShowPostForm,
    setShowPostFormLink,
  } = useGeneralStore(state => state);

  const location = useLocation();
  const isHomeRoute = location.pathname === "/";

  const account = useAccount();

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  useError(errorMessage, [errorMessage]);
  useSuccess(successMessage, [successMessage]);


  useEffect(() => {
    const successToast = localStorage.getItem("successToast");
    const errorToast = localStorage.getItem("errorToast");
    if (successToast) {
      setSuccessMessage(successToast);
      localStorage.removeItem("successToast");
    } else if (errorToast) {
      setErrorMessage(errorToast);
      localStorage.removeItem("errorToast");
    } else {
      return;
    }
  }, [setErrorMessage, setSuccessMessage]);

  // preload default subs and subscriptions
  useBufferedFeeds({
    feedsOptions: [
      {subplebbitAddresses: defaultSubplebbits.map(
        (subplebbit) => subplebbit.address
      ), sortType: 'new'},
      {subplebbitAddresses: account?.subscriptions, sortType: 'new'}
    ]
  });
  
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