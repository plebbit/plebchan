import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  body {
    margin: 0;
    padding: 0;
    background: #ffe url(/fade.png) top repeat-x;
    color: #800;
    font: 13px/1.231 arial, helvetica, clean, sans-serif;
    *font-size: small;
    *font: x-small;
    text-align: center;
  }
`;

export default GlobalStyle;