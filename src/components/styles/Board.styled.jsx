import styled from 'styled-components';

export const Container = styled.div`
  font-size: 10pt;
  margin-left: 0;
  margin-right: 0;
  margin-top: 5px;
  padding-left: 5px;
  padding-right: 5px;
`;

export const NavBar = styled.div`
  @media (min-width: 480px) {
    .board-select, .page-jump {
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
    .boardList, .nav {
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

    .board-select {
      float: left;
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
      padding-top: 2.5px;
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
      
      a {
        font-weight: 400;
        padding: 1px;
        text-decoration: none;
        color: maroon;
      }

      a:hover {
        color: red;
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
      
      a {
        font-weight: 400;
        padding: 1px;
        text-decoration: none;
        color: #34345c;
      }

      a:hover {
        color: #d00;
      }
      
      strong {
        color: #000;
      }`;

      case 'Futaba':
        return `font-size: 11pt;
        
        a, a:visited {
          font-weight: 400;
          padding: 1px;
          color: #00e;
          text-decoration: underline;
        }

        a:hover {
          color: red;
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
        
        a, a:visited {
          font-weight: 400;
          padding: 1px;
          color: #34345c;
          text-decoration: underline;
        }

        a:hover {
          color: #d00;
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
        
        a, a:visited {
          font-weight: 400;
          padding: 1px;
          text-decoration: none;
          color: #81a2be;
        }

        a:hover {
          color: #5f89ab;
        }

        #board-nav-mobile {
          background-color: #1d1f21;
          border-bottom: 2px solid #282a2e;
        }
        
        #board-select-mobile {
          background-color: #282a2e;
          color: #c5c8c6;
          border: 1px solid #373b41;
        }`;

      case 'Photon':
        return `font-size: 9pt;
        color: #333;
        
        a, a:visited {
          font-weight: 400;
          padding: 1px;
          text-decoration: none;
          color: #f60;
        }

        a:hover {
          color: #ff3300;
        }

        #board-nav-mobile {
          background-color: #ddd;
          border-bottom: 2px solid #ccc;
        }`;
  }
  }}`;

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
        }

        img {
          border: none;
          width: 300px;
          height: 100px;
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
          border: 1px solid #800;
          margin: 5px auto;
          width: 300px;
          height: 100px;
        }

        img {
          border: none;
          width: 300px;
          height: 100px;
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
        }

        img {
          border: none;
          width: 300px;
          height: 100px;
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
        }

        img {
          border: none;
          width: 300px;
          height: 100px;
        }

        .board-title {
          font-size: 24pt;
          font-weight: 700;
          margin-top: 0;
          color: #af0a0f;
        }

        .board-address {
          margin-top: 5px;
          font-size: 11pt;
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
        }

        img {
          border: none;
          width: 300px;
          height: 100px;
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
        }

        img {
          border: none;
          width: 300px;
          height: 100px;
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
    }
  }}
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
    }
  }}
`;

