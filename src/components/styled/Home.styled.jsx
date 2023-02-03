import styled from 'styled-components';

export const Container = styled.div`
  min-width: 0;
  width: auto;
  padding: 10px;
  margin: auto;
  text-align: left;
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