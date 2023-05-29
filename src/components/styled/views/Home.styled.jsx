import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  color: #800;
  font: 13px/1.231 arial, helvetica, clean, sans-serif;
  text-align: center;
  margin: auto;
  text-align: left;
  width: 57.69em;
  min-width: 750px;
  padding: 0;

  @media (max-device-width: 640px) {
    min-width: 0;
    width: auto;
    padding: 10px;
  }
`;

export const Header = styled.div`
  margin-bottom: 0;
  margin: 0;
  padding: 0;
`;

export const Logo = styled.div`
  font-size: 1px;
  line-height: 0;
  height: 120px;
  overflow: hidden;
  margin: 0 auto;
  width: 300px;

  img {
    margin: auto;
    display: block;
    border: none;
    width: 100%;
  }
`;

export const Search = styled.div`
  text-align: center;
  margin-bottom: 20px;

  input[type="text"] {
    width: 400px;
    height: 30px;
    font-size: 18px;
    padding: 3px 10px;
    box-sizing: border-box;
    -webkit-appearance: none;
    -webkit-border-radius: 0;
    border-radius: 0;
    margin: 0;
    margin-right: 2px;
    border: 1px solid #aaa;
    outline: none;
    font-family: arial, helvetica, sans-serif;
  }

  input[type="submit"] {
    width: 60px;
    height: 30px;
    font-size: 14px;
    margin-left: 5px;
  }
  
  @-moz-document url-prefix() {
    input[type="submit"] {
      vertical-align: top;
    }
  }

  @media screen and (-webkit-min-device-pixel-ratio:0) {
    input[type="submit"] {
      vertical-align: center;
    }
  }

  @media not all and (min-resolution:.001dpcm) {
    input[type="submit"] {
      vertical-align: top;
    }
  }

  @media only screen and (max-width: 480px) {
    text-align: center;

    input[type="text"] {
      width: 80%;
      height: 35px;
      font-size: 20px;
      padding: 5px;
      box-sizing: border-box;
      border-radius: 0;
    }
    
    input[type="submit"] {
      height: 35px;
      font-size: 14px;
      padding: 5px;
      box-sizing: border-box;
      vertical-align: top;
      width: 60px;
      -webkit-appearance: none;
    }
  }

`;

export const Page = styled.div`
  margin: 0;
  padding: 0;
`;

export const About = styled.div`
  background: #fff;
  color: #000;
  border: 1px solid;
  margin-bottom: .5em;
  padding-bottom: .5em;
`;

export const AboutTitle = styled.div`
  background: #800;
  color: #fff;
  position: relative;
  padding-left: .5em;
  line-height: 2em;

  h2 {
    font-size: 131%;
    font-weight: 700;
    margin: 0;
    padding: 0;
  }
`;

export const AboutContent = styled.div`
  line-height: 1.5em;
  font-size: 93%;
  padding: .5em;
  padding-top: .25em;
  padding-bottom: 0;
  min-height: 91px;

  #content {
    min-height: 91px;
  }

  button {
    color: blue !important;
    text-decoration: underline !important;
  }

  a:visited {
    color: blue;
  }

  p {
    margin: 0;
    padding: 0;
  }
`;

export const Boards = styled.div`
  border: 1px solid;
  margin: 0;
  padding: 0;
  padding-bottom: .5em;
  background: #fff;
  word-wrap: break-word;
  margin-bottom: 6px;

  #subscriptions {
    text-align: left;
  }
`;

export const BoardsTitle = styled.div`
  background: #fca;
  color: #800;
  position: relative;
  padding-left: .5em;
  line-height: 2em;

  h2 {
    font-size: 131%;
    font-weight: 700;
    margin: 0;
    padding: 0;
  }
`;

export const BoardsContent = styled.div`
  font-size: 93%;
  padding: .5em;
  padding-top: .25em;
  padding-bottom: 0;
  line-height: 130%;
  text-align: center;

  .board {
    vertical-align: top;
    display: inline-block;
    word-wrap: break-word;
    overflow: hidden;
    margin-top: 5px;
    padding: 5px 0 3px;
    position: relative;
    width: 175px;
    max-height: 320px;
    margin-bottom: 10px;
  }

  .board-title {
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    white-space: nowrap;
    margin-bottom: 5px;
  }

  .board-avatar-container {
    width: 150px;
    height: 150px;
    border: 1px solid #800;
    display: inline-block;
    overflow: hidden;
    position: relative;
  }


  .board-avatar-container img.board-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .offline-indicator {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 16px;
  }

  .board-text {
    margin-bottom: 5px;
    padding: 0 2px;
    white-space: pre-line;
  }

  h3 {
    font-size: 100%;
    font-weight: 700;
    text-align: left;
  }

  .boardlink {
    color: #800;
    text-decoration: none;

    :hover {
      text-decoration: underline;
      color: #e00
    }
  }

  #view-all {
    color: #800;
    font-weight: 700;
    text-decoration: none;

    :hover {
      color: #e00;
    }
  }

  @media (max-width: 480px) {
    .boardlink, #view-all {
      font-size: 1.2em;
    }

    .disconnected {
      width: 13px;
      margin-bottom: -1px;
      position: absolute;
    }
  }

  @media (min-width: 480px) {
    #mobile-br {
      display: none;
    }

    .disconnected {
      width: 13px;
      margin-top: 0px;
      position: absolute;
    }
  }

  
`;

export const Footer = styled.div`
  font-size: 93%;
  text-align: center;
  clear: both;
  padding-top: .5em;
  padding-bottom: 2em;

  ul {
    border-top: 1px solid;
    display: table;
    margin: auto;
    width: 750px;
    padding: 0;
  }
  
  li {
    background: #fed;
    display: block;
    float: left;
    border: 1px solid;
    padding: 2px 1em 2px 1em;
    border-left: none;
    margin-top: -1px;
    list-style: none;
  }
  
  .fill {
    border-top: 1x solid;
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    background: #ffe;
    width: 10.5%;
  }
  
  .first {
    border-left: 1px solid;
  }
  
  a {
    color: #800;
    text-decoration: none;
  }
  
  @media (max-device-width: 640px) {
    padding-top: 2em;
    padding-bottom: 3em;

    ul {
      width: auto;
      border-top: none;
      line-height: 2;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      row-gap: 10px;
    }

    .fill {
      display: none;
      background: inherit;
    }

    li {
      background: inherit;
      display: inline;
      float: none;
      border: none;
      white-space: nowrap;
    }

    .first {
      border-left: none;
    }

    a {
      color: blue;
      text-decoration: underline;
    }
  }
`;