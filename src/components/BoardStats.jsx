import React from "react";
import { useSubplebbitStats } from "@plebbit/plebbit-react-hooks/dist";
import { BoardStatsContainer } from "./styled/BoardStats.styled";
import { Break } from "./styled/views/Board.styled";
import useGeneralStore from '../hooks/stores/useGeneralStore';


const BoardStats = ({ subplebbitAddress }) => {
  const { selectedStyle } = useGeneralStore(state => state);
  const stats = useSubplebbitStats({subplebbitAddress});

  return (
    <BoardStatsContainer>
      <Break selectedStyle={selectedStyle} style={{width: '468px'}}/>
      <table id="blotter">
        <tbody id="blotter-msgs">
          <tr>
            <td>In the past hour: <strong>{stats.hourActiveUserCount}</strong> users, <strong>{stats.hourPostCount}</strong> posts.&nbsp;&nbsp;Past day: <strong>{stats.dayActiveUserCount}</strong> users, <strong>{stats.dayPostCount}</strong> posts.</td>
          </tr>
          <tr>
            <td></td>
          </tr>
          <tr>
            <td>Past week: <strong>{stats.weekActiveUserCount}</strong> users, <strong>{stats.weekPostCount}</strong> posts.&nbsp;&nbsp;Past month: <strong>{stats.monthActiveUserCount}</strong> users, <strong>{stats.monthPostCount}</strong> posts.</td>
          </tr>
          <tr>
            <td></td>
          </tr>
          <tr>
            <td>Since inception: <strong>{stats.allActiveUserCount}</strong> users browsed; <strong>{stats.allPostCount}</strong> posts made.</td>
          </tr>
        </tbody>
      </table>
    </BoardStatsContainer>
  );  
};

export default BoardStats;