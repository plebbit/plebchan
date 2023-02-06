import styled from 'styled-components';

export const Container = styled.div`
    color: maroon;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
    margin-left: 0;
    margin-right: 0;
    margin-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
`;

export const NavBar = styled.div`
  font-size: 9pt;
  color: #b86;
  display: block;
  margin-top: 5px;
  
  a {
    font-weight: 400;
    padding: 1px;
    text-decoration: none;
    color: maroon;
  }

  .nav {
    float: right;
  }
`;

export const Header = styled.div`
  text-align: center;
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
  }
`;

export const Break = styled.hr`
  width: 90%;
  border: none;
  border-top: 1px solid #d9bfb7;
  height: 0;
`;

export const PostForm = styled.form`

  #post-form-link {
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
  }
`;

export const TopBar = styled.div`
  clear: both;

  hr {
    border: none;
    border-top: 1px solid #d9bfb7;
    height: 0;
  }

  #search-box { 
    height: 16px;
    line-height: 16px;
    margin-top: 0;
    margin-right: 2px;
    margin-bottom: 0;
    margin-left: 2px;
    padding: 0 2px;
    width: 120px;
    -webkit-appearance: none;
    appearance: none;
    border: 1px solid #aaa;
    outline: none;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
  }

  a {
    color: #00e;
    text-decoration: none;
  }

  a:hover {
    color: red;
  }
`;

export const BoardForm = styled.form`
  
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
    margin: 4px 0;
    overflow: hidden;
  }

  .ext-button {
    float: left;
    margin-right: 5px;
    margin-top: -1px;
    cursor: pointer;
    margin-bottom: -4px;
    width: 18px;
    height: 18px;
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
  }
`;