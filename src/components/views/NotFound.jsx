import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Container, Header, Logo, Page, BoardsBox } from '../styled/views/Home.styled';
import packageJson from '../../../package.json';
const { version } = packageJson;
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : '';

const NotFound = () => {
  useEffect(() => {
    const yotsubaBodyStyle = {
      background: '#ffe url(assets/fade.png) top repeat-x',
      color: 'maroon',
      fontFamily: 'Arial, Helvetica, sans-serif',
    };
    const originalBodyStyles = {
      background: document.body.style.background,
      color: document.body.style.color,
      fontFamily: document.body.style.fontFamily,
    };

    for (const [key, value] of Object.entries(yotsubaBodyStyle)) {
      document.body.style[key] = value;
    }

    return () => {
      for (const [key, value] of Object.entries(originalBodyStyles)) {
        document.body.style[key] = value;
      }
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>plebchan - 404 Not Found</title>
      </Helmet>
      <Container>
        <Header>
          <Logo>
            <Link to='/'>
              <img alt='plebchan' src='assets/logo/logo-transparent.png' />
            </Link>
          </Logo>
        </Header>
        <Page>
          <BoardsBox>
            <div className='boxbar'>
              <h2 style={{ textAlign: 'center' }}>404 Not Found</h2>
            </div>
            <img
              src='assets/plebchan-husbando.jpg'
              alt='plebchan'
              style={{
                display: 'block',
                margin: 'auto',
                padding: '15px',
                width: '50%',
              }}
            ></img>
          </BoardsBox>
        </Page>
        <div
          style={{
            textAlign: 'center',
            fontSize: '11px',
            marginTop: '2em',
          }}
        >
          plebchan v{version}
          {commitRef}. GPL-2.0
        </div>
      </Container>
    </>
  );
};

export default NotFound;
