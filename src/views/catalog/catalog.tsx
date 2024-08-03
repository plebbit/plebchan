import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Comment, useAccount, useFeed, useSubplebbit, useBlock } from '@plebbit/plebbit-react-hooks';
import { Virtuoso, VirtuosoHandle, StateSnapshot } from 'react-virtuoso';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useCatalogFeedRows from '../../hooks/use-catalog-feed-rows';
import useDefaultSubplebbits from '../../hooks/use-default-subplebbits';
import useFeedStateString from '../../hooks/use-feed-state-string';
import useTimeFilter from '../../hooks/use-time-filter';
import useWindowWidth from '../../hooks/use-window-width';
import useCatalogFiltersStore from '../../stores/use-catalog-filters-store';
import useCatalogStyleStore from '../../stores/use-catalog-style-store';
import useFeedResetStore from '../../stores/use-feed-reset-store';
import useSortingStore from '../../stores/use-sorting-store';
import CatalogRow from '../../components/catalog-row';
import LoadingEllipsis from '../../components/loading-ellipsis';
import SettingsModal from '../../components/settings-modal';
import styles from './catalog.module.css';

const lastVirtuosoStates: { [key: string]: StateSnapshot } = {};

const catalogFilter = (comment: Comment) => {
  const commentMediaInfo = getCommentMediaInfo(comment);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, comment?.link);
  return hasThumbnail;
};

const Catalog = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();

  const isInAllView = isAllView(location.pathname, useParams());
  const defaultSubplebbits = useDefaultSubplebbits();
  const { showAdultBoards, showGoreBoards } = useCatalogFiltersStore();

  const account = useAccount();
  const subscriptions = account?.subscriptions;
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const subplebbitAddresses = useMemo(() => {
    const filteredDefaultSubplebbits = defaultSubplebbits
      .filter((subplebbit) => {
        const { tags } = subplebbit;
        const hasGoreTag = tags?.includes('gore');
        const hasAdultTag = tags?.includes('adult');

        if ((hasGoreTag && !showGoreBoards) || (hasAdultTag && !showAdultBoards)) {
          return false;
        }
        return true;
      })
      .map((subplebbit) => subplebbit.address);

    if (isInAllView) {
      return filteredDefaultSubplebbits;
    }
    if (isInSubscriptionsView) {
      return subscriptions || [];
    }
    return [subplebbitAddress];
  }, [isInAllView, isInSubscriptionsView, subplebbitAddress, defaultSubplebbits, subscriptions, showAdultBoards, showGoreBoards]);

  const { imageSize } = useCatalogStyleStore();
  const columnWidth = imageSize === 'Large' ? 270 : 180;

  const columnCount = Math.floor(useWindowWidth() / columnWidth);
  // postPerPage based on columnCount for optimized feed, dont change value after first render
  // eslint-disable-next-line
  const postsPerPage = useMemo(() => (columnCount <= 2 ? 10 : columnCount === 3 ? 15 : columnCount === 4 ? 20 : 25), []);

  const { timeFilterSeconds } = useTimeFilter();
  const { showTextOnlyThreads } = useCatalogFiltersStore();
  const { sortType } = useSortingStore();

  const feedOptions: any = {
    subplebbitAddresses,
    sortType,
    postsPerPage: isInAllView || isInSubscriptionsView ? 10 : postsPerPage,
    filter: !showTextOnlyThreads && catalogFilter,
  };

  if (isInAllView || isInSubscriptionsView) {
    feedOptions.newerThan = timeFilterSeconds;
  }

  const { feed, hasMore, loadMore, reset } = useFeed(feedOptions);

  const setResetFunction = useFeedResetStore((state) => state.setResetFunction);
  useEffect(() => {
    setResetFunction(reset);
  }, [reset, setResetFunction]);

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { error, shortAddress, state, title } = subplebbit || {};
  const loadingStateString = useFeedStateString(subplebbitAddresses) || t('loading');
  const loadingString = (
    <div className={styles.stateString}>
      {state === 'failed' ? (
        state
      ) : isInSubscriptionsView && subscriptions?.length === 0 ? (
        t('not_subscribed_to_any_board')
      ) : (
        <LoadingEllipsis string={loadingStateString} />
      )}
      {error && (
        <div style={{ color: 'red' }}>
          <br />
          {error.message}
        </div>
      )}
    </div>
  );

  const { blocked, unblock } = useBlock({ address: subplebbitAddress });

  const Footer = () => {
    let footerContent;
    if (feed.length === 0) {
      if (blocked) {
        footerContent = 'you have blocked this board';
      } else {
        footerContent = t('no_posts');
      }
    }
    if (hasMore || subplebbitAddresses.length === 0) {
      footerContent = loadingString;
    }
    return (
      <div className={styles.footer}>
        {footerContent}
        {blocked && (
          <>
            &nbsp;&nbsp;[
            <span
              className={styles.button}
              onClick={() => {
                unblock();
                reset();
              }}
            >
              Unblock
            </span>
            ]
          </>
        )}
      </div>
    );
  };

  const isFeedLoaded = feed.length > 0 || state === 'failed';

  const rows = useCatalogFeedRows(columnCount, feed, isFeedLoaded, subplebbit);

  // save the last Virtuoso state to restore it when navigating back
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  useEffect(() => {
    const setLastVirtuosoState = () =>
      virtuosoRef.current?.getState((snapshot: StateSnapshot) => {
        if (snapshot?.ranges?.length) {
          lastVirtuosoStates[sortType + timeFilterSeconds + 'catalog'] = snapshot;
        }
      });
    window.addEventListener('scroll', setLastVirtuosoState);
    return () => window.removeEventListener('scroll', setLastVirtuosoState);
  }, [sortType, timeFilterSeconds]);

  const lastVirtuosoState = lastVirtuosoStates?.[sortType + timeFilterSeconds + 'catalog'];

  useEffect(() => {
    let documentTitle = title ? title : shortAddress;
    if (isInAllView) documentTitle = t('all');
    else if (isInSubscriptionsView) documentTitle = t('subscriptions');
    document.title = documentTitle + ` - ${t('catalog')} - plebchan`;
  }, [title, shortAddress, isInAllView, isInSubscriptionsView, t]);

  return (
    <div className={styles.content}>
      {location.pathname.endsWith('/settings') && <SettingsModal />}
      <hr />
      <div className={styles.catalog}>
        <Virtuoso
          increaseViewportBy={{ bottom: 1200, top: 1200 }}
          totalCount={rows?.length || 0}
          data={rows}
          itemContent={(index, row) => <CatalogRow index={index} row={row} />}
          useWindowScroll={true}
          components={{ Footer }}
          endReached={loadMore}
          ref={virtuosoRef}
          restoreStateFrom={lastVirtuosoState}
          initialScrollTop={lastVirtuosoState?.scrollTop}
        />
      </div>
    </div>
  );
};

export default Catalog;
