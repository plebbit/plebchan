import React from 'react';
import { Link } from "react-router-dom";
import { Container, Header, Logo, Page, Boards, BoardsTitle } from './styles/Home.styled';


const NotFound = ({ setBodyStyle }) => {

  return (
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
          <img src="/assets/plebchan-husbando.jpg" style={{
            display: "block",
            margin: "auto",
            padding: "15px", 
            width: "50%"
            }}></img>
        </Boards>
      </Page>
    </Container>
  );
}

export default NotFound;