import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { Subplebbit, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { useDefaultSubplebbitTags } from '../../../hooks/use-default-subplebbits-tags';
import useIsMobile from '../../../hooks/use-is-mobile';
import useIsSubplebbitOffline from '../../../hooks/use-is-subplebbit-offline';
import styles from '../home.module.css';
import { nsfwTags } from '../home';

const Board = ({ subplebbit, isMobile }: { subplebbit: Subplebbit; isMobile: boolean }) => {
  const { t } = useTranslation();
  const { address, title, tags } = subplebbit || {};
  const nsfwTag = tags?.find((tag: string) => nsfwTags.includes(tag));

  const subplebbitData = useSubplebbit({ subplebbitAddress: address });
  const { isOffline, isOnlineStatusLoading, offlineIconClass, offlineTitle } = useIsSubplebbitOffline(subplebbitData);

  const displayAddress = address && Plebbit.getShortAddress(address);
  const showOfflineIcon = address && (isOffline || isOnlineStatusLoading);

  return (
    <tr className={styles.subplebbit} key={address}>
      <td className={styles.boardAddress}>
        <p className={styles.boardCell}>
          {showOfflineIcon && <span className={`${styles.offlineIcon} ${offlineIconClass}`} title={offlineTitle} />}
          <Link to={`/p/${address}`}>{displayAddress}</Link>
          {nsfwTag && <span className={styles.nsfw}> ({t(nsfwTag)})</span>}
        </p>
      </td>
      <td className={styles.boardTitle}>
        <p className={styles.boardCell}>{title || displayAddress}</p>
      </td>
      {!isMobile && (
        <td className={styles.boardTags}>
          <p className={styles.boardCell}>
            {tags.map((tag: string, index: number) => (
              <span key={tag}>
                <Link to={`/${tag}`}>{tag}</Link>
                {index < tags.length - 1 && ', '}
              </span>
            ))}
          </p>
        </td>
      )}
    </tr>
  );
};

const BoardsList = ({ multisub }: { multisub: Subplebbit[] }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [displayCount, setDisplayCount] = useState(15);
  const isMobile = useIsMobile();

  const currentTag = location.pathname.split('/').filter(Boolean)[0];
  const tags = useDefaultSubplebbitTags(multisub);

  useEffect(() => {
    setDisplayCount(15);
  }, [currentTag]);

  const filteredBoards = (currentTag && tags.includes(currentTag) ? multisub.filter((sub) => sub?.tags?.includes(currentTag)) : multisub).slice(0, displayCount);

  const totalBoardCount = currentTag && tags.includes(currentTag) ? multisub.filter((sub) => sub?.tags?.includes(currentTag)).length : multisub.length;

  const hasMoreBoards =
    currentTag && tags.includes(currentTag) ? displayCount < multisub.filter((sub) => sub?.tags?.includes(currentTag)).length : displayCount < multisub.length;

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
            {!isMobile && <th>{t('tags')}</th>}
          </tr>
        </thead>
        <tbody>
          {filteredBoards.map((sub) => (
            <Board key={sub.address} subplebbit={sub} isMobile={isMobile} />
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
