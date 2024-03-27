import { useState } from 'react';
import { useSubplebbitStats } from '@plebbit/plebbit-react-hooks';
import styles from './board-stats.module.css';
import { Trans, useTranslation } from 'react-i18next';

export interface BoardStatsProps {
  address: string | undefined;
  createdAt: number | undefined;
}

const BoardStats = ({ address, createdAt }: BoardStatsProps) => {
  const { t } = useTranslation();
  const stats = useSubplebbitStats({ subplebbitAddress: address });
  const [showStats, setShowStats] = useState(true);

  const unixToMMDDYYYY = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return month + '/' + day + '/' + year;
  };

  return (
    <div className={styles.content}>
      <table className={styles.blotter}>
        <hr />
        {showStats && (
          <tbody>
            <tr>
              <td>
                <Trans
                  i18nKey='board_stats_hour'
                  values={{ userCount: stats.hourActiveUserCount, postCount: stats.hourPostCount }}
                  components={{ 1: <span className={styles.statValue} /> }}
                />
                {' / '}
                <Trans
                  i18nKey='board_stats_day'
                  values={{ userCount: stats.dayActiveUserCount, postCount: stats.dayPostCount }}
                  components={{ 1: <span className={styles.statValue} /> }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Trans
                  i18nKey='board_stats_week'
                  values={{ userCount: stats.weekActiveUserCount, postCount: stats.weekPostCount }}
                  components={{ 1: <span className={styles.statValue} /> }}
                />
                {' / '}
                <Trans
                  i18nKey='board_stats_month'
                  values={{ userCount: stats.monthActiveUserCount, postCount: stats.monthPostCount }}
                  components={{ 1: <span className={styles.statValue} /> }}
                />
              </td>
            </tr>
            <tr>
              <td className={styles.lowercase}>
                {createdAt && unixToMMDDYYYY(createdAt)} {t('board_created')}
                {' / '}
                <Trans
                  i18nKey='board_stats_all'
                  values={{ userCount: stats.allActiveUserCount, postCount: stats.allPostCount }}
                  components={{ 1: <span className={styles.statValue} /> }}
                />
              </td>
            </tr>
          </tbody>
        )}
        <tfoot>
          <tr>
            <td colSpan={2}>
              [
              <span className={styles.hideButton} onClick={() => setShowStats(!showStats)}>
                {showStats ? t('hide') : t('show_stats')}
              </span>
              ]
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default BoardStats;
