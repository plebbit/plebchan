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
  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `font-size: 9pt;
        color: #b86;
        display: block;
        margin-top: 5px;
        
        a {
          font-weight: 400;
          padding: 1px;
          text-decoration: none;
          color: maroon;
        }

        a:hover {
          color: red;
        }

        .nav {
          float: right;
        }`;

      case 'Yotsuba B':
        return `font-size: 9pt;
        color: #89a;
        display: block;
        
        a {
          font-weight: 400;
          padding: 1px;
          text-decoration: none;
          color: #34345c;
        }

        a:hover {
          color: red;
        }

        .nav {
          float: right;
        }
        `;

        case 'Futaba':
          return `font-size: 11pt;
          display: block;
          
          a, a:visited {
            font-weight: 400;
            padding: 1px;
            color: #00e;
            text-decoration: underline;
          }

          a:hover {
            color: red;
          }

          .nav {
          float: right;
          }

          `;

        case 'Burichan':
          return `font-size: 11pt;
          display: block;
          
          a, a:visited {
            font-weight: 400;
            padding: 1px;
            color: #34345c;
            text-decoration: underline;
          }

          a:hover {
            color: red;
          }

          .nav {
          float: right;
          }
          `;

        case 'Tomorrow':
          return `font-size: 9pt;
          color: #c5c8c6;
          display: block;
          
          a, a:visited {
            font-weight: 400;
            padding: 1px;
            text-decoration: none;
            color: #81a2be;
          }

          a:hover {
            color: #5f89ab;
          }

          .nav {
           float: right;
          }
          `;

        case 'Photon':
          return `font-size: 9pt;
          color: #333;
          display: block;
          
          a, a:visited {
            font-weight: 400;
            padding: 1px;
            text-decoration: none;
            color: #f60;
          }

          a:hover {
            color: #ff3300;
          }

          .nav {
           float: right;
          }
          `;
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

      case 'Yotsuba B':
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
        }

        .board-address {
          font-size: 9pt;
          margin-top: 5px;
          font-size: 9pt;
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
          font-size: 9pt;
          margin-top: 5px;
          font-size: 9pt;
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

      case 'Yotsuba B':
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
  display: ${props => (props.showPostFormLink ? 'block' : 'none')};
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

      case 'Yotsuba B':
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

      case 'Yotsuba B':
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
        color: red;
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
        return `lear: both;
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

      case 'Yotsuba B':
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
          color: red;
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
`;

export const BoardForm = styled.div`
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

      .post-info {
        margin: 3px;
        display: block;
        width: 100%;
      }

      .name-block {
        display: inline-block;
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

      case 'Yotsuba B':
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

      .post-info {
        margin: 3px;
        display: block;
        width: 100%;
      }

      .name-block {
        display: inline-block;
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

      .reply-link:not(:hover) {
        color: #34345c !important;
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

      .post-info {
        margin: 3px;
        display: block;
        width: 100%;
      }

      .name-block {
        display: inline-block;
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

      .post-info {
        margin: 3px;
        display: block;
        width: 100%;
      }

      .name-block {
        display: inline-block;
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

      .post-info {
        margin: 3px;
        display: block;
        width: 100%;
      }

      .name-block {
        display: inline-block;
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
        color: #789922;
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

      .post-info {
        margin: 3px;
        display: block;
        width: 100%;
      }

      .name-block {
        display: inline-block;
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