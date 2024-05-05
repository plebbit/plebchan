import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { isHomeView } from './lib/utils/view-utils';
import useTheme from './hooks/use-theme';
import styles from './app.module.css';
import Board from './views/board';
import Catalog from './views/catalog';
import Home from './views/home';
import PendingPost from './views/pending-post';
import PostPage from './views/post-page';
import Settings from './views/settings';
import BoardBanner from './components/board-banner';
import { DesktopBoardButtons, MobileBoardButtons } from './components/board-buttons';
import BoardNav from './components/board-nav';
import ChallengeModal from './components/challenge-modal';
import SubplebbitStats from './components/subplebbit-stats';
import PostForm from './components/post-form';

const BoardLayout = () => {
  const { subplebbitAddress } = useParams();
  const location = useLocation();

  // force rerender of post form when navigating between pages
  const key = `${subplebbitAddress}-${location.pathname}`;

  return (
    <div className={styles.boardLayout}>
      <BoardNav />
      <BoardBanner />
      <MobileBoardButtons />
      <PostForm key={key} />
      <SubplebbitStats />
      <DesktopBoardButtons />
      <Outlet />
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const isInHomeView = isHomeView(location.pathname);
  const [theme] = useTheme();

  useEffect(() => {
    document.body.classList.forEach((className) => document.body.classList.remove(className));
    const classToAdd = isInHomeView ? 'yotsuba' : theme;
    document.body.classList.add(classToAdd);
  }, [theme, isInHomeView]);

  const globalLayout = (
    <>
      <ChallengeModal />
      <Outlet />
    </>
  );

  return (
    <div className={styles.app}>
      <Routes>
        <Route element={globalLayout}>
          <Route path='/' element={<Home />} />
          <Route element={<BoardLayout />}>
            <Route path='/p/:subplebbitAddress' element={<Board />} />

            <Route path='/p/:subplebbitAddress/catalog' element={<Catalog />} />

            <Route path='/p/:subplebbitAddress/c/:commentCid' element={<PostPage />} />
            <Route path='/p/:subplebbitAddress/description' element={<PostPage />} />
            <Route path='/p/:subplebbitAddress/rules' element={<PostPage />} />

            <Route path='/profile/:accountCommentIndex' element={<PendingPost />} />
          </Route>
          <Route path='/settings' element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
