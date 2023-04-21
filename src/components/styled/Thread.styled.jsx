import styled from 'styled-components';

export const ReplyFormLink = styled.div`
  @media (min-width: 480px) {
    display: ${props => (props.showReplyFormLink ? 'block' : 'none')};

    #post-form-link-mobile, #return-button-mobile, #catalog-button-mobile, #bottom-button-mobile {
      display: none;
    }
  }

  @media (max-width: 480px) {

    #post-form-link-desktop {
      display: none;
    }

    #post-form-link-mobile {
      margin: 11px 0;
      font-size: 13px;
      text-align: center;
      font-weight: 700;
      display: block !important;
      padding-top: 10px;
    }

    #return-button-mobile, #catalog-button-mobile, #bottom-button-mobile, #bottom-bar-top {
      font-size: 10pt;
      display: inline-block;
      margin: 0 2px;
    }

    .post-button-mobile {
      padding-bottom: 10px;
    }

    #btns-container {
      text-align: center;
      margin-bottom: 50px;
    }
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `.btn-wrap {
          background-color: #f0e0d6;
          background-image: url(/assets/buttonfade.png);
          border: 1px solid #c0a69d;
          color: #800;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
        }

        .btn-wrap a {
          text-decoration: none;
          border: none;
          color: inherit !important;
          white-space: nowrap;
        }
      }`;

      case 'Yotsuba-B':
        return `.btn-wrap {
          background-color: #d6daf0;
          background-image: url(/assets/buttonfade-blue.png);
          border: 1px solid #b7c5d9;
          color: #34345c !important;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
        }

        .btn-wrap a {
          text-decoration: none;
          border: none;
          color: #34345c !important;
          white-space: nowrap;
        }`;

      case 'Futaba':
        return `.btn-wrap {
          background-color: #f0e0d6;
          background-image: url(/assets/buttonfade.png);
          border: 1px solid #c0a69d;
          color: #800;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-wrap a {
          text-decoration: none !important;
          border: none;
          color: inherit !important;
          white-space: nowrap;
        }`;

      case 'Burichan':
        return `.btn-wrap {
          background-color: #d6daf0;
          background-image: url(/assets/buttonfade-blue.png);
          border: 1px solid #b7c5d9;
          color: #34345c;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-wrap a {
          text-decoration: none !important;
          border: none;
          color: inherit !important;
          white-space: nowrap;
        }
      }`;

      case 'Tomorrow':
        return `.btn-wrap {
          background-color: #1b1c1e;
          background-image: url(/assets/buttonfade-dark.png);
          border: 1px solid #282a2e;
          color: #707070;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
        }

        .btn-wrap a {
          text-decoration: none !important;
          border: none;
          color: #707070 !important;
          white-space: nowrap;
        }`;

      case 'Photon':
        return `.btn-wrap {
          background: linear-gradient(to bottom, rgba(238, 238, 238, 1) 0%, rgba(224, 224, 224, 1) 100%);
          border: 1px solid #ccc;
          color: #333;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
        }

        .btn-wrap a {
          text-decoration: none;
          border: none;
          color: #333 !important;
          white-space: nowrap;
        }`;
      }
    }}
`;

