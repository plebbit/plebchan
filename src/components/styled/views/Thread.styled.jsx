import styled from 'styled-components';

export const ReplyFormLink = styled.div`
  @media (min-width: 480px) {
    display: ${(props) => (props.showReplyFormLink ? 'block' : 'none')};

    #post-form-link-mobile,
    #return-button-mobile,
    #catalog-button-mobile,
    #bottom-button-mobile {
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

    #return-button-mobile,
    #catalog-button-mobile,
    #bottom-button-mobile,
    #bottom-bar-top {
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
          background-image: url(assets/buttonfade.png);
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
          background-image: url(assets/buttonfade-blue.png);
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
          background-image: url(assets/buttonfade.png);
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
          background-image: url(assets/buttonfade-blue.png);
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
          background-image: url(assets/buttonfade-dark.png);
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

      default:
        return '';
    }
  }}
`;

export const TopBar = styled.div`
  @media (min-width: 480px) {
    .stats-all-catalog-container {
      float: right;
      margin-top: 3px;
      margin-right: 30px;
      overflow: hidden;
      max-width: calc(100vw - 50vw);
    }

    #stats-all {
      display: inline-block;
      max-width: calc(100vw - 50vw);
      word-wrap: break-word;
      white-space: nowrap;
      text-overflow: '';
      overflow: hidden;
    }

    .stats-pending-container {
      float: right;
      margin-top: 3px;
      margin-right: 30px;
      overflow: hidden;
      max-width: calc(100vw - 50vw);
    }

    #stats-pending {
      display: inline-block;
      max-width: calc(100vw - 50vw);
      word-wrap: break-word;
      white-space: nowrap;
      text-overflow: '';
      overflow: hidden;
    }

    .ellipsis-all {
      white-space: nowrap;
    }

    .ellipsis-all:after {
      content: '\\2026';
      position: absolute;
      -webkit-animation: ellipsis steps(4, end) 1200ms infinite;
      animation: ellipsis steps(4, end) 1500ms infinite;
      width: 0px;
      overflow: hidden;
    }

    #return-button-mobile {
      display: none;
    }

    .reply-stat {
      margin-top: 5px;
    }

    .subscribe-button-desktop {
      float: right;
      margin-right: 10px;
      margin-top: 3px;
    }

    .subscribe-button-mobile {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .stats-all-catalog-container {
      height: 25px;
      position: absolute;
      text-align: left;
      overflow: hidden;
      width: 100vw;
      margin-top: -2px;
    }

    #stats-all {
      display: inline-block;
      max-width: 90vw;
      word-wrap: break-word;
      white-space: nowrap;
      text-overflow: '';
      overflow: hidden;
    }

    .stats-pending-container {
      height: 25px;
      position: absolute;
      text-align: left;
      overflow: hidden;
      width: 100vw;
      margin-top: 8px;
    }

    #stats-pending {
      display: inline-block;
      max-width: 90vw;
      word-wrap: break-word;
      white-space: nowrap;
      text-overflow: '';
      overflow: hidden;
    }

    .ellipsis-all {
      white-space: nowrap;
    }

    .ellipsis-all:after {
      content: '\\2026';
      position: absolute;
      -webkit-animation: ellipsis steps(4, end) 1200ms infinite;
      animation: ellipsis steps(4, end) 1500ms infinite;
      width: 0px;
      overflow: hidden;
    }

    line-height: 30px;

    #return-button-desktop,
    #catalog-button-desktop,
    #bottom-button-desktop {
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

    .subscribe-button-desktop {
      display: none;
    }

    .subscribe-button-mobile {
      margin-right: 10px;
      position: absolute;
      right: 0;
      font-size: 13.3333px !important;

      a {
        cursor: pointer;
      }
    }
  }

  .ellipsis {
    margin-right: 18px !important;
  }

  .ellipsis:after {
    content: '\\2026';
    position: absolute;
    -webkit-animation: ellipsis steps(4, end) 1200ms infinite;
    animation: ellipsis steps(4, end) 1500ms infinite;
    width: 0px;
    overflow: hidden;
  }

  @keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 1.25em;
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

          a, a:visited, #button {
            color: #00e !important;
            text-decoration: none;
          }
          
          a:hover, #button:hover {
            color: red !important;
          }
        }
        
        a, #subscribe {
          color: #00e !important;
          text-decoration: none;
        }
        
        a:hover, #subscribe:hover {
          color: red !important;
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

          a, a:visited, #button {
            color: #34345c !important;
            text-decoration: none;
          }

          a:hover, #button:hover {
            color: red !important;
          }
        }
        
        a, #subscribe {
          color: #34345c !important;
          text-decoration: none;
        }
        
        a:hover, #subscribe:hover {
          color: #d00 !important;
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

          a, a:visited, #button {
            color: #00e !important;
            text-decoration: underline;
          }

          a:hover, #button:hover {
            color: red !important;
          }
        }
        
        .reply-stat {
          font-size: 12pt;
          bottom: 2px;
        }
        
        a, #subscribe {
          color: #00e !important;
          text-decoration: underline !important;
          font-size: 12pt !important;
        }
        
        a:hover, #subscribe:hover {
          color: red !important;
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

          a, a:visited, #button {
            color: #34345c !important;
            text-decoration: underline;
          }

          a:hover, #button:hover {
            color: red !important;
          }
        }
        
        .reply-stat {
          font-size: 12pt;
          bottom: 2px;
        }
        
        a, #subscribe{
          color: #34345c !important;
          text-decoration: underline !important;
          font-size: 12pt !important;
        }
        
        a:hover, #subscribe:hover {
          color: red !important;
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

          a, a:visited, #button {
            color: #81a2be !important;
            text-decoration: none;
          }

          a:hover, #button:hover {
            color: #5f89ab !important;
          }
        }
        
        a, #subscribe {
          color: #81a2be !important;
          text-decoration: none;
        }
        
        a:hover, #subscribe:hover {
          color: #5f89ab !important;
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

          a, a:visited, #button {
            color: #f60 !important;
            text-decoration: none;
          }

          a:hover, #button:hover {
            color: #ff3300 !important;
          }
        }
        
        a, #subscribe {
          color: #f60 !important;
          text-decoration: none;
        }
        
        a:hover, #subscribe:hover {
          color: #ff3300 !important;
        }`;
      default:
        return '';
    }
  }}

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `.btn-wrap {
          background-color: #f0e0d6;
          background-image: url(assets/buttonfade.png);
          border: 1px solid #c0a69d;
          color: #800;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
          font-size: 10pt !important;
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
          background-image: url(assets/buttonfade-blue.png);
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
          background-image: url(assets/buttonfade.png);
          border: 1px solid #c0a69d;
          color: #800;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
          font-size: 16px !important;
          font-family: times new roman !important;
        }

          .subscribe-button-mobile {
            margin-top: -2px !important;
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
          background-image: url(assets/buttonfade-blue.png);
          border: 1px solid #b7c5d9;
          color: #34345c;
          border-radius: 3px 3px 3px 3px;
          font-weight: 700;
          padding: 6px 10px 5px;
          background-repeat: repeat-x;
          cursor: pointer;
          font-size: 16px !important;
          font-family: times new roman !important;
        }

        .subscribe-button-mobile {
          margin-top: -2px !important;
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
          background-image: url(assets/buttonfade-dark.png);
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

      default:
        return '';
    }
  }}
`;

