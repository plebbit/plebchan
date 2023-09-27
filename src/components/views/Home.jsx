import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAccount, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Header, Logo, Page, Search, About, AboutTitle, AboutContent, Boards, BoardsTitle, BoardsContent, Footer } from '../styled/views/Home.styled';
import BoardAvatar from '../BoardAvatar';
import OfflineIndicator from '../OfflineIndicator';
import CreateBoardModal from '../modals/CreateBoardModal';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import packageJson from '../../../package.json';
import { Tooltip } from 'react-tooltip';
const { version } = packageJson;
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : '';

const SubplebbitTitle = ({ address }) => {
  const subplebbitAddress = address;
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const title = subplebbit.title ?? null;

  return <>{title ? <span>{title}</span> : <span style={{ userSelect: 'none' }}>&nbsp;</span>}</>;
};

const Home = () => {
  const { bodyStyle, setBodyStyle, defaultSubplebbits, setSelectedAddress, selectedStyle, setSelectedStyle, setSelectedTitle } = useGeneralStore((state) => state);

  const account = useAccount();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const prevStyle = useRef(selectedStyle);
  const prevBodyStyle = useRef(bodyStyle);

  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  // prevent dark mode
  useEffect(() => {
    const currentPrevStyle = prevStyle.current;
    const currentPrevBodyStyle = prevBodyStyle.current;

    setBodyStyle({
      background: '#ffe url(assets/fade.png) top repeat-x',
      color: 'maroon',
      fontFamily: 'Helvetica, Arial, sans-serif',
    });
    setSelectedStyle('Yotsuba');

    return () => {
      setSelectedStyle(currentPrevStyle);
      setBodyStyle(currentPrevBodyStyle);
    };
  }, [setBodyStyle, setSelectedStyle]);

  return (
    <>
      <CreateBoardModal selectedStyle={selectedStyle} isOpen={isCreateBoardOpen} closeModal={() => setIsCreateBoardOpen(false)} />
      <Helmet>
        <title>plebchan</title>
      </Helmet>
      <Container>
        <Tooltip id='tooltip' className='tooltip' />
        <Header>
          <Logo>
            <Link to='/'>
              <img alt='plebchan' src='assets/logo/logo-transparent.png' />
            </Link>
          </Logo>
        </Header>
        <Page>
          <Search>
            <input
              type='text'
              placeholder='"board.eth" or "12D3KooW..."'
              ref={inputRef}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  const address = inputRef.current.value;
                  if (address) {
                    setSelectedAddress(address);
                    navigate(`/p/${address}`);
                  }
                }
              }}
            />
            <input
              type='submit'
              value='Search'
              onClick={() => {
                const address = inputRef.current.value;
                if (address) {
                  setSelectedAddress(address);
                  navigate(`/p/${address}`);
                }
              }}
            />
          </Search>
          <About>
            <AboutTitle>
              <h2>What is plebchan?</h2>
            </AboutTitle>
            <AboutContent>
              <div id='content'>
                <p>
                  Plebchan is the only serverless, adminless, fully decentralized 4chan alternative where any pleb can create and own unlimited boards, and nobody can
                  take them down. Boards can always find competition, and board owners can monetize freely, so janitors aren't needed. Plebchan is a client for{' '}
                  <a href='https://plebbit.com' target='_blank' rel='noreferrer'>
                    plebbit
                  </a>
                  , a pure P2P protocol and tooling for creating decentralized forum applications. All data is just text, and plebchan's speed depends on how many users
                  are{' '}
                  <button
                    style={{ all: 'unset', cursor: 'pointer' }}
                    onClick={() => {
                      alert(
                        'You can seed automatically simply by using the plebchan desktop app, which is a plebbit full node. Download it here:\nhttps://github.com/plebbit/plebchan/releases/latest\n\nIf you are comfortable with the command line, you can use plebbit-cli with the --seed flag:\nhttps://github.com/plebbit/plebbit-cli\n\n',
                      );
                    }}
                  >
                    seeding
                  </button>
                  . Search for any board address above, or feel free to click on a popular board below that interests you and jump right in!{' '}
                </p>
                <br />
                <p>There are no global rules, each board is completely independent and its owner decides how/if it should be moderated.</p>
                <br />
                <p>
                  {' '}
                  HOW TO RUN A BOARD (currently via CLI only): <strong>(1)</strong> have a computer you can use as server, because users will connect to your board
                  peer-to-peer; <strong>(2)</strong> go to{' '}
                  <a href='https://github.com/plebbit/plebbit-cli#install' target='_blank' rel='noreferrer'>
                    https://github.com/plebbit/plebbit-cli#install
                  </a>{' '}
                  and follow the instructions to run your daemon, create a subplebbit (board) and edit its settings; <strong>(3)</strong> users can always connect to your
                  board via its address, but it can be added below by submitting a pull request here:{' '}
                  <a href='https://github.com/plebbit/temporary-default-subplebbits' target='_blank' rel='noreferrer'>
                    https://github.com/plebbit/temporary-default-subplebbits
                  </a>{' '}
                  this will be automated with a plebbit DAO using the plebbit token.
                </p>
              </div>
            </AboutContent>
          </About>
          {account?.subscriptions?.length > 0 ? (
            <Boards>
              <BoardsTitle>
                <h2>Subscriptions</h2>
              </BoardsTitle>
              <BoardsContent id='subscriptions'>
                <h3 style={{ textDecoration: 'underline', display: 'inline' }}>
                  You have subscribed to {account?.subscriptions?.length} board{account?.subscriptions?.length > 1 ? 's' : null}
                </h3>
                &nbsp;
                <Link
                  to='/p/subscriptions'
                  id='view-all'
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  [view all]
                </Link>
                <br />
                {account?.subscriptions?.map((subscription, index) => (
                  <Fragment key={`frag-${index}`}>
                    <Link
                      key={`sub-${index}`}
                      className='boardlink'
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                      to={`/p/${subscription}`}
                    >
                      <br id='mobile-br' />
                      {subscription}&nbsp;
                    </Link>
                    <OfflineIndicator key={`offline-${index}`} address={subscription} className='disconnected' isText={true} />
                    <br key={`br-${index}`} />
                  </Fragment>
                ))}
                <br id='mobile-br' />
              </BoardsContent>
            </Boards>
          ) : null}
          <Boards>
            <BoardsTitle>
              <h2>Default Boards</h2>
            </BoardsTitle>
            <BoardsContent>
              {defaultSubplebbits.map((subplebbit, index) => (
                <div className='board' key={`board-${index}`}>
                  <div className='board-title' key='board-title'>
                    {subplebbit.title ?? <SubplebbitTitle address={subplebbit.address} />}
                  </div>
                  <div className='board-avatar-container' key='board-avatar-container'>
                    <Link
                      to={`/p/${subplebbit.address}`}
                      key='link'
                      onClick={() => {
                        setSelectedTitle(subplebbit.title);
                        setSelectedAddress(subplebbit.address);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <BoardAvatar key='baordavatar' address={subplebbit.address} />
                    </Link>
                    <OfflineIndicator address={subplebbit.address} className='offline-indicator' tooltipPlace='top' key='oi2' />
                  </div>
                  <div className='board-text' key='bt'>
                    <b key='b'>{subplebbit.address}</b>
                  </div>
                </div>
              ))}
            </BoardsContent>
          </Boards>
        </Page>
        <Footer>
          <ul>
            <li className='fill'></li>
            <li className='first'>
              <a href='https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f' target='_blank' rel='noopener noreferrer'>
                Token
              </a>
            </li>
            <li>
              <a href='https://gitcoin.co/grants/5515/plebbit-a-serverless-adminless-decentralized-redd' target='_blank' rel='noopener noreferrer'>
                Donate
              </a>
            </li>
            <li>
              <a href='https://github.com/plebbit/whitepaper/discussions/2' target='_blank' rel='noopener noreferrer'>
                Whitepaper
              </a>
            </li>
            <li>
              <a href='https://github.com/plebbit/plebchan' target='_blank' rel='noopener noreferrer'>
                GitHub
              </a>
            </li>
            <li>
              <a href='https://matrix.to/#/#plebbit:plebbitchat.org' target='_blank' rel='noopener noreferrer'>
                Matrix
              </a>
            </li>
            <li>
              <a href='https://t.me/plebbit' target='_blank' rel='noopener noreferrer'>
                Telegram
              </a>
            </li>
            <li>
              <a href='https://twitter.com/plebchan_eth' target='_blank' rel='noopener noreferrer'>
                Twitter
              </a>
            </li>
            <li>
              <a href='https://discord.gg/E7ejphwzGW' target='_blank' rel='noopener noreferrer'>
                Discord
              </a>
            </li>
          </ul>
        </Footer>
        <div
          style={{
            textAlign: 'center',
            fontSize: '11px',
            marginBottom: '2em',
          }}
        >
          plebchan v{version}
          {commitRef}. GPL-2.0
        </div>
      </Container>
    </>
  );
};

export default Home;
