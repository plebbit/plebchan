import { useAccountComment } from '@plebbit/plebbit-react-hooks';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAllView, isCatalogView, isSubscriptionsView } from '../../lib/utils/view-utils';
import styles from './board-nav.module.css';
import useDefaultSubplebbits, { categorizeSubplebbits, useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';

const BoardNavDesktop = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();
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

const BoardNavMobile = ({ subplebbitAddress }: { subplebbitAddress: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const subplebbitAddresses = useDefaultSubplebbitAddresses();
  const displaySubplebbitAddress = subplebbitAddress && subplebbitAddress.length > 30 ? subplebbitAddress.slice(0, 30).concat('...') : subplebbitAddress;

  const currentSubplebbitIsInList = subplebbitAddresses.some((address: string) => address === subplebbitAddress);

  const location = useLocation();
  const params = useParams();
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

  return (
    <div className={styles.boardNavMobile} id='sticky-menu'>
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

// sticky menu animation
// will trigger more than once with hot reloading during development
if (!window.STICKY_MENU_SCROLL_LISTENER) {
  window.STICKY_MENU_SCROLL_LISTENER = true;

  const scrollRange = 50; // the animation css px range in stickyMenuAnimation, must also edit css animation 100%: {top}
  let currentScrollInRange = 0,
    previousScroll = 0;

  window.addEventListener('scroll', () => {
    // find difference between current and last scroll position
    const currentScroll = window.scrollY;
    const scrollDifference = currentScroll - previousScroll;
    previousScroll = currentScroll;

    // find new current scroll in range
    const previousScrollInRange = currentScrollInRange;
    currentScrollInRange += scrollDifference;
    if (currentScrollInRange > scrollRange) {
      currentScrollInRange = 0;
    } else if (currentScrollInRange < 0) {
      currentScrollInRange = 0;
    }

    // fix mobile overflow scroll bug
    if (currentScroll <= 0) {
      currentScrollInRange = 0;
    }

    // no changes
    if (currentScrollInRange === previousScrollInRange) {
      return;
    }

    // Get the menu element
    const menuElement = document.getElementById('sticky-menu');
    if (!menuElement) {
      return;
    }

    // control progress of the animation using negative animation-delay (0 to -1s)
    const animationPercent = currentScrollInRange / scrollRange;
    menuElement.style.animationDelay = animationPercent * -1 + 's';
  });
}

const BoardNav = () => {
  const params = useParams();
  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  return (
    <>
      <BoardNavDesktop />
      <BoardNavMobile subplebbitAddress={subplebbitAddress} />
    </>
  );
};

export default BoardNav;
