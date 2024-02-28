import styles from './home.module.css';
import useTheme from '../../hooks/use-theme';
import { Link } from 'react-router-dom';

// TODO: remove theme selector for debugging
const ThemeSettings = () => {
  const [theme, setTheme] = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value='yotsuba'>yotsuba</option>
      <option value='yotsuba-b'>yotsuba-b</option>
    </select>
  );
};

const Home = () => {
  return (
    <div className={styles.content}>
      <Link to='/'>
        <div className={styles.logo}>
          <img alt='plebchan' src='/assets/logo/logo-transparent.png' />
        </div>
      </Link>
      <div className={styles.searchBar}>
        <input type='text' placeholder='Search' />
        <button>Search</button>
      </div>
      <ThemeSettings />
      <div className={styles.box}>
        <div className={styles.boxBar}>What is plebchan?</div>
      </div>
    </div>
  );
};

export default Home;
