import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Logo, Page, Search, About, AboutTitle, AboutContent, Boards, BoardsTitle, BoardsContent, Footer } from './styles/Home.styled';
import { BoardContext } from '../App';

const Home = ({ setBodyStyle }) => {
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const { selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, selectedStyle, setSelectedStyle } = useContext(BoardContext);

  useEffect(() => {
    setBodyStyle({
      background: "#ffe url(/fade.png) top repeat-x",
      color: "maroon",
      fontFamily: "Helvetica, Arial, sans-serif"
    });
    setSelectedStyle("Yotsuba");
  }, [setBodyStyle, setSelectedStyle]);

  const handleClick = (title, address) => {
    setSelectedTitle(title);
    setSelectedAddress(address);
  }

  useEffect(() => {
    let didCancel = false;
    fetch(
      "https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/subplebbits.json",
      { cache: "no-cache" }
    )
      .then((res) => res.json())
      .then(res => {
        if (!didCancel) {
          setDefaultSubplebbits(res);
        }
      });
    return () => {
      didCancel = true;
    };
  }, []);
  
  return (
    <Container>
      <Header>
        <Logo>
          <Link to="/">
            <img alt="plebchan" src="/logo-transparent.png" />
          </Link>
        </Logo>
      </Header>
      <Page>
        <Search>
          <form>
            <input type="text" placeholder='"board.eth" or "Qm..."' />
            <input type="submit" value="Search" disabled />
          </form>
        </Search>
        <About>
          <AboutTitle>
            <h2>What is plebchan?</h2>
          </AboutTitle>
          <AboutContent>
            <div id="content">
              <p>Plebchan is a serverless, adminless, decentralized 4chan alternative that uses the <a href="https://plebbit.com" target="_blank" rel="noreferrer">plebbit protocol</a>. Users do not need to register an account before participating in the community; anyone can post comments, share image links, and create a board. Search for any board address above, or feel free to click on a popular board below that interests you and jump right in! </p>
              <br />
              <p>There are no global rules, each board is completely independent and their owners decide how they should be moderated.</p>
            </div>
          </AboutContent>
        </About>
        <Boards>
            <BoardsTitle>
              <h2>Popular boards</h2>
            </BoardsTitle>
            <BoardsContent>
              {defaultSubplebbits.map(subplebbit => (
                <div className="board" key={subplebbit.address}>
                  <div className="board-title">{subplebbit.title}</div>
                  <Link to="/board" onClick={() => {
                    handleClick(subplebbit.title, subplebbit.address);
                  }} >
                    <img alt="board logo" src="/plebchan.png" />
                  </Link>
                  <div className="board-text">
                    <b>{subplebbit.address}</b>
                  </div>
                </div>
              ))}
            </BoardsContent>
        </Boards>
      </Page>
      <Footer>
        <ul>
          <li className="fill"></li>
          <li className="first">
            <a href="https://plebbitdemo.eth.limo" target="_blank" rel="noopener noreferrer">Plebbit</a>
          </li>
          <li>
            <a href="https://gitcoin.co/grants/5515/plebbit-a-serverless-adminless-decentralized-redd" target="_blank" rel="noopener noreferrer">Donate</a>
          </li>
          <li>
            <a href="https://plebbit.com/whitepaper" target="_blank" rel="noopener noreferrer">Whitepaper</a>
          </li>
          <li>
            <a href="https://snowtrace.io/token/0x625fc9bb971bb305a2ad63252665dcfe9098bee9" target="_blank" rel="noopener noreferrer">Contract</a>
          </li>
          <li>
            <a href="https://matrix.to/#/#plebbit:plebbitchat.org" target="_blank" rel="noopener noreferrer">Matrix</a>
          </li>
          <li>
            <a href="https://t.me/plebbit" target="_blank" rel="noopener noreferrer">Telegram</a>
          </li>
          <li>
            <a href="https://twitter.com/getplebbit" target="_blank" rel="noopener noreferrer">Twitter</a>
          </li>
          <li>
            <a href="https://discord.gg/E7ejphwzGW" target="_blank" rel="noopener noreferrer">Discord</a>
          </li>
        </ul>
      </Footer>
    </Container>
  )
};

export default Home;