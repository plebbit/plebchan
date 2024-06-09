import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { isAllView, isHomeView, isSubscriptionsView } from './lib/utils/view-utils';
import useIsMobile from './hooks/use-is-mobile';
import useTheme from './hooks/use-theme';
import styles from './app.module.css';
import Board from './views/board';
import Catalog from './views/catalog';
import Home from './views/home';
import NotFound from './views/not-found';
import PendingPost from './views/pending-post';
import PostPage from './views/post-page';
import { DesktopBoardButtons, MobileBoardButtons } from './components/board-buttons';
import BoardHeader from './components/board-header';
import ChallengeModal from './components/challenge-modal';
import PostForm from './components/post-form';
import SubplebbitStats from './components/subplebbit-stats';
import TopBar from './components/topbar';

const BoardLayout = () => {
  const { accountCommentIndex, subplebbitAddress } = useParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isInAllView = isAllView(location.pathname);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname);

  const isValidAccountCommentIndex = !accountCommentIndex || (!isNaN(parseInt(accountCommentIndex)) && parseInt(accountCommentIndex) >= 0);

  if (!isValidAccountCommentIndex) {
    return <NotFound />;
  }

  // force rerender of post form when navigating between pages
  const key = `${subplebbitAddress}-${location.pathname}`;

  return (
    <div className={styles.boardLayout}>
      <TopBar />
      <BoardHeader />
      {isMobile
        ? (subplebbitAddress || isInAllView || isInSubscriptionsView) && (
            <>
              <PostForm key={key} />
              <MobileBoardButtons />
            </>
          )
        : (subplebbitAddress || isInAllView || isInSubscriptionsView) && (
            <>
              <PostForm key={key} />
              {!(isInAllView || isInSubscriptionsView) && <SubplebbitStats />}
              <DesktopBoardButtons />
            </>
          )}
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
            <Route path='/p/:subplebbitAddress/settings' element={<Board />} />
            <Route path='/p/:subplebbitAddress/catalog' element={<Catalog />} />
            <Route path='/p/:subplebbitAddress/catalog/settings' element={<Catalog />} />

            <Route path='/p/:subplebbitAddress/c/:commentCid' element={<PostPage />} />
            <Route path='/p/:subplebbitAddress/c/:commentCid/settings' element={<PostPage />} />
            <Route path='/p/:subplebbitAddress/description' element={<PostPage />} />
            <Route path='/p/:subplebbitAddress/description/settings' element={<PostPage />} />
            <Route path='/p/:subplebbitAddress/rules' element={<PostPage />} />
            <Route path='/p/:subplebbitAddress/rules/settings' element={<PostPage />} />

            <Route path='/p/all/:timeFilterName?' element={<Board />} />
            <Route path='/p/all/:timeFilterName?/settings' element={<Board />} />
            <Route path='/p/all/description' element={<PostPage />} />
            <Route path='/p/all/catalog/:timeFilterName?' element={<Catalog />} />
            <Route path='/p/all/catalog/:timeFilterName?/settings' element={<Catalog />} />

            <Route path='/p/subscriptions/:timeFilterName?' element={<Board />} />
            <Route path='/p/subscriptions/:timeFilterName?/settings' element={<Board />} />
            <Route path='/p/subscriptions/catalog/:timeFilterName?' element={<Catalog />} />
            <Route path='/p/subscriptions/catalog/:timeFilterName?/settings' element={<Catalog />} />

            <Route path='/profile/:accountCommentIndex' element={<PendingPost />} />
            <Route path='/profile/:accountCommentIndex/settings' element={<PendingPost />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
