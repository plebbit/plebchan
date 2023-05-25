import styled from 'styled-components';

export const Threads = styled.div`
  padding: 20px 0;
  text-align: center;
  margin: 0;

  .thread {
    width: 180px;
    max-height: 320px;
    vertical-align: top;
    display: inline-block;
    word-wrap: break-word;
    overflow: hidden;
    margin-top: 5px;
    margin-bottom: 20px;
    padding: 5px 0 3px;
    position: relative;
  }

  video, audio, img {
    max-width: 150px;
    max-height: 150px;
  }

  .card {
    display: inline;
    margin: auto;
    box-shadow: 0 0 5px rgba(0, 0, 0, .25);
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
    cursor: help;
    font-size: 11px;
    line-height: 8px;
    margin-top: 2px;
    margin-bottom: 1px;
  }

  .teaser {
    display: block;
    padding: 0 15px;
  }
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
        return `.highlighted {
        background-color: #f0c0b0 !important;
        border: 1px solid #d99f91 !important;
        border-left: none !important;
        border-top: none !important;
      }
      
      .post-menu-catalog {
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
        return `.highlighted {
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
        return `.highlighted {
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
        return `.highlighted {
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
        return `.highlighted {
        background-color: #1d1d21 !important;
        border: 1px solid #111 !important;
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
        return `.highlighted {
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