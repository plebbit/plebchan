import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Comment, useAccount, useAccountComments, useBlock, useFeed, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { Virtuoso, VirtuosoHandle, StateSnapshot } from 'react-virtuoso';
import { Trans, useTranslation } from 'react-i18next';
import styles from './board.module.css';
import { shouldShowSnow } from '../../lib/snow';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import useFeedStateString from '../../hooks/use-feed-state-string';
import useReplyModal from '../../hooks/use-reply-modal';
import useTimeFilter from '../../hooks/use-time-filter';
import useInterfaceSettingsStore from '../../stores/use-interface-settings-store';
import useFeedResetStore from '../../stores/use-feed-reset-store';
import useSortingStore from '../../stores/use-sorting-store';
import LoadingEllipsis from '../../components/loading-ellipsis';
import { Post } from '../post';
import ReplyModal from '../../components/reply-modal';
import SettingsModal from '../../components/settings-modal';
import SubplebbitDescription from '../../components/subplebbit-description';
import SubplebbitRules from '../../components/subplebbit-rules';

const lastVirtuosoStates: { [key: string]: StateSnapshot } = {};

const threadsWithoutImagesFilter = (comment: Comment) => {
  if (!getHasThumbnail(getCommentMediaInfo(comment), comment?.link)) {
    return false;
  }
  return true;
};