export const BottomBar = styled.div`
  .ellipsis {
    margin-right: 18px !important;
  }

  .ellipsis:after {
    content: '\\2026';
    position: absolute;
    -webkit-animation: ellipsis steps(4, end) 1200ms infinite;
    animation: ellipsis steps(4, end) 1500ms infinite;
    width: 0px;
    overflow: hidden;
  }

  @keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }

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
        a, a:visited, #button {
          color: #00e !important;
          text-decoration: none;
        }
        
        a:hover, #button:hover {
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
        a, a:visited, #button {
          color: #34345c !important;
          text-decoration: none;
        }
        
        a:hover, #button:hover {
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
        a, a:visited, #button {
          color: #00e !important;
          text-decoration: underline;
        }
        
        a:hover, #button:hover {
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
        a, a:visited, #button {
          color: #34345c !important;
          text-decoration: underline;
        }
        
        a:hover, #button:hover {
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
        a, a:visited, #button {
          color: #81a2be !important;
          text-decoration: none;
        }
        
        a:hover, #button:hover {
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
        a, a:visited, #button {
          color: #f60 !important;
          text-decoration: none;
        }
        
        a:hover, #button:hover {
          color: #ff3300 !important;
        }
        
        hr {
          height: 0;
          clear: both;
          padding-bottom: 5px;
          padding-top: 5px;
        }`;

      default:
        return '';
    }
  }}
