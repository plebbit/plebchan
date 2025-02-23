import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Comment, useAccount, useFeed, useSubplebbit, useBlock, useAccountComments } from '@plebbit/plebbit-react-hooks';
import { Virtuoso, VirtuosoHandle, StateSnapshot } from 'react-virtuoso';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useCatalogFeedRows from '../../hooks/use-catalog-feed-rows';
import { useDefaultSubplebbits } from '../../hooks/use-default-subplebbits';
import useFeedStateString from '../../hooks/use-feed-state-string';
import useTimeFilter from '../../hooks/use-time-filter';
import useWindowWidth from '../../hooks/use-window-width';
import useCatalogStyleStore from '../../stores/use-catalog-style-store';
import useFeedResetStore from '../../stores/use-feed-reset-store';
import useInterfaceSettingsStore from '../../stores/use-interface-settings-store';
import useSortingStore from '../../stores/use-sorting-store';
import CatalogRow from '../../components/catalog-row';
import LoadingEllipsis from '../../components/loading-ellipsis';
import SettingsModal from '../../components/settings-modal';
import styles from './catalog.module.css';

const lastVirtuosoStates: { [key: string]: StateSnapshot } = {};

const threadsWithoutImagesFilter = (comment: Comment) => {
  if (!getHasThumbnail(getCommentMediaInfo(comment), comment?.link)) {
    return false;
  }
  return true;
};

