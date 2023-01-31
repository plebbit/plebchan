import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Board from './components/Board';
import Thread from './components/Thread';

function App() {
  return <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/board' element={<Board />} />
    <Route path='/board/:thread' element={<Thread />} />
  </Routes>
}

export default App;
