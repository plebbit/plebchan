import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, NavBar, Header, Break, PostForm, PostFormTable, BoardForm } from './styles/Board.styled';
import { ReplyFormLink, TopBar, BottomBar } from './styles/Thread.styled';
import { BoardContext } from '../App';
import { useComment, useAccountsActions } from '@plebbit/plebbit-react-hooks';
import ImageBanner from './ImageBanner';
import CaptchaModal from './CaptchaModal';
import { Tooltip } from 'react-tooltip';
import getDate from '../utils/getDate';
import renderThreadComments from '../utils/renderThreadComments';


const Thread = ({ setBodyStyle }) => {
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const { selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, selectedThread, setSelectedThread, selectedStyle, setSelectedStyle, captchaResponse, setCaptchaResponse } = useContext(BoardContext);
  const [showPostFormLink, setShowPostFormLink] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const { publishComment } = useAccountsActions();
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const comment = useComment(`${selectedThread}`);
  const { subplebbitAddress, threadCid } = useParams();


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

  // automatic dark mode without interefering with user's selected style
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = darkModeMediaQuery.matches;
  
    if (isDarkMode) {
      setSelectedStyle('Tomorrow');
      setBodyStyle({
        background: '#1d1f21 none',
        color: '#c5c8c6',
        fontFamily: 'Arial, Helvetica, sans-serif'
      });
      localStorage.setItem('selectedStyle', 'Tomorrow');
    }
  
    const darkModeListener = (e) => {
      if (e.matches) {
        setSelectedStyle('Tomorrow');
        setBodyStyle({
          background: '#1d1f21 none',
          color: '#c5c8c6',
          fontFamily: 'Arial, Helvetica, sans-serif'
        });
        localStorage.setItem('selectedStyle', 'Tomorrow');
      }
    };
  
    darkModeMediaQuery.addEventListener('change', darkModeListener);
  
    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeListener);
    };
  }, []);



  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      console.log('challenge success', {publishedCid: challengeVerification.publication.cid})
    }
    else if (challengeVerification.challengeSuccess === false) {
      console.error('challenge failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
      alert("Error: You seem to have mistyped the CAPTCHA. Please try again.");
    }
  }


  const onChallenge = async (challenges, comment) => {
    let challengeAnswers = [];
    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges)
    }
    catch (error) {
      console.log(error);
    }
    if (challengeAnswers) {
      await comment.publishChallengeAnswers(challengeAnswers)
    }
  }
  

  const onError = (error) => console.error(error)


  const getChallengeAnswersFromUser = async (challenges) => {
    return new Promise((resolve, reject) => {
      const imageString = challenges?.challenges[0].challenge;
      const imageSource = `data:image/png;base64,${imageString}`;
      const challengeImg = new Image();
      challengeImg.src = imageSource;
  
      challengeImg.onload = () => {
        setIsCaptchaOpen(true);
        setCaptchaImage(imageSource);
  
        const handleKeyDown = (event) => {
          if (event.key === 'Enter') {
            setCaptchaImage('');
            resolve(captchaResponse);
            setIsCaptchaOpen(false);
            document.removeEventListener('keydown', handleKeyDown);
          }
        };

        setCaptchaResponse('');
        document.addEventListener('keydown', handleKeyDown);
      };
  
      challengeImg.onerror = () => {
        reject(new Error('Could not load challenge image'));
      };
    });
  };



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
    alert("- Embedding media is optional, posts can be text-only. \n- A CAPTCHA challenge will appear after posting. \n- The CAPTCHA is case-sensitive.");
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


  const handlePublishComment = async () => {
    try {
      const pendingComment = await publishComment({
        content: commentContent,
        title: subject,
        subplebbitAddress: selectedAddress,
        onChallengeVerification,
        onChallenge,
        onError,
      });
      console.log(`Comment pending with index: ${pendingComment.index}`);
      setName('');
      setSubject('');
      setCommentContent('');
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleCaptchaClose = () => {
    setIsCaptchaOpen(false);
  };


  const handleStyleChange = (event) => {
    switch (event.target.value) {
      case "Yotsuba":
        const yotsubaBodyStyle = {
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(yotsubaBodyStyle);
        setSelectedStyle("Yotsuba");
        localStorage.setItem("selectedStyle", "Yotsuba");
        localStorage.setItem("bodyStyle", JSON.stringify(yotsubaBodyStyle));
        break;
  
      case "Yotsuba-B":
        const yotsubaBBodyStyle = {
          background: "#eef2ff url(/assets/fade-blue.png) top center repeat-x",
          color: "#000",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(yotsubaBBodyStyle);
        setSelectedStyle("Yotsuba-B");
        localStorage.setItem("selectedStyle", "Yotsuba-B");
        localStorage.setItem("bodyStyle", JSON.stringify(yotsubaBBodyStyle));
        break;
  
      case "Futaba":
        const futabaBodyStyle = {
          background: "#ffe",
          color: "maroon",
          fontFamily: "times new roman, serif"
        };
        setBodyStyle(futabaBodyStyle);
        setSelectedStyle("Futaba");
        localStorage.setItem("selectedStyle", "Futaba");
        localStorage.setItem("bodyStyle", JSON.stringify(futabaBodyStyle));
        break;
  
      case "Burichan":
        const burichanBodyStyle = {
          background: "#eef2ff",
          color: "#000",
          fontFamily: "times new roman, serif"
        };
        setBodyStyle(burichanBodyStyle);
        setSelectedStyle("Burichan");
        localStorage.setItem("selectedStyle", "Burichan");
        localStorage.setItem("bodyStyle", JSON.stringify(burichanBodyStyle));
        break;
  
      case "Tomorrow":
        const tomorrowBodyStyle = {
          background: "#1d1f21 none",
          color: "#c5c8c6",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(tomorrowBodyStyle);
        setSelectedStyle("Tomorrow");
        localStorage.setItem("selectedStyle", "Tomorrow");
        localStorage.setItem("bodyStyle", JSON.stringify(tomorrowBodyStyle));
        break;
  
      case "Photon":
        const photonBodyStyle = {
          background: "#eee none",
          color: "#333",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(photonBodyStyle);
        setSelectedStyle("Photon");
        localStorage.setItem("selectedStyle", "Photon");
        localStorage.setItem("bodyStyle", JSON.stringify(photonBodyStyle));
        break;
  
      default:
        const defaultBodyStyle = {
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(defaultBodyStyle);
        setSelectedStyle("Yotsuba");
        localStorage.setItem("selectedStyle", "Yotsuba");
        localStorage.setItem("bodyStyle", JSON.stringify(defaultBodyStyle));
    }
  }  
  
  

  return (
    <Container>
      <CaptchaModal 
      isOpen={isCaptchaOpen} 
      closeModal={handleCaptchaClose} 
      captchaImage={captchaImage} />
      <NavBar selectedStyle={selectedStyle}>
        <>
          {defaultSubplebbits.map(subplebbit => (
            <span className="boardList" key={`span-${subplebbit.address}`}>
              [
              <Link key={`a-${subplebbit.address}`} 
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
                    <option key={`option-${subplebbit.address}`} value={subplebbit.address}
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
        <PostFormTable id="post-form" showPostForm={showPostForm} selectedStyle={selectedStyle} className="post-form">
          <tbody>
            <tr data-type="Name">
              <td id="td-name">Name</td>
              <td>
                <input name="name" type="text" tabIndex={1} placeholder="Anonymous" value={name} onChange={(event) => setName(event.target.value)} />
              </td>
            </tr>
            <tr data-type="Subject">
              <td>Subject</td>
              <td>
                <input name="sub" type="text" tabIndex={3} value={subject} onChange={(event) => setSubject(event.target.value)} />
                <input id="post-button" type="submit" value="Post" tabIndex={6} onClick={handlePublishComment} />
              </td>
            </tr>
            <tr data-type="Comment">
              <td>Comment</td>
              <td>
                <textarea name="com" cols="48" rows="4" tabIndex={4} wrap="soft" value={commentContent} onChange={(event) => setCommentContent(event.target.value)}></textarea>
              </td>
            </tr>
            <tr data-type="File">
              <td>Embed File</td>
              <td>
                <input name="embed" type="text" tabIndex={7} placeholder="Paste link" />
                <button id="t-help" type="button" onClick={handleClickHelp} data-tip="Help">?</button>
              </td>
            </tr>
          </tbody>
        </PostFormTable>
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
                    <div key={`f-${comment.cid}`} className="file">
                        <div key={`ft-${comment.cid}`} className="file-text">
                          File:&nbsp;
                          <a key={`fa-${comment.cid}`} href={`${comment.link}`} target="_blank">filename.something</a>&nbsp;(metadata)
                        </div>
                        <Link to="" key={`fta-${comment.cid}`} onClick={handleVoidClick} target="_blank" className="file-thumb">
                          <img key={`fti-${comment.cid}`} src="/assets/plebchan-psycho.png" alt="filename.something" />
                        </Link>
                      </div>
                    <span className="name-block">
                        {comment.title ? (
                          comment.title.length > 75 ?
                          <>
                            <Tooltip key={`mob-tt-tm-${comment.cid}`} id="tt-title-mobile" className="tooltip" />
                            <span key={`q-${comment.cid}`} className="title"
                            data-tooltip-id="tt-title-mobile"
                            data-tooltip-content={comment.title}
                            data-tooltip-place="top">
                              {comment.title.slice(0, 75) + " (...)"}
                            </span>
                          </>
                        : <span key={`q-${comment.cid}`} className="title">
                          {comment.title}
                          </span>) 
                        : null}
                      &nbsp;
                      {comment.author.displayName
                        ? comment.author.displayName.length > 20
                        ? <>
                            <Tooltip key={`mob-tt-nm-${comment.cid}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`n-${comment.cid}`} className="name"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={comment.author.displayName}
                            data-tooltip-place="top">
                              {comment.author.displayName.slice(0, 20) + " (...)"}
                            </span>
                          </> 
                          : <span key={`n-${comment.cid}`} className="name">
                            {comment.author.displayName}</span>
                        : <span key={`n-${comment.cid}`} className="name">
                          Anonymous</span>}
                        &nbsp;
                      &nbsp;
                      <span className="poster-address">
                        (u/
                          {comment.author.address.length > 20 ?
                        <>
                          <Tooltip key={`mob-tt-am-${comment.cid}`} id="tt-address-mobile" className="tooltip" />
                          <span key={`pa-${comment.cid}`} className="poster-address"
                          data-tooltip-id="tt-address-mobile"
                          data-tooltip-content={comment.author.address}
                          data-tooltip-place="top">
                            {comment.author.address.slice(0, 20) + "..."}
                          </span>
                        </>
                        : <span key={`pa-${comment.cid}`} className="poster-address">
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
                      <Link to="" key={`pmb-${comment.cid}`} className="post-menu-button" onClick={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</Link>
                      <div id="backlink-id" className="backlink">
                        {comment.replies?.pages.topAll.comments
                          .sort((a, b) => a.timestamp - b.timestamp)
                          .map((reply) => (
                            <div key={`div-${reply.cid}`} style={{display: 'inline-block'}}>
                            <Link to={handleVoidClick} key={`ql-${reply.cid}`}
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
                    <div key={`pc-${reply.cid}`} className="reply-container">
                      <div key={`sa-${reply.cid}`} className="side-arrows">{'>>'}</div>
                      <div key={`pr-${reply.cid}`} className="post-reply" id="post-reply">
                        <div key={`pi-${reply.cid}`} className="post-info">
                        &nbsp;
                          <span key={`nb-${reply.cid}`} className="nameblock">
                          {reply.author.displayName
                          ? reply.author.displayName.length > 20
                          ? <>
                              <Tooltip key={`mob-tt-nm-${reply.cid}`} id="tt-name" className="tooltip" />
                              <span key={`mob-n-${reply.cid}`} className="name"
                              data-tooltip-id="tt-name"
                              data-tooltip-content={reply.author.displayName}
                              data-tooltip-place="top">
                                {reply.author.displayName.slice(0, 20) + " (...)"}
                              </span>
                            </>
                            : <span key={`mob-n-${reply.cid}`} className="name">
                              {reply.author.displayName}</span>
                          : <span key={`mob-n-${reply.cid}`} className="name">
                            Anonymous</span>}
                            &nbsp;
                            <span key={`pa-${reply.cid}`} className="poster-address">
                              (u/
                              {reply.author.address.length > 20 ?
                              <>
                                <Tooltip key={`mob-tt-am-${reply.cid}`} id="tt-address" className="tooltip" />
                                <span key={`mob-ha-${reply.cid}`}
                                data-tooltip-id="tt-address"
                                data-tooltip-content={reply.author.address}
                                data-tooltip-place="top">
                                  {reply.author.address.slice(0, 20) + "..."}
                                </span>
                              </>
                              : <span key={`mob-ha-${reply.cid}`}>
                                {reply.author.address}
                              </span>})
                            </span>
                          </span>
                          &nbsp;
                          <span key={`dt-${reply.cid}`} className="date-time" data-utc="data">{getDate(reply.timestamp)}</span>
                          &nbsp;
                          <span key={`pn-${reply.cid}`} className="post-number">
                            <Link to="" key={`pl1-${reply.cid}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                            <Link to="" key={`pl2-${reply.cid}`} onClick={handleVoidClick} title="Reply to this post">{reply.cid.slice(0, 8)}</Link>
                          </span>
                          <Link to="" key={`pmb-${reply.cid}`} className="post-menu-button" onClick={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</Link>
                          <div id="backlink-id" className="backlink">
                            {reply.replies?.pages.topAll.comments
                              .sort((a, b) => a.timestamp - b.timestamp)
                              .map((reply) => (
                                <div key={`div-${reply.cid}`} style={{display: 'inline-block'}}>
                                <Link to={handleVoidClick} key={`ql-${reply.cid}`}
                                  className="quote-link" 
                                  onClick={(event) => handleQuoteClick(reply, event)}>
                                  c/{reply.cid.slice(0, 8)}</Link>
                                  &nbsp;
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        <blockquote key={`pm-${reply.cid}`} className="post-message">
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
                  <div key={`mob-po-${comment.cid}`} className="post op">
                    <div key={`mob-pi-${comment.cid}`} className="post-info-mobile">
                      <Link to="" key={`mob-pb-${comment.cid}`} className="post-menu-button-mobile" onClick={handleVoidClick}>...</Link>
                      <span className="name-block-mobile">
                        {comment.author.displayName
                        ? comment.author.displayName.length > 15
                        ? <>
                            <Tooltip key={`mob-tt-nm-${comment.cid}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`mob-n-${comment.cid}`} className="name-mobile"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={comment.author.displayName}
                            data-tooltip-place="top">
                              {comment.author.displayName.slice(0, 15) + " (...)"}
                            </span>
                          </> 
                          : <span key={`mob-n-${comment.cid}`} className="name-mobile">
                            {comment.author.displayName}</span>
                        : <span key={`mob-n-${comment.cid}`} className="name-mobile">
                          Anonymous</span>}
                        &nbsp;
                        <span key={`mob-pa-${comment.cid}`} className="poster-address-mobile">
                          (u/
                          {comment.author.address.length > 15 ?
                          <>
                            <Tooltip key={`mob-tt-am-${comment.cid}`} id="tt-address-mobile" className="tooltip" />
                            <span key={`mob-ha-${comment.cid}`} className="highlight-address-mobile"
                            data-tooltip-id="tt-address-mobile"
                            data-tooltip-content={comment.author.address}
                            data-tooltip-place="top">
                              {comment.author.address.slice(0, 15) + "..."}
                            </span>
                          </>
                          : <span key={`mob-ha-${comment.cid}`} className="highlight-address-mobile">
                            {comment.author.address}
                          </span>}
                          )&nbsp;
                        </span>
                        <br key={`mob-br1-${comment.cid}`} />
                        {comment.title ? (
                            comment.title.length > 30 ?
                            <>
                              <Tooltip key={`mob-tt-tm-${comment.cid}`} id="tt-title-mobile" className="tooltip" />
                              <span key={`mob-t-${comment.cid}`} className="subject-mobile"
                              data-tooltip-id="tt-title-mobile"
                              data-tooltip-content={comment.title}
                              data-tooltip-place="top">
                                {comment.title.slice(0, 30) + " (...)"}
                              </span>
                            </>
                            : <span key={`mob-t-${comment.cid}`} className="subject-mobile">
                              {comment.title}
                            </span>) : null}
                      </span>
                      <span key={`mob-dt-${comment.cid}`} className="date-time-mobile">
                        {getDate(comment.timestamp)}
                        &nbsp;
                        <Link to="" key={`mob-no-${comment.cid}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                        <Link to="" key={`mob-no2-${comment.cid}`} onClick={handleVoidClick} title="Reply to this post">{comment.cid.slice(0, 8)}</Link>
                      </span>
                    </div>
                    <div key={`mob-f-${comment.cid}`} className="file-mobile">
                      <Link to="" key={`mob-ft${comment.cid}`} className="file-thumb-mobile" onClick={handleVoidClick} target="_blank">
                        <img key={`mob-img-${comment.cid}`} src="/assets/plebchan-psycho.png" alt="" />
                        <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">58 KB JPG</div>
                      </Link>
                    </div>
                    <blockquote key={`mob-bq-${comment.cid}`} className="post-message-mobile">
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
                  <div key={`mob-rc-${reply.cid}`} className="reply-container">
                    <div key={`mob-pr-${reply.cid}`} className="post-reply">
                      <div key={`mob-pi-${reply.cid}`} className="post-info-mobile">
                        <a className="post-menu-button-mobile" title="Post menu">...</a>
                        <span key={`mob-nb-${reply.cid}`} className="name-block-mobile">
                          {reply.author.displayName
                          ? reply.author.displayName.length > 12
                          ? <>
                              <Tooltip key={`mob-tt-nm-${reply.cid}`} id="tt-name-mobile" className="tooltip" />
                              <span key={`mob-n-${reply.cid}`} className="name-mobile"
                              data-tooltip-id="tt-name-mobile"
                              data-tooltip-content={reply.author.displayName}
                              data-tooltip-place="top">
                                {reply.author.displayName.slice(0, 12) + " (...)"}
                              </span>
                            </>
                            : <span key={`mob-n-${reply.cid}`} className="name-mobile">
                              {reply.author.displayName}</span>
                          : <span key={`mob-n-${reply.cid}`} className="name-mobile">
                            Anonymous</span>}
                          &nbsp;
                          <span key={`mob-pa-${reply.cid}`} className="poster-address-mobile">
                            (u/
                            {reply.author.address.length > 12 ?
                            <>
                              <Tooltip key={`mob-tt-am-${reply.cid}`} id="tt-address-mobile" className="tooltip" />
                              <span key={`mob-ha-${reply.cid}`} className="highlight-address-mobile"
                              data-tooltip-id="tt-address-mobile"
                              data-tooltip-content={reply.author.address}
                              data-tooltip-place="top">
                                {reply.author.address.slice(0, 12) + "..."}
                              </span>
                            </>
                            : <span key={`mob-ha-${reply.cid}`} className="highlight-address-mobile">
                              {reply.author.address}
                            </span>}
                            )
                          </span>
                          <br key={`mob-br-${reply.cid}`} />
                        </span>
                        <span key={`mob-dt-${reply.cid}`} className="date-time-mobile">
                          {getDate(reply.timestamp)}&nbsp;
                          <Link to="" key={`mob-pl1-${reply.cid}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                          <Link to="" key={`mob-pl2-${reply.cid}`} onClick={handleVoidClick} title="Reply to this post">{reply.cid.slice(0, 8)}</Link>
                        </span>
                      </div>
                      <blockquote key={`mob-pm-${reply.cid}`} className="post-message-mobile">
                        <Link to={handleVoidClick} key={`mob-ql-${reply.cid}`} className="quotelink-mobile" 
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