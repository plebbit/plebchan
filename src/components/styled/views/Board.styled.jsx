import styled from 'styled-components';

export const Container = styled.div`
  font-size: 10pt;
  margin-left: 0;
  margin-right: 0;
  margin-top: 5px;
  padding-left: 5px;
  padding-right: 5px;

  .footer-links {
    text-decoration: none;
  }
`;

export const NavBar = styled.div`
  @media (min-width: 480px) {
    .board-select,
    .page-jump {
      display: none;
    }

    .nav {
      float: right;
    }

    #separator-mobile {
      display: none;
    }

    #board-nav-mobile {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .boardList,
    .nav {
      display: none;
    }

    #board-nav-mobile {
      padding: 2px 4px;
      background-color: #d6daf0;
      overflow: hidden;
      border-bottom: 2px solid #b7c5d9;
      position: fixed;
      top: 0;
      width: 100%;
      font-size: x-small;
      left: 0;
      right: 0;
      z-index: 9001;
      display: block !important;
      clear: left !important;
      transition: top 0.3s ease-in-out;
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    strong {
      padding-right: 5px;
    }

    #board-select-mobile {
      font-size: x-small;
    }

    .page-jump {
      float: right;
      padding-right: 5px;
      font-size: 7.5pt;
    }

    .page-jump a {
      text-decoration: none;
      padding-right: 5px;
    }
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `font-size: 9pt;
      color: #b86;
      
      a, #button-span {
        font-weight: 400 !important;
        padding: 1px !important;
        text-decoration: none !important;
        color: maroon !important;
      }

      a:hover, #button-span:hover {
        color: red !important;
      }
      
      #board-nav-mobile {
        background-color: #f0e0d6;
        border-bottom: 2px solid #d9c5b7;
      }

      strong {
        color: maroon;
      }

      .page-jump a {
        color: navy;
      }`;

      case 'Yotsuba-B':
        return `font-size: 9pt;
      color: #89a;
      
      a, #button-span {
        font-weight: 400 !important;
        padding: 1px !important;
        text-decoration: none !important;
        color: #34345c !important;
      }

      a:hover, #button-span:hover {
        color: #d00 !important;
      }
      
      strong {
        color: #000;
      }`;

      case 'Futaba':
        return `font-size: 11pt;
        
        a, a:visited, #button-span {
          font-weight: 400 !important;
          padding: 1px !important;
          color: #00e !important;
          text-decoration: underline !important;
        }

        a:hover, #button-span:hover {
          color: red !important;
        }
      
        #board-nav-mobile {
          background-color: #f0e0d6;
          border-bottom: 2px solid #d9c5b7;
          font: 10px arial, helvetica, sans-serif;
          font-style: normal;
        }

        strong {
          color: maroon;
        }`;

      case 'Burichan':
        return `font-size: 11pt;
        
        a, a:visited, #button-span {
          font-weight: 400 !important;
          padding: 1px !important;
          color: #34345c !important;
          text-decoration: underline !important;
        }

        a:hover, #button-span:hover {
          color: #d00 !important;
        }
      
        #board-nav-mobile {
          background-color: #d6daf0;
          border-bottom: 2px solid #b7c5d9;
          font: 10px arial, helvetica, sans-serif;
          font-style: normal;
        }`;

      case 'Tomorrow':
        return `font-size: 9pt;
        color: #c5c8c6;
        
        a, a:visited, #button-span {
          font-weight: 400 !important;
          padding: 1px !important;
          text-decoration: none !important;
          color: #81a2be !important;
        }

        a:hover, #button-span:hover {
          color: #5f89ab !important;
        }

        #board-nav-mobile {
          background-color: #1d1f21;
          border-bottom: 2px solid #282a2e;
        }
        
        #board-select-mobile {
          background-color: #282a2e;
          color: #c5c8c6;
          border: 1px solid #373b41;
        }`;

      case 'Photon':
        return `font-size: 9pt;
        color: #333;
        
        a, a:visited, #button-span {
          font-weight: 400 !important;
          padding: 1px !important;
          text-decoration: none !important;
          color: #f60 !important;
        }

        a:hover, #button-span:hover {
          color: #ff3300 !important;
        }

        #board-nav-mobile {
          background-color: #ddd;
          border-bottom: 2px solid #ccc;
        }`;

      default:
        return '';
    }
  }}
`;

