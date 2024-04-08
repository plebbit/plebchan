import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { isHomeView } from './lib/utils/view-utils';
import { useSubplebbits } from '@plebbit/plebbit-react-hooks';
import { useDefaultSubplebbitAddresses } from './hooks/use-default-subplebbits';
import useTheme from './hooks/use-theme';
import styles from './app.module.css';
import Home from './views/home';
import PostPage from './views/post-page';
import Settings from './views/settings';
import Subplebbit from './views/subplebbit';
import BoardNav from './components/board-nav';
import BoardBanner from './components/board-banner';
import { DesktopBoardButtons } from './components/board-buttons';
import { MobileBoardButtons } from './components/board-buttons';
import BoardStats from './components/board-stats';
import PostForm from './components/post-form';

const App = () => {
  const [theme] = useTheme();
  const location = useLocation();
  const isInHomeView = isHomeView(location.pathname);

  const subplebbitAddresses = useDefaultSubplebbitAddresses();
  const { subplebbits } = useSubplebbits({ subplebbitAddresses });

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
      <BoardStats />
      <DesktopBoardButtons />
      <Outlet />
    </>
  );

  return (
    <div className={`${styles.app} ${isInHomeView ? 'yotsuba' : theme}`}>
      <Routes>
        <Route path='/' element={<Home subplebbits={subplebbits} />} />
        <Route element={boardLayout}>
          <Route path='/p/:subplebbitAddress' element={<Subplebbit />} />
          <Route path='/p/:subplebbitAddress/c/:commentCid' element={<PostPage />} />
          <Route path='/p/:subplebbitAddress/description' element={<PostPage />} />
          <Route path='/p/:subplebbitAddress/rules' element={<PostPage />} />
        </Route>
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
