import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BoardContext } from '../App';
import { Container, NavBar, Header, Break, PostFormLink, PostFormTable, PostForm, TopBar, BoardForm } from './styles/Board.styled';
import ImageBanner from './ImageBanner';
import { useFeed, useAccountsActions } from '@plebbit/plebbit-react-hooks';
import InfiniteScroll from 'react-infinite-scroller';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';


const Board = ({ setBodyStyle }) => {
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const { selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, setSelectedThread, selectedStyle, setSelectedStyle } = useContext(BoardContext);
  const [showPostFormLink, setShowPostFormLink] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const { publishComment } = useAccountsActions();
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [endIndex, setEndIndex] = useState(2);
  const { feed, hasMore, loadMore } = useFeed([`${selectedAddress}`], 'new');
  const [selectedFeed, setSelectedFeed] = useState(feed);
  const renderedFeed = selectedFeed.slice(0, endIndex);
  const { subplebbitAddress } = useParams();


  // temporary title from JSON, gets subplebbitAddress from URL
  useEffect(() => {
    setSelectedAddress(subplebbitAddress);
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
    if (selectedSubplebbit) {
      setSelectedTitle(selectedSubplebbit.title);
    }
  }, [subplebbitAddress, setSelectedAddress, setSelectedTitle, defaultSubplebbits]);
  
  // sets useFeed to address from URL
  useEffect(() => {
    setSelectedFeed(feed);
  }, [feed]);

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

  // reset endIndex whenever selectedAddress changes
  useEffect(() => {
    setEndIndex(2);
  }, [selectedAddress]);



  const tryLoadMore = async () => {
    try {
      loadMore();
      const newFeed = [...selectedFeed, ...feed];
      setSelectedFeed(newFeed);
      setEndIndex(endIndex + 2);
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };  


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
        const inputEl = document.getElementById('t-resp');
        const cntEl = document.getElementById('t-cnt');
        cntEl.appendChild(challengeImg);
        inputEl.focus();
  
        const handleKeyDown = (event) => {
          if (event.key === 'Enter') {
            const challengeResponse = inputEl.value;
            inputEl.value = '';
  
            if (cntEl.contains(challengeImg)) {
              cntEl.removeChild(challengeImg);
            }
  
            document.removeEventListener('keydown', handleKeyDown);
  
            resolve(challengeResponse);
          }
        };
  
        document.addEventListener('keydown', handleKeyDown);
      };
  
      challengeImg.onerror = () => {
        reject(new Error('Could not load challenge image'));
      };
    });
  };



  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight) {
      setEndIndex(endIndex + 5);
    }
  };
  

  const handleVoidClick = () => {};

  // desktop navbar board select functionality
  const handleClickTitle = (title, address) => {
    setSelectedTitle(title);
    setSelectedAddress(address);
    setSelectedFeed(feed.filter(feed => feed.title === title));
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
    navigate(`/${selectedAddress}/post`);
  };


  const handleClickThread = (thread) => {
    setSelectedThread(thread);
  }
  

  const handlePublishComment = async () => {
    try {
      const pendingComment = await publishComment({
        content: comment,
        title: subject,
        subplebbitAddress: selectedAddress,
        onChallengeVerification,
        onChallenge,
        onError,
      });
      console.log(`Comment pending with index: ${pendingComment.index}`);
      setName('');
      setSubject('');
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };


  const handleStyleChange = (event) => {
    switch (event.target.value) {
      case "Yotsuba":
        setBodyStyle({
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba");
        break;

      case "Yotsuba B":
        setBodyStyle({
          background: "#eef2ff url(/assets/fade-blue.png) top center repeat-x",
          color: "#000",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba B");
        break;

      case "Futaba":
        setBodyStyle({
          background: "#ffe",
          color: "maroon",
          fontFamily: "times new roman, serif"
        });
        setSelectedStyle("Futaba");
        break;

      case "Burichan":
        setBodyStyle({
          background: "#eef2ff",
          color: "#000",
          fontFamily: "times new roman, serif"
        });
        setSelectedStyle("Burichan");
        break;
        
      case "Tomorrow":
        setBodyStyle({
          background: "#1d1f21 none",
          color: "#c5c8c6",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Tomorrow");
        break;

      case "Photon":
        setBodyStyle({
          background: "#eee none",
          color: "#333",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Photon");
        break;

      default:
        setBodyStyle({
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba");
    }
  }



  function renderComments(comments) {
    return comments.map(comment => {
      const { replyCount, replies: { pages: { topAll: { comments: nestedComments } } } } = comment;
  
      if (replyCount > 0 && nestedComments.length > 0) {
        const renderedNestedComments = renderComments(nestedComments);
        return [comment, ...renderedNestedComments];
      }
  
      return [comment];
    }).flat();
  }



  return (
    <Container>
      <NavBar selectedStyle={selectedStyle}>
        <>
          {defaultSubplebbits.map(subplebbit => (
            <span className="boardList" key={`span-${subplebbit.address}`}>
              [
              <Link to={`/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => handleClickTitle(subplebbit.title, subplebbit.address)}
              >{subplebbit.title}</Link>
              ]&nbsp;
            </span>
          ))}
          <span className="nav">
            [
            <a href={handleVoidClick}>Settings</a>
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
              <a href={handleVoidClick}>Settings</a>
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
      <PostForm selectedStyle={selectedStyle}>
      <PostFormLink id="post-form-link" showPostFormLink={showPostFormLink} selectedStyle={selectedStyle} >
        <div id="post-form-link-desktop">
            [
              <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</a>
            ]
          </div>
          <div id="post-form-link-mobile">
            <span className="btn-wrap">
              <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</a>
            </span>
          </div>
        </PostFormLink>
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
                <textarea name="com" cols="48" rows="4" tabIndex={4} wrap="soft" value={comment} onChange={(event) => setComment(event.target.value)}></textarea>
              </td>
            </tr>
            <tr id="captchaFormPart">
              <td>Verification</td>
              <td colSpan={2}>
                <div id="t-root">
                  <input id="t-resp" name="t-response" placeholder="Type the CAPTCHA here and hit return" autoComplete='off' type="text" />
                  <button id="t-help" type="button" onClick={handleClickHelp} data-tip="Help" tabIndex={-1}>?</button>
                  <div id="t-cnt">
                  </div>
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
        </PostFormTable>
      </PostForm>
      <TopBar selectedStyle={selectedStyle}>
        <hr />
        <span className="style-changer">
          Style:
           
          <select id="style-selector" onChange={handleStyleChange} value={selectedStyle}>
            <option value="Yotsuba">Yotsuba</option>
            <option value="Yotsuba B">Yotsuba B</option>
            <option value="Futaba">Futaba</option>
            <option value="Burichan">Burichan</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="Photon">Photon</option>
          </select>
        </span>
        <div id="catalog-button-desktop">
          [
          <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
          ]
        </div>
        <div id="catalog-button-mobile">
          <span className="btn-wrap">
            <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
          </span>
        </div>
      </TopBar>
      <BoardForm selectedStyle={selectedStyle}>
        <div onScroll={handleScroll} className="board">
          <InfiniteScroll
            pageStart={0}
            loadMore={tryLoadMore}
            hasMore={hasMore}
            loader={<div>Loading...</div>}
          >
            {renderedFeed.map(thread => {
            const { replies: { pages: { topAll: { comments } } } } = thread;
            const renderedComments = renderComments(comments);
            return (
            <>
              <div key={`t-${thread.cid}`} className="thread">
                <div key={`c-${thread.cid}`} className="op-container">
                  <div key={`po-${thread.cid}`} className="post op">
                    <hr key={`hr-${thread.cid}`} />
                    <div key={`pi-${thread.cid}`} className="post-info">
                      <div key={`f-${thread.cid}`} className="file">
                        <div key={`ft-${thread.cid}`} className="file-text">
                          File:&nbsp;
                          <a key={`fa-${thread.cid}`} href={`${thread.link}`} target="_blank">filename.something</a>&nbsp;(metadata)
                        </div>
                        <a key={`fta-${thread.cid}`} href={handleVoidClick} target="_blank" className="file-thumb">
                          <img key={`fti-${thread.cid}`} src="/assets/plebchan-psycho.png" alt="filename.something" />
                        </a>
                      </div>
                      <span key={`nb-${thread.cid}`} className="name-block">
                        {thread.title ? (
                          thread.title.length > 75 ?
                          <>
                            <Tooltip key={`mob-tt-tm-${thread.cid}`} id="tt-title-mobile" className="tooltip" />
                            <span key={`q-${thread.cid}`} className="title"
                            data-tooltip-id="tt-title-mobile"
                            data-tooltip-content={thread.title}
                            data-tooltip-place="top">
                              {thread.title.slice(0, 75) + " (...)"}
                            </span>
                          </>
                        : <span key={`q-${thread.cid}`} className="title">
                          {thread.title}
                          </span>) 
                        : null}&nbsp;
                        {thread.author.displayName
                        ? thread.author.displayName.length > 20
                        ? <>
                            <Tooltip key={`mob-tt-nm-${thread.cid}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`n-${thread.cid}`} className="name"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={thread.author.displayName}
                            data-tooltip-place="top">
                              {thread.author.displayName.slice(0, 20) + " (...)"}
                            </span>
                          </> 
                          : <span key={`n-${thread.cid}`} className="name">
                            {thread.author.displayName}</span>
                        : <span key={`n-${thread.cid}`} className="name">
                          Anonymous</span>}
                        &nbsp;
                        (User:&nbsp;
                        {thread.author.address.length > 15 ?
                        <>
                          <Tooltip key={`mob-tt-am-${thread.cid}`} id="tt-address-mobile" className="tooltip" />
                          <span key={`pa-${thread.cid}`} className="poster-address"
                          data-tooltip-id="tt-address-mobile"
                          data-tooltip-content={thread.author.address}
                          data-tooltip-place="top">
                            {thread.author.address.slice(0, 15) + "..."}
                          </span>
                        </>
                        : <span key={`pa-${thread.cid}`} className="poster-address">
                          {thread.author.address}
                        </span>})
                        &nbsp;
                        <span key={`dt-${thread.cid}`} className="date-time" data-utc="data">{moment(thread.timestamp * 1000).fromNow()}</span>
                        &nbsp;
                        <span key={`pn-${thread.cid}`} className="post-number">
                          <a key={`pl1-${thread.cid}`} href={handleVoidClick} title="Link to this post">c/</a>
                          <a key={`pl2-${thread.cid}`} href={handleVoidClick} title="Reply to this post">{thread.cid.slice(0, 8)}</a>
                          &nbsp;
                          <span key={`rl1-${thread.cid}`}>
                            [
                            <Link key={`rl2-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="reply-link" >Reply</Link>
                            ]
                          </span>
                        </span>
                        <a key={`pmb-${thread.cid}`} className="post-menu-button" href={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</a>
                        <div key={`bi-${thread.cid}`} id="backlink-id" className="backlink">
                          <span key={`ql1-${thread.cid}`}>
                            <a key={`ql2-${thread.cid}`} className="quote-link" href={handleVoidClick}>{'>>'}{thread.cid.slice(0, 8)}</a>
                          </span>
                        </div>
                      </span>
                      {thread.content ? (
                        thread.content.length > 2000 ?
                        <>
                          <blockquote key={`bq-${thread.cid}`}>
                            {thread.content.slice(0, 2000)}
                            <span key={`ttl-s-${thread.cid}`} className="ttl"> (...) 
                            <br key={`ttl-s-br1-${thread.cid}`} /><br key={`ttl-s-br2${thread.cid}`} />
                            Post too long.&nbsp;
                              <Link key={`ttl-l-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="ttl-link">Click here</Link>
                              &nbsp;to view. </span>
                          </blockquote>
                        </>
                      : <blockquote key={`bq-${thread.cid}`}>
                          {thread.content}
                        </blockquote>)
                      : null}
                    </div>
                  </div>
                </div>
                {renderedComments.map(reply => {
                  return (
                <div key={`pc-${reply.cid}`} className="reply-container">
                  <div key={`sa-${reply.cid}`} className="side-arrows">{'>>'}</div>
                  <div key={`pr-${reply.cid}`} className="post-reply">
                    <div key={`pi-${reply.cid}`} className="post-info">
                      <span key={`nb-${reply.cid}`} className="nameblock">
                        {reply.author.displayName
                          ? reply.author.displayName.length > 12
                          ? <>
                              <Tooltip key={`mob-tt-nm-${reply.cid}`} id="tt-name" className="tooltip" />
                              <span key={`mob-n-${reply.cid}`} className="name"
                              data-tooltip-id="tt-name"
                              data-tooltip-content={reply.author.displayName}
                              data-tooltip-place="top">
                                {reply.author.displayName.slice(0, 12) + " (...)"}
                              </span>
                            </>
                            : <span key={`mob-n-${reply.cid}`} className="name">
                              {reply.author.displayName}</span>
                          : <span key={`mob-n-${reply.cid}`} className="name">
                            Anonymous</span>}
                        &nbsp;
                        <span key={`pa-${reply.cid}`} className="poster-address">
                          (User:&nbsp;
                            {reply.author.address.length > 12 ?
                            <>
                              <Tooltip key={`mob-tt-am-${reply.cid}`} id="tt-address" className="tooltip" />
                              <span key={`mob-ha-${reply.cid}`}
                              data-tooltip-id="tt-address"
                              data-tooltip-content={reply.author.address}
                              data-tooltip-place="top">
                                {reply.author.address.slice(0, 12) + "..."}
                              </span>
                            </>
                            : <span key={`mob-ha-${reply.cid}`}>
                              {reply.author.address}
                            </span>}
                          )
                        </span>
                      </span>
                      &nbsp;
                      <span key={`dt-${reply.cid}`} className="date-time" data-utc="data">{moment(reply.timestamp * 1000).fromNow()}</span>
                      &nbsp;
                      <span key={`pn-${reply.cid}`} className="post-number">
                        <a key={`pl1-${reply.cid}`} href={handleVoidClick} title="Link to this post">c/</a>
                        <a key={`pl2-${reply.cid}`} href={handleVoidClick} title="Reply to this post">{reply.cid.slice(0, 8)}</a>
                      </span>
                      <a key={`pmb-${reply.cid}`} className="post-menu-button" href={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</a>
                    </div>
                    {reply.content ? (
                        reply.content.length > 1000 ?
                        <>
                          <blockquote key={`pm-${reply.cid}`} className="post-message">
                            <a key={`r-pm-${reply.cid}`} className="quotelink" href={handleVoidClick}>
                              {`>>${reply.cid.slice(0, 8)}`}{<br />}
                            </a>
                            {reply.content.slice(0, 1000)}
                            <span key={`ttl-s-${reply.cid}`} className="ttl"> (...)
                            <br key={`ttl-s-br1-${reply.cid}`} /><br key={`ttl-s-br2${reply.cid}`} />
                            Comment too long.&nbsp;
                              <Link key={`ttl-l-${reply.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="ttl-link">Click here</Link>
                            &nbsp;to view. </span>
                          </blockquote>
                        </>
                      : <blockquote key={`pm-${thread.cid}`} className="post-message">
                          <a key={`r-pm-${reply.cid}`} className="quotelink" href={handleVoidClick}>
                            {`>>${reply.cid.slice(0, 8)}`}{<br />}
                          </a>
                          {reply.content}
                        </blockquote>)
                      : null}
                  </div>
                </div>
                )})}
              </div>
              <div key={`mob-t-${thread.cid}`} className="thread-mobile">
                <hr key={`mob-hr-${thread.cid}`} />
                <div key={`mob-c-${thread.cid}`} className="op-container">
                  <div key={`mob-po-${thread.cid}`} className="post op">
                    <div key={`mob-pi-${thread.cid}`} className="post-info-mobile">
                      <a key={`mob-pb-${thread.cid}`} className="post-menu-button-mobile" href={handleVoidClick}>...</a>
                      <span key={`mob-nbm-${thread.cid}`} className="name-block-mobile">
                        {thread.author.displayName
                        ? thread.author.displayName.length > 15
                        ? <>
                            <Tooltip key={`mob-tt-nm-${thread.cid}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`mob-n-${thread.cid}`} className="name-mobile"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={thread.author.displayName}
                            data-tooltip-place="top">
                              {thread.author.displayName.slice(0, 15) + " (...)"}
                            </span>
                          </> 
                          : <span key={`mob-n-${thread.cid}`} className="name-mobile">
                            {thread.author.displayName}</span>
                        : <span key={`mob-n-${thread.cid}`} className="name-mobile">
                          Anonymous</span>}
                        &nbsp;
                        <span key={`mob-pa-${thread.cid}`} className="poster-address-mobile">
                          (User:&nbsp;
                          {thread.author.address.length > 15 ?
                          <>
                            <Tooltip key={`mob-tt-am-${thread.cid}`} id="tt-address-mobile" className="tooltip" />
                            <span key={`mob-ha-${thread.cid}`} className="highlight-address-mobile"
                            data-tooltip-id="tt-address-mobile"
                            data-tooltip-content={thread.author.address}
                            data-tooltip-place="top">
                              {thread.author.address.slice(0, 15) + "..."}
                            </span>
                          </>
                          : <span key={`mob-ha-${thread.cid}`} className="highlight-address-mobile">
                            {thread.author.address}
                          </span>}
                          )&nbsp;
                        </span>
                        <br key={`mob-br1-${thread.cid}`} />
                        {thread.title ? (
                          thread.title.length > 30 ?
                          <>
                            <Tooltip key={`mob-tt-tm-${thread.cid}`} id="tt-title-mobile" className="tooltip" />
                            <span key={`mob-t-${thread.cid}`} className="subject-mobile"
                            data-tooltip-id="tt-title-mobile"
                            data-tooltip-content={thread.title}
                            data-tooltip-place="top">
                              {thread.title.slice(0, 30) + " (...)"}
                            </span>
                          </>
                        : <span key={`mob-t-${thread.cid}`} className="subject-mobile">
                          {thread.title}
                          </span>) 
                        : null}
                      </span>
                      <span key={`mob-dt-${thread.cid}`} className="date-time-mobile">
                        {moment(thread.timestamp * 1000).fromNow()}
                        &nbsp;
                        <a key={`mob-no-${thread.cid}`} href={handleVoidClick} title="Link to this post">c/</a>
                        <a key={`mob-no2-${thread.cid}`} href={handleVoidClick} title="Reply to this post">{thread.cid.slice(0, 8)}</a>
                      </span>
                    </div>
                    <div key={`mob-f-${thread.cid}`} className="file-mobile">
                      <a key={`mob-ft${thread.cid}`} className="file-thumb-mobile" href={handleVoidClick} target="_blank">
                        <img key={`mob-img-${thread.cid}`} src="/assets/plebchan-psycho.png" alt="" />
                        <div key={`mob-fi-${thread.cid}`} className="file-info-mobile">58 KB JPG</div>
                      </a>
                    </div>
                    {thread.content ? (
                        thread.content.length > 1500 ?
                        <>
                          <blockquote key={`mob-bq-${thread.cid}`} className="post-message-mobile">
                            {thread.content.slice(0, 1500)}
                            <span key={`mob-ttl-s-${thread.cid}`} className="ttl"> (...)
                            <br key={`mob-ttl-s-br1-${thread.cid}`} /><br key={`mob-ttl-s-br2${thread.cid}`} />
                             Post too long.&nbsp;
                              <Link key={`mob-ttl-l-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="ttl-link">Click here</Link>
                              &nbsp;to view. </span>
                          </blockquote>
                        </>
                      : <blockquote key={`mob-bq-${thread.cid}`} className="post-message-mobile">
                          {thread.content}
                        </blockquote>)
                      : null}
                  </div>
                  <div key={`mob-pl-${thread.cid}`} className="post-link-mobile">
                    <span key={`mob-info-${thread.cid}`} className="info-mobile">{thread.replyCount} Replies / ? Images</span>
                    <Link key={`rl2-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="button-mobile" >View Thread</Link>
                  </div>
                </div>
                {renderedComments.map(reply => {
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
                            (User:&nbsp;
                            {reply.author.address.length > 10 ?
                            <>
                              <Tooltip key={`mob-tt-am-${reply.cid}`} id="tt-address-mobile" className="tooltip" />
                              <span key={`mob-ha-${reply.cid}`} className="highlight-address-mobile"
                              data-tooltip-id="tt-address-mobile"
                              data-tooltip-content={reply.author.address}
                              data-tooltip-place="top">
                                {reply.author.address.slice(0, 10) + "..."}
                              </span>
                            </>
                            : <span key={`mob-ha-${reply.cid}`} className="highlight-address-mobile">
                              {reply.author.address}
                            </span>}
                            )&nbsp;
                          </span>
                          <br key={`mob-br-${reply.cid}`} />
                        </span>
                        <span key={`mob-dt-${reply.cid}`} className="date-time-mobile">
                          {moment(reply.timestamp * 1000).fromNow()}&nbsp;
                          <a key={`mob-pl1-${reply.cid}`} href={handleVoidClick} title="Link to this post">c/</a>
                          <a key={`mob-pl2-${reply.cid}`} href={handleVoidClick} title="Reply to this post">{reply.cid.slice(0, 8)}</a>
                        </span>
                      </div>
                      {reply.content ? (
                        reply.content.length > 1000 ?
                        <>
                          <blockquote key={`mob-pm-${reply.cid}`} className="post-message">
                            <a key={`mob-r-pm-${reply.cid}`} className="quotelink" href={handleVoidClick}>
                              {`>>${reply.cid.slice(0, 8)}`}{<br />}
                            </a>
                            {reply.content.slice(0, 1000)}
                            <span key={`mob-ttl-s-${reply.cid}`} className="ttl"> (...)
                            <br key={`mob-ttl-s-br1-${reply.cid}`} /><br key={`mob-ttl-s-br2${reply.cid}`} />
                            Comment too long.&nbsp;
                              <Link key={`mob-ttl-l-${reply.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="ttl-link">Click here</Link>
                            &nbsp;to view. </span>
                          </blockquote>
                        </>
                      : <blockquote key={`mob-pm-${reply.cid}`} className="post-message">
                          <a key={`mob-r-pm-${reply.cid}`} className="quotelink" href={handleVoidClick}>
                            {`>>${reply.cid.slice(0, 8)}`}{<br />}
                          </a>
                          {reply.content}
                        </blockquote>)
                      : null}
                    </div>
                  </div>
                )})}
              </div>
            </>
            )})}
          </InfiniteScroll>
        </div>
      </BoardForm>
    </Container>
  );
}

export default Board;