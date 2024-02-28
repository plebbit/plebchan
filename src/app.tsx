import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './views/home';
import styles from './app.module.css';
import useTheme from './hooks/use-theme';

const App = () => {
  const [theme] = useTheme();

  useEffect(() => {
    document.body.classList.forEach((className) => document.body.classList.remove(className));
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <div className={`${styles.app} ${theme}`}>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
