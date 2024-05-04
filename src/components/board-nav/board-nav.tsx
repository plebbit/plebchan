import { useAccountComment } from '@plebbit/plebbit-react-hooks';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isCatalogView } from '../../lib/utils/view-utils';
import styles from './board-nav.module.css';
import useDefaultSubplebbits, { MultisubSubplebbit } from '../../hooks/use-default-subplebbits';

interface BoardNavProps {
  defaultSubplebbits: MultisubSubplebbit[];
  subplebbitAddress?: string;
}

const BoardNavDesktop = ({ defaultSubplebbits }: BoardNavProps) => {
  const { t } = useTranslation();
  const isInCatalogView = isCatalogView(useLocation().pathname, useParams());

  return (
    <div className={styles.boardNavDesktop}>
      <span className={styles.boardList}>
        [
        {defaultSubplebbits.map((subplebbit, index: number) => {
          const { address, title } = subplebbit || {};
          const displayAddress = address.includes('.') ? address : address.slice(0, 10).concat('...');
          return (
            <span key={index}>
              {index === 0 ? null : ' '}
              <Link to={`/p/${address}${isInCatalogView ? '/catalog' : ''}`}>{title || displayAddress}</Link>
              {index !== defaultSubplebbits.length - 1 ? ' /' : null}
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

const BoardNavMobile = ({ defaultSubplebbits, subplebbitAddress }: BoardNavProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const displaySubplebbitAddress = subplebbitAddress && subplebbitAddress.length > 30 ? subplebbitAddress.slice(0, 30).concat('...') : subplebbitAddress;

  const subplebbitAddresses = new Set(defaultSubplebbits.map((sub) => sub.address.toLowerCase()));
  const currentSubplebbitIsInList = subplebbitAddress && subplebbitAddresses.has(subplebbitAddress.toLowerCase());

  const isInCatalogView = isCatalogView(useLocation().pathname, useParams());

  const boardSelect = (
    <select value={subplebbitAddress || 'all'} onChange={(e) => navigate(`/p/${e.target.value}${isInCatalogView ? '/catalog' : ''}`)}>
      {!currentSubplebbitIsInList && subplebbitAddress && <option value={subplebbitAddress}>{displaySubplebbitAddress}</option>}
      <option value='all'>{t('all')}</option>
      <option value='subscriptions'>{t('subscriptions')}</option>
      {defaultSubplebbits.map((subplebbit, index) => {
        const { address, title } = subplebbit || {};
        const displayAddress = address.includes('.') ? address : address.slice(0, 10).concat('...');
        return (
          <option key={index} value={address}>
            {title || displayAddress}
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
        <Link to='settings'>{t('settings')}</Link>
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
      currentScrollInRange = scrollRange;
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
  const defaultSubplebbits = useDefaultSubplebbits();

  const params = useParams();
  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  return (
    <>
      <BoardNavDesktop defaultSubplebbits={defaultSubplebbits} />
      <BoardNavMobile defaultSubplebbits={defaultSubplebbits} subplebbitAddress={subplebbitAddress} />
    </>
  );
};

export default BoardNav;