export const Header = styled.div`
  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `text-align: center;
        clear: both;

        .banner {
          border: 1px solid #800;
          margin: 5px auto;
          width: 300px;
          height: 100px;
          
          img {
            border: none;
            width: 300px;
            height: 100px;
          }
        }


        .board-title {
          font-family: Tahoma, sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -2px;
          margin-top: 0;
          color: maroon;
        }

        .board-address {
          font-size: 9pt;
          margin-top: 5px;
          font-size: 9pt;
        }`;

      case 'Yotsuba-B':
        return `text-align: center;
        clear: both;

        .banner {
          border: 1px solid #34345c;
          margin: 5px auto;
          width: 300px;
          height: 100px;
          
          img {
            border: none;
            width: 300px;
            height: 100px;
          }
        }


        .board-title {
          font-family: Tahoma, sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -2px;
          margin-top: 0;
          color: #af0a0f;
        }

        .board-address {
          font-size: 9pt;
          margin-top: 5px;
          font-size: 9pt;
        }`;

      case 'Futaba':
        return `text-align: center;
        clear: both;

        .banner {
          margin: 5px auto;
          width: 300px;
          height: 100px;
          
          img {
            border: none;
            width: 300px;
            height: 100px;
          }
        }


        .board-title {
          font-size: 24pt;
          font-weight: 700;
          margin-top: 0;
          color: #af0a0f;
        }

        .board-address {
          color: #af0a0f;
          margin-top: 5px;
          font-size: 10pt;
        }`;

      case 'Burichan':
        return `text-align: center;
        clear: both;

        .banner {
          margin: 5px auto;
          width: 300px;
          height: 100px;
          
          img {
            border: none;
            width: 300px;
            height: 100px;
          }
        }


        .board-title {
          font-size: 24pt;
          font-weight: 700;
          margin-top: 0;
          color: #af0a0f;
        }

        .board-address {
          margin-top: 5px;
          font-size: 10pt;
        }`;

      case 'Tomorrow':
        return `text-align: center;
        clear: both;

        .banner {
          border: 1px solid #000;
          margin: 5px auto;
          width: 300px;
          height: 100px;
          max-width: 100%;

          img {
            border: none;
            width: 300px;
            height: 100px;
          }
        }

        .board-title {
          font-family: Tahoma, sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -2px;
          margin-top: 0;
        }

        .board-address {
          font-size: 9pt;
          margin-top: 5px;
          font-size: 9pt;
        }`;

      case 'Photon':
        return `text-align: center;
        clear: both;

        .banner {
          border: 1px solid #000;
          margin: 5px auto;
          width: 300px;
          height: 100px;
          
          img {
            border: none;
            width: 300px;
            height: 100px;
          }
        }


        .board-title {
          font-family: Tahoma, sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -2px;
          margin-top: 0;
          color: #004a99;
        }

        .board-address {
          font-size: 9pt;
          margin-top: 5px;
          font-size: 9pt;
        }`;

      default:
        return '';
    }
  }}

  .offline {
    width: 16px;
    position: relative;
    margin: 3px 0 -3px 3px;
  }
`;

