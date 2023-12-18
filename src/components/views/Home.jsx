import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAccount, useAccountSubplebbits, useComment, useSubplebbit, useSubplebbits } from '@plebbit/plebbit-react-hooks';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Header, Logo, Page, Search, About, AboutTitle, AboutContent, BoardsBox, BoardsContent, Footer } from '../styled/views/Home.styled';
import BoardAvatar from '../BoardAvatar';
import OfflineIndicator from '../OfflineIndicator';
import CreateBoardModal from '../modals/CreateBoardModal';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import packageJson from '../../../package.json';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import { Tooltip } from 'react-tooltip';
const { version } = packageJson;
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : '';

const PopularThreads = ({ commentCid }) => {
  const comment = useComment({ commentCid });
  const subplebbit = useSubplebbit({ subplebbitAddress: comment?.subplebbitAddress });
  const { setSelectedAddress, setSelectedTitle } = useGeneralStore((state) => state);
  const commentMediaInfo = getCommentMediaInfo(comment);

  return (
    <div className='board' key={`${commentCid}`}>
      <div className='board-title' key='board-title'>
        <span>{subplebbit.title || subplebbit.address}</span>
      </div>
      <div className='board-avatar-container' key='board-avatar-container'>
        <Link
          to={`/p/${comment?.subplebbitAddress}/c/${comment?.cid}`}
          key='link'
          onClick={() => {
            setSelectedTitle(subplebbit?.title);
            setSelectedAddress(comment?.subplebbitAddress);
          }}
        >
          {commentMediaInfo?.type === 'webpage' && commentMediaInfo?.thumbnail ? (
            <img className='board-avatar' src={commentMediaInfo?.thumbnail} alt='post' />
          ) : commentMediaInfo?.type === 'image' ? (
            <img className='board-avatar' src={commentMediaInfo?.url} alt='post' />
          ) : commentMediaInfo?.type === 'video' ? (
            <video className='board-avatar' src={commentMediaInfo?.url} alt='post' />
          ) : commentMediaInfo?.type === 'iframe' && commentMediaInfo?.thumbnail ? (
            <img className='board-avatar' src={commentMediaInfo?.thumbnail} alt='post' />
          ) : (
            <BoardAvatar address={comment.subplebbitAddress} />
          )}
        </Link>
        <OfflineIndicator address={comment?.subplebbitAddress} className='offline-indicator' tooltipPlace='top' key='oi2' />
      </div>
      <div className='board-text' key='bt'>
        {comment?.title ? <b>{comment?.title}</b> : null}
        {comment?.content ? (comment.content.length > 99 ? `: ${comment.content.substring(0, 99)}...` : `: ${comment.content}`) : null}
      </div>
    </div>
  );
};

