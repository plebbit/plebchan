import { Link, useNavigate, useParams } from 'react-router-dom';
import useDefaultSubplebbits from '../../hooks/use-default-subplebbits';
import styles from './board-nav.module.css';

interface BoardNavProps {
  subplebbits: any;
  currentSubplebbit?: string | undefined;
}

const BoardNavDesktop = ({ subplebbits }: BoardNavProps) => {
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

const BoardNavMobile = ({ subplebbits, currentSubplebbit }: BoardNavProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.boardNavMobile}>
      <div className={styles.boardSelect}>
        <strong>Board</strong>
        <select value={currentSubplebbit} onChange={(e) => navigate(`/p/${e.target.value}`)}>
          <option value='all'>All</option>
          <option value='subscriptions'>Subscriptions</option>
          {subplebbits.map((subplebbit: any, index: number) => (
            <option key={index} value={subplebbit.address}>
              {subplebbit.address.includes('.') ? subplebbit.address : subplebbit.title || subplebbit.address.slice(0, 10).concat('...')}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.pageJump}></div>
    </div>
  );
};

const BoardNav = () => {
  const defaultSubplebbits = useDefaultSubplebbits();
  const subplebbitAddress = useParams().subplebbitAddress;

  return (
    <>
      <BoardNavDesktop subplebbits={defaultSubplebbits} />
      <BoardNavMobile subplebbits={defaultSubplebbits} currentSubplebbit={subplebbitAddress} />
    </>
  );
};

export default BoardNav;
