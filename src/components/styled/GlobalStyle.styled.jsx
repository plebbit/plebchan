import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *:focus {
    outline: none;
  }

  body {
    margin: 0;
    padding: 0;
    background: ${props => props.background};
    color: ${props => props.color};
    font-family: ${props => props.fontFamily};
  }

  .tooltip {
    z-index: 999;
    border-radius: 0;
    max-width: 40%;
    font-size: 11px;
    padding: 3px;
    opacity: 100%;
    word-wrap: break-word;
  }

  .line-break {
    white-space: pre-line;
  }

  .custom-paragraph {
    margin: 0;
    padding: 0;
  }

  .custom-linebreak {
    display: block;
    margin: 0;
    padding: 0;
  }

  .expanded-container {
    display: inline-block;
  }

  @media (min-width: 480px) {
    .enlarged {
      display: block;
      max-width: 100% !important;
      max-height: 100% !important;
    }
    
    .instagram-embed {
      height: 420px;
      width: 360px;
    }

    .streamable-embed, 
    .bitchute-embed, 
    .odysee-embed, 
    .youtube-embed, 
    .rumble-embed, 
    .twitch-embed {
      height: 450px;
      width: 800px;
    }

    .spotify-embed {
      height: 240px;
      width: 700px;
    }
  
    .tiktok-embed {
      width: 400px;
      height: 780px;
    }

    .twitter-embed {
      width: 400px;
      height: 580px;
    }

    .reddit-embed {
      width: 500px;
      height: 260px;
    }
  }

  @media (max-width: 480px) {
    .enlarged {
      max-width: 100% !important;
      max-height: 100% !important;
    }
  }

  .post-menu-catalog {
    position: absolute;
    font-size: 12px;
    line-height: 1.3em;
    list-style: none;

    ul {
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
`;