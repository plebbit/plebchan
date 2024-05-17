import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAccount, useFeed, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { Virtuoso, VirtuosoHandle, StateSnapshot } from 'react-virtuoso';
import { useTranslation } from 'react-i18next';
import styles from './board.module.css';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import useFeedStateString from '../../hooks/use-feed-state-string';
import useReplyModal from '../../hooks/use-reply-modal';
import LoadingEllipsis from '../../components/loading-ellipsis';
import Post from '../../components/post';
import ReplyModal from '../../components/reply-modal';
import SettingsModal from '../../components/settings-modal';
import SubplebbitDescription from '../../components/subplebbit-description';
import SubplebbitRules from '../../components/subplebbit-rules';

const lastVirtuosoStates: { [key: string]: StateSnapshot } = {};

const Board = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();

  const isInAllView = isAllView(location.pathname);
  const defaultSubplebbitAddresses = useDefaultSubplebbitAddresses();

  const account = useAccount();
  const subscriptions = account?.subscriptions;
  const isInSubscriptionsView = isSubscriptionsView(location.pathname);

  const subplebbitAddresses = useMemo(() => {
    if (isInAllView) {
      return defaultSubplebbitAddresses;
    }
    if (isInSubscriptionsView) {
      return subscriptions || [];
    }
    return [subplebbitAddress];
  }, [isInAllView, isInSubscriptionsView, subplebbitAddress, defaultSubplebbitAddresses, subscriptions]);

  const sortType = 'active';
  const { feed, hasMore, loadMore } = useFeed({ subplebbitAddresses, sortType });

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { createdAt, description, rules, shortAddress, state, suggested } = subplebbit || {};
  const title = isInAllView ? t('all') : isInSubscriptionsView ? t('subscriptions') : subplebbit?.title;

  const { activeCid, closeModal, openReplyModal, showReplyModal, scrollY } = useReplyModal();

  const loadingStateString = useFeedStateString(subplebbitAddresses) || t('loading');
  const loadingString = <div className={styles.stateString}>{state === 'failed' ? state : <LoadingEllipsis string={loadingStateString} />}</div>;

  const Footer = () => {
    let footerContent;
    if (feed.length === 0) {
      footerContent = t('no_posts');
    }
    if (hasMore || subplebbitAddresses.length === 0) {
      footerContent = loadingString;
    }
    return <div className={styles.footer}>{footerContent}</div>;
  };

  // save the last Virtuoso state to restore it when navigating back
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  useEffect(() => {
    const setLastVirtuosoState = () => {
      virtuosoRef.current?.getState((snapshot: StateSnapshot) => {
        if (snapshot?.ranges?.length) {
          lastVirtuosoStates[subplebbitAddress + sortType] = snapshot;
        }
      });
    };
    window.addEventListener('scroll', setLastVirtuosoState);
    return () => window.removeEventListener('scroll', setLastVirtuosoState);
  }, [subplebbitAddress, sortType]);

  const lastVirtuosoState = lastVirtuosoStates?.[subplebbitAddress + sortType];

  useEffect(() => {
    document.title = title ? title : shortAddress;
  }, [title, shortAddress]);

  return (
    <div className={styles.content}>
      {location.pathname === `/p/${subplebbitAddress}/settings` && <SettingsModal />}
      {showReplyModal && activeCid && <ReplyModal closeModal={closeModal} parentCid={activeCid} scrollY={scrollY} />}
      {feed.length > 0 && (
        <>
          {rules && rules.length > 0 && <SubplebbitRules subplebbitAddress={subplebbitAddress} createdAt={createdAt} rules={rules} />}
          {(description && description.length > 0) ||
            (isInAllView && (
              <SubplebbitDescription
                avatarUrl={suggested?.avatarUrl}
                subplebbitAddress={subplebbitAddress}
                createdAt={createdAt}
                description={description}
                shortAddress={shortAddress}
                title={title}
              />
            ))}
        </>
      )}
      <Virtuoso
        increaseViewportBy={{ bottom: 1200, top: 1200 }}
        totalCount={feed?.length || 0}
        data={feed}
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
    </div>
  );
};

export default Board;
