import styled from "styled-components";
import Modal from 'react-modal';

export const StyledModal = styled(Modal)`
  .panel {
    top: 60px;
    width: 400px;
    height: auto;
    max-height: 80%;
    left: calc(50% - 25px);
    overflow-y: auto;
    margin-left: -178px;
    position: absolute;
    padding: 2px 5px 5px;
    font-size: 14px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .25);
  }

  #version {
    font-size: 11px;
    position: absolute;
    display: block;
    margin-left: 5px;
  }

  @media (max-width: 768px) {
    .panel {
      width: 320px !important;
      max-height: 60% !important;
      left: calc(50% + 15px) !important;
    }
  }

  .panel-header {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    line-height: 14px;
  }

  .icon {
    right: 5px;
    width: 18px;
    height: 18px;
    display: block;
    background-size: 100%;
    cursor: pointer;
    position: absolute;
    top: 5px;
  }

  h4 {
    font-size: 14px;
    padding: 0;
    margin: 10px 0 5px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 10px;
  }

  .settings-cat-lbl {
    font-weight: 700;
    margin: 10px 0 5px;
    padding-left: 5px;
  }

  .plus, .minus {
    vertical-align: text-bottom;
    margin-right: 5px;
    cursor: pointer;
    width: 18px;
    height: 18px;
    background-repeat: no-repeat;
    background-position: center;
    display: inline-block;
  }

  .settings-cat {
    display: ${({ expanded }) => index => (expanded.includes(index) ? "block" : "none")};
    margin: 5px;
  }

  textarea {
    width: 80%;
    margin-left: 7%;
    min-height: 50px;
  }

  .all-div {
    text-align: center;
  }

  .plebbit-options-buttons {
    display: block;
    position: relative;
    float: right;

    button {
      margin-right: 3px;
      margin-left: 3px;
    }
  }

  .cache-button {
    margin: auto;
    margin-bottom: 10px;
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


  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `
        .panel {
          background-color: #f0e0d6;
        }

        .panel-header {
          border-bottom: 1px solid #d9bfb7;
        }

        .icon {
          background-image: url(assets/buttons/cross_red.png);
        }
        
        .plus {
          background-image: url(assets/buttons/post_expand_plus_red.png);
        }
        
        .minus {
          background-image: url(assets/buttons/post_expand_minus_red.png);
        }
        
        .all-button {
          color: #00e !important;
          
          :hover {
            color: red !important;
          }
        }`;

      case 'Yotsuba-B':
        return `
        .panel {
          background-color: #d6daf0;
        }
        
        .panel-header {
          border-bottom: 1px solid #b7c5d9;
        }
        
        .icon {
          background-image: url(assets/buttons/cross_blue.png);
        }
        
        .plus {
          background-image: url(assets/buttons/post_expand_plus_blue.png);
        }
        
        .minus {
          background-image: url(assets/buttons/post_expand_minus_blue.png);
        }
        
        .all-button {
          color: #34345c !important;
          
          :hover {
            color: #d00 !important;
          }
        }`;

      case 'Futaba':
        return `
        .panel {
          background-color: #f0e0d6;
        }

        .panel-header {
          border-bottom: 1px solid rgba(0,0,0,.2);
        }
        
        .icon {
          background-image: url(assets/buttons/cross_red.png);
        }
        
        .plus {
          background-image: url(assets/buttons/post_expand_plus_red.png);
        }
        
        .minus {
          background-image: url(assets/buttons/post_expand_minus_red.png);
        }
        
        .all-button {
          color: #00e !important;
          
          :hover {
            color: red !important;
          }
        }`;

      case 'Burichan':
        return `
        .panel {
          background-color: #d6daf0;
        }
        
        .panel-header {
          border-bottom: 1px solid rgba(0,0,0,.2);
        }
        
        .icon {
          background-image: url(assets/buttons/cross_blue.png);
        }
        
        .plus {
          background-image: url(assets/buttons/post_expand_plus_blue.png);
        }
        
        .minus {
          background-image: url(assets/buttons/post_expand_minus_blue.png);
        }
        
        .all-button {
          color: #34345c !important;
          
          :hover {
            color: #d00 !important;
          }
        }`;

      case 'Tomorrow':
        return `
        .panel {
          background-color: #282a2e;
        }
        
        .panel-header {
          border-bottom: 1px solid #111;
        }
        
        .icon {
          background-image: url(assets/buttons/cross_dark.png);
        }
        
        .plus {
          background-image: url(assets/buttons/post_expand_plus_dark.png);
        }
        
        .minus {
          background-image: url(assets/buttons/post_expand_minus_dark.png);
        }
        
        .all-button {
          color: #81a2be !important;
          
          :hover {
            color: #5f89ac !important;
          }
        }
        
        button {
          filter: brightness(80%);
        }
        
        textarea {
          background-color: #282a2e;
          color: #c5c8c6;
          border: 1px solid #000;
        }`;

      case 'Photon':
        return `
        .panel {
          background-color: #ddd;
        }
        
        .panel-header {
          border-bottom: 1px solid rgba(0, 0, 0, 0.20);
        }
        
        .icon {
          background-image: url(assets/buttons/cross_photon.png);
        }
        
        .plus {
          background-image: url(assets/buttons/post_expand_plus_photon.png);
        }
        
        .minus {
          background-image: url(assets/buttons/post_expand_minus_photon.png);
        }
        
        .all-button {
          color: #f60 !important;
          
          :hover {
            color: #f30 !important;
          }
        }`;
        
        default:
          return '';
      }
  }}
`;