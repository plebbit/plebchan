import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isCatalogView } from '../../lib/utils/view-utils';
import styles from './board-nav.module.css';
import { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';

interface BoardNavProps {
  subplebbitAddresses: string[];
  subplebbitAddress?: string;
}

const BoardNavDesktop = ({ subplebbitAddresses }: BoardNavProps) => {
  const { t } = useTranslation();
  const isInCatalogView = isCatalogView(useLocation().pathname, useParams());

  return (
    <div className={styles.boardNavDesktop}>
      <span className={styles.boardList}>
        [
        {subplebbitAddresses.map((address: string, index: number) => {
          return (
            <span key={index}>
              {index === 0 ? null : ' '}
              <Link to={`/p/${address}${isInCatalogView ? '/catalog' : ''}`}>{address.includes('.') ? address : address.slice(0, 10).concat('...')}</Link>
              {index !== subplebbitAddresses.length - 1 ? ' /' : null}
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

const BoardNavMobile = ({ subplebbitAddresses, subplebbitAddress }: BoardNavProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const displaySubplebbitAddress = subplebbitAddress && subplebbitAddress.length > 30 ? subplebbitAddress.slice(0, 30).concat('...') : subplebbitAddress;

  const currentSubplebbitIsInList = subplebbitAddresses.some((address: string) => address === subplebbitAddress);

  const isInCatalogView = isCatalogView(useLocation().pathname, useParams());

  const boardSelect = (
    <select value={subplebbitAddress || 'all'} onChange={(e) => navigate(`/p/${e.target.value}${isInCatalogView ? '/catalog' : ''}`)}>
      {!currentSubplebbitIsInList && subplebbitAddress && <option value={subplebbitAddress}>{displaySubplebbitAddress}</option>}
      <option value='all'>{t('all')}</option>
      <option value='subscriptions'>{t('subscriptions')}</option>
      {subplebbitAddresses.map((subplebbit: any, index: number) => {
        const address = subplebbit?.address || '';
        const subplebbitAddress = address?.includes('.') ? address : address?.slice(0, 10).concat('...');
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

const BoardNav = () => {
  const subplebbitAddresses = useDefaultSubplebbitAddresses();
  const { subplebbitAddress } = useParams();
  return (
    <>
      <BoardNavDesktop subplebbitAddresses={subplebbitAddresses} />
      <BoardNavMobile subplebbitAddresses={subplebbitAddresses} subplebbitAddress={subplebbitAddress} />
    </>
  );
};

export default BoardNav;
