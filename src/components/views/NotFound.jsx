import React, { useEffect }  from 'react';
import { Helmet } from 'react-helmet-async';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Link } from "react-router-dom";
import { Container, Header, Logo, Page, Boards, BoardsTitle } from '../styled/Home.styled';


const NotFound = ({ setBodyStyle }) => {
  const { setSelectedStyle } = useGeneralStore(state => state);

  useEffect(() => {
    setBodyStyle({
      background: "#ffe url(/assets/fade.png) top repeat-x",
      color: "maroon",
      fontFamily: "Helvetica, Arial, sans-serif"
    });
    setSelectedStyle("Yotsuba");
  }, [setBodyStyle, setSelectedStyle]);

  return (
    <>
      <Helmet>
        <title>plebchan - 404 Not Found</title>
      </Helmet>
      <Container>
        <Header>
          <Logo>
            <Link to="/">
              <img alt="plebchan" src="/assets/logo/logo-transparent.png" />
            </Link>
          </Logo>
        </Header>
        <Page>
          <Boards>
            <BoardsTitle>
              <h2 style={{textAlign: 'center'}}>404 Not Found</h2>
            </BoardsTitle>
            <img src="/assets/plebchan-husbando.jpg" alt="plebchan" style={{
              display: "block",
              margin: "auto",
              padding: "15px", 
              width: "50%"
              }}></img>
          </Boards>
        </Page>
        <div style={{
          marginTop: "25px",
          textAlign: "center",
          fontSize: "11px",
          marginBottom: "1em",
        }}>
          v.0.1.0
          <br />
          Plebchan is free and open-source software distributed under GPL-2.0 license.
        </div>
      </Container>
    </>
  );
}

export default NotFound;