import styled from 'styled-components';

export const BoardStatsContainer = styled.div`
  @media (max-width: 480px) {
    display: none;
  }

  @media (min-width: 480px) {
    width: 468px;
    margin: auto;
    line-height: 1;
    margin-top: -1px;

    table {
      border-spacing: 0px;
      width: 100%;
      margin-top: -1px;
      padding-left: 3px;
    }

    tr {
      vertical-align: top;
      font-size: 11px;
    }
  }

  tfoot {
    text-align: right;
  }

  .hide-button:hover {
    cursor: pointer;
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `
        #stat-number {
          color: #00e;
        }
        
        .hide-button:hover {
          color: red !important;
        }`;

      case 'Yotsuba-B':
        return `
        #stat-number {
          color: #34345c;
        }
        
        .hide-button:hover {
          color: #d00 !important;
        }`;

      case 'Futaba':
        return `
        #stat-number {
          color: #00e;
        }
        
        .hide-button:hover {
          color: red !important;
        }`;

      case 'Burichan':
        return `
        #stat-number {
          color: #34345c;
        }
        
        .hide-button:hover {
          color: red !important;
        }`;

      case 'Tomorrow':
        return `
        #stat-number {
          color: #81a2be;
        }
        
        .hide-button:hover {
          color: #5f89ab !important;
        }`;

      case 'Photon':
        return `
        #stat-number {
          color: #f60;
        }
        
        .hide-button:hover {
          color: #ff3300 !important;
        }`;

      default:
        return '';
    }
  }}
`;
