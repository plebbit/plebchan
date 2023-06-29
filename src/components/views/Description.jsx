import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import { Container, NavBar, Header, Break, PostMenu, PostForm } from '../styled/views/Board.styled';
import { TopBar, BoardForm, Footer, ReplyFormLink} from '../styled/views/Thread.styled';
import { PostMenuCatalog } from '../styled/views/Catalog.styled';
import ImageBanner from '../ImageBanner';
import AdminListModal from '../modals/AdminListModal';
import OfflineIndicator from '../OfflineIndicator';
import SettingsModal from '../modals/SettingsModal';
import getDate from '../../utils/getDate';
import handleImageClick from '../../utils/handleImageClick';
import handleStyleChange from '../../utils/handleStyleChange';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import packageJson from '../../../package.json'
const {version} = packageJson


const Description = () => {
  const {
    defaultSubplebbits,
    isSettingsOpen, setIsSettingsOpen,
    selectedAddress, setSelectedAddress,
    selectedStyle,
    selectedThread, setSelectedThread,
    setSelectedTitle,
  } = useGeneralStore(state => state);
  
  const navigate = useNavigate();

  const threadMenuRefs = useRef({});
  const postMenuRef = useRef(null);
  const postMenuCatalogRef = useRef(null);

  const [isAdminListOpen, setIsAdminListOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
  const [openMenuCid, setOpenMenuCid] = useState(null);

  const { subplebbitAddress, threadCid } = useParams();
  const subplebbit = useSubplebbit({subplebbitAddress: selectedAddress});
  

  const handleOptionClick = () => {
    setOpenMenuCid(null);
  };

  const handleOutsideClick = useCallback((e) => {
    if (openMenuCid !== null && !postMenuRef.current.contains(e.target) && !postMenuCatalogRef.current.contains(e.target)) {
      setOpenMenuCid(null);
    }
  }, [openMenuCid, postMenuRef, postMenuCatalogRef]);


  useEffect(() => {
    if (openMenuCid !== null) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [openMenuCid, handleOutsideClick]);

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // temporary title from JSON, gets subplebbitAddress and threadCid from URL
  useEffect(() => {
    setSelectedAddress(subplebbitAddress);
    setSelectedThread(threadCid);
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
    if (selectedSubplebbit) {
      setSelectedTitle(selectedSubplebbit.title);
    }
  }, [subplebbitAddress, setSelectedAddress, setSelectedTitle, defaultSubplebbits, setSelectedThread, threadCid]);

  // mobile navbar scroll effect
  useEffect(() => {
    const debouncedHandleScroll = debounce(() => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    }, 50);
  
    window.addEventListener('scroll', debouncedHandleScroll);
  
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [prevScrollPos, visible]);

  // mobile navbar board select functionality
  const handleSelectChange = (event) => {
    const selected = event.target.value;

    if (selected === 'subscriptions') {
      navigate(`/p/subscriptions`);
      return;
    } else if (selected === 'all') {
      navigate(`/p/all`);
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
          <title>
          {"Board Description - " + (subplebbit.title || subplebbit.address) + " - plebchan"}
          </title>
        </Helmet>
      <Container>
        <AdminListModal
        selectedStyle={selectedStyle}
        isOpen={isAdminListOpen}
        closeModal={() => setIsAdminListOpen(false)}
        roles={subplebbit.roles} />
        <SettingsModal
        selectedStyle={selectedStyle}
        isOpen={isSettingsOpen}
        closeModal={() => setIsSettingsOpen(false)} />
        <NavBar selectedStyle={selectedStyle}>
          <>
          <span className="boardList">
            [
              <Link to={`/p/all`}>All</Link>
               / 
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
              <span id="button-span" style={{cursor: 'pointer'}} onClick={
                () => alert(
                  'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                  )
              }>Create Board</span>
              ]
              [
              <Link to={`/p/${selectedAddress}/c/${selectedThread}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
              ]
              [
              <Link to="/">Home</Link>
              ]
            </span>
            <div id="board-nav-mobile" style={{ top: visible ? 0 : '-23px' }}>
              <div className="nav-container">
                <div className="board-select">
                  <strong>Board</strong>
                  &nbsp;
                  <select id="board-select-mobile" value={selectedAddress} onChange={handleSelectChange}>
                    <option value="all">All</option>
                    <option value="subscriptions">Subscriptions</option>
                    {defaultSubplebbits.map(subplebbit => (
                        <option key={`option-${subplebbit.address}`} value={subplebbit.address}
                        >{subplebbit.title ? subplebbit.title : subplebbit.address}</option>
                      ))}
                  </select> 
                  <span id="button-span" style={{cursor: 'pointer'}} onClick={
                  () => alert(
                    'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                    )
                  }>Create Board</span>
                </div>
                <div className="page-jump">
                  <Link to={`/p/${selectedAddress}/c/${selectedThread}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
                  &nbsp;
                  <Link to="/" onClick={() => {handleStyleChange({target: {value: "Yotsuba"}}); window.scrollTo(0, 0);}}>Home</Link>
                </div>
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
              <div className="board-title">{subplebbit.title ?? null}</div>
              <div className="board-address">p/{subplebbit.address}
                <OfflineIndicator 
                address={subplebbit.address} 
                className="offline"
                tooltipPlace="top" />
              </div>
              </>
          </>
        </Header>
        <Break selectedStyle={selectedStyle} />
        <PostForm selectedStyle={selectedStyle}>
          <ReplyFormLink id="post-form-link" selectedStyle={selectedStyle} style={{marginBottom: '10px'}}>
          <div id="return-button-mobile">
              <span className="btn-wrap" onClick={()=> {window.scrollTo(0, 0)}}>
                <Link to={`/p/${selectedAddress}`}>Return</Link>
              </span>
            </div>
            <div id="catalog-button-mobile">
              <span className="btn-wrap">
                <Link to={`/p/${selectedAddress}/catalog`} onClick={()=> {window.scrollTo(0, 0)}}>Catalog</Link>
              </span>
            </div>
            <div id="bottom-button-mobile">
              <span className="btn-wrap">
                <span style={{cursor: 'pointer'}} onClick={() => window.scrollTo(0, document.body.scrollHeight)} onMouseOver={(event) => event.target.style.cursor='pointer'}>Bottom</span>
              </span>
            </div>
          </ReplyFormLink>
        </PostForm>
        <TopBar selectedStyle={selectedStyle}>
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
          <span className="return-button" id="return-button-desktop">
            [
            <Link to={`/p/${selectedAddress}`}>Return</Link>
            ]
          </span>
          <span className="return-button catalog-button" id="catalog-button-desktop">
            [
            <Link to={`/p/${selectedAddress}/catalog`}>Catalog</Link>
            ]
          </span>
          <span className="return-button catalog-button" id="bottom-button-desktop">
            [
            <span id="button" style={{cursor: 'pointer'}} onClick={() =>  window.scrollTo(0, document.body.scrollHeight)} 
            onMouseOver={(event) => event.target.style.cursor='pointer'} 
            onTouchStart={() =>  window.scrollTo(0, document.body.scrollHeight)}>Bottom</span>
            ]
          </span>
        </TopBar>
        <Tooltip id="tooltip" className="tooltip" />
        <BoardForm selectedStyle={selectedStyle}>
          <>
            <div className="thread">
              <div className="op-container" style={{
              display: subplebbit.rules ? "grid" : "block",
              marginBottom: '10px',
              }}>
                <div className="post op op-desktop">
                  <hr />
                  <div className="post-info">
                    {subplebbit.suggested?.avatarUrl ? (
                      <div className="file" style={{marginBottom: "5px"}}>
                        <div className="file-text">
                          Link:&nbsp;
                          <a href={subplebbit.suggested?.avatarUrl} 
                          target="_blank" rel="noopener noreferrer">{
                          subplebbit.suggested?.avatarUrl.length > 30 ?
                          subplebbit.suggested?.avatarUrl.slice(0, 30) + "..." :
                          subplebbit.suggested?.avatarUrl
                          }
                          </a>&nbsp;(image)
                        </div>
                        <div className="img-container">
                          <span className="file-thumb">
                            <img src={subplebbit.suggested?.avatarUrl} alt="board avatar"
                            onClick={handleImageClick}
                            style={{cursor: "pointer"}} />
                          </span>
                        </div>
                      </div>
                      ) : null}
                    <span className="name-block">
                      <span className="title">Welcome to {subplebbit.title || subplebbit.address}</span>
                      &nbsp;
                      <span className="name capcode"
                      style={{cursor: 'pointer'}}
                      onClick={() => {setIsAdminListOpen(!isAdminListOpen)}}
                      >## Board Admins</span>
                      &nbsp;
                      <span className="date-time">{getDate(subplebbit.createdAt)}</span>
                      &nbsp;
                      <img src="assets/sticky.gif" alt="Sticky" title="Sticky" style={{marginBottom: "-1px", imageRendering: 'pixelated'}} />
                      &nbsp;
                      <img src="assets/closed.gif" alt="Closed" title="Closed" style={{marginBottom: "-1px", imageRendering: 'pixelated'}} />
                      <span>&nbsp;
                          [
                          <Link to={() => {}} style={{textDecoration: "none"}} className="reply-link">Reply</Link>
                          ]
                      </span>
                      <PostMenu 
                        title="Post menu"
                        ref={el => { 
                          threadMenuRefs.current[subplebbit.pubsubTopic] = el;
                        }}
                        className='post-menu-button' 
                        rotated={openMenuCid === subplebbit.pubsubTopic}
                        onClick={(event) => {
                          event.stopPropagation();
                          const rect = threadMenuRefs.current[subplebbit.pubsubTopic].getBoundingClientRect();
                          setMenuPosition({top: rect.top + window.scrollY, left: rect.left});
                          setOpenMenuCid(prevCid => (prevCid === subplebbit.pubsubTopic ? null : subplebbit.pubsubTopic));
                        }}
                      >
                        ▶
                      </PostMenu>
                      {createPortal(
                        <PostMenuCatalog selectedStyle={selectedStyle} 
                        ref={el => {postMenuCatalogRef.current = el}}
                        onClick={(event) => event.stopPropagation()}
                        style={{position: "absolute", 
                        top: menuPosition.top + 7, 
                        left: menuPosition.left}}>
                        <div className={`post-menu-thread post-menu-thread-${subplebbit.pubsubTopic}`}
                        style={{ display: openMenuCid === subplebbit.pubsubTopic ? 'block' : 'none' }}
                        >
                          <ul className="post-menu-catalog">
                            <li onClick={() => handleOptionClick(subplebbit.pubsubTopic)}>Hide thread</li>
                            {/* {isModerator ? (
                              <>
                                change description
                              </>
                            ) : null} */}
                          </ul>
                        </div>
                        </PostMenuCatalog>, document.body
                      )}
                    </span>
                    <blockquote>
                      <div className="custom-paragraph">
                        {subplebbit.description}
                      </div>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
            <div className="thread-mobile">
              <hr />
              <div className="op-container">
                <div className="post op op-mobile">
                  <div className="post-info-mobile">
                    <button className="post-menu-button-mobile"
                    style={{ all: 'unset', cursor: 'pointer' }}>...</button>
                    <span className="name-block-mobile">
                      <span className="name-mobile capcode"
                      style={{cursor: 'pointer'}}
                      onClick={() => {setIsAdminListOpen(!isAdminListOpen)}}
                      >## Board Admins</span>
                      &nbsp;
                      <span className="thread-icons-mobile"
                      style={{float: "right", marginRight: "18px"}}>
                        <img src="assets/sticky.gif" alt="Sticky" title="Sticky" style={{marginTop: "-1px", marginRight: "2px", imageRendering: 'pixelated'}} />
                        &nbsp;
                        <img src="assets/closed.gif" alt="Closed" title="Closed" style={{marginTop: "-1px", marginRight: "2px", imageRendering: 'pixelated'}} />
                      </span>
                      <br />
                      <span className="subject-mobile"
                    style={{marginBottom: "-15px"}}>Welcome to {subplebbit.title || subplebbit.address}</span>
                      &nbsp;
                    </span>
                    <span className="date-time-mobile post-number-mobile">{getDate(subplebbit.createdAt)}</span>
                    &nbsp;
                  </div>
                  {subplebbit.suggested?.avatarUrl ? (
                    <div className="file-mobile">
                      <div className="img-container">
                        <span className="file-thumb-mobile">
                          <img src={subplebbit.suggested.avatarUrl} alt="board avatar"
                          onClick={handleImageClick}
                          style={{cursor: "pointer"}} />
                          <div className="file-info-mobile">image</div>
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <blockquote className="post-message-mobile">
                    <div className="custom-paragraph">
                      {subplebbit.description}
                    </div>
                  </blockquote>
                </div>
                <div className="post-link-mobile">
                  <Link to={() => {}} className="button-mobile">View Thread</Link>
                </div>
              </div>
            </div>
          </>
        </BoardForm>
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
                <Link to={`/p/all`}>All</Link>
                 / 
                <Link to={`/p/subscriptions`}>Subscriptions</Link>
              ]&nbsp;
            </span>
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
            <span className="nav">
              [
                <span id="button-span" style={{cursor: 'pointer'}} onClick={
                  () => alert(
                    'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                    )
                }>Create Board</span>
              ]
                [
                <Link to={`/p/${selectedAddress}/c/${selectedThread}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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

export default Description;