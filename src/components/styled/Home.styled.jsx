import styled from 'styled-components';

export const Container = styled.div`
  margin: auto;
  text-align: left;
  width: 57.69em;
  min-width: 750px;
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
`;

export const BoxOuter = styled.div`
  border: 1px solid;
  margin-bottom: .5em;
  padding-bottom: .5em;
  margin: 0;
  padding: 0;
`;

export const BoxInner = styled.div`
  margin: 0;
  padding: 0;
`;

export const BoxBar = styled.div`
  background: #800;
  color: #fff;
  position: relative;
  padding-left: .5em;
  line-height: 2em;
  padding-top: 1ch;

  h2 {
    font-size: 131%;
    font-weight: 700;
    margin: 0;
    padding: 0;
  }
`;

export const BoxContent = styled.div`
  line-height: 1.5em;
  font-size: 93%;
  padding: .5em;
  padding-top: .25em;
  padding-bottom: 0;
  min-height: 91px;

  #content {
    min-height: 91px;
  }

  p {
    margin: 0;
    padding: 0;
  }
`;