export const Break = styled.hr`
  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `width: 90%;
        border: none;
        border-top: 1px solid #d9bfb7;
        height: 0;`;

      case 'Yotsuba-B':
        return `width: 90%;
        border: none;
        border-top: 1px solid #b7c5d9;
        height: 0;`;

      case 'Futaba':
        return `width: 90%;`;

      case 'Burichan':
        return `width: 90%;`;

      case 'Tomorrow':
        return `width: 90%;
        border: none;
        border-top: 1px solid #282a2e;
        height: 0;`;

      case 'Photon':
        return `width: 90%;
        border: none;
        border-top: 1px solid #ddd;
        height: 0;`;

      default:
        return '';
    }
  }}
`;

export const PostFormLink = styled.div`
  @media (min-width: 480px) {
    display: ${(props) => (props.showPostFormLink ? 'block' : 'none')};

    #post-form-link-mobile {
      display: none;
    }
  }

  @media (max-width: 480px) {
    display: ${(props) => (props.showPostFormLink ? 'block' : 'none')};
    line-height: 30px;

    #post-form-link-desktop {
      display: none;
    }

    #post-form-link-mobile {
      margin: 11px 0;
      font-size: 10pt;
      text-align: center;
      font-weight: 700;
      display: block !important;
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

        .btn-wrap a, .btn-wrap span {
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

        .btn-wrap a, .btn-wrap span {
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

        .btn-wrap a, .btn-wrap span {
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

        .btn-wrap a, .btn-wrap span {
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

        .btn-wrap a, .btn-wrap span {
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

        .btn-wrap a, .btn-wrap span {
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

export const PostFormTable = styled.table`
  display: ${(props) => (props.showPostForm ? 'table' : 'none')};
  width: 418px;
  border-spacing: 1px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `tbody > tr > td:first-child {
        background-color: #ea8;
        color: #800;
        font-weight: 700;
        border: 1px solid #800;
        padding: 0 5px;
        font-size: 10pt;
      }

      td {
        padding: 0;
        font-size: 10pt;
      }
      
      tbody > tr > td > input[type="text"] {
        width: 244px;
      }
      
      input[type="text"], input[type="password"] > tbody textarea {
        margin: 0;
        margin-right: 2px;
        padding: 2px 4px 3px;
        border: 1px solid #aaa;
        outline: none;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      textarea {
        width: 292px;
        margin-bottom: 0;
        outline: none;
        border-radius: none;
        margin-top: 0px;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 0;
        width: 300px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
        margin-left: 1px;
        padding: 0px 2px;
        font-family: monospace;
        vertical-align: middle;
        -webkit-appearance: none;
      }

      #t-cnt {
        height: 80px;
        margin-top: 2px;
        position: relative;

        img {
          height: 100%;
          width: 100%
        }
      }`;

      case 'Yotsuba-B':
        return `tbody > tr > td:first-child {
        background-color: #98e;
        color: #000;
        font-weight: 700;
        border: 1px solid #000;
        padding: 0 5px;
        font-size: 10pt;
      }

      td {
        padding: 0;
        font-size: 10pt;
      }
      
      tbody > tr > td > input[type="text"] {
        width: 244px;
      }
      
      input[type="text"], input[type="password"] > tbody textarea {
        margin: 0;
        margin-right: 2px;
        padding: 2px 4px 3px;
        border: 1px solid #aaa;
        outline: none;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      textarea {
        width: 292px;
        margin-bottom: 0;
        outline: none;
        border-radius: none;
        margin-top: 0px;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 0;
        margin-bottom: 0px;
        width: 300px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
        margin-left: 1px;
        padding: 0px 2px;
        font-family: monospace;
        vertical-align: middle;
        -webkit-appearance: none;
      }

      #t-help {
        font-size: 11px;
        padding: 0;
        width: 20px;
        box-sizing: border-box;
        margin: 0px 0px 0px 6px;
        vertical-align: middle;
        height: 18px;
      }

      #t-cnt {
        height: 80px;
        margin-top: 2px;
        position: relative;

        img {
          height: 100%;
          width: 100%
        }
      }`;

      case 'Futaba':
        return `tbody > tr > td:first-child {
        background-color: #ea8;
        color: #800;
        font-weight: 700;
        padding: 0;
      }

      td {
        padding: 0;
        font-size: 12pt;
      }
      
      tbody > tr > td > input[type="text"] {
        width: 244px;
      }
      
      input[type="text"], input[type="password"] > tbody textarea {
        margin: 0;
        margin-right: 2px;
        padding: 2px 4px 3px;
        border: 1px solid #aaa;
        outline: none;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      textarea {
        width: 292px;
        margin-bottom: 0;
        outline: none;
        border-radius: none;
        margin-top: 0px;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 0;
        width: 300px;
        margin-bottom: 0px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
        margin-left: 1px;
        margin-bottom: 1px;
        padding: 0px 2px;
        font-family: monospace;
        vertical-align: middle;
        -webkit-appearance: none;
      }

      #t-help {
        font-size: 11px;
        padding: 0;
        width: 20px;
        box-sizing: border-box;
        margin: 0px 0px 0px 6px;
        vertical-align: middle;
        height: 18px;
      }

      #t-cnt {
        height: 80px;
        margin-top: 2px;
        position: relative;

        img {
          height: 100%;
          width: 100%
        }
      }`;

      case 'Burichan':
        return `tbody > tr > td:first-child {
        background-color: #98e;
        color: #000;
        font-weight: 700;
        padding: 0;
        font-size: 12pt;
      }

      td {
        padding: 0;
      }
      
      tbody > tr > td > input[type="text"] {
        width: 244px;
      }
      
      input[type="text"], input[type="password"] > tbody textarea {
        margin: 0;
        margin-right: 2px;
        padding: 2px 4px 3px;
        border: 1px solid #aaa;
        outline: none;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      textarea {
        width: 292px;
        margin-bottom: 0;
        outline: none;
        border-radius: none;
        margin-top: 0px;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 0;
        width: 300px;
        margin-bottom: 0px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
        margin-left: 1px;
        margin-top: 1px;
        padding: 0px 2px;
        font-family: monospace;
        vertical-align: middle;
        -webkit-appearance: none;
      }

      #t-help {
        font-size: 11px;
        padding: 0;
        width: 20px;
        box-sizing: border-box;
        margin: 0px 0px 0px 6px;
        vertical-align: middle;
        height: 18px;
      }

      #t-cnt {
        height: 80px;
        margin-top: 2px;
        position: relative;

        img {
          height: 100%;
          width: 100%
        }
      }`;

      case 'Tomorrow':
        return `tbody > tr > td:first-child {
        background-color: #282a2e;
        color: #c5c8c6;
        font-weight: 700;
        border: 1px solid #111;
        padding: 0 5px;
        font-size: 10pt;
      }

      td {
        padding: 0;
        font-size: 10pt;
      }
      
      tbody > tr > td > input[type="text"] {
        width: 244px;
      }
      
      input[type="text"], input[type="password"] > tbody textarea {
        margin: 0;
        margin-right: 2px;
        padding: 2px 4px 3px;
        border: 1px solid #000;
        background-color: #282a2e;
        color: #c5c8c6;
        outline: none;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      textarea {
        width: 292px;
        margin-bottom: 0;
        outline: none;
        border-radius: none;
        border: 1px solid #000;
        background-color: #282a2e;
        color: #c5c8c6;
        margin-top: 0px;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #2d2d2d;
        border: 1px solid #777;
        margin: 0;
        width: 300px;
        margin-bottom: 0px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
        margin-left: 1px;
        padding: 0px 2px;
        font-family: monospace;
        vertical-align: middle;
        -webkit-appearance: none;
      }

      #t-help {
        font-size: 11px;
        padding: 0;
        width: 20px;
        box-sizing: border-box;
        margin: 0px 0px 0px 6px;
        vertical-align: middle;
        height: 18px;
      }

      #t-cnt {
        height: 80px;
        margin-top: 2px;
        position: relative;

        img {
          height: 100%;
          width: 100%
        }
      }

      #post-button, button {
        filter: brightness(80%);
      }`;

      case 'Photon':
        return `tbody > tr > td:first-child {
        background-color: #ddd;
        color: #333;
        font-weight: 700;
        border: 1px solid #ccc;
        padding: 0 5px;
        font-size: 10pt;
      }

      td {
        padding: 0;
        font-size: 10pt;
      }
      
      tbody > tr > td > input[type="text"] {
        width: 244px;
      }
      
      input[type="text"], input[type="password"] > tbody textarea {
        margin: 0;
        margin-right: 2px;
        padding: 2px 4px 3px;
        border: 1px solid #aaa;
        outline: none;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      textarea {
        width: 292px;
        margin-bottom: 0;
        outline: none;
        border-radius: none;
        margin-top: 0px;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 0;
        width: 300px;
        margin-bottom: 0px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
        margin-left: 1px;
        padding: 0px 2px;
        font-family: monospace;
        vertical-align: middle;
        -webkit-appearance: none;
      }

      #t-help {
        font-size: 11px;
        padding: 0;
        width: 20px;
        box-sizing: border-box;
        margin: 0px 0px 0px 6px;
        vertical-align: middle;
        height: 18px;
      }

      #t-cnt {
        height: 80px;
        margin-top: 2px;
        position: relative;

        img {
          height: 100%;
          width: 100%
        }
      }`;

      default:
        return '';
    }
  }}

  #t-help {
    margin: 0;
    margin-top: -5px;
  }
