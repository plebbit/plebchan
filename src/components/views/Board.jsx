import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAppStore from '../../useAppStore';
import { Container, NavBar, Header, Break, PostFormLink, PostFormTable, PostForm, TopBar, BoardForm } from './styles/Board.styled';
import CaptchaModal from '../CaptchaModal';
import ImageBanner from '../ImageBanner';
import PostLoader from '../PostLoader';
import ReplyModal from '../ReplyModal';
import SettingsModal from '../SettingsModal';
import { useFeed, usePublishComment } from '@plebbit/plebbit-react-hooks';
import InfiniteScroll from 'react-infinite-scroller';
import { Tooltip } from 'react-tooltip';
import handleStyleChange from '../../utils/handleStyleChange';
import onError from '../../utils/onError';
import onSuccess from '../../utils/onSuccess';
import getDate from '../../utils/getDate';
import renderComments from '../../utils/renderComments';
import useClickForm from '../../hooks/useClickForm';


const Board = () => {
  const {
    captchaResponse, setCaptchaResponse,
    defaultSubplebbits,
    isSettingsOpen, setIsSettingsOpen,
    selectedAddress, setSelectedAddress,
    selectedStyle,
    setSelectedThread,
    selectedTitle, setSelectedTitle,
    showPostForm,
    showPostFormLink
  } = useAppStore(state => state);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const { publishComment } = usePublishComment();
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [endIndex, setEndIndex] = useState(2);
  const { feed, hasMore, loadMore } = useFeed({subplebbitAddresses: ['test2'], sortType: 'new'});
  const [selectedFeed, setSelectedFeed] = useState(feed);
  const renderedFeed = selectedFeed.slice(0, endIndex);
  const { subplebbitAddress } = useParams();  
  const handleClickForm = useClickForm();


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
      onSuccess('challenge success', {publishedCid: challengeVerification.publication.cid})
    }
    else if (challengeVerification.challengeSuccess === false) {
      onError('challenge failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
      onError("Error: You seem to have mistyped the CAPTCHA. Please try again.");
    }
  }


  const onChallenge = async (challenges, comment) => {
    let challengeAnswers = [];
    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges)
    }
    catch (error) {
      onError(error);
    }
    if (challengeAnswers) {
      await comment.publishChallengeAnswers(challengeAnswers)
    }
  }
  

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
        reject(onError('Could not load challenge image'));
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
    alert("- Embedding media is optional, posts can be text-only. \n- A CAPTCHA challenge will appear after posting. \n- The CAPTCHA is case-sensitive.");
  };


  const handleClickThread = (thread) => {
    setSelectedThread(thread);
  };
  

  const handlePublishComment = async () => {
    try {
      const pendingComment = await publishComment({
        content: comment,
        title: subject,
        subplebbitAddress: selectedAddress,
        onChallengeVerification,
        onChallenge,
        onError: onError,
      });
      console.log(`Comment pending with index: ${pendingComment.index}`);
      setName('');
      setSubject('');
      setComment('');
    } catch (error) {
      onError(error);
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

  const handleReplyClose = () => {
    setIsReplyOpen(false);
  };
  
  const handleReplyOpen = () => {
    setIsReplyOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  }

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  }



  return (
    <Container>
      <CaptchaModal 
      selectedStyle={selectedStyle}
      isOpen={isCaptchaOpen} 
      closeModal={handleCaptchaClose} 
      captchaImage={captchaImage} />
      <ReplyModal 
      selectedStyle={selectedStyle}
      isOpen={isReplyOpen}
      closeModal={handleReplyClose} />
      <SettingsModal
      selectedStyle={selectedStyle}
      isOpen={isSettingsOpen}
      closeModal={handleSettingsClose} />
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
            <Link to={`/${selectedAddress}/settings`} onClick={handleSettingsOpen}>Settings</Link>
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
              <Link to={`/${selectedAddress}/settings`} onClick={handleSettingsOpen}>Settings</Link>
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
            loader={<PostLoader key="loader" />}
          >
            {renderedFeed.map(thread => {
            const { replies: { pages: { topAll: { comments } } } } = thread;
            const { renderedComments, omittedCount } = renderComments(comments);
            return (
            <Fragment key={`fragment1-${thread.cid}`}>
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
                        <Link to="" key={`fta-${thread.cid}`} onClick={handleVoidClick} className="file-thumb">
                          <img key={`fti-${thread.cid}`} src="/assets/plebchan-psycho.png" alt="filename.something" />
                        </Link>
                      </div>
                      <span key={`nb-${thread.cid}`} className="name-block">
                        {thread.title ? (
                          thread.title.length > 75 ?
                          <Fragment key={`fragment2-${thread.cid}`}>
                            <Tooltip key={`mob-tt-tm-${thread.cid}`} id="tt-title-mobile" className="tooltip" />
                            <span key={`q-${thread.cid}`} className="title"
                            data-tooltip-id="tt-title-mobile"
                            data-tooltip-content={thread.title}
                            data-tooltip-place="top">
                              {thread.title.slice(0, 75) + " (...)"}
                            </span>
                          </Fragment>
                        : <span key={`q-${thread.cid}`} className="title">
                          {thread.title}
                          </span>) 
                        : null}&nbsp;
                        {thread.author.displayName
                        ? thread.author.displayName.length > 20
                        ? <Fragment key={`fragment3-${thread.cid}`}>
                            <Tooltip key={`mob-tt-nm-${thread.cid}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`n-${thread.cid}`} className="name"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={thread.author.displayName}
                            data-tooltip-place="top">
                              {thread.author.displayName.slice(0, 20) + " (...)"}
                            </span>
                          </Fragment> 
                          : <span key={`n-${thread.cid}`} className="name">
                            {thread.author.displayName}</span>
                        : <span key={`n-${thread.cid}`} className="name">
                          Anonymous</span>}
                        &nbsp;
                        (u/
                        {thread.author.address.length > 15 ?
                        <Fragment key={`fragment4-${thread.cid}`}>
                          <Tooltip key={`mob-tt-am-${thread.cid}`} id="tt-address-mobile" className="tooltip" />
                          <span key={`pa-${thread.cid}`} className="poster-address"
                          data-tooltip-id="tt-address-mobile"
                          data-tooltip-content={thread.author.address}
                          data-tooltip-place="top">
                            {thread.author.address.slice(0, 15) + "..."}
                          </span>
                        </Fragment>
                        : <span key={`pa-${thread.cid}`} className="poster-address">
                          {thread.author.address}
                        </span>})
                        &nbsp;
                        <span key={`dt-${thread.cid}`} className="date-time" data-utc="data">{getDate(thread.timestamp)}</span>
                        &nbsp;
                        <span key={`pn-${thread.cid}`} className="post-number">
                          <Link to="" key={`pl1-${thread.cid}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                          <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`pl2-${thread.cid}`} onClick={handleReplyOpen} title="Reply to this post">{thread.cid.slice(0, 8)}</button>
                          &nbsp;
                          <span key={`rl1-${thread.cid}`}>&nbsp;
                            [
                            <Link key={`rl2-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="reply-link" >Reply</Link>
                            ]
                          </span>
                        </span>&nbsp;
                        <button key={`pmb-${thread.cid}`} className="post-menu-button" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }} data-cmd="post-menu">▶</button>
                        <div key={`bi-${thread.cid}`} id="backlink-id" className="backlink">
                          {thread.replies?.pages.topAll.comments
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .map((reply) => (
                              <div key={`div-${reply.cid}`} style={{display: 'inline-block'}}>
                              <Link key={`ql-${reply.cid}`}
                              to={handleVoidClick} className="quote-link" 
                              onClick={(event) => handleQuoteClick(reply, event)}>
                                c/{reply.cid.slice(0, 8)}</Link>
                                &nbsp;
                              </div>
                            ))
                          }
                        </div>
                      </span>
                      {thread.content ? (
                        thread.content.length > 2000 ?
                        <Fragment key={`fragment5-${thread.cid}`}>
                          <blockquote key={`bq-${thread.cid}`}>
                            {thread.content.slice(0, 2000)}
                            <span key={`ttl-s-${thread.cid}`} className="ttl"> (...) 
                            <br key={`ttl-s-br1-${thread.cid}`} /><br key={`ttl-s-br2${thread.cid}`} />
                            Post too long.&nbsp;
                              <Link key={`ttl-l-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="ttl-link">Click here</Link>
                              &nbsp;to view. </span>
                          </blockquote>
                        </Fragment>
                      : <blockquote key={`bq-${thread.cid}`}>
                          {thread.content}
                        </blockquote>)
                      : null}
                    </div>
                  </div>
                </div>
                <span key={`summary-${thread.cid}`} className="summary">
                  {omittedCount > 0 ? (
                  <span key={`oc-${thread.cid}`} className="ttl">
                    <span key={`oc1-${thread.cid}`}>
                      {omittedCount} post{omittedCount > 1 ? "s" : ""} omitted. Click&nbsp;
                      <Link key={`oc2-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="ttl-link">here</Link>
                      &nbsp;to view.
                    </span>
                  </span>) : null}
                </span>
                {renderedComments.map(reply => {
                  return (
                <div key={`pc-${reply.cid}`} className="reply-container">
                  <div key={`sa-${reply.cid}`} className="side-arrows">{'>>'}</div>
                  <div key={`pr-${reply.cid}`} className="post-reply">
                    <div key={`pi-${reply.cid}`} className="post-info">
                      <span key={`nb-${reply.cid}`} className="nameblock">
                        {reply.author.displayName
                          ? reply.author.displayName.length > 12
                          ? <Fragment key={`fragment6-${reply.cid}`}>
                              <Tooltip key={`mob-tt-nm-${reply.cid}`} id="tt-name" className="tooltip" />
                              <span key={`mob-n-${reply.cid}`} className="name"
                              data-tooltip-id="tt-name"
                              data-tooltip-content={reply.author.displayName}
                              data-tooltip-place="top">
                                {reply.author.displayName.slice(0, 12) + " (...)"}
                              </span>
                            </Fragment>
                            : <span key={`mob-n-${reply.cid}`} className="name">
                              {reply.author.displayName}</span>
                          : <span key={`mob-n-${reply.cid}`} className="name">
                            Anonymous</span>}
                        &nbsp;
                        <span key={`pa-${reply.cid}`} className="poster-address">
                          (u/
                            {reply.author.address.length > 12 ?
                            <Fragment key={`fragment7-${reply.cid}`}>
                              <Tooltip key={`mob-tt-am-${reply.cid}`} id="tt-address" className="tooltip" />
                              <span key={`mob-ha-${reply.cid}`}
                              data-tooltip-id="tt-address"
                              data-tooltip-content={reply.author.address}
                              data-tooltip-place="top">
                                {reply.author.address.slice(0, 12) + "..."}
                              </span>
                            </Fragment>
                            : <span key={`mob-ha-${reply.cid}`}>
                              {reply.author.address}
                            </span>}
                          )
                        </span>
                      </span>
                      &nbsp;
                      <span key={`dt-${reply.cid}`} className="date-time" data-utc="data">{getDate(reply.timestamp)}</span>
                      &nbsp;
                      <span key={`pn-${reply.cid}`} className="post-number">
                        <Link to="" key={`pl1-${reply.cid}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                        <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`pl2-${reply.cid}`} onClick={handleReplyOpen} title="Reply to this post">{reply.cid.slice(0, 8)}</button>
                      </span>&nbsp;
                      <button key={`pmb-${reply.cid}`} className="post-menu-button" onClick={handleVoidClick} title="Post menu" style={{ all: 'unset', cursor: 'pointer' }} data-cmd="post-menu">▶</button>
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
                    {reply.content ? (
                        reply.content.length > 1000 ?
                        <Fragment key={`fragment8-${reply.cid}`}>
                          <blockquote key={`pm-${reply.cid}`} className="post-message">
                            <Link to="" key={`r-pm-${reply.cid}`} className="quotelink" onClick={handleVoidClick}>
                              {`c/${reply.parentCid.slice(0, 8)}`}{<br />}
                            </Link>
                            {reply.content.slice(0, 1000)}
                            <span key={`ttl-s-${reply.cid}`} className="ttl"> (...)
                            <br key={`ttl-s-br1-${reply.cid}`} /><br key={`ttl-s-br2${reply.cid}`} />
                            Comment too long.&nbsp;
                              <Link key={`ttl-l-${reply.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="ttl-link">Click here</Link>
                            &nbsp;to view. </span>
                          </blockquote>
                        </Fragment>
                      : <blockquote key={`pm-${reply.cid}`} className="post-message">
                          <Link to={handleVoidClick} key={`r-pm-${reply.cid}`} className="quotelink" onClick={(event) => handleQuoteClick(reply, event)}>
                            {`c/${reply.parentCid.slice(0, 8)}`}{<br />}
                          </Link>
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
                      <button key={`mob-pb-${thread.cid}`} className="post-menu-button-mobile" onClick={handleVoidClick} style={{ all: 'unset', cursor: 'pointer' }}>...</button>
                      <span key={`mob-nbm-${thread.cid}`} className="name-block-mobile">
                        {thread.author.displayName
                        ? thread.author.displayName.length > 15
                        ? <Fragment key={`fragment9-${thread.cid}`}>
                            <Tooltip key={`mob-tt-nm-${thread.cid}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`mob-n-${thread.cid}`} className="name-mobile"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={thread.author.displayName}
                            data-tooltip-place="top">
                              {thread.author.displayName.slice(0, 15) + " (...)"}
                            </span>
                          </Fragment> 
                          : <span key={`mob-n-${thread.cid}`} className="name-mobile">
                            {thread.author.displayName}</span>
                        : <span key={`mob-n-${thread.cid}`} className="name-mobile">
                          Anonymous</span>}
                        &nbsp;
                        <span key={`mob-pa-${thread.cid}`} className="poster-address-mobile">
                          (u/
                          {thread.author.address.length > 15 ?
                          <Fragment key={`fragment10-${thread.cid}`}>
                            <Tooltip key={`mob-tt-am-${thread.cid}`} id="tt-address-mobile" className="tooltip" />
                            <span key={`mob-ha-${thread.cid}`} className="highlight-address-mobile"
                            data-tooltip-id="tt-address-mobile"
                            data-tooltip-content={thread.author.address}
                            data-tooltip-place="top">
                              {thread.author.address.slice(0, 15) + "..."}
                            </span>
                          </Fragment>
                          : <span key={`mob-ha-${thread.cid}`} className="highlight-address-mobile">
                            {thread.author.address}
                          </span>}
                          )&nbsp;
                        </span>
                        <br key={`mob-br1-${thread.cid}`} />
                        {thread.title ? (
                          thread.title.length > 30 ?
                          <Fragment key={`fragment11-${thread.cid}`}>
                            <Tooltip key={`mob-tt-tm-${thread.cid}`} id="tt-title-mobile" className="tooltip" />
                            <span key={`mob-t-${thread.cid}`} className="subject-mobile"
                            data-tooltip-id="tt-title-mobile"
                            data-tooltip-content={thread.title}
                            data-tooltip-place="top">
                              {thread.title.slice(0, 30) + " (...)"}
                            </span>
                          </Fragment>
                        : <span key={`mob-t-${thread.cid}`} className="subject-mobile">
                          {thread.title}
                          </span>) 
                        : null}
                      </span>
                      <span key={`mob-dt-${thread.cid}`} className="date-time-mobile">
                        {getDate(thread.timestamp)}
                        &nbsp;
                        <Link to="" key={`mob-no-${thread.cid}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                        <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`mob-no2-${thread.cid}`} onClick={handleReplyOpen} title="Reply to this post">{thread.cid.slice(0, 8)}</button>
                      </span>
                    </div>
                    <div key={`mob-f-${thread.cid}`} className="file-mobile">
                      <Link to="" key={`mob-ft${thread.cid}`} className="file-thumb-mobile" onClick={handleVoidClick} target="_blank">
                        <img key={`mob-img-${thread.cid}`} src="/assets/plebchan-psycho.png" alt="" />
                        <div key={`mob-fi-${thread.cid}`} className="file-info-mobile">58 KB JPG</div>
                      </Link>
                    </div>
                    {thread.content ? (
                        thread.content.length > 1500 ?
                        <Fragment key={`fragment12-${thread.cid}`}>
                          <blockquote key={`mob-bq-${thread.cid}`} className="post-message-mobile">
                            {thread.content.slice(0, 1500)}
                            <span key={`mob-ttl-s-${thread.cid}`} className="ttl"> (...)
                            <br key={`mob-ttl-s-br1-${thread.cid}`} /><br key={`mob-ttl-s-br2${thread.cid}`} />
                             Post too long.&nbsp;
                              <Link key={`mob-ttl-l-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="ttl-link">Click here</Link>
                              &nbsp;to view. </span>
                          </blockquote>
                        </Fragment>
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
                        <button key={`pmbm-${reply.cid}`} className="post-menu-button-mobile" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>...</button>
                        <span key={`mob-nb-${reply.cid}`} className="name-block-mobile">
                          {reply.author.displayName
                          ? reply.author.displayName.length > 12
                          ? <Fragment key={`fragment13-${reply.cid}`}>
                              <Tooltip key={`mob-tt-nm-${reply.cid}`} id="tt-name-mobile" className="tooltip" />
                              <span key={`mob-n-${reply.cid}`} className="name-mobile"
                              data-tooltip-id="tt-name-mobile"
                              data-tooltip-content={reply.author.displayName}
                              data-tooltip-place="top">
                                {reply.author.displayName.slice(0, 12) + " (...)"}
                              </span>
                            </Fragment>
                            : <span key={`mob-n-${reply.cid}`} className="name-mobile">
                              {reply.author.displayName}</span>
                          : <span key={`mob-n-${reply.cid}`} className="name-mobile">
                            Anonymous</span>}
                          &nbsp;
                          <span key={`mob-pa-${reply.cid}`} className="poster-address-mobile">
                            (u/
                            {reply.author.address.length > 10 ?
                            <Fragment key={`fragment14-${reply.cid}`}>
                              <Tooltip key={`mob-tt-am-${reply.cid}`} id="tt-address-mobile" className="tooltip" />
                              <span key={`mob-ha-${reply.cid}`} className="highlight-address-mobile"
                              data-tooltip-id="tt-address-mobile"
                              data-tooltip-content={reply.author.address}
                              data-tooltip-place="top">
                                {reply.author.address.slice(0, 10) + "..."}
                              </span>
                            </Fragment>
                            : <span key={`mob-ha-${reply.cid}`} className="highlight-address-mobile">
                              {reply.author.address}
                            </span>}
                            )&nbsp;
                          </span>
                          <br key={`mob-br-${reply.cid}`} />
                        </span>
                        <span key={`mob-dt-${reply.cid}`} className="date-time-mobile">
                        {getDate(reply.timestamp)}&nbsp;
                          <Link to="" key={`mob-pl1-${reply.cid}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                          <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`mob-pl2-${reply.cid}`} onClick={handleReplyOpen} title="Reply to this post">{reply.cid.slice(0, 8)}</button>
                        </span>
                      </div>
                      {reply.content ? (
                        reply.content.length > 1000 ?
                        <Fragment key={`fragment15-${reply.cid}`}>
                          <blockquote key={`mob-pm-${reply.cid}`} className="post-message">
                            <Link to="" key={`mob-r-pm-${reply.cid}`} className="quotelink" onClick={handleVoidClick}>
                              {`c/${reply.parentCid.slice(0, 8)}`}{<br />}
                            </Link>
                            {reply.content.slice(0, 1000)}
                            <span key={`mob-ttl-s-${reply.cid}`} className="ttl"> (...)
                            <br key={`mob-ttl-s-br1-${reply.cid}`} /><br key={`mob-ttl-s-br2${reply.cid}`} />
                            Comment too long.&nbsp;
                              <Link key={`mob-ttl-l-${reply.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="ttl-link">Click here</Link>
                            &nbsp;to view. </span>
                          </blockquote>
                        </Fragment>
                      : <blockquote key={`mob-pm-${reply.cid}`} className="post-message">
                          <Link to={handleVoidClick} key={`mob-r-pm-${reply.cid}`} className="quotelink" onClick={(event) => handleQuoteClick(reply, event)}>
                            {`c/${reply.parentCid.slice(0, 8)}`}{<br />}
                          </Link>
                          {reply.content}
                        </blockquote>)
                      : null}
                    </div>
                  </div>
                )})}
              </div>
            </Fragment>
            )})}
          </InfiniteScroll>
        </div>
      </BoardForm>
    </Container>
  );
}

export default Board;