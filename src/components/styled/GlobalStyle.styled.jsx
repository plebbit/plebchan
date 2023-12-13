import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *:focus {
    outline: none;
  }

  body {
    margin: 0;
    padding: 0;
    background: ${(props) => props.background};
    color: ${(props) => props.color};
    font-family: ${(props) => props.fontFamily};
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

  .poster-address {
    display: inline-block;
    overflow-x: clip;
  }

  .author-address-hidden {
    visibility: hidden;
    user-select: none;
  }

  .author-address-visible {
    float: left;
    width: 0;
    white-space: nowrap;
  }

  @keyframes authorAddressChangedAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .author-address-changed {
    animation-name: authorAddressChangedAnimation;
    animation-duration: 0.2s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;
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
      height: 520px;
    }
  }

  @media (max-width: 480px) {
    .enlarged {
      max-width: 100% !important;
      max-height: 100% !important;
    }

    .instagram-embed {
      width: 100vw !important;
      height: 45vh !important;
    }

    .streamable-embed, 
    .bitchute-embed, 
    .odysee-embed, 
    .youtube-embed, 
    .rumble-embed, 
    .twitch-embed {
      width: 100vw !important;
      height: 30vh !important;
    }

    .spotify-embed {
      width: 100vw !important;
      height: 40vh !important;
    }
  
    .tiktok-embed {
      width: 100vw !important;
      height: 70vh !important;
    }

    .twitter-embed {
      width: 100vw !important;
      height: 65vh !important;
    }

    .reddit-embed {
      width: 100vw !important;
      height: 55vh !important;
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
