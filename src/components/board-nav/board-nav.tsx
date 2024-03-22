import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useDefaultSubplebbits from '../../hooks/use-default-subplebbits';
import styles from './board-nav.module.css';

interface BoardNavProps {
  address?: string | undefined;
  subplebbits?: any;
  currentSubplebbit?: string | undefined;
}

const BoardNavDesktop = ({ subplebbits }: BoardNavProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.boardNavDesktop}>
      <span className={styles.boardList}>
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
      </span>
      <span className={styles.navTopRight}>
        [<Link to='/settings'>{t('settings')}</Link>] [<Link to='/'>{t('home')}</Link>]
      </span>
    </div>
  );
};

const BoardNavMobile = ({ subplebbits, currentSubplebbit }: BoardNavProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const boardSelect = (
    <select value={currentSubplebbit} onChange={(e) => navigate(`/p/${e.target.value}`)}>
      <option value='all'>All</option>
      <option value='subscriptions'>Subscriptions</option>
      {subplebbits.map((subplebbit: any, index: number) => (
        <option key={index} value={subplebbit.address}>
          {subplebbit.address.includes('.') ? subplebbit.address : subplebbit.title || subplebbit.address.slice(0, 10).concat('...')}
        </option>
      ))}
    </select>
  );

  return (
    <div className={styles.boardNavMobile}>
      <div className={styles.boardSelect}>
        <strong>{t('board')}</strong>
        {boardSelect}
      </div>
      <div className={styles.pageJump}>
        <Link to='settings'>{t('settings')}</Link>
        <Link to='/'>{t('home')}</Link>
      </div>
    </div>
  );
};

const BoardNav = ({ address }: BoardNavProps) => {
  const defaultSubplebbits = useDefaultSubplebbits();

  return (
    <>
      <BoardNavDesktop subplebbits={defaultSubplebbits} />
      <BoardNavMobile subplebbits={defaultSubplebbits} currentSubplebbit={address} />
    </>
  );
};

export default BoardNav;
