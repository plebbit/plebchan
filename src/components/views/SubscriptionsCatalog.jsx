import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useAccount, useFeed } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break} from '../styled/Board.styled';
import { Threads } from '../styled/Catalog.styled';
import { TopBar, Footer } from '../styled/Thread.styled';
import ImageBanner from '../ImageBanner';
import OfflineIndicator from '../OfflineIndicator';
import SettingsModal from '../SettingsModal';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import handleStyleChange from '../../utils/handleStyleChange';
import useError from '../../hooks/useError';
import packageJson from '../../../package.json'
const {version} = packageJson


const SubscriptionsCatalog = () => {
  const {
    defaultSubplebbits,
    isSettingsOpen, setIsSettingsOpen,
    selectedAddress, setSelectedAddress,
    selectedStyle,
    setSelectedThread,
    setSelectedTitle,
  } = useGeneralStore(state => state);

  const account = useAccount();

  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const { feed, hasMore, loadMore } = useFeed({subplebbitAddresses: account?.subscriptions, sortType: 'new'});
  const [setSelectedFeed] = useState(feed.sort((a, b) => b.timestamp - a.timestamp));

  const [errorMessage] = useState(null);
  useError(errorMessage, [errorMessage]);

  // mobile navbar scroll effect
  useEffect(() => {
    const debouncedHandleScroll = debounce(() => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    }, 50);
  
    window.addEventListener('scroll', debouncedHandleScroll);
  
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [prevScrollPos, visible]);


  const tryLoadMore = async () => {
    try {loadMore()} 
    catch (e)
    {await new Promise(resolve => setTimeout(resolve, 1000))}
  };

    // desktop navbar board select functionality
    const handleClickTitle = (title, address) => {
      setSelectedTitle(title);
      setSelectedAddress(address);
      setSelectedFeed(feed.filter(feed => feed.title === title));
    };

  // mobile navbar board select functionality
  const handleSelectChange = (event) => {
    const selected = event.target.value;

    if (selected === 'subscriptions') {
      return;
    }

    const selectedTitle = defaultSubplebbits.find((subplebbit) => subplebbit.address === selected).title;
    setSelectedTitle(selectedTitle);
    setSelectedAddress(selected);
    navigate(`/p/${selected}`);
  };


  return (
    <>
      <Helmet>
      <title>Subscriptions - Catalog - plebchan</title>
      </Helmet>
      <Container>
        <SettingsModal
        selectedStyle={selectedStyle}
        isOpen={isSettingsOpen}
        closeModal={() => setIsSettingsOpen(false)} />
        <NavBar selectedStyle={selectedStyle}>
          <>
          <span className="boardList">
            [
              <Link to={`/p/subscriptions`}>Subscriptions</Link>
            ]&nbsp;[
            {defaultSubplebbits.map((subplebbit, index) => (
              <span className="boardList" key={`span-${subplebbit.address}`}>
                {index === 0 ? null : "\u00a0"}
                <Link to={`/p/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => {
                setSelectedTitle(subplebbit.title);
                setSelectedAddress(subplebbit.address);
                }}
                >{subplebbit.title ? subplebbit.title : subplebbit.address}</Link>
                {index !== defaultSubplebbits.length - 1 ? " /" : null}
              </span>
            ))}
            ]
          </span>
            <span className="nav">
            [
              <button style={{all: 'unset', cursor: 'pointer'}} onClick={
                () => alert(
                  'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                  )
              }>Create Board</button>
              ]
              [
              <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
              ]
              [
              <Link to="/" onClick={() => handleStyleChange({target: {value: "Yotsuba"}}
              )}>Home</Link>
              ]
            </span>
            <div id="board-nav-mobile" style={{ top: visible ? 0 : '-23px' }}>
              <div className="board-select">
                <strong>Board</strong>
                &nbsp;
                <select id="board-select-mobile" value={selectedAddress} onChange={handleSelectChange}>
                  <option value="subscriptions">Subscriptions</option>
                  {defaultSubplebbits.map(subplebbit => (
                      <option key={`option-${subplebbit.address}`} value={subplebbit.address}
                      >{subplebbit.title ? subplebbit.title : subplebbit.address}</option>
                    ))}
                </select> 
                <button style={{all: 'unset', cursor: 'pointer'}} onClick={
                  () => alert(
                    'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                    )
                  }>Create Board</button>
              </div>
              <div className="page-jump">
                <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
                &nbsp;
                <Link to="/" onClick={() => handleStyleChange({target: {value: "Yotsuba"}}
                  )}>Home</Link>
              </div>
            </div>
            <div id="separator-mobile">&nbsp;</div>
            <div id="separator-mobile">&nbsp;</div>
          </>
        </NavBar>
        <Header selectedStyle={selectedStyle}>
          <>
            <div className="banner">
              <ImageBanner />
            </div>
              <>
              <div className="board-title">Subscriptions</div>
              {feed.length < 1 ? (
                <div className="board-address">You haven't subscribed to any board yet.</div>
              ) : (
                <div className="board-address">
                  You have subscribed to {account.subscriptions.length} board{account.subscriptions.length > 1 ? "s" : null}.
                </div>
              )}
              </>
          </>
        </Header>
        <Break selectedStyle={selectedStyle} />
        <TopBar selectedStyle={selectedStyle}>
          <hr />
          <span className="style-changer">
            Style:
             
            <select id="style-selector" onChange={handleStyleChange} value={selectedStyle}>
              <option value="Yotsuba">Yotsuba</option>
              <option value="Yotsuba-B">Yotsuba B</option>
              <option value="Futaba">Futaba</option>
              <option value="Burichan">Burichan</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="Photon">Photon</option>
            </select>
          </span>
          <div className="return-button" id="return-button-desktop">
            [
            <Link to={`/p/subscriptions`}>Return</Link>
            ]
          </div>
          <div id="return-button-mobile">
            <span className="btn-wrap-catalog btn-wrap">
              <Link to={`/p/subscriptions`}>Return</Link>
            </span>
          </div>
          <hr />
        </TopBar>
        <Tooltip id="tooltip" className="tooltip" />
        <Threads selectedStyle={selectedStyle}>
          { feed.length < 1 ? (
            null
          ) : (
            <InfiniteScroll
              pageStart={0}
              loadMore={tryLoadMore}
              hasMore={hasMore}
            >
              {feed.map((thread, index) => {
                const commentMediaInfo = getCommentMediaInfo(thread);
                const fallbackImgUrl = "assets/filedeleted-res.gif";
                return (
                  <Link style={{all: "unset", cursor: "pointer"}} key={`link-${index}`} to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`} 
                  onClick={() => setSelectedThread(thread.cid)}>
                    <div key={`thread-${index}`} className="thread">
                        {commentMediaInfo?.url ? (
                          <Fragment key="f-catalog">
                            {commentMediaInfo?.type === "webpage" ? (
                              thread.thumbnailUrl ? (
                              <img className="card" key={`img-${index}`}
                              src={commentMediaInfo.thumbnail} alt={commentMediaInfo.type}
                              onError={(e) => {
                                e.target.src = fallbackImgUrl
                                e.target.onerror = null;
                              }}  />
                              ) : null
                            ) : null}
                            {commentMediaInfo?.type === "image" ? (
                              <img className="card" key={`img-${index}`}
                              src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                              onError={(e) => {
                                e.target.src = fallbackImgUrl
                                e.target.onerror = null;}}  />
                            ) : null}
                            {commentMediaInfo?.type === "video" ? (
                              <video className="card" key={`fti-${index}`} 
                              src={commentMediaInfo.url} 
                              alt={commentMediaInfo.type} 
                              style={{ pointerEvents: "none" }}
                              onError={(e) => e.target.src = fallbackImgUrl} /> 
                            ) : null}
                            {commentMediaInfo?.type === "audio" ? (
                              <audio className="card" controls 
                              key={`fti-${index}`} 
                              src={commentMediaInfo.url} 
                              alt={commentMediaInfo.type} 
                              style={{ pointerEvents: "none" }}
                              onError={(e) => e.target.src = fallbackImgUrl} />
                            ) : null}
                          </Fragment>
                        ) : null}
                      <div key={`ti-${index}`} className="thread-icons" >
                      {(commentMediaInfo && (
                        commentMediaInfo.type === 'image' || 
                        commentMediaInfo.type === 'video' || 
                        (commentMediaInfo.type === 'webpage' && 
                        commentMediaInfo.thumbnail))) ? (                          
                          // <span key={`si-${index}`} className="thread-icon sticky-icon" title="Sticky" /> */
                          <OfflineIndicator 
                          address={thread.subplebbitAddress} 
                          className="thread-icon offline-icon"
                          tooltipPlace="top" />
                        ) : (
                          // <span key={`si-${index}`} className="thread-icon sticky-icon-no-link" title="Sticky" /> */
                          <OfflineIndicator 
                          address={thread.subplebbitAddress} 
                          className="thread-icon offline-icon-no-link"
                          tooltipPlace="top" />
                        ) }
                      </div>
                      <div key={`meta-${index}`} className="meta" title="(R)eplies / (I)mage Replies" >
                        R:
                        <b key={`b-${index}`}>{thread.replyCount}</b>
                      </div>
                      <div key={`t-${index}`} className="teaser">
                          <b key={`b2-${index}`}>{thread.title ? `${thread.title}` : null}</b>
                          {thread.content ? `: ${thread.content}` : null}
                      </div>
                    </div>
                  </Link>
                )})}
            </InfiniteScroll>
          )}
        </Threads>
        <Footer selectedStyle={selectedStyle}>
          <Break id="break" selectedStyle={selectedStyle} style={{
            marginTop: "-36px",
            width: "100%",
          }} />
          <Break selectedStyle={selectedStyle} style={{
            width: "100%",
          }} />
          <span className="style-changer" style={{
            float: "right",
            marginTop: "2px",
          }}>
            Style:
             
            <select id="style-selector" onChange={handleStyleChange} value={selectedStyle}>
              <option value="Yotsuba">Yotsuba</option>
              <option value="Yotsuba-B">Yotsuba B</option>
              <option value="Futaba">Futaba</option>
              <option value="Burichan">Burichan</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="Photon">Photon</option>
            </select>
          </span>
          <NavBar selectedStyle={selectedStyle} style={{
            marginTop: "42px",
          }}>
          <>
            <span className="boardList">
              [
                <Link to={`/p/subscriptions`}>Subscriptions</Link>
              ]&nbsp;[
            {defaultSubplebbits.map((subplebbit, index) => (
              <span className="boardList" key={`span-${subplebbit.address}`}>
                {index === 0 ? null : "\u00a0"}
                <Link to={`/p/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => handleClickTitle(subplebbit.title, subplebbit.address)}
                >{subplebbit.title ? subplebbit.title : subplebbit.address}</Link>
                {index !== defaultSubplebbits.length - 1 ? " /" : null}
                </span>
              ))}
              ]
            </span>
              <span className="nav">
              [
              <button style={{all: 'unset', cursor: 'pointer'}} onClick={
                () => alert(
                  'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                  )
              }>Create Board</button>
              ]
                [
                <Link to={`/p/subscriptions/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
                ]
                [
                <Link to="/" onClick={() => handleStyleChange({target: {value: "Yotsuba"}}
                )}>Home</Link>
                ]
              </span>
            </>
          </NavBar>
          <div id="version">
            plebchan v{version}. GPL-2.0
          </div>
          <div className="footer-links"
            style={{
              textAlign: "center",
              fontSize: "x-small",
              fontFamily: "arial",
              marginTop: "5px",
              marginBottom: "15px",
            }}>
            <a style={{textDecoration: 'underline'}} href="https://plebbit.com" target="_blank" rel="noopener noreferrer">About</a>
            &nbsp;•&nbsp;  
            <a style={{textDecoration: 'underline'}} href="https://github.com/plebbit/plebchan/releases/latest" target="_blank" rel="noopener noreferrer">App</a>
            &nbsp;•&nbsp;
            <a style={{textDecoration: 'underline'}} href="https://twitter.com/plebchan_eth" target="_blank" rel="noopener noreferrer">Twitter</a>
            &nbsp;•&nbsp;  
            <a style={{textDecoration: 'underline'}} href="https://t.me/plebbit" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
        </Footer>
      </Container>
    </>
  );
}

export default SubscriptionsCatalog;