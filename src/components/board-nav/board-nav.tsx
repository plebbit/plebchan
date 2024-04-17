import { useMemo } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Subplebbit } from '@plebbit/plebbit-react-hooks';
import { isCatalogView } from '../../lib/utils/view-utils';
import styles from './board-nav.module.css';

interface BoardNavProps {
  subplebbits: (Subplebbit | undefined)[];
  currentSubplebbit?: string | undefined;
}

const BoardNavDesktop = ({ subplebbits }: BoardNavProps) => {
  const { t } = useTranslation();
  const isInCatalogView = isCatalogView(useLocation().pathname, useParams());

  const sortedSubplebbits = useMemo(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const retainedSubplebbits: (Subplebbit | undefined)[] = [];

    subplebbits.forEach((sub: Subplebbit | undefined) => {
      if (!sub || sub.updatedAt === undefined || sub.updatedAt * 1000 > oneHourAgo) {
        // retain the position of loading, undefined, or online subplebbits
        retainedSubplebbits.push(sub);
      }
      // don't include offline subs
    });
    return retainedSubplebbits;
  }, [subplebbits]);

  return (
    <div className={styles.boardNavDesktop}>
      <span className={styles.boardList}>
        [
        {sortedSubplebbits.map((subplebbit: any, index: number) => {
          const address = subplebbit?.address || '';
          const title = subplebbit?.title || '';
          return (
            <span key={index}>
              {index === 0 ? null : ' '}
              <Link to={`/p/${address}${isInCatalogView ? '/catalog' : ''}`} title={title || ''}>
                {address.includes('.') ? address : title || address.slice(0, 10).concat('...')}
              </Link>
              {index !== sortedSubplebbits.length - 1 ? ' /' : null}
            </span>
          );
        })}
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
  const displaySubplebbitAddress = currentSubplebbit && currentSubplebbit.length > 30 ? currentSubplebbit.slice(0, 30).concat('...') : currentSubplebbit;

  const currentSubplebbitIsInList = subplebbits.some((subplebbit: any) => subplebbit?.address === currentSubplebbit);

  const sortedSubplebbits = useMemo(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const retainedSubplebbits: (Subplebbit | undefined)[] = [];

    subplebbits.forEach((sub: Subplebbit | undefined) => {
      if (!sub || sub.updatedAt === undefined || sub.updatedAt * 1000 > oneHourAgo) {
        // retain the position of loading, undefined, or online subplebbits
        retainedSubplebbits.push(sub);
      }
      // don't include offline subs
    });
    return retainedSubplebbits;
  }, [subplebbits]);

  const isInCatalogView = isCatalogView(useLocation().pathname, useParams());

  const boardSelect = (
    <select value={currentSubplebbit || 'all'} onChange={(e) => navigate(`/p/${e.target.value}${isInCatalogView ? '/catalog' : ''}`)}>
      {!currentSubplebbitIsInList && currentSubplebbit && <option value={currentSubplebbit}>{displaySubplebbitAddress}</option>}
      <option value='all'>{t('all')}</option>
      <option value='subscriptions'>{t('subscriptions')}</option>
      {sortedSubplebbits.map((subplebbit: any, index: number) => {
        const address = subplebbit?.address || '';
        const title = subplebbit?.title || '';
        const subplebbitAddress = address?.includes('.') ? address : title || address?.slice(0, 10).concat('...');
        return (
          <option key={index} value={address}>
            {subplebbitAddress}
          </option>
        );
      })}
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

const BoardNav = ({ subplebbits }: BoardNavProps) => {
  const { subplebbitAddress: address } = useParams();
  return (
    <>
      <BoardNavDesktop subplebbits={subplebbits} />
      <BoardNavMobile subplebbits={subplebbits} currentSubplebbit={address} />
    </>
  );
};

export default BoardNav;
