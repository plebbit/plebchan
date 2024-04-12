import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFeed, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { Virtuoso, VirtuosoHandle, StateSnapshot } from 'react-virtuoso';
import useFeedStateString from '../../hooks/use-feed-state-string';
import useWindowWidth from '../../hooks/use-window-width';
import CatalogRow from '../../components/catalog-row';
import LoadingEllipsis from '../../components/loading-ellipsis';
import styles from './catalog.module.css';

const lastVirtuosoStates: { [key: string]: StateSnapshot } = {};

const useFeedRows = (feed: any[], columnCount: number, includeDescription: boolean, includeRules: boolean) => {
  const rowsRef = useRef<any[]>([]);
  return useMemo(() => {
    const rows: any[] = [];
    let startIndex = 0;
    let adjustment = 0; // Adjustment for the first row if description/rules are included

    // Calculate adjustment for the first row
    if (includeDescription) adjustment += 1;
    if (includeRules) adjustment += 1;

    while (startIndex < feed.length) {
      let currentColumnCount = columnCount;

      // Adjust the number of items in the first row to compensate for description/rules
      if (rows.length === 0 && adjustment > 0) {
        currentColumnCount = columnCount - adjustment;
      }

      // Ensure we don't try to slice more items than are available
      const endIndex = Math.min(startIndex + currentColumnCount, feed.length);

      if (rowsRef.current[rows.length] && rowsRef.current[rows.length].length === currentColumnCount) {
        rows.push(rowsRef.current[rows.length]);
      } else {
        rows.push(feed.slice(startIndex, endIndex));
      }

      startIndex = endIndex; // Update startIndex to the end of the current row
    }

    rowsRef.current = rows;
    return rows;
  }, [feed, columnCount, includeDescription, includeRules]);
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
  const { createdAt, description, rules, shortAddress, state, suggested, title } = subplebbit || {};
  const { avatarUrl } = suggested || {};
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

  // split feed into rows
  const includeDescription = !!description && description.length > 0;
  const includeRules = !!rules && rules.length > 0;
  const rows = useFeedRows(feed, columnCount, includeDescription, includeRules);

  const descriptionPost = {
    isDescription: true,
    subplebbitAddress,
    timestamp: createdAt,
    author: { displayName: '## Board Mods' },
    content: description,
    link: avatarUrl,
    title: 'Welcome to ' + (title || `p/${shortAddress}`),
    pinned: true,
    locked: true,
  };

  const content = rules?.map((rule: string, index: number) => `${index + 1}. ${rule}`).join('\n');
  const rulesPost = {
    isRules: true,
    subplebbitAddress,
    timestamp: createdAt,
    author: { displayName: '## Board Mods' },
    content,
    title: 'Rules',
    pinned: true,
    locked: true,
  };

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
          itemContent={(index, row) => (
            <CatalogRow description={index === 0 && includeDescription && descriptionPost} index={index} row={row} rules={index === 0 && includeRules && rulesPost} />
          )}
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
