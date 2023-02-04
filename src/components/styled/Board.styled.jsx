import styled from 'styled-components';

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
    width: 311px;
    height: 100px;
  }

  img {
    border: none;
    width: 311px;
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
  border: none;
  border-top: 1px solid #d9bfb7;
  height: 0;
`;

export const PostForm = styled.div`

`;