`;

export const BoardForm = styled.div`
  .ellipsis {
    margin-right: 14px;
  }

  .ellipsis:after {
    content: '\\2026';
    position: absolute;
    -webkit-animation: ellipsis steps(4, end) 1200ms infinite;
    animation: ellipsis steps(4, end) 1500ms infinite;
    width: 0px;
    overflow: hidden;
  }

  @keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }
  @media (min-width: 480px) {
    .thread-mobile {
      display: none;
    }

    .post-info {
      margin: 3px 3px 0 5px;
      display: block;
      width: 100%;
    }

    #bottombar-mobile {
      display: none;
    }

    .summary {
      margin-top: 10px;
    }

    #post-menu {
      z-index: 999;
      position: absolute;
      font-size: 12px;
      line-height: 1.3em;
      left: 80%;

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        white-space: nowrap;
      }

      li {
        cursor: pointer;
        position: relative;
        padding: 2px 4px;
      }

      .dropdown {
        position: relative;
        display: inline-block;
      }

      .dropdown-menu {
        display: none;
        position: absolute;
        left: 100%;
        top: 0;
        list-style: none;
      }

      .dropdown:hover .dropdown-menu {
        display: block;
      }

      a {
        text-decoration: none;
        color: inherit;
      }
    }

    ${({ selectedStyle }) => {
      switch (selectedStyle) {
        case 'Yotsuba':
          return `.highlighted, .highlighted-click, .highlighted-address {
        background-color: #f0c0b0 !important;
        border: 1px solid #d99f91 !important;
        border-left: none !important;
        border-top: none !important;
      }

      .capcode {
        color: purple !important;
        cursor: pointer;
      }

      .capcode-admin {
        color: red !important;
        cursor: pointer;
      }
      
      #post-menu {
        ul {
          background-color: #f0e0d6;
          border: 1px solid #d9bfb7;
          border-bottom: 1px solid #d9bfb7;
          border-right-width: 2px;
        }

        li {
          border-bottom: 1px solid #ccc;

          :hover {
            background-color: #ffe;
          }
        }
      }`;

        case 'Yotsuba-B':
          return `.highlighted, .highlighted-click, .highlighted-address {
        background-color: #d6bad0 !important;
        border: 1px solid #ba9dbf !important;
        border-left: none !important;
        border-top: none !important;
      }

      .capcode {
        color: purple !important;
        cursor: pointer;
      }

      .capcode-admin {
        color: red !important;
        cursor: pointer;
      }
      
      #post-menu {
        ul {
          background-color: #d6daf0;
          border: 1px solid #b7c5d9;
          border-right-width: 2px;
        }

        li {
          border-bottom: 1px solid #b7c5d9;

          :hover {
            background-color: #eef2ff;
          }
        }
      }`;

        case 'Futaba':
          return `.highlighted, .highlighted-click, .highlighted-address {
        background-color: #f0c0b0 !important;
      }

      .capcode {
        color: purple !important;
        cursor: pointer;
      }

      .capcode-admin {
        color: red !important;
        cursor: pointer;
      }
      
      #post-menu {
        font-size: 13px !important;

        ul {
          background-color: #f0e0d6;
          border: 1px solid #d9bfb7;
          border-bottom: none;
        }

        li {
          border-bottom: 1px solid #d9bfb7;

          :hover {
            background-color: #ffe;
          }
        }
      }`;

        case 'Burichan':
          return `.highlighted, .highlighted-click, .highlighted-address {
        background-color: #d6bad0 !important;
      }

      .capcode {
        color: purple !important;
        cursor: pointer;
      }

      .capcode-admin {
        color: red !important;
        cursor: pointer;
      }
      
      #post-menu {
        font-size: 13px !important;

        ul {
          background-color: #d6daf0;
          border: 1px solid #b7c5d9;
          border-bottom: none;
        }

        li {
          border-bottom: 1px solid #b7c5d9;

          :hover {
            background-color: #eef2ff;
          }
        }
      }`;

        case 'Tomorrow':
          return `.highlighted, .highlighted-click, .highlighted-address {
        background-color: #1d1d21 !important;
        outline: 1px solid #111 !important;
      }

      .capcode {
        color: #81a2be !important;
        cursor: pointer;
      }

      .capcode-admin {
        color: #81a2be !important;
        cursor: pointer;
      }
      
      #post-menu {
        ul {
          background-color: #282a2e;
          border: 1px solid #000;
          border-bottom: none;
        }

        li {
          border-bottom: 1px solid #000;

          :hover {
            background-color: #1d1f21;
          }
        }
      }`;

        case 'Photon':
          return `.highlighted, .highlighted-click, .highlighted-address {
        background-color: #ccc !important;
        outline: 1px solid #ccc !important;
      }

      .capcode {
        color: #f60 !important;
        cursor: pointer;
      }

      .capcode-admin {
        color: #f60 !important;
        cursor: pointer;
      }
      
      #post-menu {
        ul {
          background-color: #ddd;
          border: 1px solid #ccc;
          border-bottom: none;
        }

        li {
          border-bottom: 1px solid #ccc;

          :hover {
            background-color: #eee;
          }
        }
      }`;

        default:
          return '';
      }
    }}
  }

  .file {
    display: block;

    .file-text {
      max-width: 600px;
      white-space: nowrap;
    }

    .fileText a {
      text-decoration: underline;
    }

    .file-thumb {
      float: left;
      margin: 3px 20px 5px 20px;
    }

    .reply-file-text {
      max-width: 600px;
      white-space: nowrap;
      margin-left: 5px;
    }

    .file-thumb-reply {
      float: left;
      margin: 3px 20px 5px 20px;
    }

    .file-thumb img,
    .file-thumb video,
    .file-thumb audio {
      border: none;
      max-width: 250px;
      max-height: 250px;
    }

    .file-thumb-reply img,
    .file-thumb-reply video,
    .file-thumb-reply audio {
      max-width: 125px;
      max-height: 125px;
    }
  }

  .thread-mobile {
    border-top: none;
    margin: 0;
    clear: both;

    hr {
      margin-top: 30px;
      margin-bottom: 30px;
    }

    .op-container {
      margin: 0 -5px;
      padding: 5px;
      display: block;
      overflow: hidden;

      .op {
        display: inline;
        margin: 4px 0;
        overflow: hidden;
      }

      .post-info-mobile {
        overflow: hidden;
        padding: 5px;
        margin: -5px -6px -5px -5px;
        display: block;
        clear: left;
      }

      .post-menu-button-mobile {
        line-height: 1em !important;
        width: 1em !important;
        text-align: center !important;
        outline: none !important;
        transform: rotate(90deg) !important;
        margin: 4px -5px 0 4px !important;
        float: left !important;
        font-weight: 700 !important;
        opacity: 1 !important;
        height: 0.5em !important;
        font-size: 16px !important;
      }

      .name-block-mobile {
        clear: none;
        float: left;

        .subject-mobile {
          display: block;
        }
      }

      .date-time-mobile {
        float: right;
        text-align: right;
      }

      .file-mobile {
        display: block;

        .file-thumb-mobile {
          margin-left: 10px !important;
          margin-right: 10px !important;
          text-decoration: none;
          float: left;
          margin-bottom: 5px;
          margin-top: 15px;
        }

        .file-info-mobile {
          padding-top: 5px;
          text-align: center;
          text-decoration: none;
          display: block !important;
          clear: left !important;
        }
      }

      video {
        width: 100%;
        height: auto;
      }

      iframe {
        width: 100%;
        height: auto;
      }

      img {
        border: none;
        float: left;
        max-width: 100px;
        max-height: 100px;
        object-fit: scale-down;
      }

      .thread-icons-mobile {
        margin-top: -1px;
        margin-right: 2px;
        image-rendering: pixelated;
      }

      blockquote {
        padding-top: 5px;
        display: block;
        margin: 10px !important;
      }

      .post-link-mobile {
        clear: both !important;
        padding: 5px;
        overflow: hidden;
        margin: -5px;
        display: block !important;
      }

      .info-mobile {
        margin-top: 8px;
        float: left;
      }

      .button-mobile {
        float: right;
        border-radius: 3px;
        padding: 6px 10px 5px;
        user-select: none;
        text-decoration: none;
      }
    }

    .reply-container {
      margin: 7px 2px 0;
      padding-left: 0;

      .post-reply {
        margin-top: 0 !important;
        width: 100%;
        padding: 0 !important;
        display: table;
        overflow: hidden;
      }

      .file-mobile {
        display: block;

        .file-thumb-mobile {
          margin-left: 10px !important;
          margin-right: 10px !important;
          text-decoration: none;
          float: left;
          margin-bottom: 5px;
          margin-top: 15px;
        }

        .file-info-mobile {
          padding-top: 5px;
          text-align: center;
          text-decoration: none;
          display: block !important;
          clear: left !important;
        }
      }

      video {
        max-width: 100px;
      }

      img {
        border: none;
        float: left;
        max-width: 100px;
        max-height: 100px;
        object-fit: scale-down;
      }

      .post-info-mobile {
        margin: 0;
        overflow: hidden;
        padding: 5px;
        display: block !important;
        clear: left !important;

        .post-menu-button-mobile {
          line-height: 1em !important;
          width: 1em !important;
          text-align: center !important;
          outline: none !important;
          transform: rotate(90deg) !important;
          margin: 4px -5px 0 4px !important;
          float: left !important;
          font-weight: 700 !important;
          opacity: 1 !important;
          height: 0.5em !important;
          font-size: 16px !important;
        }

        .name-block-mobile {
          clear: none;
          float: left;
        }

        .date-time-mobile {
          float: right;
          text-align: right;

          a {
            text-decoration: none;
          }
        }
      }

      blockquote {
        display: block;
        margin: 10px !important;
      }
    }
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `.thread {
        margin: 0;
        clear: both;
      }

      .op-container {
        display: inline;
      }

      .op {
        display: inline;
      }

      .post {
        overflow: hidden;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
      }

      img {
        border: none;
      }

      .file a {
        text-decoration: underline;
        color: #00e;
      }

      .file a:hover {
        color: red;
      }

      .name {
        color: #117743;
        font-weight: 700;
      }

      .post-number a {
        text-decoration: none;
        color: maroon;
      }

      .post-number a:hover {
        color: red;
      }

      #reply-button:hover {
        color: red !important;
      }

      .reply-link:not(:hover) {
        color: #00e !important;
      }

      .ttl {
        color: #707070;
      }

      .ttl-link {
        text-decoration: none;
        color: #00e;
      }

      .ttl-link:hover {
        color: red;
      }

      .post-menu-button {
        color: #000080 !important;
        margin-left: 5px;
        text-decoration: none;
        line-height: 1em;
        display: inline-block;
        transition: transform 0.1s;
        width: 1em;
        height: 1em;
        text-align: center;
        outline: none;
        opacity: 0.8;
      }

      .post-menu-button:hover {
        color: red !important;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
      }
      
      .backlink-mobile {
        padding: 3px 5px;
        clear: both !important;
        line-height: 2;
        background-color: #ead6ca;
        border-top: 1px solid #d9bfb7;
        display: block;
      }

      .quote-link {
        color: navy;
        text-decoration: underline;
      }

      .quote-link:hover {
        color: red;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
        line-height: 1.3em;
      }

      .title {
        color: #cc1105;
        font-weight: 700;
      }

      .greentext {
        color: #789922;
      }

      .quotelink {
        color: navy;
        text-decoration: underline;
        font-family: arial;
      }

      .quotelink:hover {
        color: red;
      }

      .side-arrows {
        color: #e0bfb7;
        float: left;
        margin-right: 2px;
        margin-top: 0;
        margin-left: 2px;
      }

      .post-reply {
        background-color: #f0e0d6;
        border: 1px solid #d9bfb7;
        margin-top: 2px;
        border-left: none;
        border-top: none;
        display: table;
        padding: 2px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
        margin: 4px 0;
      }

      hr {
        border: none;
        border-top: 1px solid #d9bfb7;
        height: 0;
      }`;

      case 'Yotsuba-B':
        return `.thread {
        margin: 0;
        clear: both;
      }

      .op-container {
        display: inline;
      }

      .op {
        display: inline;
      }

      .post {
        overflow: hidden;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
      }

      img {
        border: none;
      }

      .file a {
        text-decoration: underline;
        color: #34345c;
      }

      .file a:hover {
        color: #d00;
      }

      .name {
        color: #117743;
        font-weight: 700;
      }

      .post-number a {
        text-decoration: none;
        color: #000;
      }

      .post-number a:hover {
        color: #d00;
      }

      #reply-button:hover {
        color: #d00 !important;
      }

      .reply-link:not(:hover) {
        color: #34345c !important;
      }

      .ttl {
        color: #707070;
      }

      .ttl-link {
        text-decoration: none;
        color: #34345c;
      }

      .ttl-link:hover {
        color: #d00;
      }

      .post-menu-button {
        color: #34345c !important;
        margin-left: 5px;
        text-decoration: none;
        line-height: 1em;
        display: inline-block;
        transition: transform 0.1s;
        width: 1em;
        height: 1em;
        text-align: center;
        outline: none;
        opacity: 0.8;
      }

      .post-menu-button:hover {
        color: #d00 !important;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
      }

      .backlink-mobile {
        padding: 3px 5px;
        clear: both !important;
        line-height: 2;
        background-color: #c9cde8;
        border-top: 1px solid #b7c5d9;
        display: block;
      }
      
      .quote-link {
        color: #34345C;
        text-decoration: underline;
      }

      .quote-link:hover {
        color: #d00;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
        line-height: 1.3em;
      }

      .title {
        color: #0f0c5d;
        font-weight: 700;
      }

      .greentext {
        color: #789922;
      }
      
      .quotelink {
        color: #d00;
        text-decoration: underline;
        font-family: arial;
      }

      .side-arrows {
        color: #b7c5d9;
        float: left;
        margin-right: 2px;
        margin-top: 0;
        margin-left: 2px;
      }

      .post-reply {
        background-color: #d6daf0;
        border: 1px solid #b7c5d9;
        margin-top: 2px;
        border-left: none;
        border-top: none;
        display: table;
        padding: 2px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
        margin: 4px 0;
      }

      hr {
        border: none;
        border-top: 1px solid #b7c5d9;
        height: 0;
      }`;

      case 'Futaba':
        return `
        font-size: 12pt;
        
      .thread {
        margin: 0;
        clear: both;
      }

      .op-container {
        display: inline;
      }

      .op {
        display: inline;
      }

      .post {
        overflow: hidden;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
      }

      img {
        border: none;
      }

      .file a {
        color: #00e;
        text-decoration: underline;
      }

      .file a:hover {
        color: red;
       } 

      .name {
        color: #117743;
        font-weight: 700;
      }

      .post-number a {
        text-decoration: none;
        color: maroon;
      }

      .post-number a:hover {
        color: red;
      }

      #reply-button:hover {
        color: red !important;
      }
      
      .reply-link {
        text-decoration: underline !important;
      }

      .reply-link:not(:hover) {
        color: #00e !important;
      }

      .ttl-link {
        color: #00e;
      }

      .ttl-link:hover {
        color: red;
      }

      .post-menu-button {
        color: #00e !important;
        margin-left: 5px;
        text-decoration: none;
        line-height: 1em;
        display: inline-block;
        transition: transform 0.1s;
        width: 1em;
        height: 1em;
        text-align: center;
        outline: none;
        opacity: 0.8;
      }

      .post-menu-button:hover {
        color: red !important;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
      }

      .backlink-mobile {
        padding: 3px 5px;
        clear: both !important;
        line-height: 2;
        background-color: #ead6ca;
        border-top: 1px solid #d9bfb7;
        display: block;
      }

      .quote-link {
        color: #34345C;
        text-decoration: underline;
      }

      .quote-link:hover {
        color: red;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
        line-height: 1.3em;
      }

      .title {
        color: #cc1105;
        font-weight: 700;
      }

      .greentext {
        color: #789922;
      }

      .quotelink {
        color: navy;
        text-decoration: underline;
      }

      .quotelink:hover {
        color: red;
      }

      .side-arrows {
        float: left;
        margin-right: 2px;
        margin-top: 0;
        margin-left: 2px;
      }

      .post-reply {
        background-color: #f0e0d6;
        margin-top: 2px;
        border-left: none;
        border-top: none;
        display: table;
        padding: 2px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
        margin: 4px 0
      }

      hr {
        clear: both;
      }`;

      case 'Burichan':
        return `
        font-size: 12pt;

      .thread {
      margin: 0;
      clear: both;
      }

      .op-container {
        display: inline;
      }

      .op {
        display: inline;
      }

      .post {
        overflow: hidden;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
      }

      img {
        border: none;
      }

      .file a {
        color: #34345c;
        text-decoration: underline;
      }

      .file a:hover {
        color: red;
      } 

      .name {
        color: #117743;
        font-weight: 700;
      }

      .post-number a {
        text-decoration: none;
        color: #000;
      }

      .post-number a:hover {
        color: red;
      }

      #reply-button:hover {
        color: red !important;
      }

      .reply-link {
        text-decoration: underline !important;
       }

      .reply-link:not(:hover) {
        color: #000 !important;
      }

      .ttl {
        color: #707070;
      }

      .ttl-link {
        color: #34345c;
      }

      .ttl-link:hover {
        color: #d00;
      }

      .post-menu-button {
        color: #34345c !important;
        margin-left: 5px;
        text-decoration: none;
        line-height: 1em;
        display: inline-block;
        transition: transform 0.1s;
        width: 1em;
        height: 1em;
        text-align: center;
        outline: none;
        opacity: 0.8;
      }

      .post-menu-button:hover {
        color: red !important;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
      }

      .backlink-mobile {
        padding: 3px 5px;
        clear: both !important;
        line-height: 2;
        background-color: #c9cde8;
        border-top: 1px solid #b7c5d9;
        display: block;
      }

      .quote-link {
        color: #34345C;
        text-decoration: underline;
      }

      .quote-link:hover {
        color: #dd0000;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
        line-height: 1.3em;
      }

      .title {
        color: #cc1105;
        font-weight: 700;
      }

      .greentext {
        color: #789922;
      }

      .quotelink {
        color: #d00;
        text-decoration: underline;
      }

      .side-arrows {
        float: left;
        margin-right: 2px;
        margin-top: 0;
        margin-left: 2px;
      }

      .post-reply {
        background-color: #d6daf0;
        margin-top: 2px;
        border-left: none;
        border-top: none;
        display: table;
        padding: 2px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
        margin: 4px 0
      }

      hr {
        clear: both;
      }`;

      case 'Tomorrow':
        return `.thread {
        margin: 0;
        clear: both;
      }

      .op-container {
        display: inline;
      }

      .op {
        display: inline;
      }

      .post {
        overflow: hidden;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
      }

      img {
        border: none;
      }

      .file a {
        color: #81a2be;
        text-decoration: underline;
      }

      .file a:hover {
        color: #5f89ab;
      } 

      .name {
        color: #c5c8c6;
        font-weight: 700;
      }

      .post-number a {
        text-decoration: none;
        color: #c5c8c6;
      }

      .post-number a:hover {
        color: #5f89ab;
      }

      #reply-button:hover {
        color: #5f89ab !important;
      }

      .reply-link:not(:hover) {
        color: #81a2be;
      }

      .ttl {
        color: #707070;
      }

      .ttl-link {
        text-decoration: none;
        color: #81a2be;
      }

      .ttl-link:hover {
        color: #5f89ab;
      }

      .reply-link:hover {
        color: #5f89ab
      }

      .post-menu-button {
        color: #81a2be !important;
        margin-left: 5px;
        text-decoration: none;
        line-height: 1em;
        display: inline-block;
        transition: transform 0.1s;
        width: 1em;
        height: 1em;
        text-align: center;
        outline: none;
        opacity: 0.8;
      }

      .post-menu-button:hover {
        color: #5f89ab !important;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
      }

      .backlink-mobile {
        padding: 3px 5px;
        clear: both !important;
        line-height: 2;
        background-color: #212326;
        border-top: 1px solid #2D2F33;
        display: block;
      }

      .quote-link {
        color: #5f89ac;
        text-decoration: underline;
      }

      .quote-link:hover {
        color: #81a2be;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
        line-height: 1.3em;
      }

      .title {
        color: #b294bb;
        font-weight: 700;
      }

      .greentext {
        color: #b5bd68;
      }

      .quotelink {
        color: #5f89ac;
        text-decoration: underline;
        font-family: arial;
      }

      .quotelink:hover {
        color: #81a2be;
      }

      .side-arrows {
        color: #c5c8c6;
        float: left;
        margin-right: 2px;
        margin-top: 0;
        margin-left: 2px;
      }

      .post-reply {
        background-color: #282a2e;
        border: 1px solid #282a2e;
        margin-top: 2px;
        border-left: none;
        border-top: none;
        display: table;
        padding: 2px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
        margin: 4px 0
      }

      hr {
        border: none;
        border-top: 1px solid #282a2e;
        height: 0;
      }`;

      case 'Photon':
        return `.thread {
        margin: 0;
        clear: both;
      }

      .op-container {
        display: inline;
      }

      .op {
        display: inline;
      }

      .post {
        overflow: hidden;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
      }

      img {
        border: none;
      }

      .file a {
        text-decoration: underline;
        color: #f60;
      }

      .file a:hover {
        color: #ff3300;
      }

      .name {
        color: #004a99;
        font-weight: 700;
      }

      .post-number a {
        text-decoration: none;
        color: #333;
      }

      .post-number a:hover {
        color: #ff3300;
      }

      #reply-button:hover {
        color: #ff3300 !important;
      }

      .reply-link:not(:hover) {
        color: #f60 !important;
      }

      .ttl {
        color: #707070;
      }

      .ttl-link {
        text-decoration: none;
        color: #f60;
      }

      .ttl-link:hover {
        color: #ff3300;
      }

      .post-menu-button {
        color: #f60 !important;
        margin-left: 5px;
        text-decoration: none;
        line-height: 1em;
        display: inline-block;
        transition: transform 0.1s;
        width: 1em;
        height: 1em;
        text-align: center;
        outline: none;
        opacity: 0.8;
      }

      .post-menu-button:hover {
        color: #ff3300 !important;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
      }

      .quote-link {
        color: #f60;
        text-decoration: underline;
      }

      .quote-link:hover {
        color: #ff3300;
      }

      .backlink span {
        padding: 0;
      }

      .backlink-mobile {
        padding: 3px 5px;
        clear: both !important;
        line-height: 2;
        background-color: #ddd;
        border-top: 1px solid #ccc;
        display: block;
      }

      blockquote {
        display: block;
        line-height: 1.3em;
      }

      .title {
        color: #111;
        font-weight: 700;
      }

      .greentext {
        
        color: #789922;
      }

      .quotelink {
        color: #f60;
        text-decoration: underline;
        font-family: arial;
      }

      .quotelink:hover {
        color: #ff3300;
      }

      .side-arrows {
        color: #333;
        float: left;
        margin-right: 2px;
        margin-top: 0;
        margin-left: 2px;
      }

      .post-reply {
        background-color: #ddd;
        border: 1px solid #ccc;
        margin-top: 2px;
        border-left: none;
        border-top: none;
        display: table;
        padding: 2px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
        margin: 4px 0
      }

      hr {
        border: none;
        border-top: 1px solid #ddd;
        height: 0;
      }`;

      default:
        return '';
    }
  }}

  @media (max-width: 480px) {
    margin-top: -7%;

    .thread {
      display: none;
    }

    hr {
      margin-left: calc((100% - 100vw) / 2);
      margin-right: calc((100% - 100vw) / 2);
    }

    .name-block {
      display: block;
    }

    .post-info {
      display: flex;
      flex-wrap: wrap;
      margin: 4px;
    }

    #bottombar-desktop {
      display: none;
    }

    ${({ selectedStyle }) => {
      switch (selectedStyle) {
        case 'Yotsuba':
          return `.highlighted, .highlighted-click, .highlighted-address {
          background-color: #f0c0b0 !important;
        }`;

        case 'Yotsuba-B':
          return `.highlighted, .highlighted-click, .highlighted-address {
          background-color: #d6bad0 !important;
        }`;

        case 'Futaba':
          return `.highlighted, .highlighted-click, .highlighted-address {
          background-color: #f0c0b0 !important;
        }`;

        case 'Burichan':
          return `.highlighted, .highlighted-click, .highlighted-address {
          background-color: #d6bad0 !important;
        }`;

        case 'Tomorrow':
          return `.highlighted, .highlighted-click, .highlighted-address {
          background-color: #1d1d21 !important;
        }`;

        case 'Photon':
          return `.highlighted, .highlighted-click, .highlighted-address {
          background-color: #ccc !important;
        }`;

        default:
          return '';
      }
    }}

    ${({ selectedStyle }) => {
      switch (selectedStyle) {
        case 'Yotsuba':
          return `
            .op-container {
              background-color: #f5e9e1;
              border: 1px solid #d9bfb7 !important;
            }

              .post-info-mobile {
                border-bottom: 1px solid #d9bfb7;
                background-color: #ead6ca;
              }
    
              .post-menu-button-mobile {
                color: #00e !important;
              }
    
              .name-mobile {
                color: #117743;
                font-weight: 700;
              }

              .capcode {
                color: purple !important;
                cursor: pointer;
              }

              .capcode-admin {
                color: red !important;
                cursor: pointer;
              }
    
              .subject-mobile {
                color: #cc1105;
                font-weight: 700;
              }
    
              .date-time-mobile {
                color: maroon;

                a {
                  text-decoration: none;
                  color: maroon;
                }
              }
    
              .file-thumb-mobile {
                color: #00e !important;
              }
    
              .file-info-mobile {
                color: #707070;
                font-size: 9pt !important;
              }
    
              blockquote {
                font-size: 11pt;
              }
    
              .post-link-mobile {
                background-color: #ead6ca;
                border-top: 1px solid #d9bfb7;
              }
    
              .info-mobile {
                color: #800;
              }
    
              .button-mobile {
                color: #800;
                font-weight: 700;
                background-color: #f0e0d6;
                border: 1px solid #c0a69d;
                background-image: url(assets/buttonfade.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }

            .reply-container {
              background-color: #f0e0d6;

              .post-reply {
                background-color: #f0e0d6;
                border: 1px solid #d9bfb7;
              }

              .post-info-mobile {
                border-bottom: 1px solid #d9bfb7;
                background-color: #ead6ca;

                .post-menu-button-mobile {
                  color: #00e !important;
                }

                .name-mobile {
                  color: #117743;
                  font-weight: 700;
                }

                .date-time-mobile {
                  color: maroon;

                  a {
                    color: maroon;
                  }
                }
              }

              blockquote {
                font-size: 11pt;

                .quotelink-mobile {
                  color: navy !important;
                  text-decoration: underline;
                  font-family: arial;
                }

                .quotelink-mobile:hover {
                  color: red !important;
                }

                p:first-of-type::before {
                  color: #789922;
                }
              }
            }
          }`;

        case 'Yotsuba-B':
          return `
            .op-container {
              background-color: #d6daf0;
              border: 1px solid #b7c5d9 !important;
            }

              .post-info-mobile {
                border-bottom: 1px solid #b7c5d9;
                background-color: #c9cde8;
              }
    
              .post-menu-button-mobile {
                color: #34345c !important;
              }
    
              .name-mobile {
                color: #117743;
                font-weight: 700;
              }

              .capcode {
                color: purple !important;
                cursor: pointer;
              }

              .capcode-admin {
                color: red !important;
                cursor: pointer;
              }
    
              .subject-mobile {
                color: #0f0c5d;
                font-weight: 700;
              }
    
              .date-time-mobile {
                color: #000;

                a {
                  text-decoration: none;
                  color: #000;
                }
              }
    
              .file-thumb-mobile {
                color: #81a2be !important;
              }
    
              .file-info-mobile {
                color: #707070;
                font-size: 9pt !important;
              }
    
              blockquote {
                font-size: 11pt;
              }
    
              .post-link-mobile {
                background-color: #c9cde8;
                border-top: 1px solid #b7c5d9;
              }
    
              .info-mobile {
                color: #34345c;
              }
    
              .button-mobile {
                color: #34345c;
                font-weight: 700;
                background-color: #d6daf0;
                border: 1px solid #b7c5d9;
                background-image: url(assets/buttonfade-blue.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }

            .reply-container {
              background-color: #d6daf0;

              .post-reply {
                background-color: #d6daf0;
                border: 1px solid #b7c5d9;
              }

              .post-info-mobile {
                border-bottom: 1px solid #b7c5d9;
                background-color: #c9cde8;

                .post-menu-button-mobile {
                  color: #34345c !important;
                }

                .name-mobile {
                  color: #117743;
                  font-weight: 700;
                }

                .date-time-mobile {
                  color: #000;

                  a {
                    color: #000;
                  }
                }
              }

              blockquote {
                font-size: 11pt;

                .quotelink-mobile {
                  color: #d00;
                  text-decoration: underline;
                  font-family: arial;
                }

                p:first-of-type::before {
                  color: #789922;
                }
              }
            }
          }`;

        case 'Futaba':
          return `
            .op-container {
              background-color: #f5e9e1;
              border: 1px solid #d9bfb7 !important;
            }

              .post-info-mobile {
                border-bottom: 1px solid #d9bfb7;
                background-color: #ead6ca;
              }
    
              .post-menu-button-mobile {
                color: #00e !important;
              }
    
              .name-mobile {
                color: #117743;
                font-weight: 700;
              }

              .capcode {
                color: purple !important;
                cursor: pointer;
              }

              .capcode-admin {
                color: red !important;
                cursor: pointer;
              }
    
              .date-time-mobile {
                color: maroon;

                a {
                  text-decoration: none;
                  color: maroon;
                }
              }
    
              .file-thumb-mobile {
                color: #00e !important;
              }
    
              .file-info-mobile {
                color: #707070;
                font-size: 9pt !important;
              }
    
              blockquote {
                font-size: 12pt;
              }
    
              .post-link-mobile {
                background-color: #ead6ca;
                border-top: 1px solid #d9bfb7;
              }
    
              .info-mobile {
                color: #800;
              }
    
              .button-mobile {
                color: #800;
                font-weight: 700;
                background-color: #f0e0d6;
                border: 1px solid #c0a69d;
                background-image: url(assets/buttonfade.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }

            .reply-container {
              background-color: #f0e0d6;

              .post-reply {
                background-color: #f0e0d6;
                border: 1px solid #d9bfb7;
              }

              .post-info-mobile {
                border-bottom: 1px solid #d9bfb7;
                background-color: #ead6ca;

                .post-menu-button-mobile {
                  color: #00e !important;
                }

                .name-mobile {
                  color: #117743;
                  font-weight: 700;
                }

                .date-time-mobile {
                  color: maroon;

                  a {
                    color: maroon;
                  }
                }
              }

              blockquote {
                font-size: 12pt;

                .quotelink-mobile {
                  color: navy !important;
                  text-decoration: underline;
                }

                .quotelink-mobile:hover {
                  color: red !important;
                }

                p:first-of-type::before {
                  color: #789922;
                }
              }
            }
          }`;

        case 'Burichan':
          return `
            .op-container {
              background-color: #d6daf0;
              border: 1px solid #b7c5d9 !important;
            }

              .post-info-mobile {
                border-bottom: 1px solid #b7c5d9;
                background-color: #c9cde8;
              }
    
              .post-menu-button-mobile {
                color: #34345c !important;
              }
    
              .name-mobile {
                color: #117743;
                font-weight: 700;
              }

              .capcode {
                color: purple !important;
                cursor: pointer;
              }

              .capcode-admin {
                color: red !important;
                cursor: pointer;
              }
    
              .subject-mobile {
                color: #0f0c5d;
                font-weight: 700;
              }
    
              .date-time-mobile {
                color: #000;

                a {
                  text-decoration: none;
                  color: #000;
                }
              }
    
              .file-thumb-mobile {
                color: #81a2be !important;
              }
    
              .file-info-mobile {
                color: #707070;
                font-size: 9pt !important;
              }
    
              blockquote {
                font-size: 12pt;
              }
    
              .post-link-mobile {
                background-color: #c9cde8;
                border-top: 1px solid #b7c5d9;
              }
    
              .info-mobile {
                color: #34345c;
              }
    
              .button-mobile {
                color: #34345c;
                font-weight: 700;
                background-color: #d6daf0;
                border: 1px solid #b7c5d9;
                background-image: url(assets/buttonfade-blue.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }

            .reply-container {
              background-color: #d6daf0;

              .post-reply {
                background-color: #d6daf0;
                border: 1px solid #b7c5d9;
              }

              .post-info-mobile {
                border-bottom: 1px solid #b7c5d9;
                background-color: #c9cde8;

                .post-menu-button-mobile {
                  color: #34345c !important;
                }

                .name-mobile {
                  color: #117743;
                  font-weight: 700;
                }

                .date-time-mobile {
                  color: #000;

                  a {
                    color: #000;
                  }
                }
              }

              blockquote {
                font-size: 12pt;

                .quotelink-mobile {
                  color: #d00;
                  text-decoration: underline;
                }

                p:first-of-type::before {
                  color: #789922;
                }
              }
            }
          }`;

        case 'Tomorrow':
          return `
            .op-container {
              background-color: #282A2E;
              border: 1px solid #2D2F33 !important;
            }

              .post-info-mobile {
                border-bottom: 1px solid #2D2F33;
                background-color: #212326;
              }
    
              .post-menu-button-mobile {
                color: #81A2BE !important;
              }
    
              .name-mobile {
                color: #117743;
                font-weight: 700;
              }

              .capcode {
                color: #81a2be !important;
                cursor: pointer;
              }

              .capcode-admin {
                color: #81a2be !important;
                cursor: pointer;
              }

              .poster-address-mobile {
                color: #707070;
              }
    
              .subject-mobile {
                color: #B294BB;
                font-weight: 700;
              }
    
              .date-time-mobile {
                color: #707070;

                a {
                  text-decoration: none;
                  color: #707070;
                }
              }
    
              .file-thumb-mobile {
                color: #81A2BE !important;
              }
    
              .file-info-mobile {
                color: #707070;
                font-size: 9pt !important;
              }
    
              blockquote {
                color: #C5C8C6;
                font-size: 11pt;
              }
    
              .post-link-mobile {
                background-color: #212326;
                border-top: 1px solid #2D2F33;
              }
    
              .info-mobile {
                color: #707070;
              }
    
              .button-mobile {
                color: #707070;
                font-weight: 700;
                background-color: rgb(27,28,30);
                border: 1px solid #2D2F33;
                background-image: url(assets/buttonfade-dark.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }

            .reply-container {
              background-color: #f0e0d6;
              color: #C5C8C6;

              .post-reply {
                background-color: #282A2E;
                border: 1px solid #2D2F33;
              }

              .post-info-mobile {
                border-bottom: 1px solid #2D2F33;
                background-color: #212326;

                .post-menu-button-mobile {
                  color: #81A2BE !important;
                }

                .name-mobile {
                  color: #117743;
                  font-weight: 700;
                }

                .date-time-mobile {
                  color: #707070;

                  a {
                    color: #707070;
                  }
                }
              }

              blockquote {
                font-size: 11pt;
              }

              .quotelink-mobile {
                color: #5F89AC;
                text-decoration: underline;
              }

              .quotelink-mobile:hover {
                color: #81A2BE;
              }

              p:first-of-type::before {
                color: #b5bd68;
              }
            }
          }`;

        case 'Photon':
          return `
            .op-container {
              background-color: #eee;
              border: 1px solid #ccc !important;
            }

            .post-info-mobile {
              border-bottom: 1px solid #ccc;
              background-color: #ddd;
            }
  
            .post-menu-button-mobile {
              color: #f60 !important;
            }
  
            .name-mobile {
              color: #004a99;
              font-weight: 700;
            }

            .capcode {
              color: #f60 !important;
                cursor: pointer;
              }

              .capcode-admin {
                color: #f60 !important;
                cursor: pointer;
              }
  
            .subject-mobile {
              color: #111;
              font-weight: 700;
            }
  
            .date-time-mobile {
              color: #333;

              a {
                text-decoration: none;
                color: #333;
              }
            }
  
            .file-thumb-mobile {
              color: #f60 !important;
            }
  
            .file-info-mobile {
              color: #707070;
              font-size: 9pt !important;
            }
  
            blockquote {
              font-size: 11pt;
            }
  
            .post-link-mobile {
              background-color: #ddd;
              border-top: 1px solid #ccc;
            }
  
            .info-mobile {
              color: #333;
            }
  
            .button-mobile {
              background: linear-gradient(to bottom, rgba(238, 238, 238, 1) 0%, rgba(224, 224, 224, 1) 100%);
              border: 1px solid #ccc;
              color: #333;
              border-radius: 3px 3px 3px 3px;
              font-weight: 700;
              padding: 6px 10px 5px;
              background-repeat: repeat-x;
              cursor: pointer;
            }

            .reply-container {
              background-color: #eee;

              .post-reply {
                background-color: #eee;
                border: 1px solid #ccc;
              }

              .post-info-mobile {
                border-bottom: 1px solid #ccc;
                background-color: #ddd;

                .post-menu-button-mobile {
                  color: #f60 !important;
                }

                .name-mobile {
                  color: #004a99;
                  font-weight: 700;
                }

                .date-time-mobile {
                  color: #333;

                  a {
                    color: #333;
                  }
                }
              }

              blockquote {
                font-size: 11pt;
              }

              .quotelink-mobile {
                color: #f60;
                text-decoration: underline;
              }

              .quotelink-mobile:hover {
                color: #ff3300;
              }

              p:first-of-type::before {
                color: #789922;
              }
            }
          }`;

        default:
          return '';
      }
    }}
  }
