import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { isHomeView } from './lib/utils/view-utils';
import { useSubplebbit } from '@plebbit/plebbit-react-hooks';
import styles from './app.module.css';
import useTheme from './hooks/use-theme';
import Home from './views/home';
import Settings from './views/settings';
import Subplebbit from './views/subplebbit';
import BoardNav from './components/board-nav';
import BoardBanner from './components/board-banner';
import BoardStats from './components/board-stats';
import PostForm from './components/post-form';
import { MobileBoardButtons } from './components/board-buttons';
import { DesktopBoardButtons } from './components/board-buttons';

const BoardLayout = () => {
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const subplebbit = useSubplebbit({ subplebbitAddress });

  return (
    <>
      {subplebbitAddress && (
        <>
          <BoardNav address={subplebbitAddress} />
          <BoardBanner title={subplebbit.title} address={subplebbitAddress} />
          <MobileBoardButtons address={subplebbitAddress} />
          <PostForm address={subplebbitAddress} />
          <BoardStats address={subplebbitAddress} createdAt={subplebbit.createdAt} />
          <DesktopBoardButtons address={subplebbitAddress} />
        </>
      )}
      <Outlet />
    </>
  );
};

const App = () => {
  const [theme] = useTheme();
  const location = useLocation();
  const isInHomeView = isHomeView(location.pathname);

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

  return (
    <div className={`${styles.app} ${isInHomeView ? 'yotsuba' : theme}`}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<BoardLayout />}>
          <Route path='/p/:subplebbitAddress' element={<Subplebbit />} />
        </Route>
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
