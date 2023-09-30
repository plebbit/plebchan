import styled from 'styled-components';

export const Threads = styled.div`
  padding: 20px 0;
  text-align: center;
  margin: 0;
  overflow: hidden;

  .thread {
    width: 180px;
    position: relative;
    max-height: 320px;
    vertical-align: top;
    display: inline-block;
    margin-top: 5px;
    margin-bottom: 20px;
    padding: 5px 0 3px;
  }

  video,
  audio,
  img {
    max-width: 150px;
    max-height: 150px;
  }

  .file-thumb {
    background-color: rgba(0, 0, 0, 0.05);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
  }

  .card {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
    border: 0;
  }

  .thread-icons {
    display: inline;
    height: 16px;
    margin: 2px 0 0 -101px;
    position: absolute;
    width: 100px;
    text-align: right;
  }

  .offline-icon {
    height: 16px;
    margin: 2px;
  }

  .offline-icon-no-link {
    height: 11px;
    position: absolute;
    margin-left: 13px;
    margin-top: -2px;
  }

  .offline-icon-no-link-shifted {
    height: 11px;
    position: absolute;
    margin-left: 35px;
    margin-top: -2px;
  }

  .offline-icon-no-link-hovered {
    transform: translate(16px, 0);
  }
  .sticky-icon {
    background-image: url(assets/sticky.gif);
    width: 16px;
    height: 16px;
    display: inline-block;
  }

  .closed-icon {
    background-image: url(assets/closed.gif);
    width: 16px;
    height: 16px;
    display: inline-block;
  }

  .meta {
    font-size: 11px;
    line-height: 8px;
    margin-top: 2px;
    margin-bottom: 1px;
  }

  .teaser {
    display: block;
    padding: 0 15px;
    overflow: hidden;
    word-wrap: break-word;
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return ``;

      case 'Yotsuba-B':
        return ``;

      case 'Futaba':
        return ``;

      case 'Burichan':
        return ``;

      case 'Tomorrow':
        return `
        .file-thumb {
          background-color: rgba(255, 255, 255, 0.01) !important;
        }`;

      case 'Photon':
        return ``;

      default:
        return '';
    }
  }}
`;

export const PostPreview = styled.div`
  .post-preview {
    position: absolute;
    background-color: #000;
    border-radius: 3px;
    padding: 5px 8px 4px;
    z-index: 100000;
    word-wrap: break-word;
    white-space: normal;
    max-width: 500px;
    width: fit-content;
    color: #dedede;
    font-size: 10pt;
    text-align: left;
  }

  .post-author {
    font-weight: 700;
  }

  .post-last {
    margin-top: 3px;
    color: #bbbfbd;
    font-size: 90%;
  }

  .post-author-admin {
    color: purple;
    font-weight: 700;
  }

  ${({ selectedStyle }) => {
    switch (selectedStyle) {
      case 'Yotsuba':
        return `
        .post-subject{
          color:#cc1105;
          font-weight:700;
        };

        .post-author{
          color:#00a550;font-weight:bold
        }`;

      case 'Yotsuba-B':
        return `
        .post-subject{
          color:#dedede;
          font-weight:700;
        };

        .post-author{
          color:#00a550;font-weight:bold
        }`;

      case 'Futaba':
        return `
        .post-preview{
          font-family: arial,helvetica,sans-serif;
        }

        .post-subject{
          color:#cc1105;
          font-weight:700;
        };
        
        .post-author{
          color:#00a550;font-weight:700;
        }`;

      case 'Burichan':
        return `
        .post-preview{
          font-family: arial,helvetica,sans-serif;
        }

        .post-subject{
          color:#dedede;
          font-weight:700;
        };

        .post-author{
          color:#00a550;font-weight:700;
        }`;

      case 'Tomorrow':
        return `
        .post-preview{
          font-family: arial,helvetica,sans-serif;
        }

        .file-thumb {
          background-color: rgba(255, 255, 255, 0.01) !important;
        }

        .post-subject{
          color:#b294bb;
          font-weight:700;
        };

        .post-author{
          color:#00a550;font-weight:700;
        }`;

      case 'Photon':
        return `
        .post-preview{
          font-family: arial,helvetica,sans-serif;
        }

        .post-subject{
          color:#dedede;
          font-weight:700;
        };

        .post-author{
          color:#dedede;font-weight:700;
        }`;
      default:
        return '';
    }
  }}
`;

export const PostMenuCatalog = styled.div`
  .post-menu-catalog {
    position: relative;
    font-size: 12px;
    padding: 0;

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
        border: 1px solid #d9bfb7 !important;
        border-left: none !important;
        border-top: none !important;
      }
      
      .post-menu-catalog {
        border-right: 1px solid #d9bfb7;
        border-bottom: 2px solid #d9bfb7;
        
        li {
          border: 1px solid #d9bfb7;
          background-color: #f0e0d6;
          border-bottom: none;

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
      
      .post-menu-catalog {
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
      
      .post-menu-catalog {
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
      
      .post-menu-catalog {
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
        border: 1px solid #111 !important;
      }

      .catalog-media-wrapper {
        background-color: rgba(255, 255, 255, 0.01) !important;
      }
      
      .post-menu-catalog {
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
        border: 1px solid #ccc !important;
      }
      
      .post-menu-catalog {
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
`;
