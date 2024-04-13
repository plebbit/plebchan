import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { isHomeView } from './lib/utils/view-utils';
import { useSubplebbits } from '@plebbit/plebbit-react-hooks';
import { useDefaultSubplebbitAddresses } from './hooks/use-default-subplebbits';
import useTheme from './hooks/use-theme';
import styles from './app.module.css';
import Catalog from './views/catalog';
import Home from './views/home';
import PostPage from './views/post-page';
import Settings from './views/settings';
import Board from './views/board';
import BoardNav from './components/board-nav';
import BoardBanner from './components/board-banner';
import { DesktopBoardButtons } from './components/board-buttons';
import { MobileBoardButtons } from './components/board-buttons';
import SubplebbitStats from './components/subplebbit-stats';
import PostForm from './components/post-form';

const App = () => {
  const location = useLocation();
  const isInHomeView = isHomeView(location.pathname);

  const subplebbitAddresses = useDefaultSubplebbitAddresses();
  const { subplebbits } = useSubplebbits({ subplebbitAddresses });

  // add theme className to body so it can set the correct body background in index.css
  const [theme] = useTheme();
  useEffect(() => {
    document.body.classList.forEach((className) => document.body.classList.remove(className));
    document.body.classList.add(theme);
  }, [theme]);

  // const globalLayout = (
  //   <>
  //     <ChallengeModal />
  //     <Outlet />
  //   </>
  // );

  const boardLayout = (
    <>
      <BoardNav subplebbits={subplebbits} />
      <BoardBanner />
      <MobileBoardButtons />
      <PostForm />
      <SubplebbitStats />
      <DesktopBoardButtons />
      <Outlet />
    </>
  );

  return (
    <div className={`${styles.app} ${isInHomeView ? 'yotsuba' : theme}`}>
      <Routes>
        <Route path='/' element={<Home subplebbits={subplebbits} />} />
        <Route element={boardLayout}>
          <Route path='/p/:subplebbitAddress' element={<Board />} />
          <Route path='/p/:subplebbitAddress/c/:commentCid' element={<PostPage />} />
          <Route path='/p/:subplebbitAddress/description' element={<PostPage />} />
          <Route path='/p/:subplebbitAddress/rules' element={<PostPage />} />
          <Route path='/p/:subplebbitAddress/catalog' element={<Catalog />} />
        </Route>
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
