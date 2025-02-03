import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { Subplebbit } from '@plebbit/plebbit-react-hooks';
import useIsSubplebbitOffline from '../../../hooks/use-is-subplebbit-offline';
import styles from '../home.module.css';
import { nsfwTags } from '../home';

const Board = ({ subplebbit, subplebbits }: { subplebbit: Subplebbit; subplebbits: any; useCatalog?: boolean }) => {
  const { t } = useTranslation();
  const { address, title, tags } = subplebbit || {};
  const nsfwTag = tags.find((tag: string) => nsfwTags.includes(tag));

  const subplebbitData = subplebbits && subplebbits.find((sub: Subplebbit) => sub?.address === address);
  const { isOffline, isOnlineStatusLoading, offlineIconClass, offlineTitle } = useIsSubplebbitOffline(subplebbitData);

  return (
    <tr className={styles.subplebbit} key={address}>
      <td className={styles.boardAddress}>
        <p className={styles.boardCell}>
          <Link to={`/p/${address}`}>{address && Plebbit.getShortAddress(address)}</Link>
          {(isOffline || isOnlineStatusLoading) && <span className={`${styles.offlineIcon} ${offlineIconClass}`} title={offlineTitle} />}
          {nsfwTag && <span className={styles.nsfw}> ({t(nsfwTag)})</span>}
        </p>
      </td>
      <td className={styles.boardTitle}>
        <p className={styles.boardCell}>{title || (address && Plebbit.getShortAddress(address))}</p>
      </td>
      <td className={styles.boardTags}>
        <p className={styles.boardCell}>{tags.join(', ')}</p>
      </td>
    </tr>
  );
};

const BoardsList = ({ multisub, subplebbits }: { multisub: Subplebbit[]; subplebbits: any }) => {
  const { t } = useTranslation();

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
          {multisub.map((sub) => (
            <Board key={sub.address} subplebbit={sub} subplebbits={subplebbits} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardsList;
