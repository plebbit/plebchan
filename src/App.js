import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './components/Home';
import Board from './components/Board';
import Thread from './components/Thread';
import { createGlobalStyle } from 'styled-components';

export const BoardContext = React.createContext();

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: ${props => props.background};
    color: ${props => props.color};
    font-family: ${props => props.fontFamily};
  }
`;

export default function App() {
  const [bodyStyle, setBodyStyle] = useState({
    background: "#ffe url(/fade.png) top repeat-x",
    color: "maroon",
    fontFamily: "Helvetica, Arial, sans-serif"
  });

  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Yotsuba');

  return (
  <div>
    <Helmet>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fee9cd" />
      <meta name="msapplication-TileColor" content="#fee9cd" />
      <meta name="theme-color" content="#ffffff" />
    </Helmet>
    <GlobalStyle 
    background={bodyStyle.background} 
    color={bodyStyle.color} 
    fontFamily={bodyStyle.fontFamily}
    />
    <BoardContext.Provider value={{ selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, selectedStyle, setSelectedStyle }}>
      <Routes>
        <Route exact path='/' element={<Home setBodyStyle={setBodyStyle} />} />
        <Route path='/board' element={<Board setBodyStyle={setBodyStyle} />}>
          <Route path='post-thread' element={<Board />} />
        </Route>
        <Route path='/board/thread' element={<Thread setBodyStyle={setBodyStyle} />}>
          <Route path='post-reply' element={<Thread />} />
        </Route>
      </Routes>
    </BoardContext.Provider>
  </div>
)}