const Board = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const { hideThreadsWithoutImages } = useInterfaceSettingsStore();

  const isInAllView = isAllView(location.pathname);
  const defaultSubplebbitAddresses = useDefaultSubplebbitAddresses();

  const account = useAccount();
  const subscriptions = account?.subscriptions;
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const subplebbitAddresses = useMemo(() => {
    if (isInAllView) {
      return defaultSubplebbitAddresses;
    }
    if (isInSubscriptionsView) {
      return subscriptions || [];
    }
    return [subplebbitAddress];
  }, [isInAllView, isInSubscriptionsView, subplebbitAddress, defaultSubplebbitAddresses, subscriptions]);

  const { sortType } = useSortingStore();
  const { timeFilterSeconds, timeFilterName } = useTimeFilter();

  const feedOptions: any = useMemo(
    () => ({
      subplebbitAddresses,
      sortType,
      postsPerPage: isInAllView || isInSubscriptionsView ? 5 : 25,
      ...(isInAllView || isInSubscriptionsView ? { newerThan: timeFilterSeconds } : {}),
      filter: hideThreadsWithoutImages ? threadsWithoutImagesFilter : undefined,
    }),
    [subplebbitAddresses, sortType, timeFilterSeconds, isInAllView, isInSubscriptionsView, hideThreadsWithoutImages],
  );

  const { feed, hasMore, loadMore, reset, subplebbitAddressesWithNewerPosts } = useFeed(feedOptions);
  const { accountComments } = useAccountComments();

  const resetTriggeredRef = useRef(false);

  const setResetFunction = useFeedResetStore((state) => state.setResetFunction);
  useEffect(() => {
    setResetFunction(reset);
  }, [reset, setResetFunction, feed]);

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

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { createdAt, description, error, rules, shortAddress, state, suggested } = subplebbit || {};
  const title = isInAllView ? t('all') : isInSubscriptionsView ? t('subscriptions') : subplebbit?.title;

  const { activeCid, threadCid, closeModal, openReplyModal, showReplyModal, scrollY, subplebbitAddress: postSubplebbitAddress } = useReplyModal();

  const { blocked, unblock } = useBlock({ address: subplebbitAddress });

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

  const feedLength = feed.length;
  const weeklyFeedLength = weeklyFeed.length;
  const monthlyFeedLength = monthlyFeed.length;
  const hasFeedLoaded = !!feed;
  const loadingStateString =
    useFeedStateString(subplebbitAddresses) ||
    (!hasFeedLoaded || (feedLength === 0 && !(weeklyFeedLength > feedLength || monthlyFeedLength > feedLength)) ? t('loading_feed') : t('looking_for_more_posts'));

  const [showMorePostsSuggestion, setShowMorePostsSuggestion] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMorePostsSuggestion(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const params = useParams();
  const currentTimeFilterName = params?.timeFilterName || timeFilterName;

  const Footer = () => {
    let footerContent;
    if (combinedFeed.length === 0) {
      footerContent = t('no_threads');
    }
    if (hasMore || (subplebbitAddresses && subplebbitAddresses.length === 0)) {
      footerContent = (
        <>
          {subplebbitAddressesWithNewerPosts.length > 0 ? (
            <div className={styles.morePostsSuggestion}>
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
              <div className={styles.morePostsSuggestion}>
                <Trans
                  i18nKey='more_threads_last_week'
                  values={{ currentTimeFilterName, count: feed.length }}
                  components={{
                    1: <Link to={(isInAllView ? '/p/all' : isInSubscriptionsView ? '/p/subscriptions' : `/p/${subplebbitAddress}`) + '/1w'} />,
                  }}
                />
              </div>
            ) : (
              <div className={styles.morePostsSuggestion}>
                <Trans
                  i18nKey='more_threads_last_month'
                  values={{ currentTimeFilterName, count: feed.length }}
                  components={{
                    1: <Link to={(isInAllView ? '/p/all' : isInSubscriptionsView ? '/p/subscriptions' : `/p/${subplebbitAddress}`) + '/1m'} />,
                  }}
                />
              </div>
            ))
          )}
        </>
      );
    }
    return (
      <div className={styles.footer}>
        {footerContent}
        <div>
          {state === 'failed' ? (
            <span className='red'>{state}</span>
          ) : isInSubscriptionsView && subscriptions?.length === 0 ? (
            t('not_subscribed_to_any_board')
          ) : blocked ? (
            t('you_have_blocked_this_board')
          ) : (
            hasMore && <LoadingEllipsis string={loadingStateString} />
          )}
          {error && (
            <div className='red'>
              <br />
              {error.message}
            </div>
          )}
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
      </div>
    );
  };

  // save the last Virtuoso state to restore it when navigating back
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  useEffect(() => {
    const setLastVirtuosoState = () => {
      virtuosoRef.current?.getState((snapshot: StateSnapshot) => {
        if (snapshot?.ranges?.length) {
          lastVirtuosoStates[sortType + timeFilterSeconds] = snapshot;
        }
      });
    };
    window.addEventListener('scroll', setLastVirtuosoState);
    return () => window.removeEventListener('scroll', setLastVirtuosoState);
  }, [sortType, timeFilterSeconds]);

  const lastVirtuosoState = lastVirtuosoStates?.[sortType + timeFilterSeconds];

  useEffect(() => {
    const boardTitle = title ? title : shortAddress || subplebbitAddress;
    document.title = boardTitle + ' - plebchan';
  }, [title, shortAddress, subplebbitAddress]);

  return (
    <>
      {shouldShowSnow() && <hr />}
      <div className={`${styles.content} ${shouldShowSnow() ? styles.garland : ''}`}>
        {location.pathname.endsWith('/settings') && <SettingsModal />}
        {activeCid && threadCid && postSubplebbitAddress && (
          <ReplyModal
            closeModal={closeModal}
            parentCid={activeCid}
            postCid={threadCid}
            scrollY={scrollY}
            showReplyModal={showReplyModal}
            subplebbitAddress={postSubplebbitAddress}
          />
        )}
        {((description && description.length > 0) || isInAllView) && (
          <SubplebbitDescription
            avatarUrl={suggested?.avatarUrl}
            subplebbitAddress={subplebbitAddress}
            createdAt={createdAt}
            description={description}
            replyCount={isInAllView ? 0 : rules?.length > 0 ? 1 : 0}
            shortAddress={shortAddress}
            title={title}
          />
        )}
        {rules && !description && rules.length > 0 && <SubplebbitRules subplebbitAddress={subplebbitAddress} createdAt={createdAt} rules={rules} />}
        <Virtuoso
          increaseViewportBy={{ bottom: 1200, top: 1200 }}
          totalCount={combinedFeed.length}
          data={combinedFeed}
          itemContent={(index, post) => <Post index={index} post={post} openReplyModal={openReplyModal} />}
          useWindowScroll={true}
          components={{ Footer }}
          endReached={loadMore}
          ref={virtuosoRef}
          restoreStateFrom={lastVirtuosoState}
          initialScrollTop={lastVirtuosoState?.scrollTop}
        />
      </div>
    </>
  );
};

export default Board;
