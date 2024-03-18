import { Link } from 'react-router-dom';
import useDefaultSubplebbits from '../hooks/use-default-subplebbits';
import styles from './topnav.module.css';

const BoardNavDesktop = ({ subplebbits }: { subplebbits: any }) => {
  return (
    <div className={styles.boardNavDesktop}>
      [
      {subplebbits.map((subplebbit: any, index: number) => (
        <span key={subplebbit.address}>
          {index === 0 ? null : ' '}
          <Link to={`/p/${subplebbit.address}`} title={subplebbit.title || ''}>
            {subplebbit.address.includes('.') ? subplebbit.address : subplebbit.title || subplebbit.address.slice(0, 10).concat('...')}
          </Link>
          {index !== subplebbits.length - 1 ? ' /' : null}
        </span>
      ))}
      ]
    </div>
  );
};

const BoardNavMobile = ({ subplebbits }: { subplebbits: any }) => {
  return (
    <div className={styles.boardNavMobile}>
      <h1>BoardNavMobile</h1>
    </div>
  );
};

const TopNav = () => {
  const defaultSubplebbits = useDefaultSubplebbits();

  return (
    <>
      <BoardNavDesktop subplebbits={defaultSubplebbits} />
      <BoardNavMobile subplebbits={defaultSubplebbits} />
    </>
  );
};

export default TopNav;