export const TopBar = styled.div`
  @media (min-width: 480px) {
    #return-button-mobile {
      display: none;
    }

    .reply-stat {
      margin-top: 5px;
    }
  }

  @media (max-width: 480px) {
    line-height: 30px;
    
    #return-button-desktop, #catalog-button-desktop, #bottom-button-desktop {
      display: none;
    }

    #return-button-mobile {
      position: absolute;
      left: 50%;
      display: inline-block;
      transform: translateX(-50%);
      font-size: 10pt;
    }

    hr {
      display: none;
    }
  }

  .return-button {
    display: inline-block;
  }

  .reply-stat { 
    position: relative;
    float: right;
    margin-right: 5px;
  }

  .catalog-button {
    margin-left: 3px !important;
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `clear: both;
        hr {
          border: none;
          border-top: 1px solid #d9bfb7;
          height: 0;
        }

        .style-changer {
          margin-left: 5px;
          font-size: 10pt;
        }
        
        .return-button {
          margin-left: 10px;

          a, a:visited {
            color: #00e !important;
            text-decoration: none;
          }
          
          a:hover {
            color: red !important;
          }
        }`;

      case 'Yotsuba-B':
        return `clear: both;
        hr {
          border: none;
          border-top: 1px solid #b7c5d9;
          height: 0;
        }

        .style-changer {
          margin-left: 5px;
          font-size: 10pt;
        }
        
        .return-button {
          margin-left: 10px;

          a, a:visited {
            color: #34345c !important;
            text-decoration: none;
          }

          a:hover {
            color: red !important;
          }
        }`;

      case 'Futaba':
        return `clear: both;
        hr {
          clear: both;
        }

        .style-changer {
          margin-left: 5px;
          font-size: 12pt;
        }
        
        .return-button {
          margin-left: 10px;
          padding-top: 2px;
          font-size: 12pt;

          a, a:visited {
            color: #00e !important;
            text-decoration: underline;
          }

          a:hover {
            color: red !important;
          }
        }
        
        .reply-stat {
          font-size: 12pt;
          bottom: 2px;
        }`;

      case 'Burichan':
        return `clear: both;
        hr {
          clear: both;
        }

        .style-changer {
          margin-left: 5px;
          font-size: 12pt;
        }
        
        .return-button {
          margin-left: 10px;
          padding-top: 2px;
          font-size: 12pt;

          a, a:visited {
            color: #34345c !important;
            text-decoration: underline;
          }

          a:hover {
            color: red !important;
          }
        }
        
        .reply-stat {
          font-size: 12pt;
          bottom: 2px;
        }`;

      case 'Tomorrow':
        return `clear: both;
        hr {
          border: none;
          border-top: 1px solid #282a2e;
          height: 0;
        }

        .style-changer {
          margin-left: 5px;
          font-size: 10pt;
        }

        #style-selector {
          background-color: #282a2e;
          color: #c5c8c6;
          border: 1px solid #373b41;
        }
        
        .return-button {
          margin-left: 10px;

          a, a:visited {
            color: #81a2be !important;
            text-decoration: none;
          }

          a:hover {
            color: #5f89ab !important;
          }
        }`;

      case 'Photon':
        return `clear: both;
        hr {
          border: none;
          border-top: 1px solid #ddd;
          height: 0;
        }

        .style-changer {
          margin-left: 5px;
          font-size: 10pt;
        }
        
        .return-button {
          margin-left: 10px;

          a, a:visited {
            color: #f60 !important;
            text-decoration: none;
          }

          a:hover {
            color: #ff3300 !important;
          }
        }`;
      
    }
  }}

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `.btn-wrap {
          background-color: #f0e0d6;
          background-image: url(/assets/buttonfade.png);
          border: 1px solid #c0a69d;
          color: #800;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
        }

        .btn-wrap a {
          text-decoration: none;
          border: none;
          color: inherit !important;
          white-space: nowrap;
        }
      }`;

      case 'Yotsuba-B':
        return `.btn-wrap {
          background-color: #d6daf0;
          background-image: url(/assets/buttonfade-blue.png);
          border: 1px solid #b7c5d9;
          color: #34345c !important;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
        }

        .btn-wrap a {
          text-decoration: none;
          border: none;
          color: #34345c !important;
          white-space: nowrap;
        }`;

      case 'Futaba':
        return `.btn-wrap {
          background-color: #f0e0d6;
          background-image: url(/assets/buttonfade.png);
          border: 1px solid #c0a69d;
          color: #800;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-wrap a {
          text-decoration: none !important;
          border: none;
          color: inherit !important;
          white-space: nowrap;
        }`;

      case 'Burichan':
        return `.btn-wrap {
          background-color: #d6daf0;
          background-image: url(/assets/buttonfade-blue.png);
          border: 1px solid #b7c5d9;
          color: #34345c;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-wrap a {
          text-decoration: none !important;
          border: none;
          color: inherit !important;
          white-space: nowrap;
        }
      }`;

      case 'Tomorrow':
        return `.btn-wrap {
          background-color: #1b1c1e;
          background-image: url(/assets/buttonfade-dark.png);
          border: 1px solid #282a2e;
          color: #707070;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
        }

        .btn-wrap a {
          text-decoration: none !important;
          border: none;
          color: #707070 !important;
          white-space: nowrap;
        }`;

      case 'Photon':
        return `.btn-wrap {
          background: linear-gradient(to bottom, rgba(238, 238, 238, 1) 0%, rgba(224, 224, 224, 1) 100%);
          border: 1px solid #ccc;
          color: #333;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
        }

        .btn-wrap a {
          text-decoration: none;
          border: none;
          color: #333 !important;
          white-space: nowrap;
        }`;
      
      }
    }}
`;

export const BottomBar = styled.div`
  .reply-stat { 
    position: relative;
    float: right;
    margin-right: 5px;
    transform: translateY(-50%);
  }

  .quickreply-button {
    text-align: center;
    width: 200px;
    position: absolute;
    margin-left: 50%;
    left: -100px;
    transform: translateY(-50%);
  }

  .bottom-bar-return {
    position: absolute;
    transform: translateY(-50%);
  }

  .bottom-bar-catalog {
    position: absolute;
    transform: translateY(-50%);
    left: 56px;
  }

  .bottom-bar-top {
    position: absolute;
    transform: translateY(-50%);
    left: 113px;
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `
        a, a:visited {
          color: #00e !important;
          text-decoration: none;
        }
        
        a:hover {
          color: red !important;
        }

        hr {
          height: 0;
          clear: both;
          padding-bottom: 5px;
          padding-top: 5px;
        }`;

      case 'Yotsuba-B':
        return `
        a, a:visited {
          color: #34345c !important;
          text-decoration: none;
        }
        
        a:hover {
          color: red !important;
        }

        hr {
          height: 0;
          clear: both;
          padding-bottom: 5px;
          padding-top: 5px;
        }`;

      case 'Futaba':
        return `
        a, a:visited {
          color: #00e !important;
          text-decoration: underline;
        }
        
        a:hover {
          color: red !important;
        }

        hr {
          height: 0;
          clear: both;
          margin-top: 5px;
          margin-bottom: 15px;
        }
        
        .bottom-bar-catalog {
          left: 62px;
        }

        .bottom-bar-top {
          left: 125px;
        }`;

      case 'Burichan':
        return `
        a, a:visited {
          color: #34345c !important;
          text-decoration: underline;
        }
        
        a:hover {
          color: red !important;
        }

        hr {
          height: 0;
          clear: both;
          margin-top: 5px;
          margin-bottom: 15px;
        }

        .bottom-bar-catalog {
          left: 62px;
        }

        .bottom-bar-top {
          left: 125px;
        }`;

      case 'Tomorrow':
        return `
        a, a:visited {
          color: #81a2be !important;
          text-decoration: none;
        }
        
        a:hover {
          color: #5f89ab !important;
        }

        hr {
          height: 0;
          clear: both;
          padding-bottom: 5px;
          padding-top: 5px;
        }`;

      case 'Photon':
        return `
        a, a:visited {
          color: #f60 !important;
          text-decoration: none;
        }
        
        a:hover {
          color: #ff3300 !important;
        }
        
        hr {
          height: 0;
          clear: both;
          padding-bottom: 5px;
          padding-top: 5px;
        }`;
      
    }
  }}
`;