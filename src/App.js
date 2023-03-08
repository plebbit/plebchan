import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './components/Home';
import Board from './components/Board';
import Thread from './components/Thread';
import Catalog from './components/Catalog';
import NotFound from './components/NotFound';
import { createGlobalStyle } from 'styled-components';
import 'react-tooltip/dist/react-tooltip.css';
import preloadImages from './utils/preloadImages';
import { useCookies } from 'react-cookie';

export const BoardContext = React.createContext();

const GlobalStyle = createGlobalStyle`
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

export default function App() {
  const [bodyStyle, setBodyStyle] = useState({
    background: "#ffe url(/assets/fade.png) top repeat-x",
    color: "maroon",
    fontFamily: "Helvetica, Arial, sans-serif"
  });

  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedThread, setSelectedThread] = useState('');
  const [cookies, setCookie] = useCookies(['selectedStyle']);
  const [selectedStyle, setSelectedStyle] = useState(cookies.selectedStyle || 'Yotsuba');



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
    <BoardContext.Provider value={{ selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, selectedThread, setSelectedThread, selectedStyle, setSelectedStyle }}>
      <Routes>
        <Route exact path='/' element={<Home setBodyStyle={setBodyStyle} />} />
        <Route path={`/:subplebbitAddress`} element={<Board setBodyStyle={setBodyStyle} />}>
          <Route path='post' element={<Board />} />
        </Route>
        <Route path={`/:subplebbitAddress/thread/:threadCid`} element={<Thread setBodyStyle={setBodyStyle} />}>
          <Route path='post' element={<Thread />} />
        </Route>
        <Route path={`/:subplebbitAddress/catalog`} element={<Catalog setBodyStyle={setBodyStyle} /> }>
          <Route path='post' element={<Catalog />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BoardContext.Provider>
  </div>
)}
