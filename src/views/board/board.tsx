import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Comment, useAccount, useAccountComments, useBlock, useFeed, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { Virtuoso, VirtuosoHandle, StateSnapshot } from 'react-virtuoso';
import { useTranslation } from 'react-i18next';
import styles from './board.module.css';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import useFeedStateString from '../../hooks/use-feed-state-string';
import useReplyModal from '../../hooks/use-reply-modal';
import useTimeFilter from '../../hooks/use-time-filter';
import useFeedResetStore from '../../stores/use-feed-reset-store';
import useSortingStore from '../../stores/use-sorting-store';
import LoadingEllipsis from '../../components/loading-ellipsis';
import { Post } from '../post';
import ReplyModal from '../../components/reply-modal';
import SettingsModal from '../../components/settings-modal';
import SubplebbitDescription from '../../components/subplebbit-description';
import SubplebbitRules from '../../components/subplebbit-rules';
import useInterfaceSettingsStore from '../../stores/use-interface-settings-store';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';

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

  const isInAllView = isAllView(location.pathname, useParams());
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
  const { timeFilterSeconds } = useTimeFilter();

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

  const { feed, hasMore, loadMore, reset } = useFeed(feedOptions);
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
        const { cid, deleted, postCid, removed, state } = comment || {};
        return (
          !deleted &&
          !removed &&
          state === 'succeeded' &&
          cid &&
          cid === postCid &&
          comment?.subplebbitAddress === subplebbitAddress &&
          !feed.some((post) => post.cid === cid)
        );
      }),
    [accountComments, subplebbitAddress, feed],
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
  const loadingStateString = useFeedStateString(subplebbitAddresses) || t('loading');
  const loadingString = (
    <div className={styles.stateString}>
      {state === 'failed' ? (
        <span className='red'>{state}</span>
      ) : isInSubscriptionsView && subscriptions?.length === 0 ? (
        t('not_subscribed_to_any_board')
      ) : blocked ? (
        'you have blocked this board'
      ) : !hasMore && feed.length === 0 ? (
        t('no_posts')
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

  const Footer = () => {
    return <div className={styles.footer}>{loadingString}</div>;
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
    <div className={styles.content}>
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
          shortAddress={shortAddress}
          title={title}
        />
      )}
      {feed.length !== 0 ? (
        <>
          {rules && rules.length > 0 && <SubplebbitRules subplebbitAddress={subplebbitAddress} createdAt={createdAt} rules={rules} />}
          <Virtuoso
            increaseViewportBy={{ bottom: 1200, top: 1200 }}
            totalCount={combinedFeed.length}
            data={combinedFeed}
            itemContent={(index, post) => {
              const { deleted, locked, removed } = post || {};
              const isThreadClosed = deleted || locked || removed;

              return <Post index={index} post={post} openReplyModal={isThreadClosed ? () => alert(t('thread_closed_alert')) : openReplyModal} />;
            }}
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
                Unblock
              </span>
              ]
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Board;
