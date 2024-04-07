import React, { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { isHomeView } from './lib/utils/view-utils';
import { Subplebbit as SubplebbitType, useSubplebbit, useSubplebbits } from '@plebbit/plebbit-react-hooks';
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

interface BoardLayoutProps {
  subplebbits: (SubplebbitType | undefined)[];
}

const BoardLayout = React.memo(({ subplebbits }: BoardLayoutProps) => {
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { address, createdAt, title } = subplebbit || {};

  return (
    <>
      {address && (
        <>
          <BoardNav address={address} subplebbits={subplebbits} />
          <BoardBanner title={title} address={address} />
          <MobileBoardButtons address={address} />
          <PostForm address={address} />
          <BoardStats address={address} createdAt={createdAt} />
          <DesktopBoardButtons address={address} />
        </>
      )}
      <Outlet />
    </>
  );
});

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

  return (
    <div className={`${styles.app} ${isInHomeView ? 'yotsuba' : theme}`}>
      <Routes>
        <Route path='/' element={<Home subplebbits={subplebbits} />} />
        <Route element={<BoardLayout subplebbits={subplebbits} />}>
          <Route path='/p/:subplebbitAddress' element={<Subplebbit />} />
          <Route path='/p/:subplebbitAddress/c/:commentCid' element={<PostPage />} />
        </Route>
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
