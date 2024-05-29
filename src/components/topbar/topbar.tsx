import { useEffect, useRef, useState } from 'react';
import { useAccountComment } from '@plebbit/plebbit-react-hooks';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAllView, isCatalogView, isSubscriptionsView } from '../../lib/utils/view-utils';
import styles from './topbar.module.css';
import useDefaultSubplebbits, { categorizeSubplebbits, useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import { debounce } from 'lodash';

const TopBarDesktop = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isInCatalogView = isCatalogView(location.pathname);
  const subplebbits = useDefaultSubplebbits();

  const { plebbitSubs, interestsSubs, randomSubs, internationalSubs, projectsSubs } = categorizeSubplebbits(subplebbits);

  const renderSubplebbits = (subplebbits: any) => {
    return subplebbits.map((sub: any, index: any) => (
      <span key={index}>
        {index === 0 ? null : ' '}
        <Link to={`/p/${sub.address}${isInCatalogView ? '/catalog' : ''}`}>{sub.address.includes('.') ? sub.address : sub.address.slice(0, 10).concat('...')}</Link>
        {index !== subplebbits.length - 1 ? ' /' : null}
      </span>
    ));
  };

  return (
    <div className={styles.boardNavDesktop}>
      <span className={styles.boardList}>
        [<Link to='/p/all'>all</Link> / <Link to='/p/subscriptions'>subscriptions</Link>] [{renderSubplebbits(plebbitSubs)}] [{renderSubplebbits(projectsSubs)}] [
        {renderSubplebbits(interestsSubs)}] [{renderSubplebbits(randomSubs)}] [{renderSubplebbits(internationalSubs)}]
      </span>
      <span className={styles.navTopRight}>
        [<Link to={!location.pathname.endsWith('settings') ? location.pathname + '/settings' : location.pathname}>{t('settings')}</Link>] [<Link to='/'>{t('home')}</Link>
        ]
      </span>
    </div>
  );
};

const TopBarMobile = ({ subplebbitAddress }: { subplebbitAddress: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const subplebbitAddresses = useDefaultSubplebbitAddresses();
  const displaySubplebbitAddress = subplebbitAddress && subplebbitAddress.length > 30 ? subplebbitAddress.slice(0, 30).concat('...') : subplebbitAddress;

  const currentSubplebbitIsInList = subplebbitAddresses.some((address: string) => address === subplebbitAddress);

  const location = useLocation();
  const isInAllView = isAllView(location.pathname);
  const isInCatalogView = isCatalogView(location.pathname);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname);
  const selectValue = isInAllView ? 'all' : isInSubscriptionsView ? 'subscriptions' : subplebbitAddress;

  const boardSelect = (
    <select value={selectValue} onChange={(e) => navigate(`/p/${e.target.value}${isInCatalogView ? '/catalog' : ''}`)}>
      {!currentSubplebbitIsInList && subplebbitAddress && <option value={subplebbitAddress}>{displaySubplebbitAddress}</option>}
      <option value='all'>{t('all')}</option>
      <option value='subscriptions'>{t('subscriptions')}</option>
      {subplebbitAddresses.map((address: any, index: number) => {
        const subplebbitAddress = address?.includes('.') ? address : address?.slice(0, 10).concat('...');
        return (
          <option key={index} value={address}>
            {subplebbitAddress}
          </option>
        );
      })}
    </select>
  );

  // navbar animation on scroll
  const [visible, setVisible] = useState(true);
  const prevScrollPosRef = useRef(0);

  useEffect(() => {
    const debouncedHandleScroll = debounce(() => {
      const currentScrollPos = window.scrollY;
      const prevScrollPos = prevScrollPosRef.current;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      prevScrollPosRef.current = currentScrollPos;
    }, 50);

    window.addEventListener('scroll', debouncedHandleScroll);

    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, []);

  return (
    <div className={styles.boardNavMobile} id='sticky-menu' style={{ top: visible ? 0 : '-23px' }}>
      <div className={styles.boardSelect}>
        <strong>{t('board')}</strong>
        {boardSelect}
      </div>
      <div className={styles.pageJump}>
        <Link to={useLocation().pathname + '/settings'}>{t('settings')}</Link>
        <Link to='/'>{t('home')}</Link>
      </div>
    </div>
  );
};

const TopBar = () => {
  const params = useParams();
  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  return (
    <>
      <TopBarDesktop />
      <TopBarMobile subplebbitAddress={subplebbitAddress} />
    </>
  );
};

export default TopBar;