export const PostFormLink = styled.div`
  @media (min-width: 480px) {
    display: ${props => (props.showPostFormLink ? 'block' : 'none')};

    #post-form-link-mobile {
      display: none;
    }
  }

  @media (max-width: 480px) {
    display: ${props => (props.showPostFormLink ? 'block' : 'none')};
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

export const PostFormTable = styled.table`
  display: ${props => (props.showPostForm ? 'table' : 'none')};
  width: 418px;
  border-spacing: 1px;
  margin-left: auto;
  margin-right: auto;

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
    }
  }}

  #t-help {
    margin: 0;
    margin-top: -5px
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
        
        a {
          color: #00e;
          text-decoration: none;
        }
        
        a:hover {
          color: red;
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
        
        a {
          color: #34345c;
          text-decoration: none;
        }
        
        a:hover {
          color: #d00;
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
        
        a {
          color: #00e;
          text-decoration: underline;
        }
        
        a:hover {
          color: red;
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
        
        a {
          color: #34345c;
          text-decoration: underline;
        }
        
        a:hover {
          color: red;
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
        
        a {
          color: #81a2be;
          text-decoration: none;
        }
        
        a:hover {
          color: #5f89ab;
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
        
        a {
          color: #f60;
          text-decoration: none;
        }
        
        a:hover {
          color: #ff3300;
        }`;
      
    }
  }}

  @media (min-width: 480px) {
    #catalog-button-mobile {
      display: none;
    }

    #catalog-button-desktop {
      display: inline-block;
    }
  }

  @media (max-width: 480px) {
    line-height: 25px;

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

        .btn-wrap a {
          text-decoration: none;
          border: none;
          color: #333 !important;
          white-space: nowrap;
        }`;
      }
    }}
`;

export const BoardForm = styled.div`
  @media (min-width: 480px) {
    .thread-mobile {
      display: none;
    }

    .post-info {
      margin: 5px;
      display: block;
      width: 100%;
    }

    #bottombar-mobile {
      display: none;
    }

    .summary {
      margin-top: 10px;
    }
  }

  @media (max-width: 480px) {
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
          return `
            .op-container {
              background-color: #f5e9e1;
              border: 1px solid #d9bfb7 !important;

              .post-info-mobile {
                border-bottom: 1px solid #d9bfb7;
                background-color: #ead6ca;
              }
    
              .post-menu-button-mobile {
                color: #00e;
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
                background-image: url(/assets/buttonfade.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }
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
                  color: #00e;
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
                  content: '>';
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

              .post-info-mobile {
                border-bottom: 1px solid #b7c5d9;
                background-color: #c9cde8;
              }
    
              .post-menu-button-mobile {
                color: #34345c;
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
                background-image: url(/assets/buttonfade-blue.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }
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
                  color: #34345c;
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
                  content: '>';
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

              .post-info-mobile {
                border-bottom: 1px solid #d9bfb7;
                background-color: #ead6ca;
              }
    
              .post-menu-button-mobile {
                color: #00e;
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
                background-image: url(/assets/buttonfade.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }
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
                  color: #00e;
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
                  content: '>';
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

              .post-info-mobile {
                border-bottom: 1px solid #b7c5d9;
                background-color: #c9cde8;
              }
    
              .post-menu-button-mobile {
                color: #34345c;
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
                background-image: url(/assets/buttonfade-blue.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }
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
                  color: #34345c;
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
                  content: '>';
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

              .post-info-mobile {
                border-bottom: 1px solid #2D2F33;
                background-color: #212326;
              }
    
              .post-menu-button-mobile {
                color: #81A2BE;
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
                border: 1px solid #282A2E;
                background-image: url(/assets/buttonfade-dark.png);
                background-repeat: repeat-x;
                text-decoration: none;
              }
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
                  color: #81A2BE;
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
                color: #81A2BE;
                text-decoration: underline;
              }

              .quotelink-mobile:hover {
                color: #5F89AC;
              }

              p:first-of-type::before {
                content: '>';
                color: #b5bd68;
              }
            }
          }`;

        case 'Photon':
          return `
            .op-container {
              background-color: #eee;
              border: 1px solid #ccc !important;

              .post-info-mobile {
                border-bottom: 1px solid #ccc;
                background-color: #ddd;
              }
    
              .post-menu-button-mobile {
                color: #f60;
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
                  color: #f60;
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
                content: '>';
                color: #789922;
              }
            }
          }`;
        
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
  
    .file-thumb img {
      border: none;
      float: left;
      max-width: 250px;
      max-height: 250px;
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
        text-decoration: none;
        line-height: 1em;
        width: 1em;
        text-align: center;
        outline: none;
        transform: rotate(90deg);
        margin: 4px -5px 0 4px !important;
        float: left;
        font-weight: 700;
        opacity: 1 !important;
        height: .5em !important;
        font-size: 16px;
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
  
      img {
        border: none;
        float: left;
        max-width: 100px;
        max-height: 100px;
        object-fit: scale-down;
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

      .post-info-mobile {
        margin: 0;
        overflow: hidden;
        padding: 5px;
        display: block !important;
        clear: left !important;

        .post-menu-button-mobile {
          text-decoration: none;
          line-height: 1em;
          width: 1em;
          text-align: center;
          outline: none;
          transform: rotate(90deg);
          margin: 4px -5px 0 4px !important;
          float: left;
          font-weight: 700;
          opacity: 1 !important;
          height: .5em !important;
          font-size: 16px;
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
        color: #000080;
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
        color: red;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
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

      blockquote > p:first-of-type::before {
        content: '>';
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
        color: #34345c;
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
        color: #d00;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
      }

      .quote-link {
        color: #d00;
        text-decoration: underline;
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

      blockquote > p:first-of-type::before {
        content: '>';
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
        color: #00e;
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
        color: red;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
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

      blockquote > p:first-of-type::before {
        content: '>';
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
        color: #34345c;
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
        color: red;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
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

      blockquote > p:first-of-type::before {
        content: '>';
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
        color: #81a2be;
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
        color: #5f89ab;
      }

      .backlink {
        font-size: 0.8em !important;
        display: inline;
        padding: 0;
        padding-left: 5px;
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

      blockquote > p:first-of-type::before {
        content: '>';
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
        color: #f60;
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
        color: #ff3300;
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

      blockquote {
        display: block;
        line-height: 1.3em;
      }

      .title {
        color: #111;
        font-weight: 700;
      }

      blockquote > p:first-of-type::before {
        content: '>';
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
      
    }
  }}
`;