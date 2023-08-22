import styled from "styled-components";

export const BoardStatsContainer = styled.div`
  @media (max-width: 480px) {
    display: none;
  }

  @media (min-width: 480px) {
    width: 468px;
    margin: auto;
  
    table {
      border-spacing: 0px;
      text-align: center;
      width: 100%;
    }
  
    tr {
      vertical-align: top;
      font-size: 11px;
    }
  }
`;