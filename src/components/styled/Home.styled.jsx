import styled from 'styled-components';

export const Container = styled.div`
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
`;

export const Image = styled.img`
  margin: auto;
  display: block;
  border: none;
  width: 100%;
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
    padding: 3px;
    box-sizing: border-box;
    vertical-align: top;
    margin-left: 5px;
  }

  @media only screen and (max-width: 480px) {
    text-align: center;

    input[type="text"] {
      width: 80%;
      height: 35px;
      font-size: 20px;
      padding: 5px;
      box-sizing: border-box;
      -webkit-appearance: none;
      -webkit-border-radius: 0;
      border-radius: 0;
    }
    
    input[type="submit"] {
      height: 35px;
      font-size: 14px;
      padding: 5px;
      box-sizing: border-box;
      vertical-align: top;
      width: 60px;
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
  padding: .5em;
  padding-top: .25em;
  padding-bottom: 0;
`;