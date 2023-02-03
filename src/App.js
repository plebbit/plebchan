import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import GlobalStyle from './globalStyles';
import Home from './components/Home';
import Board from './components/Board';
import Thread from './components/Thread';

function App() {
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
    <GlobalStyle />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/board' element={<Board />} />
      <Route path='/board/:thread' element={<Thread />} />
    </Routes>
  </div>
)}

export default App;