const Home = () => {
  const { bodyStyle, setBodyStyle, defaultSubplebbits, defaultNsfwSubplebbits, setSelectedAddress, selectedStyle, setSelectedStyle } = useGeneralStore((state) => state);

  const { accountSubplebbits } = useAccountSubplebbits();
  const accountSubplebbitsAddresses = Object.values(accountSubplebbits).map((subplebbit) => subplebbit.address);
  const sfwAddresses = defaultSubplebbits.map((subplebbit) => subplebbit.address);
  const sfwSubs = useSubplebbits({ subplebbitAddresses: sfwAddresses });
  const sfwList = sfwSubs.subplebbits.map((subplebbit) => subplebbit?.address);
  const [sfwListCids, setSfwListCids] = useState([]);

  useEffect(() => {
    let subplebbitToCid = {};

    sfwSubs.subplebbits.forEach((s) => {
      let maxTimestamp = -Infinity;
      let mostRecentCid = null;

      if (s && s.posts && s.posts.pages && s.posts.pages.hot && s.posts.pages.hot.comments) {
        for (const comment of Object.values(s.posts.pages.hot.comments)) {
          const commentMediaInfo = getCommentMediaInfo(comment);
          const isMediaShowed =
            comment.link &&
            commentMediaInfo &&
            (commentMediaInfo.type === 'image' ||
              commentMediaInfo.type === 'video' ||
              (commentMediaInfo.type === 'webpage' && commentMediaInfo.thumbnail) ||
              (commentMediaInfo.type === 'iframe' && commentMediaInfo.thumbnail));

          if (
            isMediaShowed &&
            comment.replyCount > 2 &&
            !comment.removed &&
            !comment.locked &&
            !comment.pinned &&
            comment.timestamp > Date.now() / 1000 - 60 * 60 * 24 * 30 &&
            comment.timestamp > maxTimestamp
          ) {
            maxTimestamp = comment.timestamp;
            mostRecentCid = comment.cid;
          }
        }

        if (mostRecentCid) {
          subplebbitToCid[s.address] = { cid: mostRecentCid, timestamp: maxTimestamp };
        }
      }
    });

    const newSfwListCids = Object.values(subplebbitToCid)
      .map((item) => item.cid)
      .slice(0, 8);

    setSfwListCids((prevOrderedCids) => {
      const uniqueCids = Array.from(new Set([...prevOrderedCids, ...newSfwListCids]));
      return uniqueCids.slice(0, 8);
    });
  }, [sfwSubs.subplebbits]);

  const account = useAccount();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const prevStyle = useRef(selectedStyle);
  const prevBodyStyle = useRef(bodyStyle);

  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [showAllSFWBoards, setShowAllSFWBoards] = useState(false);
  const [showAllSubscriptions, setShowAllSubscriptions] = useState(false);

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
              value='Go'
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
                  Plebchan is a serverless, adminless, decentralized 4chan alternative where any pleb can create and own unlimited boards. All data comes from the 
                  <a href='https://plebbit.com' target='_blank' rel='noreferrer'>
                    plebbit
                  </a>{' '}
                  protocol, it's all text including links from which media is embedded, shared peer-to-peer. Users do not need to register an account before participating
                  in the community. Feel free to click on a board below that interests you and jump right in!{' '}
                </p>
                <br />
                <p>There are no global rules, each board is completely independent and its owner decides how/if it should be moderated.</p>
              </div>
            </AboutContent>
          </About>
          <BoardsBox>
            <div className='boxbar'>
              <h2>Boards</h2>
            </div>
            <div className='boxcontent'>
              <div className='column'>
                <h3 style={{ textDecoration: 'underline', display: 'inline' }}>
                  <a
                    href='https://github.com/plebbit/temporary-default-subplebbits'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ all: 'unset', cursor: 'pointer' }}
                  >
                    Default SFW
                  </a>
                </h3>
                &nbsp;
                <Link to={{ pathname: '/p/all', state: { scrollToTop: true } }} id='button'>
                  [view all]
                </Link>
                <ul>
                  {sfwList.slice(0, showAllSFWBoards ? undefined : 18).map((address, index) => (
                    <li key={`default-${index}`}>
                      <OfflineIndicator address={address} className='disconnected' isText={true} />
                      <Link
                        key={`default-link-${index}`}
                        className='boardlink'
                        to={{
                          pathname: `/p/${address}`,
                          state: { scrollToTop: true },
                        }}
                      >
                        {address}
                      </Link>
                      &nbsp;
                    </li>
                  ))}
                  {sfwList.length > 17 && (
                    <li onClick={() => setShowAllSFWBoards(!showAllSFWBoards)}>
                      {!showAllSFWBoards ? '... ' : null}
                      <span id='button'>{showAllSFWBoards ? '[show less]' : '[show more]'}</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className='column'>
                <h3 style={{ textDecoration: 'underline', display: 'inline' }}>
                  <a
                    href='https://github.com/plebbit/temporary-default-subplebbits'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ all: 'unset', cursor: 'pointer' }}
                  >
                    Default NSFW
                  </a>
                </h3>
                <ul>
                  {defaultNsfwSubplebbits.length === 0 && <li style={{ color: 'black' }}>No boards yet in this list.</li>}
                  {defaultNsfwSubplebbits.slice(0, showAllSFWBoards ? undefined : 18).map((subplebbit, index) => (
                    <li key={`default-${index}`}>
                      <OfflineIndicator address={subplebbit.address} className='disconnected' isText={true} />
                      <Link key={`default-link-${index}`} className='boardlink' to={{ pathname: `/p/${subplebbit.address}`, state: { scrollToTop: true } }}>
                        {subplebbit.address}
                      </Link>
                      &nbsp;
                    </li>
                  ))}
                  {defaultNsfwSubplebbits.length > 17 && (
                    <li onClick={() => setShowAllSFWBoards(!showAllSFWBoards)}>
                      {!showAllSFWBoards ? '... ' : null}
                      <span id='button'>{showAllSFWBoards ? '[show less]' : '[show more]'}</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className='column'>
                <h3 style={{ textDecoration: 'underline', display: 'inline' }}>Subscriptions</h3>
                &nbsp;
                <Link to={{ pathname: '/p/subscriptions', state: { scrollToTop: true } }} id='button'>
                  [view all]
                </Link>
                <br />
                <ul>
                  {account?.subscriptions?.length === 0 && <li style={{ color: 'black' }}>Not subscribed to any board.</li>}
                  {account?.subscriptions?.slice(0, showAllSubscriptions ? undefined : 18).map((subscription, index) => (
                    <li key={`sub-${index}`}>
                      <OfflineIndicator address={subscription} className='disconnected' isText={true} />
                      <Link key={`sub-link-${index}`} className='boardlink' to={{ pathname: `/p/${subscription}`, state: { scrollToTop: true } }}>
                        {subscription}
                      </Link>
                      &nbsp;
                    </li>
                  ))}
                  {account?.subscriptions?.length > 17 && (
                    <li onClick={() => setShowAllSubscriptions(!showAllSubscriptions)}>
                      {!showAllSubscriptions ? '... ' : null}
                      <span id='button'>{showAllSubscriptions ? '[show less]' : '[show more]'}</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className='column'>
                <h3 style={{ textDecoration: 'underline', display: 'inline' }}>Moderating</h3>
                <ul>
                  {accountSubplebbitsAddresses?.length === 0 && <li style={{ color: 'black' }}>Not moderating any board.</li>}
                  {accountSubplebbitsAddresses?.slice(0, showAllSubscriptions ? undefined : 18).map((subplebbit, index) => (
                    <li key={`sub-${index}`}>
                      <OfflineIndicator address={subplebbit} className='disconnected' isText={true} />
                      <Link key={`sub-link-${index}`} className='boardlink' to={{ pathname: `/p/${subplebbit}`, state: { scrollToTop: true } }}>
                        {subplebbit}
                      </Link>
                      &nbsp;
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BoardsBox>
          <BoardsBox>
            <div className='boxbar'>
              <h2>Popular Threads</h2>
            </div>
            <BoardsContent>
              {sfwListCids.map((cid, index) => (
                <PopularThreads key={index} commentCid={cid} />
              ))}
            </BoardsContent>
          </BoardsBox>
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
