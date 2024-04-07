import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFeed, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { Virtuoso, VirtuosoHandle, StateSnapshot } from 'react-virtuoso';
import { useTranslation } from 'react-i18next';
import styles from './subplebbit.module.css';
import useFeedStateString from '../../hooks/use-feed-state-string';
import LoadingEllipsis from '../../components/loading-ellipsis';
import Post from '../../components/post';

const lastVirtuosoStates: { [key: string]: StateSnapshot } = {};

const Subplebbit = () => {
  const { t } = useTranslation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const subplebbitAddresses = useMemo(() => [subplebbitAddress], [subplebbitAddress]) as string[];
  const sortType = 'active';
  const { feed, hasMore, loadMore } = useFeed({ subplebbitAddresses, sortType });

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { shortAddress, state, title } = subplebbit || {};

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
      <Virtuoso
        increaseViewportBy={{ bottom: 1200, top: 1200 }}
        totalCount={feed?.length || 0}
        data={feed}
        itemContent={(index, post) => <Post index={index} post={post} />}
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

export default Subplebbit;
