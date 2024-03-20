import { useState } from 'react';
import { useSubplebbitStats } from '@plebbit/plebbit-react-hooks';
import styles from './board-stats.module.css';

export interface BoardStatsProps {
  address: string | undefined;
  createdAt: number;
}

const BoardStats = ({ address, createdAt }: BoardStatsProps) => {
  const stats = useSubplebbitStats({ subplebbitAddress: address });
  const [showStats, setShowStats] = useState(true);

  const unixToMMDDYYYY = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return month + '/' + day + '/' + year;
  };

  const pluralize = (count: number, singular: string, plural: string) => (count === 1 ? singular : plural);

  return (
    <div className={styles.content}>
      <hr />
      <table className={styles.blotter}>
        {showStats && (
          <tbody id='blotter-msgs'>
            <tr>
              <td>
                In the past hour, <span id='stat-number'>{stats.hourActiveUserCount}</span> {pluralize(stats.hourActiveUserCount, 'user', 'users')} made{' '}
                <span id='stat-number'>{stats.hourPostCount}</span> {pluralize(stats.hourPostCount, 'post', 'posts')} / in the past day,{' '}
                <span id='stat-number'>{stats.dayActiveUserCount}</span> {pluralize(stats.dayActiveUserCount, 'user', 'users')} made{' '}
                <span id='stat-number'>{stats.dayPostCount}</span> {pluralize(stats.dayPostCount, 'post', 'posts')}
              </td>
            </tr>
            <tr>
              <td>
                In the past week, <span id='stat-number'>{stats.weekActiveUserCount}</span> {pluralize(stats.weekActiveUserCount, 'user', 'users')} made{' '}
                <span id='stat-number'>{stats.weekPostCount}</span> {pluralize(stats.weekPostCount, 'post', 'posts')} / in the past month,{' '}
                <span id='stat-number'>{stats.monthActiveUserCount}</span> {pluralize(stats.monthActiveUserCount, 'user', 'users')} made{' '}
                <span id='stat-number'>{stats.monthPostCount}</span> {pluralize(stats.monthPostCount, 'post', 'posts')}
              </td>
            </tr>
            <tr>
              <td>
                {unixToMMDDYYYY(createdAt)} board created / since then, <span id='stat-number'>{stats.allActiveUserCount}</span>{' '}
                {pluralize(stats.allActiveUserCount, 'user', 'users')} have made <span id='stat-number'>{stats.allPostCount}</span>{' '}
                {pluralize(stats.allPostCount, 'post', 'posts')}
              </td>
            </tr>
          </tbody>
        )}
        <tfoot>
          <tr>
            <td colSpan={2}>
              [
              <span className={styles.hideButton} onClick={() => setShowStats(!showStats)}>
                {showStats ? 'Hide' : 'Show Stats'}
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
