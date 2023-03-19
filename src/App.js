import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useBoardStore from './useBoardStore';
import Home from './components/views/Home';
import Board from './components/views/Board';
import Thread from './components/views/Thread';
import Catalog from './components/views/Catalog';
import NotFound from './components/views/NotFound';
import styled, { createGlobalStyle } from 'styled-components';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';
import preloadImages from './utils/preloadImages';
import { ToastContainer } from 'react-toastify';


const GlobalStyle = createGlobalStyle`
  *:focus {
    outline: none;
  }
  
  body {
    margin: 0;
    padding: 0;
    background: ${props => props.background};
    color: ${props => props.color};
    font-family: ${props => props.fontFamily};
  }
  
  .tooltip {
    border-radius: 0;
    max-width: 40%;
    font-size: 11px;
    padding: 3px;
    opacity: 100%;
  }
`;

const StyledContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 0px;
    font-size: 11pt;
    animation-duration: 0s;
    border: 1px solid #fee9cd;
    color: #c5c8c6;
  }
`;


export default function App() {
  const { bodyStyle, setBodyStyle } = useBoardStore(state => state);
  
  const imageUrls = Array.from({ length: 14 }, (_, index) => `/assets/banners/banner-${index + 1}.jpg`);

  useEffect(() => {
    preloadImages([...imageUrls]);
  }, []);


  return (
  <div>
    <Helmet>
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/logo/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/logo/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/logo/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
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
        <Route path={`/:subplebbitAddress`} element={<Board setBodyStyle={setBodyStyle} />}>
          <Route path='post' element={<Board />} />
          <Route path='settings' element={<Board />} />
        </Route>
        <Route path={`/:subplebbitAddress/thread/:threadCid`} element={<Thread setBodyStyle={setBodyStyle} />}>
          <Route path='post' element={<Thread />} />
          <Route path='settings' element={<Thread />} />
        </Route>
        <Route path={`/:subplebbitAddress/catalog`} element={<Catalog setBodyStyle={setBodyStyle} /> }>
          <Route path='post' element={<Catalog />} />
          <Route path='settings' element={<Catalog />} />
        </Route>
        <Route path='*' element={<NotFound setBodyStyle={setBodyStyle} />} />
      </Routes>
      <StyledContainer />
  </div>
)}