import React, { useState } from "react";
import { useSubplebbitStats } from "@plebbit/plebbit-react-hooks/dist";
import { BoardStatsContainer } from "./styled/BoardStats.styled";
import { Break } from "./styled/views/Board.styled";
import useGeneralStore from '../hooks/stores/useGeneralStore';


const BoardStats = ({ subplebbitAddress }) => {
  const { selectedStyle } = useGeneralStore(state => state);
  const stats = useSubplebbitStats({subplebbitAddress});
  const [showStats, setShowStats] = useState(true);

  const handleToggleStats = () => { 
    setShowStats(!showStats);
  };

  return (
    <BoardStatsContainer selectedStyle={selectedStyle}>
      <Break selectedStyle={selectedStyle} style={{width: '468px'}}/>
        <table id="blotter">
          {showStats && (
            <tbody id="blotter-msgs">
              <tr>
                <td>Since this board was created, <span id="stat-number">{stats.allActiveUserCount}</span> users made <span id="stat-number">{stats.allPostCount}</span> posts in it.</td>
              </tr>
              <tr>
                <td>In the past month, <span id="stat-number">{stats.monthActiveUserCount}</span> users made <span id="stat-number">{stats.monthPostCount}</span> posts.&nbsp;&nbsp;In the past week, <span id="stat-number">{stats.weekActiveUserCount}</span> users made <span id="stat-number">{stats.weekPostCount}</span> posts.</td>
              </tr>
              <tr>
              </tr>
              <tr>
                <td>In the past day, <span id="stat-number">{stats.dayActiveUserCount}</span> users made <span id="stat-number">{stats.dayPostCount}</span> posts.&nbsp;&nbsp;In the past hour, <span id="stat-number">{stats.hourActiveUserCount}</span> users made <span id="stat-number">{stats.hourPostCount}</span> posts.</td>
              </tr>
              <tr>
              </tr>
            </tbody>
          )}
          <tfoot>
            <tr>
              <td colSpan={2}>
                [
                  <span id="stat-number" className="hide-button" onClick={handleToggleStats}>
                    {showStats ? 'Hide Stats' : 'Show Stats'}
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