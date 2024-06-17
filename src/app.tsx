import { Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { isAllView, isHomeView, isNotFoundView, isSubscriptionsView } from './lib/utils/view-utils';
import useIsMobile from './hooks/use-is-mobile';
import styles from './app.module.css';
import Board from './views/board';
import Catalog from './views/catalog';
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
import { useEffect } from 'react';
import { nsfwTags } from './views/home/home';
import useDefaultSubplebbits from './hooks/use-default-subplebbits';
import useThemeStore from './stores/use-theme-store';
import { timeFilterNames } from './hooks/use-time-filter';

const BoardLayout = () => {
  const { accountCommentIndex, subplebbitAddress, timeFilterName } = useParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isInAllView = isAllView(location.pathname, useParams());
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const isValidAccountCommentIndex = !accountCommentIndex || (!isNaN(parseInt(accountCommentIndex)) && parseInt(accountCommentIndex) >= 0);

  if (!isValidAccountCommentIndex || (timeFilterName && !timeFilterNames.includes(timeFilterName))) {
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

const GlobalLayout = () => {
  const location = useLocation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const getTheme = useThemeStore((state) => state.getTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const subplebbits = useDefaultSubplebbits();
  const isInHomeView = isHomeView(location.pathname);
  const isInNotFoundView = isNotFoundView(location.pathname, useParams());

  useEffect(() => {
    let theme = 'yotsuba-b';

    if (isInHomeView || isInNotFoundView) {
      theme = 'yotsuba';
    } else if (subplebbitAddress) {
      theme = getTheme(subplebbitAddress);
      const subplebbit = subplebbits.find((s) => s.address === subplebbitAddress);

      if (subplebbit && subplebbit.tags && subplebbit.tags.some((tag) => nsfwTags.includes(tag)) && theme === 'yotsuba-b') {
        theme = 'yotsuba';
        setTheme(subplebbitAddress, 'yotsuba');
      }
    }

    document.body.classList.remove('yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon');
    document.body.classList.add(theme);
  }, [location.pathname, subplebbitAddress, getTheme, setTheme, subplebbits, isInHomeView]);

  return (
    <>
      <ChallengeModal />
      <Outlet />
    </>
  );
};

const App = () => {
  return (
    <div className={styles.app}>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path='/' element={<Home />} />
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
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
