import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFeed, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { Virtuoso, VirtuosoHandle, StateSnapshot } from 'react-virtuoso';
import { useTranslation } from 'react-i18next';
import styles from './board.module.css';
import useFeedStateString from '../../hooks/use-feed-state-string';
import useReplyModal from '../../hooks/use-reply-modal';
import LoadingEllipsis from '../../components/loading-ellipsis';
import Post from '../../components/post';
import ReplyModal from '../../components/reply-modal';
import SubplebbitDescription from '../../components/subplebbit-description';
import SubplebbitRules from '../../components/subplebbit-rules';

const lastVirtuosoStates: { [key: string]: StateSnapshot } = {};

const Board = () => {
  const { t } = useTranslation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const subplebbitAddresses = useMemo(() => [subplebbitAddress], [subplebbitAddress]) as string[];
  const sortType = 'active';
  const { feed, hasMore, loadMore } = useFeed({ subplebbitAddresses, sortType });

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { createdAt, description, rules, shortAddress, state, suggested, title } = subplebbit || {};

  const { showReplyModal, activeCid, openReplyModal, closeModal } = useReplyModal();

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
      {showReplyModal && activeCid && <ReplyModal closeModal={closeModal} parentCid={activeCid} />}
      {feed.length > 0 && (
        <>
          {rules && rules.length > 0 && <SubplebbitRules subplebbitAddress={subplebbitAddress} createdAt={createdAt} rules={rules} />}
          {description && description.length > 0 && (
            <SubplebbitDescription
              avatarUrl={suggested?.avatarUrl}
              subplebbitAddress={subplebbitAddress}
              createdAt={createdAt}
              description={description}
              shortAddress={shortAddress}
              title={title}
            />
          )}
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
