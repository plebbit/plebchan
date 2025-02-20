import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, useAccountComment } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAllView, isCatalogView, isSubscriptionsView } from '../../lib/utils/view-utils';
import styles from './topbar.module.css';
import { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import _, { debounce } from 'lodash';
import { TimeFilter } from '../board-buttons';
import { useAutoSubscribe } from '../../hooks/use-auto-subscribe';

const SearchBar = ({ setShowSearchBar }: { setShowSearchBar: (show: boolean) => void }) => {
  const navigate = useNavigate();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const placeholder = `"community.eth/.sol" / "12D3KooW..."`;

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSearchBar(false);
      }
    },
    [searchBarRef, setShowSearchBar],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchBar(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [setShowSearchBar]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchInput = searchInputRef.current?.value;
    if (searchInput) {
      searchInputRef.current.value = '';
      navigate(`/p/${searchInput}`);
      setShowSearchBar(false);
    }
  };

  return (
    <div className={styles.searchBar} ref={searchBarRef}>
      <form onSubmit={handleSearchSubmit}>
        <input type='text' autoCorrect='off' autoComplete='off' spellCheck='false' autoCapitalize='off' placeholder={placeholder} ref={searchInputRef} />
      </form>
    </div>
  );
};

const TopBarDesktop = () => {
  const { t } = useTranslation();
  const account = useAccount();
  const location = useLocation();
  const params = useParams();
  const isInCatalogView = isCatalogView(location.pathname, params);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const subscriptions = account?.subscriptions;

  return (
    <div className={styles.boardNavDesktop}>
      <span className={styles.boardList}>
        [<Link to='/p/all'>all</Link> / <Link to='/p/subscriptions'>subscriptions</Link>]{' '}
        {subscriptions?.length > 0 && (
          <>
            [
            {subscriptions.map((address: any, index: any) => (
              <span key={index}>
                {index === 0 ? null : ' '}
                <Link to={`/p/${address}${isInCatalogView ? '/catalog' : ''}`}>
                  {address.endsWith('.eth') || address.endsWith('.sol') ? address : address.slice(0, 10).concat('...')}
                </Link>
                {index !== subscriptions?.length - 1 ? ' /' : null}
              </span>
            ))}
            ]{' '}
          </>
        )}
        [
        <Link
          className={styles.disabledButton}
          to='boards/create'
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {t('create')}
        </Link>
        ] [
        <Link
          className={styles.disabledButton}
          to='boards'
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {t('vote')}
        </Link>
        ]
      </span>
      <span className={styles.navTopRight}>
        [<Link to={!location.pathname.endsWith('settings') ? location.pathname.replace(/\/$/, '') + '/settings' : location.pathname}>{t('settings')}</Link>] [
        <span onClick={() => setShowSearchBar(!showSearchBar)}>{t('search')}</span>] [<Link to='/'>{t('home')}</Link>]
      </span>
      {showSearchBar && <SearchBar setShowSearchBar={setShowSearchBar} />}
    </div>
  );
};

const TopBarMobile = ({ subplebbitAddress }: { subplebbitAddress: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const subplebbitAddresses = useDefaultSubplebbitAddresses();
  const displaySubplebbitAddress = subplebbitAddress && subplebbitAddress.length > 30 ? subplebbitAddress.slice(0, 30).concat('...') : subplebbitAddress;
  const [showSearchBar, setShowSearchBar] = useState(false);

  const currentSubplebbitIsInList = subplebbitAddresses.some((address: string) => address === subplebbitAddress);

  const location = useLocation();
  const params = useParams();
  const isInAllView = isAllView(location.pathname);
  const isInCatalogView = isCatalogView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());
  const selectValue = isInAllView ? 'all' : isInSubscriptionsView ? 'subscriptions' : subplebbitAddress;

  const boardSelect = (
    <select value={selectValue} onChange={(e) => navigate(`/p/${e.target.value}${isInCatalogView ? '/catalog' : ''}`)}>
      {!currentSubplebbitIsInList && subplebbitAddress && <option value={subplebbitAddress}>{displaySubplebbitAddress}</option>}
      <option value='all'>all</option>
      <option value='subscriptions'>subscriptions</option>
      {subplebbitAddresses.map((address: any, index: number) => {
        const subplebbitAddress = address?.includes('.') ? address : Plebbit.getShortAddress(address);
        return (
          <option key={index} value={address}>
            {subplebbitAddress.endsWith('.eth') || subplebbitAddress.endsWith('.sol') ? subplebbitAddress.slice(0, -4) : subplebbitAddress}
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
    <div className={styles.boardNavMobile} style={{ transform: visible ? 'translateY(0)' : 'translateY(-23px)' }}>
      <div className={styles.boardSelect}>
        <strong>{t('board')}</strong>
        {boardSelect}
        {(isInAllView || isInSubscriptionsView) && (
          <TimeFilter isTopbar={true} isInAllView={isInAllView} isInCatalogView={isInCatalogView} isInSubscriptionsView={isInSubscriptionsView} />
        )}
      </div>
      <div className={styles.pageJump}>
        <Link to={useLocation().pathname.replace(/\/$/, '') + '/settings'}>{t('settings')}</Link>
        <span onClick={() => setShowSearchBar(!showSearchBar)}>{_.capitalize(t('search'))}</span>
        <Link to='/'>{t('home')}</Link>
        {showSearchBar && <SearchBar setShowSearchBar={setShowSearchBar} />}
      </div>
    </div>
  );
};

const TopBar = () => {
  const { t } = useTranslation();
  const params = useParams();
  const { isCheckingSubscriptions } = useAutoSubscribe();
  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  return (
    <>
      {isCheckingSubscriptions && <div className={styles.checkingSubscriptions}>{t('loading_subscriptions')}</div>}
      <TopBarDesktop />
      <TopBarMobile subplebbitAddress={subplebbitAddress} />
    </>
  );
};

export default TopBar;
