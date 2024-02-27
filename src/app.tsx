import { Route, Routes } from 'react-router-dom';
import Home from './views/home';
import styles from './app.module.css';

const App = () => {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
