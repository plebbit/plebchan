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

  .enlarged {
    display: block;
    max-width: 100% !important;
    max-height: 100% !important;
  }

  @media (max-width: 480px) {
    .enlarged {
      max-width: 100% !important;
      max-height: 100% !important;
    }
  }
`;