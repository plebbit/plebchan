import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Subplebbit, useFeed, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { Virtuoso, VirtuosoHandle, StateSnapshot } from 'react-virtuoso';
import useFeedStateString from '../../hooks/use-feed-state-string';
import useWindowWidth from '../../hooks/use-window-width';
import CatalogRow from '../../components/catalog-row';
import LoadingEllipsis from '../../components/loading-ellipsis';
import styles from './catalog.module.css';

const lastVirtuosoStates: { [key: string]: StateSnapshot } = {};

const useFeedRows = (columnCount: number, feed: any, isFeedLoaded: boolean, subplebbit: Subplebbit) => {
  const modifiedFeed = useMemo(() => {
    if (!isFeedLoaded) {
      return []; // prevent rules and description from appearing while feed is loading
    }
    if (!subplebbit?.description && !subplebbit?.rules) {
      return feed;
    }
    const _feed = [...feed];
    if (subplebbit?.description) {
      _feed.unshift({
        isDescription: true,
        subplebbitAddress: subplebbit?.address,
        timestamp: subplebbit?.createdAt,
        author: { displayName: '## Board Mods' },
        content: subplebbit?.description,
        link: subplebbit?.suggested?.avatarUrl,
        title: 'Welcome to ' + (subplebbit?.title || `p/${subplebbit?.shortAddress}`),
        pinned: true,
        locked: true,
      });
    }
    if (subplebbit?.rules) {
      _feed.unshift({
        isRules: true,
        subplebbitAddress: subplebbit?.address,
        timestamp: subplebbit?.createdAt,
        author: { displayName: '## Board Mods' },
        content: subplebbit?.rules.map((rule: string, index: number) => `${index + 1}. ${rule}`).join('\n'),
        title: 'Rules',
        pinned: true,
        locked: true,
      });
    }
    return _feed;
  }, [
    feed,
    subplebbit?.description,
    subplebbit?.rules,
    subplebbit?.address,
    isFeedLoaded,
    subplebbit?.createdAt,
    subplebbit?.title,
    subplebbit?.shortAddress,
    subplebbit?.suggested?.avatarUrl,
  ]);

  // Memoize rows calculation, ensuring it updates on changes to the modified feed or column count
  const rows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < modifiedFeed.length; i += columnCount) {
      rows.push(modifiedFeed.slice(i, i + columnCount));
    }
    return rows;
  }, [modifiedFeed, columnCount]);

  return rows;
};

const columnWidth = 180;

const Catalog = () => {
  const { t } = useTranslation();
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const subplebbitAddresses = useMemo(() => [subplebbitAddress], [subplebbitAddress]) as string[];

  const columnCount = Math.floor(useWindowWidth() / columnWidth);
  // postPerPage based on columnCount for optimized feed, dont change value after first render
  // eslint-disable-next-line
  const postsPerPage = useMemo(() => (columnCount <= 2 ? 10 : columnCount === 3 ? 15 : columnCount === 4 ? 20 : 25), []);

  const { feed, hasMore, loadMore } = useFeed({ subplebbitAddresses, sortType: 'active', postsPerPage });

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

  const isFeedloaded = feed.length > 0 || state === 'failed';

  // split feed into rows
  const rows = useFeedRows(columnCount, feed, isFeedloaded, subplebbit);

  // save the last Virtuoso state to restore it when navigating back
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  useEffect(() => {
    const setLastVirtuosoState = () =>
      virtuosoRef.current?.getState((snapshot: StateSnapshot) => {
        if (snapshot?.ranges?.length) {
          lastVirtuosoStates[subplebbitAddress + 'catalog'] = snapshot;
        }
      });
    window.addEventListener('scroll', setLastVirtuosoState);
    return () => window.removeEventListener('scroll', setLastVirtuosoState);
  }, [subplebbitAddress]);

  const lastVirtuosoState = lastVirtuosoStates?.[subplebbitAddress + 'catalog'];

  useEffect(() => {
    let documentTitle = title ? title : shortAddress;
    document.title = documentTitle + ' - Catalog';
  }, [title, shortAddress]);

  return (
    <div className={styles.content}>
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