const Catalog = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();

  const isInAllView = isAllView(location.pathname);
  const defaultSubplebbits = useDefaultSubplebbits();
  const { hideAdultBoards, hideGoreBoards } = useInterfaceSettingsStore();
  const { hideThreadsWithoutImages } = useInterfaceSettingsStore();

  const account = useAccount();
  const subscriptions = account?.subscriptions;
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const subplebbitAddresses = useMemo(() => {
    const filteredDefaultSubplebbits = defaultSubplebbits
      .filter((subplebbit) => {
        const { tags } = subplebbit;
        const hasGoreTag = tags?.includes('gore');
        const hasAdultTag = tags?.includes('adult');

        if ((hasGoreTag && hideGoreBoards) || (hasAdultTag && hideAdultBoards)) {
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
  }, [isInAllView, isInSubscriptionsView, subplebbitAddress, defaultSubplebbits, subscriptions, hideAdultBoards, hideGoreBoards]);

  const { imageSize } = useCatalogStyleStore();
  const columnWidth = imageSize === 'Large' ? 270 : 180;

  const columnCount = Math.floor(useWindowWidth() / columnWidth);
  const postsPerPage = columnCount <= 2 ? 10 : columnCount === 3 ? 15 : columnCount === 4 ? 20 : 25;

  const { timeFilterSeconds, timeFilterName } = useTimeFilter();
  const { sortType } = useSortingStore();

  const feedOptions = useMemo(() => {
    const options: any = {
      subplebbitAddresses,
      sortType,
      postsPerPage: isInAllView || isInSubscriptionsView ? 10 : postsPerPage,
      filter: hideThreadsWithoutImages ? threadsWithoutImagesFilter : undefined,
    };

    if (isInAllView || isInSubscriptionsView) {
      options.newerThan = timeFilterSeconds;
    }

    return options;
  }, [subplebbitAddresses, sortType, isInAllView, isInSubscriptionsView, postsPerPage, timeFilterSeconds, hideThreadsWithoutImages]);

  const { feed, hasMore, loadMore, reset, subplebbitAddressesWithNewerPosts } = useFeed(feedOptions);
  const { accountComments } = useAccountComments();

  const resetTriggeredRef = useRef(false);

  // show account comments instantly in the feed once published (cid defined), instead of waiting for the feed to update
  const filteredComments = useMemo(
    () =>
      accountComments.filter((comment) => {
        const { cid, deleted, postCid, removed, state, timestamp } = comment || {};
        return (
          !deleted &&
          !removed &&
          timestamp > Date.now() / 1000 - 60 * 60 &&
          state === 'succeeded' &&
          cid &&
          (hideThreadsWithoutImages ? getHasThumbnail(getCommentMediaInfo(comment), comment?.link) : true) &&
          cid === postCid &&
          comment?.subplebbitAddress === subplebbitAddress &&
          !feed.some((post) => post.cid === cid)
        );
      }),
    [accountComments, subplebbitAddress, feed, hideThreadsWithoutImages],
  );

  // show newest account comment at the top of the feed but after pinned posts
  const combinedFeed = useMemo(() => {
    const newFeed = [...feed];
    const lastPinnedIndex = newFeed.map((post) => post.pinned).lastIndexOf(true);
    if (filteredComments.length > 0) {
      newFeed.splice(lastPinnedIndex + 1, 0, ...filteredComments);
    }
    return newFeed;
  }, [feed, filteredComments]);

  useEffect(() => {
    if (filteredComments.length > 0 && !resetTriggeredRef.current) {
      reset();
      resetTriggeredRef.current = true;
    }
  }, [filteredComments, reset]);

  const handleNewerPostsButtonClick = () => {
    window.scrollTo({ top: 0, left: 0 });
    setTimeout(() => {
      reset();
    }, 300);
  };

  // suggest the user to change time filter if there aren't enough posts
  const { feed: weeklyFeed } = useFeed({
    subplebbitAddresses,
    sortType,
    newerThan: 60 * 60 * 24 * 7,
    filter: hideThreadsWithoutImages ? threadsWithoutImagesFilter : undefined,
  });
  const { feed: monthlyFeed } = useFeed({
    subplebbitAddresses,
    sortType,
    newerThan: 60 * 60 * 24 * 30,
    filter: hideThreadsWithoutImages ? threadsWithoutImagesFilter : undefined,
  });

  const [showMorePostsSuggestion, setShowMorePostsSuggestion] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMorePostsSuggestion(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const setResetFunction = useFeedResetStore((state) => state.setResetFunction);
  useEffect(() => {
    setResetFunction(reset);
  }, [reset, setResetFunction]);

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { error, shortAddress, state, title } = subplebbit || {};
  const { blocked, unblock } = useBlock({ address: subplebbitAddress });

  const feedLength = feed.length;
  const weeklyFeedLength = weeklyFeed.length;
  const monthlyFeedLength = monthlyFeed.length;
  const hasFeedLoaded = !!feed;
  const loadingStateString =
    useFeedStateString(subplebbitAddresses) || !hasFeedLoaded || (feedLength === 0 && !(weeklyFeedLength > feedLength || monthlyFeedLength > feedLength))
      ? t('loading_feed')
      : t('looking_for_more_posts');

  const loadingString = (
    <div className={styles.stateString}>
      {state === 'failed' ? (
        <span className='red'>{state}</span>
      ) : isInSubscriptionsView && subscriptions?.length === 0 ? (
        t('not_subscribed_to_any_board')
      ) : blocked ? (
        t('you_have_blocked_this_board')
      ) : !hasMore && combinedFeed.length === 0 ? (
        t('no_threads')
      ) : (
        hasMore && <LoadingEllipsis string={loadingStateString} />
      )}
      {error && (
        <div className='red'>
          <br />
          {error.message}
        </div>
      )}
    </div>
  );

  const params = useParams<{ sortType?: string; timeFilterName?: string }>();
  const currentTimeFilterName = params?.timeFilterName || timeFilterName;

  const Footer = () => {
    let footerContent;
    if (feed.length === 0) {
      if (blocked) {
        footerContent = t('you_have_blocked_this_board');
      } else if (combinedFeed.length === 0) {
        footerContent = t('no_threads');
      }
    }
    if (hasMore || (subplebbitAddresses && subplebbitAddresses.length === 0)) {
      footerContent = (
        <>
          {subplebbitAddressesWithNewerPosts.length > 0 ? (
            <div className={styles.stateString}>
              <Trans
                i18nKey='newer_threads_available'
                components={{
                  1: <span className={styles.newerPostsButton} onClick={handleNewerPostsButtonClick} />,
                }}
              />
            </div>
          ) : (
            (isInAllView || isInSubscriptionsView) &&
            showMorePostsSuggestion &&
            monthlyFeed.length > feed.length &&
            (weeklyFeed.length > feed.length ? (
              <div className={styles.stateString}>
                <Trans
                  i18nKey='more_threads_last_week'
                  values={{ currentTimeFilterName, count: feed.length }}
                  components={{
                    1: <Link to={(isInAllView ? '/p/all/catalog' : isInSubscriptionsView ? '/p/subscriptions/catalog' : `/p/${subplebbitAddress}/catalog`) + '/1w'} />,
                  }}
                />
              </div>
            ) : (
              <div className={styles.stateString}>
                <Trans
                  i18nKey='more_threads_last_month'
                  values={{ currentTimeFilterName, count: feed.length }}
                  components={{
                    1: <Link to={(isInAllView ? '/p/all/catalog' : isInSubscriptionsView ? '/p/subscriptions/catalog' : `/p/${subplebbitAddress}/catalog`) + '/1m'} />,
                  }}
                />
              </div>
            ))
          )}
          <div className={styles.stateString}>
            <LoadingEllipsis string={loadingStateString} />
          </div>
        </>
      );
    }
    return <div className={styles.footer}>{footerContent}</div>;
  };

  const isFeedLoaded = feed.length > 0 || state === 'failed';

  const rows = useCatalogFeedRows(columnCount, combinedFeed, isFeedLoaded, subplebbit);

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
        {combinedFeed.length !== 0 ? (
          <>
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
          </>
        ) : (
          <div className={styles.footer}>
            {loadingString}
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
                  {t('unblock')}
                </span>
                ]
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
