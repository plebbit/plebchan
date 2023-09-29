import styled from 'styled-components';
import Modal from 'react-modal';

export const StyledModal = styled(Modal)`
  .modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: auto;
    max-height: calc(100vh - 2 * 50px);
    overflow-y: auto;
    padding: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  }

  .modal-header {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 5px;
    margin-top: 1px;
    padding-bottom: 5px;
    text-align: center;
    line-height: 14px;
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

  #name,
  #description,
  #rule {
    border: 1px solid #aaa;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
    outline: medium none;
    width: 298px;
    padding: 2px;
    margin-bottom: 10px;
  }

  #form {
    margin: 20px;
  }

  textarea {
    min-width: 296px;
    float: left;
    font-size: 10pt;
    font-family: Arial, Helvetica, sans-serif;
    margin-top: 0.5px;
    margin-left: 25px;
  }

  .rule-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1px;
  }

  .rule-item p {
    margin: 0;
    padding: 5px;
    width: 200px;
    font-size: 0.8em;
  }

  #rule {
  }

  #rule-btn {
    margin-left: 281px;
  }

  fieldset {
    margin-left: 5px;
    width: 90%;
  }

  legend {
    margin-left: 260px;
  }

  #create-board-btn {
    margin: auto;
    margin-bottom: -10px;
    margin-top: 10px;
    display: block;
    text-align: center;
  }

  .settings-option {
    margin: 5px 0 5px 0;
    padding-left: 23px;
    display: inline-block;
  }

  .settings-tip {
    font-size: 0.85em;
    margin: 0 0 5px 0;
    padding-left: 23px;
  }

  .settings-option.disc::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: currentColor;
    position: absolute;
    margin-left: -15px;
    margin-top: 6px;
  }

  .settings-option {
    margin: 5px 0 5px 0;
    padding-left: 23px;
    display: inline-block;
    position: relative;
  }

  .settings-input {
    position: relative;
    padding-left: 23px;

    input {
      padding-left: 5px;
      left: 4px;
      font-family: monospace;
    }
  }

  .settings-input::before {
    content: '';
    display: block;
    width: 10px;
    height: 1px;
    background-color: currentColor;
    position: absolute;
    left: 28px;
    top: 13px;
  }

  .settings-input::after {
    content: '';
    display: block;
    width: 1px;
    height: 12px;
    background-color: currentColor;
    position: absolute;
    left: 28px;
    top: 1px;
  }

  input {
    margin-left: 25px;
    margin-top: 3px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 10px;
  }

  #explaination {
    font-size: 0.8em;
    margin: -10px 0 10px 0;
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
          border-bottom: 1px solid #d9bfb7;
        }

        .icon {
          background-image: url(assets/buttons/cross_red.png);
        }

        span {
          color: #000;
        }`;

      case 'Yotsuba-B':
        return `
        .modal-content {
          background-color: #d6daf0;
          border: 1px solid #b7c5d9;
        }

        .modal-header {
          border-bottom: 1px solid #b7c5d9;
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
          border-bottom: 1px solid rgba(0,0,0,.2);
        }

        .icon {
          background-image: url(assets/buttons/cross_red.png);
        }

        span {
          color: #000;
        }`;

      case 'Burichan':
        return `
        .modal-content {
          background-color: #d6daf0;
          border: 1px solid #b7c5d9;
        }

        .modal-header {
          border-bottom: 1px solid rgba(0,0,0,.2);
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
          border-bottom: 1px solid #111;
        }

        .icon {
          background-image: url(assets/buttons/cross_dark.png);
        }

        #name, #description, #rule {
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
        
        button, select, input, textarea, fieldset {
          filter: brightness(80%);
        }

        fieldset button {
          filter: brightness(100%);
        }

        textarea, input {
          color: white !important;
        }`;

      case 'Photon':
        return `
        .modal-content {
          background-color: #ddd;
          border: 1px solid #ccc;
          border-bottom: 1px solid rgba(0, 0, 0, 0.20);
        }

        .modal-header {
          border-bottom: 1px solid rgba(0, 0, 0, 0.20);
        }

        .icon {
          background-image: url(assets/buttons/cross_photon.png);
        }

        span {
          color: #000;
        }`;

      default:
        return '';
    }
  }}
`;
