import { useEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAccountComment } from '@plebbit/plebbit-react-hooks';
import { isAllView, isSubscriptionsView } from './lib/utils/view-utils';
import useIsMobile from './hooks/use-is-mobile';
import useTheme from './hooks/use-theme';
import { timeFilterNames } from './hooks/use-time-filter';
import styles from './app.module.css';
import Board from './views/board';
import Catalog from './views/catalog';
import FAQ from './views/faq';
import Home from './views/home';
import NotFound from './views/not-found';
import PendingPost from './views/pending-post';
import Post from './views/post';
import { DesktopBoardButtons, MobileBoardButtons } from './components/board-buttons';
import BoardHeader from './components/board-header';
import ChallengeModal from './components/challenge-modal';
import PostForm from './components/post-form';
import SubplebbitStats from './components/subplebbit-stats';
import TopBar from './components/topbar';

const BoardLayout = () => {
  const { accountCommentIndex, subplebbitAddress, timeFilterName } = useParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isInAllView = isAllView(location.pathname, useParams());
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());
  const pendingPost = useAccountComment({ commentIndex: accountCommentIndex ? parseInt(accountCommentIndex) : undefined });

  const isValidAccountCommentIndex = !accountCommentIndex || (!isNaN(Number(accountCommentIndex)) && Number(accountCommentIndex) >= 0);

  if (!isValidAccountCommentIndex || (timeFilterName && !timeFilterNames.includes(timeFilterName))) {
    return <NotFound />;
  }

  // force rerender of post form when navigating between pages, except when opening settings modal in current view
  const key = location.pathname.endsWith('/settings')
    ? `${subplebbitAddress}-${location.pathname.replace(/\/settings$/, '')}`
    : `${subplebbitAddress}-${location.pathname}`;

  return (
    <div className={styles.boardLayout}>
      <TopBar />
      <BoardHeader />
      {isMobile
        ? (subplebbitAddress || isInAllView || isInSubscriptionsView || pendingPost?.subplebbitAddress) && (
            <>
              <MobileBoardButtons />
              <PostForm key={key} />
            </>
          )
        : (subplebbitAddress || isInAllView || isInSubscriptionsView || pendingPost?.subplebbitAddress) && (
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

const GlobalLayout = () => {
  const [theme, setTheme] = useState('');
  const [currentTheme] = useTheme();

  useEffect(() => {
    if (currentTheme !== theme) {
      setTheme(currentTheme);
    }
  }, [currentTheme, theme]);

  useEffect(() => {
    if (theme) {
      document.body.classList.add(theme);
      return () => {
        document.body.classList.remove(theme);
      };
    }
  }, [theme]);

  return (
    <>
      <ChallengeModal />
      <Outlet />
    </>
  );
};

const App = () => {
  // react router doesn't handle the %23 hash correctly, so we need to replace it with #
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const currentPath = location.pathname + location.hash;
    if (currentPath.includes('%23')) {
      const correctedPath = currentPath.replace('%23', '#');
      navigate(correctedPath, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className={styles.app}>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='*' element={<NotFound />} />

          <Route element={<BoardLayout />}>
            <Route path='/p/:subplebbitAddress' element={<Board />} />
            <Route path='/p/:subplebbitAddress/settings' element={<Board />} />
            <Route path='/p/:subplebbitAddress/catalog' element={<Catalog />} />
            <Route path='/p/:subplebbitAddress/catalog/settings' element={<Catalog />} />

            <Route path='/p/:subplebbitAddress/c/:commentCid' element={<Post />} />
            <Route path='/p/:subplebbitAddress/c/:commentCid/settings' element={<Post />} />
            <Route path='/p/:subplebbitAddress/description' element={<Post />} />
            <Route path='/p/:subplebbitAddress/description/settings' element={<Post />} />
            <Route path='/p/:subplebbitAddress/rules' element={<Post />} />
            <Route path='/p/:subplebbitAddress/rules/settings' element={<Post />} />

            <Route path='/p/all/:timeFilterName?' element={<Board />} />
            <Route path='/p/all/:timeFilterName?/settings' element={<Board />} />
            <Route path='/p/all/description' element={<Post />} />
            <Route path='/p/all/catalog/:timeFilterName?' element={<Catalog />} />
            <Route path='/p/all/catalog/:timeFilterName?/settings' element={<Catalog />} />

            <Route path='/p/subscriptions/:timeFilterName?' element={<Board />} />
            <Route path='/p/subscriptions/:timeFilterName?/settings' element={<Board />} />
            <Route path='/p/subscriptions/catalog/:timeFilterName?' element={<Catalog />} />
            <Route path='/p/subscriptions/catalog/:timeFilterName?/settings' element={<Catalog />} />

            <Route path='/profile/:accountCommentIndex' element={<PendingPost />} />
            <Route path='/profile/:accountCommentIndex/settings' element={<PendingPost />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