`;

export const PostForm = styled.div`
  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `#post-form-link {
        font-size: 22px;
        font-weight: 700;
        text-align: center;
      }

      a, a:visited {
        color: #00e;
        text-decoration: none;
      }
      a:hover {
        color: red;
      }`;

      case 'Yotsuba-B':
        return `#post-form-link {
        font-size: 22px;
        font-weight: 700;
        text-align: center;
      }

      a, a:visited {
        color: #34345c;
        text-decoration: none;
      }
      a:hover {
        color: #d00;
      }`;

      case 'Futaba':
        return `#post-form-link {
        font-size: 22px;
        font-weight: 700;
        text-align: center;
      }

      a, a:visited {
        color: #00e;
        text-decoration: underline;
      }
      a:hover {
        color: red;
      }`;

      case 'Burichan':
        return `#post-form-link {
        font-size: 22px;
        font-weight: 700;
        text-align: center;
      }

      a, a:visited {
        color: #34345c;
        text-decoration: underline;
      }
      a:hover {
        color: red;
      }`;

      case 'Tomorrow':
        return `#post-form-link {
        font-size: 22px;
        font-weight: 700;
        text-align: center;
      }

      a, a:visited {
        color: #81a2be;
        text-decoration: none;
      }
      a:hover {
        color: #5f89ab;
      }`;

      case 'Photon':
        return `#post-form-link {
        font-size: 22px;
        font-weight: 700;
        text-align: center;
      }

      a, a:visited {
        color: #f60;
        text-decoration: none;
      }
      a:hover {
        color: #ff3300;
      }`;

      default:
        return '';
    }
  }}
