import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Home from './views/home';
import styles from './app.module.css';
import useTheme from './hooks/use-theme';
import Subplebbit from './views/subplebbit';
import { isHomeView } from './lib/utils/view-utils';
import BoardNav from './components/board-nav';
import BoardBanner from './components/board-banner';

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

  const boardLayout = (
    <>
      <BoardNav />
      <BoardBanner />
      {/*<PostForm />
      <Stats /> */}
      <Outlet />
    </>
  );

  return (
    <div className={`${styles.app} ${isInHomeView ? 'yotsuba' : theme}`}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={boardLayout}>
          <Route path='/p/:subplebbitAddress' element={<Subplebbit />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
