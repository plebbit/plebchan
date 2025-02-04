import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { Subplebbit } from '@plebbit/plebbit-react-hooks';
import { useDefaultSubplebbitTags } from '../../../hooks/use-default-subplebbits-tags';
import useIsSubplebbitOffline from '../../../hooks/use-is-subplebbit-offline';
import styles from '../home.module.css';
import { nsfwTags } from '../home';
import { useState, useEffect } from 'react';

const Board = ({ subplebbit }: { subplebbit: Subplebbit; useCatalog?: boolean }) => {
  const { t } = useTranslation();
  const { address, title, tags } = subplebbit || {};
  const nsfwTag = tags?.find((tag: string) => nsfwTags.includes(tag));

  const { isOffline, isOnlineStatusLoading, offlineIconClass, offlineTitle } = useIsSubplebbitOffline(subplebbit);

  const displayAddress = address === 'all' ? 'all' : Plebbit.getShortAddress(address);
  const showOfflineIcon = address !== 'all' && (isOffline || isOnlineStatusLoading);

  return (
    <tr className={styles.subplebbit} key={address}>
      <td className={styles.boardAddress}>
        <p className={styles.boardCell}>
          <Link to={`/p/${address}`}>{displayAddress}</Link>
          {showOfflineIcon && <span className={`${styles.offlineIcon} ${offlineIconClass}`} title={offlineTitle} />}
          {nsfwTag && <span className={styles.nsfw}> ({t(nsfwTag)})</span>}
        </p>
      </td>
      <td className={styles.boardTitle}>
        <p className={styles.boardCell}>{title || displayAddress}</p>
      </td>
      <td className={styles.boardTags}>
        <p className={styles.boardCell}>
          {tags.map((tag: string, index: number) => (
            <>
              {tag === 'multiboard' ? <span>{tag}</span> : <Link to={`/${tag}`}>{tag}</Link>}
              {index < tags.length - 1 && ', '}
            </>
          ))}
        </p>
      </td>
    </tr>
  );
};

const BoardsList = ({ multisub }: { multisub: Subplebbit[] }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [displayCount, setDisplayCount] = useState(15);

  const currentTag = location.pathname.split('/').filter(Boolean)[0];
  const tags = useDefaultSubplebbitTags(multisub);

  useEffect(() => {
    setDisplayCount(15);
  }, [currentTag]);

  const filteredBoards = (currentTag && tags.includes(currentTag) ? multisub.filter((sub) => sub?.tags?.includes(currentTag)) : multisub).slice(0, displayCount);

  const totalBoardCount = currentTag && tags.includes(currentTag) ? multisub.filter((sub) => sub?.tags?.includes(currentTag)).length : multisub.length;

  const hasMoreBoards =
    currentTag && tags.includes(currentTag) ? displayCount < multisub.filter((sub) => sub?.tags?.includes(currentTag)).length : displayCount < multisub.length;

  const defaultBoard = {
    address: 'all',
    title: 'Temporary Default Subplebbits',
    tags: ['multiboard'],
  } as Subplebbit;

  return (
    <div className={styles.boardsBox}>
      <table className={styles.boardsList}>
        <colgroup>
          <col className={styles.boardAddress} />
          <col className={styles.boardTitle} />
        </colgroup>
        <thead>
          <tr>
            <th>{t('board')}</th>
            <th>{t('title')}</th>
            <th>{t('tags')}</th>
          </tr>
        </thead>
        <tbody>
          {!currentTag && <Board key='all' subplebbit={defaultBoard} />}
          {filteredBoards.map((sub) => (
            <Board key={sub.address} subplebbit={sub} />
          ))}
        </tbody>
      </table>
      <div className={styles.displayCount}>
        displaying {filteredBoards.length} of {totalBoardCount} boards
        {currentTag && tags.includes(currentTag) && ` tagged "${currentTag}"`}
      </div>
      {hasMoreBoards && (
        <div className={styles.loadMoreButton}>
          [<span onClick={() => setDisplayCount((prevCount) => prevCount + 15)}>{t('load_more')}</span>]
        </div>
      )}
    </div>
  );
};

export default BoardsList;
