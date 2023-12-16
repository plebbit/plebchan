import styled from 'styled-components';

export const AlertModal = styled.div`
  .author-delete-alert {
    padding: 20px;
    border: 1px solid #ccc;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);

    .author-delete-buttons {
      display: flex;
      justify-content: center;

      & > button {
        margin-top: 10px;
      }

      & > button:first-child {
        margin-right: 20px;
      }
    }
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `
        .author-delete-alert {
          background-color: #f0e0d6;
          border: 1px solid #d9bfb7;
        }`;

      case 'Yotsuba-B':
        return `
        .author-delete-alert {
          background-color: #d6daf0;
          border: 1px solid #b7c5d9;
        }`;

      case 'Futaba':
        return `
        .author-delete-alert {
          background-color: #f0e0d6;
          border: 1px solid #d9bfb7;
        }`;

      case 'Burichan':
        return `
        .author-delete-alert {
          background-color: #d6daf0;
          border: 1px solid #b7c5d9;
        }`;

      case 'Tomorrow':
        return `
        .author-delete-alert {
          background-color: #282a2e;
          border: 1px solid #111;
        }`;

      case 'Photon':
        return `
        .author-delete-alert {
          background-color: #ddd;
          border: 1px solid #ccc;
        }`;

      default:
        return '';
    }
  }}
`;
