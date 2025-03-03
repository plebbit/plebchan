import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { Subplebbit, useSubplebbit, useSubplebbitStats } from '@plebbit/plebbit-react-hooks';
import { useDefaultSubplebbitsState, useDefaultSubplebbitTags } from '../../../hooks/use-default-subplebbits';
import useIsMobile from '../../../hooks/use-is-mobile';
import useIsSubplebbitOffline from '../../../hooks/use-is-subplebbit-offline';
import LoadingEllipsis from '../../../components/loading-ellipsis';
import Tooltip from '../../../components/tooltip';
import styles from './boards-list.module.css';
import { nsfwTags } from '../home';

const Board = ({ subplebbit, isMobile }: { subplebbit: Subplebbit; isMobile: boolean }) => {
  const { t } = useTranslation();
  const { address, tags } = subplebbit || {};
  const nsfwTag = tags?.find((tag: string) => nsfwTags.includes(tag));

  let stats = useSubplebbitStats({ subplebbitAddress: address });

  const subplebbitData = useSubplebbit({ subplebbitAddress: address });
  const { isOffline, isOnlineStatusLoading, offlineIconClass, offlineTitle } = useIsSubplebbitOffline(subplebbitData);

  const displayAddress = address && Plebbit.getShortAddress(address);
  const showOfflineIcon = address && (isOffline || isOnlineStatusLoading);

  const title =
    subplebbitData?.title ||
    (subplebbitData?.updatedAt ? (
      displayAddress.endsWith('.eth') || displayAddress.endsWith('.sol') ? (
        displayAddress.slice(0, -4)
      ) : (
        displayAddress
      )
    ) : (
      <span className={styles.loadingBoardCellValue}>{isOffline ? t('board_not_reachable') : t('loading_board')}</span>
    ));

  return (
    <tr key={address}>
      <td>
        <p className={styles.boardCell}>
          <Link to={`/p/${address}`}>{displayAddress}</Link>
          {nsfwTag && <span className={styles.nsfw}> ({t(nsfwTag)})</span>}
          {showOfflineIcon && (
            <span className={styles.offlineIconContainer}>
              <Tooltip content={offlineTitle}>
                <span className={`${styles.offlineIcon} ${offlineIconClass}`} />
              </Tooltip>
            </span>
          )}
        </p>
      </td>
      <td>
        <p className={styles.boardCell}>{title}</p>
      </td>
      {!isMobile && (
        <>
          <td className={styles.boardPPH}>
            <p className={styles.boardCell}>{stats.hourPostCount ?? <span className={styles.loadingBoardCellValue}>?</span>}</p>
          </td>
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
        </>
      )}
    </tr>
  );
};

const BoardsList = ({ multisub }: { multisub: Subplebbit[] }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [displayCount, setDisplayCount] = useState(15);
  const isMobile = useIsMobile();
  const { loading, error } = useDefaultSubplebbitsState();

  const currentTag = location.pathname.split('/').filter(Boolean)[0];
  const tags = useDefaultSubplebbitTags(multisub);

  useEffect(() => {
    setDisplayCount(15);
  }, [currentTag]);

  if (loading) {
    return (
      <div className={styles.boardsBox}>
        <span className={styles.loading}>
          <LoadingEllipsis string={t('loading_default_boards')} />
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.boardsBox}>
        <div className='red'>{error.message}</div>
      </div>
    );
  }

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
            {!isMobile && (
              <th className={styles.boardPPH} title={t('pph')}>
                PPH
              </th>
            )}
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
        {currentTag && tags.includes(currentTag)
          ? t('displaying_boards_with_tag', {
              filteredBoardsCount: filteredBoards.length,
              totalBoardCount: totalBoardCount,
              currentTag: `"${currentTag}"`,
              interpolation: { escapeValue: false },
            })
          : t('displaying_boards', { filteredBoardsCount: filteredBoards.length, totalBoardCount: totalBoardCount, interpolation: { escapeValue: false } })}
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
