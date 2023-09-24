import React, { useState } from 'react';
import { useSubplebbit, useSubplebbitStats } from '@plebbit/plebbit-react-hooks/dist';
import { BoardStatsContainer } from './styled/BoardStats.styled';
import { Break } from './styled/views/Board.styled';
import useGeneralStore from '../hooks/stores/useGeneralStore';

const BoardStats = ({ subplebbitAddress }) => {
  const { selectedStyle } = useGeneralStore((state) => state);
  const stats = useSubplebbitStats({ subplebbitAddress });
  const [showStats, setShowStats] = useState(true);
  const subplebbit = useSubplebbit({ subplebbitAddress });

  const handleToggleStats = () => {
    setShowStats(!showStats);
  };

  const unixToMMDDYYYY = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return month + '/' + day + '/' + year;
  };

  const pluralize = (count, singular, plural) => (count === 1 ? singular : plural);

  return (
    <BoardStatsContainer selectedStyle={selectedStyle}>
      <Break selectedStyle={selectedStyle} style={{ width: '468px' }} />
      <table id='blotter'>
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
                {unixToMMDDYYYY(subplebbit.createdAt)} board created / since then, <span id='stat-number'>{stats.allActiveUserCount}</span>{' '}
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
              <span id='stat-number' className='hide-button' onClick={handleToggleStats}>
                {showStats ? 'Hide' : 'Show Stats'}
              </span>
              ]
            </td>
          </tr>
        </tfoot>
      </table>
    </BoardStatsContainer>
  );
};

export default BoardStats;
