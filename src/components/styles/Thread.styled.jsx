import styled from 'styled-components';

export const ReplyFormLink = styled.div`
  display: ${props => (props.showReplyFormLink ? 'block' : 'none')};
`;

export const ReplyFormTable = styled.table`
  display: ${props => (props.showReplyForm ? 'table' : 'none')};
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
        margin-bottom: -3px;
        outline: none;
        border-radius: none;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 2px 0;
        width: 300px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
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
        margin-bottom: -3px;
        outline: none;
        border-radius: none;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 2px 0;
        width: 300px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
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
        margin-bottom: -3px;
        outline: none;
        border-radius: none;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 2px 0;
        width: 300px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
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
        margin-bottom: -3px;
        outline: none;
        border-radius: none;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 2px 0;
        width: 300px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
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
        border: 1px solid #000;
        background-color: #282a2e;
        color: #c5c8c6;
        outline: none;
        font-family: arial, helvetica, sans-serif;
        font-size: 10pt;
      }

      textarea {
        width: 292px;
        margin-bottom: -3px;
        outline: none;
        border-radius: none;
        border: 1px solid #000;
        background-color: #282a2e;
        color: #c5c8c6;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #2d2d2d;
        border: 1px solid #777;
        margin: 2px 0;
        width: 300px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
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
        margin-bottom: -3px;
        outline: none;
        border-radius: none;
      }

      #t-root {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: #eee;
        border: 1px solid #777;
        margin: 2px 0;
        width: 300px;
      }

      #t-resp {
        width: 254px;
        box-sizing: border-box;
        text-transform: uppercase;
        font-size: 11px;
        height: 18px;
        margin: 0px;
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
      }`;
    }
  }}
`;

export const TopBar = styled.div`
  .return-button {
    margin-top: 3px;
  }

  .reply-stat { 
    position: relative;
    float: right;
    margin-right: 5px;
    margin-top: 4px;
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

      case 'Yotsuba B':
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