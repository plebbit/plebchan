import styled from 'styled-components';
import Modal from 'react-modal';

export const StyledModal = styled(Modal)`
  .hide-modal-overlay {
    display: none;
  }

  .modal-content {
    position: fixed;
    top: calc(50% - 150px);
    left: calc(50% - 150px);
    display: block;
    padding: 2px;
    font-size: 10pt;
    border-left: none;
    border-top: none;
  }

  .modal-header {
    font-size: 10pt;
    text-align: center;
    margin-bottom: 1px;
    padding: 0;
    height: 18px;
    line-height: 18px;
    cursor: move;
    font-weight: 700;
  }

  .icon {
    all: unset;
    float: right;
    cursor: pointer;
    margin-bottom: -4px;
    width: 18px;
    height: 18px;
    border: none;
    image-rendering: pixelated;
  }

  #field {
    border: 1px solid #aaa;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
    outline: medium none;
    width: 298px;
    padding: 2px;
  }

  textarea {
    min-width: 296px;
    float: left;
    font-size: 10pt;
    font-family: Arial, Helvetica, sans-serif;
  }

  #captcha-container {
    position: relative;
    width: 302px;
    height: 100px;
    overflow: hidden;
    margin-bottom: 17px;
  }

  #response {
    width: 100%;
    box-sizing: border-box;
    font-size: 11px;
    height: 18px;
    margin: 0px;
    padding: 0px 2px;
    font-family: monospace;
    vertical-align: middle;
  }

  img {
    height: 100%;
    width: 100%;
    position: relative;
    display: block;
  }

  #nav {
    float: right;
    margin: 0;
    width: auto;
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `
        .modal-content {
          background-color: #f0e0d6;
          border: 1px solid #d9bfb7;
        }

        .modal-header {
          background-color: #ea8;
          color: #800;
          border: 1px solid #800;
        }

        .icon {
          background-image: url(assets/buttons/cross_red.png);
        }

        span {
          color: maroon;
        }`;

      case 'Yotsuba-B':
        return `
        .modal-content {
          background-color: #d6daf0;
          border: 1px solid #b7c5d9;
        }

        .modal-header {
          background-color: #98e;
          color: #000;
          border: 1px solid #000;
        }

        .icon {
          background-image: url(assets/buttons/cross_blue.png);
        }

        span {
          color: #000;
        }`;

      case 'Futaba':
        return `
        .modal-content {
          background-color: #f0e0d6;
          border: 1px solid #d9bfb7;
        }

        .modal-header {
          background-color: #ea8;
          color: #800;
          border: 1px solid #800;
        }

        .icon {
          background-image: url(assets/buttons/cross_red.png);
        }

        span {
          color: maroon;
        }`;

      case 'Burichan':
        return `
        .modal-content {
          background-color: #d6daf0;
          border: 1px solid #b7c5d9;
        }

        .modal-header {
          background-color: #98e;
          color: #000;
          border: 1px solid #000;
        }

        .icon {
          background-image: url(assets/buttons/cross_blue.png);
        }

        span {
          color: #000;
        }`;

      case 'Tomorrow':
        return `
        .modal-content {
          background-color: #282a2e;
          border: 1px solid #111;
        }

        .modal-header {
          background-color: #282a2e;
          color: #c5c8c6;
        }

        .icon {
          background-image: url(assets/buttons/cross_dark.png);
        }

        #field {
          background-color: #282a2e;
          color: #c5c8c6;
          border: 1px solid #515151;
          width: 296px;
        }

        textarea {
          background-color: #282a2e;
          color: #c5c8c6;
          border: 1px solid #515151;
        }

        #response {
          background-color: #282a2e;
          color: #c5c8c6;
          outline: none;
          border: 1px solid #515151;
        }

        span {
          color: #c5c8c6;
        }
        
        #next {
          filter: brightness(80%);
        }`;

      case 'Photon':
        return `
        .modal-content {
          background-color: #ddd;
          border: 1px solid #ccc;
        }

        .modal-header {
          background-color: #ddd;
          color: #333;
        }

        .icon {
          background-image: url(assets/buttons/cross_photon.png);
        }

        span {
          color: #333;
        }`;

      default:
        return '';
    }
  }}
`;