`;

export const TopBar = styled.div`
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
          margin-right: 10px;
          font-size: 10pt;
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
          margin-right: 10px;
          font-size: 10pt;
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
        font-size: 12pt;
        
        hr {
          clear: both;
        }

        .style-changer {
          margin-left: 5px;
          margin-right: 10px;
          font-size: 12pt;
        }
        
        a, #subscribe {
          color: #00e !important;
          text-decoration: underline;
        }
        
        a:hover, #subscribe:hover {
          color: red !important;
        }`;

      case 'Burichan':
        return `clear: both;
        font-size: 12pt;

        hr {
          clear: both;
        }

        .style-changer {
          margin-left: 5px;
          margin-right: 10px;
          font-size: 12pt;
        }
        
        a, #subscribe{
          color: #34345c !important;
          text-decoration: underline;
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
          margin-right: 10px;
          font-size: 10pt;
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
          margin-right: 10px;
          font-size: 10pt;
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
    .stats-all-container {
      float: right;
      margin-top: 5px;
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

    #catalog-button-mobile {
      display: none;
    }

    #catalog-button-desktop {
      display: inline-block;
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
    line-height: 25px;

    .stats-all-container {
      height: 20px;
      position: absolute;
      margin-top: 13px;
      text-align: left;
      overflow: hidden;
      width: 100vw;
    }

    #stats-all {
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

    hr {
      display: none;
    }

    #catalog-button-desktop {
      display: none;
    }

    #catalog-button-mobile {
      position: absolute;
      left: 50%;
      display: inline-block;
      transform: translateX(-50%);
      font-size: 10pt;
    }

    .subscribe-button-desktop {
      display: none;
    }

    .subscribe-button-mobile {
      margin-right: 10px;
      margin-top: 1px;
      position: absolute;
      right: 0;
      font-size: 13.3333px !important;

      a {
        cursor: pointer;
      }
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
          font-size: 10pt !important;
        }

        .btn-wrap a, .btn-wrap span {
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

        .btn-wrap a, .btn-wrap span {
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

        

        .btn-wrap a, .btn-wrap span {
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
          margin-top: 0px !important;
        }

        .btn-wrap a, .btn-wrap span {
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

        .btn-wrap a, .btn-wrap span {
          text-decoration: none;
          border: none;
          color: #707070 !important;
          white-space: nowrap;
        }
        
        #style-selector {
          background-color: #282a2e;
          color: #c5c8c6;
          border: 1px solid #373b41;
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

        .btn-wrap a, .btn-wrap span {
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
    margin-bottom: 130px;

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

    .offline-sub {
      width: 16px;
      margin: -5px -4px -2px 3px;
      position: relative;
    }

    .offline-reply {
      width: 16px;
      margin: -5px -4px -2px 3px;
      position: relative;
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
        border-right: 1px solid #d9bfb7;
        border-bottom: 2px solid #d9bfb7;

        li {
          border: 1px solid #d9bfb7;
          border-bottom: none;
          background-color: #f0e0d6;

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
        border-right: 1px solid #b7c5d9;
        border-bottom: 2px solid #b7c5d9;
        
        li {
          border: 1px solid #b7c5d9;
          border-bottom: none;
          background-color: #d6daf0;

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
        border: 1px solid #d9bfb7;
        border-bottom: none;
        
        li {
          background-color: #f0e0d6;
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
        border: 1px solid #b7c5d9;
        border-bottom: none;
        
        li {
          background-color: #d6daf0;
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
        border: 1px solid #000;
        border-bottom: none;

        li {
          background-color: #282a2e;
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
        border: 1px solid #ccc;
        border-bottom: none;

        li {
          background-color: #ddd;
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
      background-color: rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .reply-file-text {
      max-width: 600px;
      white-space: nowrap;
      margin-left: 5px;
    }

    .file-thumb-reply,
    .file-thumb-mobile {
      display: flex;
      justify-content: center;
      align-items: center;
      float: left;
    }

    .file-thumb-reply {
      margin: 3px 20px 5px 20px;
    }

    .file-thumb img,
    .file-thumb video,
    .file-thumb audio {
      border: none;
      max-width: 250px;
      max-height: 250px;
      margin: 0;
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
    padding-bottom: 25px;

    hr {
      padding-top: 25px;
    }

    .op-container {
      display: block;
      overflow: hidden;

      .op {
        display: inline;
        overflow: hidden;
      }

      .post-info-mobile {
        overflow: hidden;
        display: block;
        clear: left;
        padding: 5px;
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
          padding-left: 10px !important;
          padding-right: 10px !important;
          text-decoration: none;
          float: left;
          padding-bottom: 5% !important;
          padding-top: 15px !important;
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

      #video-thumbnail-mobile {
        width: 100px;
      }

      img {
        border: none;
        float: left;
        max-width: 100px;
        max-height: 100px;
        object-fit: scale-down;
        margin: 0;
      }

      .thread-icons-mobile {
        image-rendering: pixelated;
      }

      blockquote {
        display: block;
        margin: 0;
        padding: 10px;
      }

      .post-link-mobile {
        clear: both !important;
        padding: 5px;
        overflow: hidden;
        /* margin: -5px; */
        display: block !important;
      }

      .info-mobile {
        padding-top: 8px;
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
      padding: 7px 7px 0 7px;
      background-color: inherit;

      .button-mobile {
        float: right;
        border-radius: 3px;
        padding: 6px 10px 5px;
        user-select: none;
        text-decoration: none;
      }

      video {
        width: 100%;
        height: auto;
      }

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
          padding-left: 10px !important;
          padding-right: 10px !important;
          text-decoration: none;
          float: left;
          padding-top: 15px;
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

          a,
          #reply-button {
            text-decoration: none;
          }
        }
      }

      blockquote {
        display: block;
        margin: 0;
        padding: 10px;
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
        display: grid;
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

      .post-number {
        color: maroon;

        a, #reply-button {
          text-decoration: none;
          color: maroon;
        }
      }

      #reply-button:hover {
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
        display: grid;
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

      .post-number {
        color: #000;

        a, #reply-button {
          text-decoration: none;
          color: #000;
        }
      }

      #reply-button:hover {
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
        display: grid;
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

      .post-number {
        color: maroon;

        a, #reply-button {
          text-decoration: none;
          color: maroon;
        }
      }

      #reply-button:hover {
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
        display: grid;
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

      .post-number {
        color: #000;

        a, #reply-button {
          text-decoration: none;
          color: #000;
        }
      }

      #reply-button:hover {
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
      }

      hr {
        clear: both;
      }`;

      case 'Tomorrow':
        return `.thread {
        margin: 0;
        clear: both;
      }

      .file-thumb {
        background-color: rgba(255, 255, 255, 0.01) !important;
      }

      .op-container {
        display: grid;
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

      .post-number {
        color: #c5c8c6;

        a, #reply-button {
          text-decoration: none;
          color: #c5c8c6;
        }
      }

      #reply-button:hover {
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
        display: grid;
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

      .post-number {
        color: #333;

        a, #reply-button {
          text-decoration: none;
          color: #333;
        }
      }

      #reply-button:hover {
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
    margin-bottom: 335px;
    margin-left: -5px;
    margin-right: -5px;

    .offline-mobile-sub {
      width: 16px;
      margin-right: 5px;
    }

    .offline-mobile-sub-reply {
      width: 16px;
    }

    .thread {
      display: none;
    }

    .name-block {
      display: block;
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
            .capcode {
              color: purple !important;
              cursor: pointer;
            }

            .capcode-admin {
              color: red !important;
              cursor: pointer;
            }
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
    
              .subject-mobile {
                color: #cc1105;
                font-weight: 700;
              }
    
              .date-time-mobile {
                color: maroon;

                a, #reply-button {
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

                  a, #reply-button {
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
          .capcode {
            color: purple !important;
            cursor: pointer;
          }

          .capcode-admin {
            color: red !important;
            cursor: pointer;
          }
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
    
              .subject-mobile {
                color: #0f0c5d;
                font-weight: 700;
              }
    
              .date-time-mobile {
                color: #000;

                a, #reply-button {
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

                  a, #reply-button {
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
          .capcode {
            color: purple !important;
            cursor: pointer;
          }

          .capcode-admin {
            color: red !important;
            cursor: pointer;
          }
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
    
              .subject-mobile {
                color: #cc1105;
                font-weight: 700;
              }
    
              .date-time-mobile {
                color: maroon;

                a, #reply-button {
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

                  a, #reply-button {
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
          .capcode {
            color: purple !important;
            cursor: pointer;
          }

          .capcode-admin {
            color: red !important;
            cursor: pointer;
          }
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
    
              .subject-mobile {
                color: #0f0c5d;
                font-weight: 700;
              }
    
              .date-time-mobile {
                color: #000;

                a, #reply-button {
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

                  a, #reply-button {
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
          .capcode {
            color: #81a2be !important;
            cursor: pointer;
          }

          .capcode-admin {
            color: #81a2be !important;
            cursor: pointer;
          }

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

              .poster-address-mobile {
                color: #707070;
              }
    
              .subject-mobile {
                color: #B294BB;
                font-weight: 700;
              }
    
              .date-time-mobile {
                color: #707070;

                a, #reply-button {
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

                  a, #reply-button {
                    color: #707070;
                  }
                }
              }

              blockquote {
                font-size: 11pt;
              }

              .quotelink-mobile {
                color: #81A2BE;
                text-decoration: underline;
              }

              .quotelink-mobile:hover {
                color: #5F89AC;
              }

              p:first-of-type::before {
                color: #b5bd68;
              }
            }
          }`;

        case 'Photon':
          return `
          .capcode {
            color: #f60 !important;
            cursor: pointer;
          }

          .capcode-admin {
            color: #f60 !important;
            cursor: pointer;
          }
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
  
            .subject-mobile {
              color: #111;
              font-weight: 700;
            }
  
            .date-time-mobile {
              color: #333;

              a, #reply-button {
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

                  a, #reply-button {
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

export const PostMenu = styled.div`
  display: inline-block;
  cursor: pointer;
  transition: transform 0.1s;
  transform: ${(props) => (props.rotated ? 'rotate(90deg)' : 'none')};
`;

export const PostMenuMobile = styled.div`
  font-size: 16px;
  line-height: 2.5em;
  width: 216px;

  ul {
    border-right-width: 2px !important;
    list-style: none;
    padding: 0;
    margin: 0;
    white-space: nowrap;
  }

  li {
    cursor: pointer;
    position: relative;
    padding: 2px 4px;
    vertical-align: middle;
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `
          ul {
            border: 1px solid #d9bfb7;
          }

          li {
            background-color: #f0e0d6;
            border-bottom: 1px solid #d9bfb7;

            :hover {
              background-color: #ffe;
              color: #d00;
            }
          }
          `;

      case 'Yotsuba-B':
        return `
          ul {
            border: 1px solid #b7c5d9;
          }

          li {
            background-color: #d6daf0;
            border-bottom: 1px solid #b7c5d9;

            :hover {
              background-color: #eef2ff;
              color: #d00;
            }
          }
          `;

      case 'Futaba':
        return `
          ul {
            border: 1px solid #d9bfb7;
          }

          li {
            background-color: #f0e0d6;
            border-bottom: 1px solid #d9bfb7;

            :hover {
              background-color: #ffe;
              color: #d00;
            }
          }
          `;

      case 'Burichan':
        return `
          ul {
            border: 1px solid #b7c5d9;
          }

          li {
            background-color: #d6daf0;
            border-bottom: 1px solid #b7c5d9;

            :hover {
              background-color: #eef2ff;
              color: #d00;
            }
          }
          `;

      case 'Tomorrow':
        return `
          ul {
            border: 1px solid #282a2e;
          }

          li {
            background-color: #1d1f21;
            border-bottom: 1px solid #282a2e;

            :hover {
              background-color: #1b1c1e;
            }
          }
          `;

      case 'Photon':
        return `
          ul {
            border: 1px solid #ccc;
          }

          li {
            background-color: #ddd;
            border-bottom: 1px solid #ccc;

            :hover {
              background-color: #eee;
            }
          }
          `;

      default:
        return '';
    }
  }}
`;
