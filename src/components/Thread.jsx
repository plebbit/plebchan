import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, NavBar, Header, Break, PostForm, BoardForm } from './styles/Board.styled';
import { ReplyFormTable, ReplyFormLink, TopBar, BottomBar } from './styles/Thread.styled';
import { BoardContext } from '../App';
import { useComment } from '@plebbit/plebbit-react-hooks';
import ImageBanner from './ImageBanner';
import { Tooltip } from 'react-tooltip';
import getDate from '../utils/getDate';
import renderThreadComments from '../utils/renderThreadComments';
import { useCookies } from 'react-cookie';


const Thread = ({ setBodyStyle }) => {
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const { selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, selectedThread, setSelectedThread, selectedStyle, setSelectedStyle } = useContext(BoardContext);
  const [showPostFormLink, setShowPostFormLink] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const comment = useComment(`${selectedThread}`);
  const { subplebbitAddress, threadCid } = useParams();
  const [cookies, setCookie] = useCookies(['selectedStyle']);


  // temporary title from JSON, gets subplebbitAddress and threadCid from URL
  useEffect(() => {
    setSelectedAddress(subplebbitAddress);
    setSelectedThread(threadCid);
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
    if (selectedSubplebbit) {
      setSelectedTitle(selectedSubplebbit.title);
    }
  }, [subplebbitAddress, setSelectedAddress, setSelectedTitle, defaultSubplebbits]);
  
  // fetches default subplebbits from JSON
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

  // mobile navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible]);
  
  // post route handling
  useEffect(() => {
    const path = location.pathname;
    if (path.endsWith('/post')) {
      setShowPostFormLink(false);
      setShowPostForm(true);
    } else {
      setShowPostFormLink(true);
      setShowPostForm(false);
    }
  }, [location.pathname]);



  const handleVoidClick = () => {}

  // desktop navbar board select functionality
  const handleClickTitle = (title, address) => {
    setSelectedTitle(title);
    setSelectedAddress(address);
  };

  // mobile navbar board select functionality
  const handleSelectChange = (event) => {
    const selected = event.target.value;
    const selectedTitle = defaultSubplebbits.find((subplebbit) => subplebbit.address === selected).title;
    setSelectedTitle(selectedTitle);
    setSelectedAddress(selected);
    navigate(`/${selected}`);
  }


  const handleClickHelp = () => {
    alert("- The CAPTCHA loads after you click \"Post\" \n- The CAPTCHA is case-sensitive. \n- Make sure to not block any cookies set by plebchan.");
  };


  const handleClickForm = () => {
    setShowPostFormLink(false);
    setShowPostForm(true);
    navigate(`/${selectedAddress}/thread/${selectedThread}/post`);
  };


  const handleClickTop = () => {
    window.scrollTo(0, 0);
  }


  const handleClickBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  }

  // scroll to post when quote is clicked
  function handleQuoteClick(reply, event) {
    event.preventDefault();
    const cid = reply.cid.slice(0, 8);
    const targetElement = [...document.querySelectorAll('.post-reply')]
      .find(el => el.innerHTML.includes(cid));
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: "instant" });
    }
  }


  const handleStyleChange = (event) => {
    switch (event.target.value) {
      case "Yotsuba":
        setBodyStyle({
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba");
        setCookie("selectedStyle", "Yotsuba", { path: "/" });
        break;

      case "Yotsuba-B":
        setBodyStyle({
          background: "#eef2ff url(/assets/fade-blue.png) top center repeat-x",
          color: "#000",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba-B");
        setCookie("selectedStyle", "Yotsuba-B", { path: "/", sameSite: 'none', secure: true });
        break;

      case "Futaba":
        setBodyStyle({
          background: "#ffe",
          color: "maroon",
          fontFamily: "times new roman, serif"
        });
        setSelectedStyle("Futaba");
        setCookie("selectedStyle", "Futaba", { path: "/", sameSite: 'none', secure: true });
        break;

      case "Burichan":
        setBodyStyle({
          background: "#eef2ff",
          color: "#000",
          fontFamily: "times new roman, serif"
        });
        setSelectedStyle("Burichan");
        setCookie("selectedStyle", "Burichan", { path: "/", sameSite: 'none', secure: true });
        break;
        
      case "Tomorrow":
        setBodyStyle({
          background: "#1d1f21 none",
          color: "#c5c8c6",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Tomorrow");
        setCookie("selectedStyle", "Tomorrow", { path: "/", sameSite: 'none', secure: true });
        break;

      case "Photon":
        setBodyStyle({
          background: "#eee none",
          color: "#333",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Photon");
        setCookie("selectedStyle", "Photon", { path: "/", sameSite: 'none', secure: true });
        break;

      default:
        setBodyStyle({
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba");
        setCookie("selectedStyle", "Yotsuba", { path: "/", sameSite: 'none', secure: true });
    }
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  
  useEffect(() => {
    const style = getCookie("selectedStyle");
    if (style) {
      handleStyleChange({ target: { value: style } });
    }
  }, []);
  
  

  return (
    <Container>
      <NavBar selectedStyle={selectedStyle}>
        <>
          {defaultSubplebbits.map(subplebbit => (
            <span className="boardList" key={`span-${Math.random()}`}>
              [
              <Link key={`a-${Math.random()}`} 
              to={`/${subplebbit.address}`} 
              onClick={() => handleClickTitle(subplebbit.title, subplebbit.address)}
              >{subplebbit.title}</Link>
              ]&nbsp;
            </span>
          ))}
          <span className="nav">
            [
            <Link to="" onClick={handleVoidClick}>Settings</Link>
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
                {defaultSubplebbits.map(subplebbit => (
                    <option key={`option-${Math.random()}`} value={subplebbit.address}
                    >{subplebbit.title}</option>
                  ))}
              </select>
            </div>
            <div className="page-jump">
              <Link to="" onClick={handleVoidClick}>Settings</Link>
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
            <div className="board-title">{selectedTitle}</div>
            <div className="board-address">p/{selectedAddress}</div>
            </>
        </>
      </Header>
      <Break selectedStyle={selectedStyle} />
      <PostForm selectedStyle={selectedStyle} name="post" action="" method="post" enctype="multipart/form-data">
        <ReplyFormLink id="post-form-link" showReplyFormLink={showPostFormLink} selectedStyle={selectedStyle} >
          <div id="return-button-mobile">
            <span className="btn-wrap">
              <Link to={`/${selectedAddress}`}>Return</Link>
            </span>
          </div>
          <div id="catalog-button-mobile">
            <span className="btn-wrap">
              <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
            </span>
          </div>
          <div id="bottom-button-mobile">
            <span className="btn-wrap">
              <a onClick={handleClickBottom} onMouseOver={(event) => event.target.style.cursor='pointer'}>Bottom</a>
            </span>
          </div>
          <div id="post-form-link-desktop">
            [
              <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</a>
            ]
          </div>
          <div id="post-form-link-mobile">
            <span className="btn-wrap">
              <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</a>
            </span>
          </div>
        </ReplyFormLink>
        <ReplyFormTable id="post-form" showReplyForm={showPostForm} selectedStyle={selectedStyle} className="post-form">
          <tbody>
            <tr data-type="Subject">
              <td>Name</td>
              <td>
                <input name="sub" type="text" placeholder='Anonymous' tabIndex={3} />
                <input id="post-button" type="submit" value="Post" tabIndex={6} />
              </td>
            </tr>
            <tr data-type="Comment">
              <td>Comment</td>
              <td>
                <textarea name="com" cols="48" rows="4" tabIndex={4} wrap="soft"></textarea>
              </td>
            </tr>
            <tr id="captchaFormPart">
              <td>Verification</td>
              <td colSpan={2}>
                <div id="t-root">
                  <input id="t-resp" name="t-response" placeholder="Type the CAPTCHA here" autoComplete='off' type="text" />
                  <button id="t-help" type="button" onClick={handleClickHelp} data-tip="Help" tabIndex={-1}>?</button>
                  <div id="t-cnt">
                    <div id="t-bg"></div>
                    <div id="t-fg"></div>
                  </div>
                  <div id="t-msg"></div>
                  <input name="t-challenge" type="hidden"/>
                </div>
              </td>
            </tr>
            <tr data-type="File">
              <td>Embed File</td>
              <td>
                <input name="embed" type="text" tabIndex={7} placeholder="Paste link" />
              </td>
            </tr>
            <tr></tr>
          </tbody>
        </ReplyFormTable>
      </PostForm>
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
        <span className="return-button" id="return-button-desktop">
          [
          <Link to={`/${selectedAddress}`}>Return</Link>
          ]
        </span>
        <span className="return-button catalog-button" id="catalog-button-desktop">
          [
          <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
          ]
        </span>
        <span className="return-button catalog-button" id="bottom-button-desktop">
          [
          <a onClick={handleClickBottom} onMouseOver={(event) => event.target.style.cursor='pointer'} onTouchStart={handleClickBottom}>Bottom</a>
          ]
        </span>
        {comment ? (
          comment.replyCount > 0 ? (
            <span className="reply-stat">{comment.replyCount} replies</span>
          ) : (
            <span className="reply-stat">No replies yet</span>
        )) : (
          null
        )}
        <hr />
      </TopBar>
      <BoardForm selectedStyle={selectedStyle}>
        {comment ? (
          <>
            <div className="thread">
              <div className="op-container">
                <div className="post op">
                  <div className="post-info">
                    <div key={`f-${Math.random()}`} className="file">
                        <div key={`ft-${Math.random()}`} className="file-text">
                          File:&nbsp;
                          <a key={`fa-${Math.random()}`} href={`${comment.link}`} target="_blank">filename.something</a>&nbsp;(metadata)
                        </div>
                        <Link to="" key={`fta-${Math.random()}`} onClick={handleVoidClick} target="_blank" className="file-thumb">
                          <img key={`fti-${Math.random()}`} src="/assets/plebchan-psycho.png" alt="filename.something" />
                        </Link>
                      </div>
                    <span className="name-block">
                        {comment.title ? (
                          comment.title.length > 75 ?
                          <>
                            <Tooltip key={`mob-tt-tm-${Math.random()}`} id="tt-title-mobile" className="tooltip" />
                            <span key={`q-${Math.random()}`} className="title"
                            data-tooltip-id="tt-title-mobile"
                            data-tooltip-content={comment.title}
                            data-tooltip-place="top">
                              {comment.title.slice(0, 75) + " (...)"}
                            </span>
                          </>
                        : <span key={`q-${Math.random()}`} className="title">
                          {comment.title}
                          </span>) 
                        : null}
                      &nbsp;
                      {comment.author.displayName
                        ? comment.author.displayName.length > 20
                        ? <>
                            <Tooltip key={`mob-tt-nm-${Math.random()}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`n-${Math.random()}`} className="name"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={comment.author.displayName}
                            data-tooltip-place="top">
                              {comment.author.displayName.slice(0, 20) + " (...)"}
                            </span>
                          </> 
                          : <span key={`n-${Math.random()}`} className="name">
                            {comment.author.displayName}</span>
                        : <span key={`n-${Math.random()}`} className="name">
                          Anonymous</span>}
                        &nbsp;
                      &nbsp;
                      <span className="poster-address">
                        (u/
                          {comment.author.address.length > 20 ?
                        <>
                          <Tooltip key={`mob-tt-am-${Math.random()}`} id="tt-address-mobile" className="tooltip" />
                          <span key={`pa-${Math.random()}`} className="poster-address"
                          data-tooltip-id="tt-address-mobile"
                          data-tooltip-content={comment.author.address}
                          data-tooltip-place="top">
                            {comment.author.address.slice(0, 20) + "..."}
                          </span>
                        </>
                        : <span key={`pa-${Math.random()}`} className="poster-address">
                          {comment.author.address}
                        </span>})
                      </span>
                      &nbsp;
                      <span className="date-time" data-utc="data">{getDate(comment.timestamp)}</span>
                      &nbsp;
                      <span className="post-number">
                        <Link to="" onClick={handleVoidClick} title="Link to this post">c/</Link>
                        <Link to="" onClick={handleVoidClick} title="Reply to this post">{comment.cid.slice(0, 8)}</Link>
                      </span>
                      <Link to="" key={`pmb-${Math.random()}`} className="post-menu-button" onClick={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</Link>
                      <div id="backlink-id" className="backlink">
                        {comment.replies?.pages.topAll.comments
                          .sort((a, b) => a.timestamp - b.timestamp)
                          .map((reply) => (
                            <div key={`div-${Math.random()}`} style={{display: 'inline-block'}}>
                            <Link to={handleVoidClick} key={`ql-${Math.random()}`}
                              className="quote-link" 
                              onClick={(event) => handleQuoteClick(reply, event)}>
                              c/{reply.cid.slice(0, 8)}</Link>
                              &nbsp;
                            </div>
                          ))
                        }
                      </div>
                    </span>
                    <blockquote>
                      {comment.content}
                    </blockquote>
                  </div>
                </div>
              </div>
              {comment.replyCount > 0 && 
              Object.keys(comment.replies.pages.topAll.comments).map(() => {
                const renderedComments = renderThreadComments(comment.replies.pages.topAll.comments);
                return renderedComments.map(reply => {
                  return (
                    <div key={`pc-${Math.random()}`} className="reply-container">
                      <div key={`sa-${Math.random()}`} className="side-arrows">{'>>'}</div>
                      <div key={`pr-${Math.random()}`} className="post-reply" id="post-reply">
                        <div key={`pi-${Math.random()}`} className="post-info">
                        &nbsp;
                          <span key={`nb-${Math.random()}`} className="nameblock">
                          {reply.author.displayName
                          ? reply.author.displayName.length > 20
                          ? <>
                              <Tooltip key={`mob-tt-nm-${Math.random()}`} id="tt-name" className="tooltip" />
                              <span key={`mob-n-${Math.random()}`} className="name"
                              data-tooltip-id="tt-name"
                              data-tooltip-content={reply.author.displayName}
                              data-tooltip-place="top">
                                {reply.author.displayName.slice(0, 20) + " (...)"}
                              </span>
                            </>
                            : <span key={`mob-n-${Math.random()}`} className="name">
                              {reply.author.displayName}</span>
                          : <span key={`mob-n-${Math.random()}`} className="name">
                            Anonymous</span>}
                            &nbsp;
                            <span key={`pa-${Math.random()}`} className="poster-address">
                              (u/
                              {reply.author.address.length > 20 ?
                              <>
                                <Tooltip key={`mob-tt-am-${Math.random()}`} id="tt-address" className="tooltip" />
                                <span key={`mob-ha-${Math.random()}`}
                                data-tooltip-id="tt-address"
                                data-tooltip-content={reply.author.address}
                                data-tooltip-place="top">
                                  {reply.author.address.slice(0, 20) + "..."}
                                </span>
                              </>
                              : <span key={`mob-ha-${Math.random()}`}>
                                {reply.author.address}
                              </span>})
                            </span>
                          </span>
                          &nbsp;
                          <span key={`dt-${Math.random()}`} className="date-time" data-utc="data">{getDate(reply.timestamp)}</span>
                          &nbsp;
                          <span key={`pn-${Math.random()}`} className="post-number">
                            <Link to="" key={`pl1-${Math.random()}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                            <Link to="" key={`pl2-${Math.random()}`} onClick={handleVoidClick} title="Reply to this post">{reply.cid.slice(0, 8)}</Link>
                          </span>
                          <Link to="" key={`pmb-${Math.random()}`} className="post-menu-button" onClick={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</Link>
                          <div id="backlink-id" className="backlink">
                            {reply.replies?.pages.topAll.comments
                              .sort((a, b) => a.timestamp - b.timestamp)
                              .map((reply) => (
                                <div key={`div-${Math.random()}`} style={{display: 'inline-block'}}>
                                <Link to={handleVoidClick} key={`ql-${Math.random()}`}
                                  className="quote-link" 
                                  onClick={(event) => handleQuoteClick(reply, event)}>
                                  c/{reply.cid.slice(0, 8)}</Link>
                                  &nbsp;
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        <blockquote key={`pm-${Math.random()}`} className="post-message">
                          <Link to={handleVoidClick} className="quote-link"
                            onClick={(event) => handleQuoteClick(reply, event)}>
                            {`c/${reply.parentCid.slice(0, 8)}`}{<br />}
                          </Link>
                          {reply.content}
                        </blockquote>
                      </div>
                    </div>
                  )
                })
              })}
            </div>
            <div className="thread-mobile">
              <hr />
              <div className="op-container">
                  <div key={`mob-po-${Math.random()}`} className="post op">
                    <div key={`mob-pi-${Math.random()}`} className="post-info-mobile">
                      <Link to="" key={`mob-pb-${Math.random()}`} className="post-menu-button-mobile" onClick={handleVoidClick}>...</Link>
                      <span className="name-block-mobile">
                        {comment.author.displayName
                        ? comment.author.displayName.length > 15
                        ? <>
                            <Tooltip key={`mob-tt-nm-${Math.random()}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`mob-n-${Math.random()}`} className="name-mobile"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={comment.author.displayName}
                            data-tooltip-place="top">
                              {comment.author.displayName.slice(0, 15) + " (...)"}
                            </span>
                          </> 
                          : <span key={`mob-n-${Math.random()}`} className="name-mobile">
                            {comment.author.displayName}</span>
                        : <span key={`mob-n-${Math.random()}`} className="name-mobile">
                          Anonymous</span>}
                        &nbsp;
                        <span key={`mob-pa-${Math.random()}`} className="poster-address-mobile">
                          (u/
                          {comment.author.address.length > 15 ?
                          <>
                            <Tooltip key={`mob-tt-am-${Math.random()}`} id="tt-address-mobile" className="tooltip" />
                            <span key={`mob-ha-${Math.random()}`} className="highlight-address-mobile"
                            data-tooltip-id="tt-address-mobile"
                            data-tooltip-content={comment.author.address}
                            data-tooltip-place="top">
                              {comment.author.address.slice(0, 15) + "..."}
                            </span>
                          </>
                          : <span key={`mob-ha-${Math.random()}`} className="highlight-address-mobile">
                            {comment.author.address}
                          </span>}
                          )&nbsp;
                        </span>
                        <br key={`mob-br1-${Math.random()}`} />
                        {comment.title ? (
                            comment.title.length > 30 ?
                            <>
                              <Tooltip key={`mob-tt-tm-${Math.random()}`} id="tt-title-mobile" className="tooltip" />
                              <span key={`mob-t-${Math.random()}`} className="subject-mobile"
                              data-tooltip-id="tt-title-mobile"
                              data-tooltip-content={comment.title}
                              data-tooltip-place="top">
                                {comment.title.slice(0, 30) + " (...)"}
                              </span>
                            </>
                            : <span key={`mob-t-${Math.random()}`} className="subject-mobile">
                              {comment.title}
                            </span>) : null}
                      </span>
                      <span key={`mob-dt-${Math.random()}`} className="date-time-mobile">
                        {getDate(comment.timestamp)}
                        &nbsp;
                        <Link to="" key={`mob-no-${Math.random()}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                        <Link to="" key={`mob-no2-${Math.random()}`} onClick={handleVoidClick} title="Reply to this post">{comment.cid.slice(0, 8)}</Link>
                      </span>
                    </div>
                    <div key={`mob-f-${Math.random()}`} className="file-mobile">
                      <Link to="" key={`mob-ft${Math.random()}`} className="file-thumb-mobile" onClick={handleVoidClick} target="_blank">
                        <img key={`mob-img-${Math.random()}`} src="/assets/plebchan-psycho.png" alt="" />
                        <div key={`mob-fi-${Math.random()}`} className="file-info-mobile">58 KB JPG</div>
                      </Link>
                    </div>
                    <blockquote key={`mob-bq-${Math.random()}`} className="post-message-mobile">
                      {comment.content ? (
                        <>
                          {comment.content}
                        </>
                      ) : null}
                    </blockquote>
                  </div>
                </div>
                {comment.replyCount > 0 && 
                Object.keys(comment.replies.pages.topAll.comments).map(() => {
                  const renderedComments = renderThreadComments(comment.replies.pages.topAll.comments);
                  return renderedComments.map(reply => {
                    return (
                  <div key={`mob-rc-${Math.random()}`} className="reply-container">
                    <div key={`mob-pr-${Math.random()}`} className="post-reply">
                      <div key={`mob-pi-${Math.random()}`} className="post-info-mobile">
                        <a className="post-menu-button-mobile" title="Post menu">...</a>
                        <span key={`mob-nb-${Math.random()}`} className="name-block-mobile">
                          {reply.author.displayName
                          ? reply.author.displayName.length > 12
                          ? <>
                              <Tooltip key={`mob-tt-nm-${Math.random()}`} id="tt-name-mobile" className="tooltip" />
                              <span key={`mob-n-${Math.random()}`} className="name-mobile"
                              data-tooltip-id="tt-name-mobile"
                              data-tooltip-content={reply.author.displayName}
                              data-tooltip-place="top">
                                {reply.author.displayName.slice(0, 12) + " (...)"}
                              </span>
                            </>
                            : <span key={`mob-n-${Math.random()}`} className="name-mobile">
                              {reply.author.displayName}</span>
                          : <span key={`mob-n-${Math.random()}`} className="name-mobile">
                            Anonymous</span>}
                          &nbsp;
                          <span key={`mob-pa-${Math.random()}`} className="poster-address-mobile">
                            (u/
                            {reply.author.address.length > 12 ?
                            <>
                              <Tooltip key={`mob-tt-am-${Math.random()}`} id="tt-address-mobile" className="tooltip" />
                              <span key={`mob-ha-${Math.random()}`} className="highlight-address-mobile"
                              data-tooltip-id="tt-address-mobile"
                              data-tooltip-content={reply.author.address}
                              data-tooltip-place="top">
                                {reply.author.address.slice(0, 12) + "..."}
                              </span>
                            </>
                            : <span key={`mob-ha-${Math.random()}`} className="highlight-address-mobile">
                              {reply.author.address}
                            </span>}
                            )
                          </span>
                          <br key={`mob-br-${Math.random()}`} />
                        </span>
                        <span key={`mob-dt-${Math.random()}`} className="date-time-mobile">
                          {getDate(reply.timestamp)}&nbsp;
                          <Link to="" key={`mob-pl1-${Math.random()}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                          <Link to="" key={`mob-pl2-${Math.random()}`} onClick={handleVoidClick} title="Reply to this post">{reply.cid.slice(0, 8)}</Link>
                        </span>
                      </div>
                      <blockquote key={`mob-pm-${Math.random()}`} className="post-message-mobile">
                        <Link to={handleVoidClick} key={`mob-ql-${Math.random()}`} className="quotelink-mobile" 
                        onClick={(event) => handleQuoteClick(reply, event)}>
                          {`c/${reply.parentCid.slice(0, 8)}`}{<br />}
                        </Link>
                        {reply.content}
                      </blockquote>
                    </div>
                  </div>
                  )
                })
              })}
            </div>
            <BottomBar selectedStyle={selectedStyle}>
                <div id="bottombar-desktop">
                  <hr />
                  <span className="bottom-bar-return">
                    [
                    <Link to={`/${selectedAddress}`}>Return</Link>
                    ]
                  </span>
                  <span className="bottom-bar-catalog">
                    [
                    <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
                    ]
                  </span>
                  <span className="bottom-bar-top">
                    [
                    <a onClick={handleClickTop} onMouseOver={(event) => event.target.style.cursor='pointer'} onTouchStart={handleClickTop}>Top</a>
                    ]
                  </span>
                  <span className="quickreply-button">
                  [
                  <Link to="" onClick={handleVoidClick} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</Link>
                  ]
                  </span>
                  {comment.replyCount > 0 ? (
                    <span className="reply-stat">{comment.replyCount} replies</span>
                  ) : (
                    <span className="reply-stat">No replies yet</span>
                  )}
                  <hr />
                </div>
              </BottomBar>
            <div id="bottombar-mobile">
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
                {comment ? (
                  comment.replyCount > 0 ? (
                    <span className="reply-stat">{comment.replyCount} replies</span>
                  ) : (
                    <span className="reply-stat">No replies yet</span>
                )) : (
                  null
                )}
                <hr />
              </TopBar>
              <ReplyFormLink id="post-form-link" selectedStyle={selectedStyle} >
                <div id="post-form-link-mobile" className="post-button-mobile">
                  <span className="btn-wrap">
                    <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</a>
                  </span>
                </div>
                <div id="btns-container">
                  <div id="return-button-mobile">
                    <span className="btn-wrap">
                      <Link to={`/${selectedAddress}`}>Return</Link>
                    </span>
                  </div>
                  <div id="catalog-button-mobile">
                    <span className="btn-wrap">
                      <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
                    </span>
                  </div>
                  <span className="bottom-bar-top">
                    <span className="btn-wrap">
                      <a onClick={handleClickTop} onMouseOver={(event) => event.target.style.cursor='pointer'} onTouchStart={handleClickTop}>Top</a>
                    </span>
                  </span>
                </div>
              </ReplyFormLink>
            </div>
          </>
         ) : (
          <div>Loading...</div>
        )}
      </BoardForm>
    </Container>
  );
}

export default Thread;