`;

export const Footer = styled.div`
  #version {
    text-align: center;
    font-size: 11px;
    font-family: 'arial';
  }
  @media (min-width: 480px) {
    #break {
      display: none;
    }

    hr {
      margin-top: -10px;
    }

    #version {
      margin-top: 15px;
    }
  }

  @media (max-width: 480px) {
    margin-top: 60px;

    .style-changer {
      display: none;
    }

    #version {
      margin-top: -2em;
    }
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `
        .footer-links {
          a {
            color: #00e;
            text-decoration: none;
          }

          a:hover {
            color: red;
          }
        }`;

      case 'Yotsuba-B':
        return `
        .footer-links {
          a {
            color: #34345c;
            text-decoration: none;
          }

          a:hover {
            color: #d00;
          }
        }`;

      case 'Futaba':
        return `
        .footer-links {
          a {
            color: #00e;
            text-decoration: underline;
          }

          a:hover {
            color: red;
          }
        }`;

      case 'Burichan':
        return `
        .footer-links {
          a {
            color: #34345c;
            text-decoration: underline;
          }

          a:hover {
            color: #d00;
          }
        }`;

      case 'Tomorrow':
        return `
        .footer-links {
          a {
            color: #81a2be;
            text-decoration: none;
          }

          a:hover {
            color: #5f89ac;
          }
        }
        #style-selector {
          background-color: #282a2e;
          color: #c5c8c6;
          border: 1px solid #373b41;
        }`;

      case 'Photon':
        return `
        .footer-links {
          a {
            color: #f60;
            text-decoration: none;
          }

          a:hover {
            color: #f30;
          }
        }`;

      default:
        return '';
    }
  }}
`;
