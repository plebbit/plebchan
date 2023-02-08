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
          
          a {
            font-weight: 400;
            padding: 1px;
          }

          a:hover {
            color: red;
          }

          a:visited {
            color: #00e;
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
            color: #34345c
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

export const PostForm = styled.form`
  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
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
        color: red;
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
          font-size: 10pt;
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
          font-size: 10pt;
        }`;

      case 'Futaba':
        return `clear: both;
        hr {
          clear: both;
        }

        .style-changer {
          margin-left: 5px;
          font-size: 10pt;
        }`;

      case 'Burichan':
        return `clear: both;
        hr {
          clear: both;
        }

        .style-changer {
          margin-left: 5px;
          font-size: 10pt;
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
        }`;
      
    }
  }}
`;

export const BoardForm = styled.form`
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
        margin: 4px 0;
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
      }

      .quote-link:hover {
        color: red;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
      }

      .quote {
        color: #789922;
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
        margin: 4px 0;
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
      }

      .quote-link:hover {
        color: red;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
      }

      .quote {
        color: #789922;
      }

      .side-arrows {
        color: #e0bfb7;
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
        margin: 4px 0;
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
      }

      .quote-link:hover {
        color: red;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
      }

      .quote {
        color: #789922;
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

      case 'Burichan':
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
        margin: 4px 0;
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
        color: navy;
      }

      .quote-link:hover {
        color: red;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
      }

      .quote {
        color: #789922;
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

      .op-container {
        display: inline;
      }

      .op {
        display: inline;
      }

      .post {
        margin: 4px 0;
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
        color: #34345C;
      }

      .quote-link:hover {
        color: red;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
      }

      .quote {
        color: #b5bd68;
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
        display: inline;
      }

      .op {
        display: inline;
      }

      .post {
        margin: 4px 0;
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
        color: red;
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
      }

      .quote-link:hover {
        color: red;
      }

      .backlink span {
        padding: 0;
      }

      blockquote {
        display: block;
      }

      .quote {
        color: #789922;
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
      
    }
  }}
`;