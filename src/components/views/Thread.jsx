import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useComment, usePublishComment } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import useAppStore from '../../useAppStore';
import { Container, NavBar, Header, Break, PostForm, PostFormTable, BoardForm } from './styles/Board.styled';
import { ReplyFormLink, TopBar, BottomBar } from './styles/Thread.styled';
import CaptchaModal from '../CaptchaModal';
import ImageBanner from '../ImageBanner';
import PostLoader from '../PostLoader';
import ReplyModal from '../ReplyModal';
import SettingsModal from '../SettingsModal';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getDate from '../../utils/getDate';
import handleStyleChange from '../../utils/handleStyleChange';
import onError from '../../utils/onError';
import onSuccess from '../../utils/onSuccess';
import renderThreadComments from '../../utils/renderThreadComments';
import useClickForm from '../../hooks/useClickForm';


const Thread = () => {
  const {
    captchaResponse, setCaptchaResponse,
    defaultSubplebbits,
    isSettingsOpen, setIsSettingsOpen,
    selectedAddress, setSelectedAddress,
    selectedStyle,
    selectedThread, setSelectedThread,
    selectedTitle, setSelectedTitle,
    showPostForm,
    showPostFormLink
  } = useAppStore(state => state);
  

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const { publishComment } = usePublishComment();
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const comment = useComment({selectedThread});
  const { subplebbitAddress, threadCid } = useParams();
  const handleClickForm = useClickForm();

  const commentMediaInfo = getCommentMediaInfo(comment);
  const fallbackImgUrl = "/assets/filedeleted-res.gif";


  // temporary title from JSON, gets subplebbitAddress and threadCid from URL
  useEffect(() => {
    setSelectedAddress(subplebbitAddress);
    setSelectedThread(threadCid);
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
    if (selectedSubplebbit) {
      setSelectedTitle(selectedSubplebbit.title);
    }
  }, [subplebbitAddress, setSelectedAddress, setSelectedTitle, defaultSubplebbits]);

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
        onError: onError,
      });
      console.log(`Comment pending with index: ${pendingComment.index}`);
      setName('');
      setSubject('');
      setCommentContent('');
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
              <Link key={`a-${subplebbit.address}`} 
              to={`/${subplebbit.address}`} 
              onClick={() => handleClickTitle(subplebbit.title, subplebbit.address)}
              >{subplebbit.title}</Link>
              ]&nbsp;
            </span>
          ))}
          <span className="nav">
            [
            <Link to={`/${selectedAddress}/thread/${selectedThread}/settings`} onClick={handleSettingsOpen}>Settings</Link>
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
              <Link to={`/${selectedAddress}/thread/${selectedThread}/settings`} onClick={handleSettingsOpen}>Settings</Link>
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
          comment.replyCount !== undefined ? (
            comment.replyCount > 0 ? (
              comment.replyCount === 1 ? (
                <span className="reply-stat">{comment.replyCount} reply</span>
              ) : (
                <span className="reply-stat">{comment.replyCount} replies</span>
              )
            ) : (
              <span className="reply-stat">No replies yet</span>
            )
          ) : (
            <span className="reply-stat">Fetching IPFS...</span>
          )
        ) : (
          <span className="reply-stat">Fetching IPFS...</span>
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
                  {commentMediaInfo?.url ? (
                      <div key={`f-${comment.cid}`} className="file" style={{marginBottom: "5px"}}>
                        <div key={`ft-${comment.cid}`} className="file-text">
                          Link:&nbsp;
                          <a key={`fa-${comment.cid}`} href={commentMediaInfo.url} target="_blank">{
                          commentMediaInfo?.url.length > 30 ?
                          commentMediaInfo?.url.slice(0, 30) + "(...)" :
                          commentMediaInfo?.url
                          }</a>&nbsp;({commentMediaInfo?.type})
                        </div>
                        {commentMediaInfo?.type === "webpage" ? (
                          <span key={`fta-${comment.cid}`} className="file-thumb">
                            <img key={`fti-${comment.cid}`} src={comment.thumbnailUrl} alt="thumbnail" onError={(e) => e.target.src = fallbackImgUrl} />
                          </span>
                        ) : null}
                        {commentMediaInfo?.type === "image" ? (
                          <span key={`fta-${comment.cid}`} className="file-thumb">
                            <img key={`fti-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                          </span>
                        ) : null}
                        {commentMediaInfo?.type === "video" ? (
                          <span key={`fta-${comment.cid}`} className="file-thumb">
                            <video key={`fti-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                          </span>
                        ) : null}
                        {commentMediaInfo?.type === "audio" ? (
                          <span key={`fta-${comment.cid}`} className="file-thumb">
                            <audio key={`fti-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                          </span>
                        ) : null}
                      </div>
                    ) : null}
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
                      {comment.author?.displayName
                        ? comment.author?.displayName.length > 20
                        ? <>
                            <Tooltip key={`mob-tt-nm-${comment.cid}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`n-${comment.cid}`} className="name"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={comment.author?.displayName}
                            data-tooltip-place="top">
                              {comment.author?.displayName.slice(0, 20) + " (...)"}
                            </span>
                          </> 
                          : <span key={`n-${comment.cid}`} className="name">
                            {comment.author?.displayName}</span>
                        : <span key={`n-${comment.cid}`} className="name">
                          Anonymous</span>}
                        &nbsp;
                      &nbsp;
                      <span className="poster-address">
                        (u/
                          {comment.author?.address.length > 20 ?
                        <>
                          <Tooltip key={`mob-tt-am-${comment.cid}`} id="tt-address-mobile" className="tooltip" />
                          <span key={`pa-${comment.cid}`} className="poster-address"
                          data-tooltip-id="tt-address-mobile"
                          data-tooltip-content={comment.author?.address}
                          data-tooltip-place="top">
                            {comment.author?.address.slice(0, 20) + "..."}
                          </span>
                        </>
                        : <span key={`pa-${comment.cid}`} className="poster-address">
                          {comment.author?.address}
                        </span>})
                      </span>
                      &nbsp;
                      <span className="date-time" data-utc="data">{getDate(comment?.timestamp)}</span>
                      &nbsp;
                      <span className="post-number">
                        <Link to="" onClick={handleVoidClick} title="Link to this post">c/</Link>
                        <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} onClick={handleReplyOpen} title="Reply to this post">{comment.cid?.slice(0, 8)}</button>
                      </span>&nbsp;&nbsp;
                      <button key={`pmb-${comment.cid}`} className="post-menu-button" onClick={handleVoidClick} title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>▶</button>
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
              {comment.replyCount === undefined ? <PostLoader /> : null}
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
                          <span key={`dt-${reply.cid}`} className="date-time" data-utc="data">{getDate(reply?.timestamp)}</span>
                          &nbsp;
                          <span key={`pn-${reply.cid}`} className="post-number">
                            <Link to="" key={`pl1-${reply.cid}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                            <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`pl2-${reply.cid}`} onClick={handleReplyOpen} title="Reply to this post">{reply.cid.slice(0, 8)}</button>
                          </span>&nbsp;
                          <button key={`pmb-${reply.cid}`} className="post-menu-button" onClick={handleVoidClick} title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>▶</button>
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
                      <button style={{ all: 'unset', cursor: 'pointer' }} key={`mob-pb-${comment.cid}`} className="post-menu-button-mobile" onClick={handleVoidClick}>...</button>
                      <span className="name-block-mobile">
                        {comment.author?.displayName
                        ? comment.author?.displayName.length > 15
                        ? <>
                            <Tooltip key={`mob-tt-nm-${comment.cid}`} id="tt-name-mobile" className="tooltip" />
                            <span key={`mob-n-${comment.cid}`} className="name-mobile"
                            data-tooltip-id="tt-name-mobile"
                            data-tooltip-content={comment.author?.displayName}
                            data-tooltip-place="top">
                              {comment.author?.displayName.slice(0, 15) + " (...)"}
                            </span>
                          </> 
                          : <span key={`mob-n-${comment.cid}`} className="name-mobile">
                            {comment.author?.displayName}</span>
                        : <span key={`mob-n-${comment.cid}`} className="name-mobile">
                          Anonymous</span>}
                        &nbsp;
                        <span key={`mob-pa-${comment.cid}`} className="poster-address-mobile">
                          (u/
                          {comment.author?.address.length > 15 ?
                          <>
                            <Tooltip key={`mob-tt-am-${comment.cid}`} id="tt-address-mobile" className="tooltip" />
                            <span key={`mob-ha-${comment.cid}`} className="highlight-address-mobile"
                            data-tooltip-id="tt-address-mobile"
                            data-tooltip-content={comment.author?.address}
                            data-tooltip-place="top">
                              {comment.author?.address.slice(0, 15) + "..."}
                            </span>
                          </>
                          : <span key={`mob-ha-${comment.cid}`} className="highlight-address-mobile">
                            {comment.author?.address}
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
                        {getDate(comment?.timestamp)}
                        &nbsp;
                        <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`mob-no-${comment.cid}`} onClick={handleReplyOpen} title="Link to this post">c/</button>
                        <Link to="" key={`mob-no2-${comment.cid}`} onClick={handleVoidClick} title="Reply to this post">{comment.cid?.slice(0, 8)}</Link>
                      </span>
                    </div>
                    {commentMediaInfo?.url ? (
                      commentMediaInfo.type === "webpage" ? (
                        <div key={`mob-f-${comment.cid}`} className="file-mobile">
                          <span key={`mob-ft${comment.cid}`} className="file-thumb-mobile">
                            <img key={`mob-img-${comment.cid}`} src={comment.thumbnailUrl} alt="thumbnail" onError={(e) => e.target.src = fallbackImgUrl} />
                            <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                          </span>
                        </div>
                      ) : commentMediaInfo.type === "image" ? (
                        <div key={`mob-f-${comment.cid}`} className="file-mobile">
                          <span key={`mob-ft${comment.cid}`} className="file-thumb-mobile">
                            <img key={`mob-img-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                          </span>
                        </div>
                      ) : commentMediaInfo.type === "video" ? (
                        <div key={`mob-f-${comment.cid}`} className="file-mobile">
                          <span key={`mob-ft${comment.cid}`} className="file-thumb-mobile">
                            <video key={`mob-img-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                          </span>
                        </div>
                      ) : commentMediaInfo.type === "audio" ? (
                        <div key={`mob-f-${comment.cid}`} className="file-mobile">
                          <span key={`mob-ft${comment.cid}`} className="file-thumb-mobile">
                            <audio key={`mob-img-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                          </span>
                        </div>
                      ) : null
                    ) : null}
                    <blockquote key={`mob-bq-${comment.cid}`} className="post-message-mobile">
                      {comment.content ? (
                        <>
                          {comment.content}
                        </>
                      ) : null}
                    </blockquote>
                  </div>
                </div>
                {comment.replyCount === undefined ? <PostLoader /> : null}
                {comment.replyCount > 0 && 
                Object.keys(comment.replies.pages.topAll.comments).map(() => {
                  const renderedComments = renderThreadComments(comment.replies.pages.topAll.comments);
                  return renderedComments.map(reply => {
                    return (
                  <div key={`mob-rc-${reply.cid}`} className="reply-container">
                    <div key={`mob-pr-${reply.cid}`} className="post-reply">
                      <div key={`mob-pi-${reply.cid}`} className="post-info-mobile">
                        <button className="post-menu-button-mobile" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>...</button>
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
                          {getDate(reply?.timestamp)}&nbsp;
                          <Link to="" key={`mob-pl1-${reply.cid}`} onClick={handleVoidClick} title="Link to this post">c/</Link>
                          <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`mob-pl2-${reply.cid}`} onClick={handleReplyOpen} title="Reply to this post">{reply.cid.slice(0, 8)}</button>
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
                  comment.replyCount !== undefined ? (
                    comment.replyCount > 0 ? (
                      comment.replyCount === 1 ? (
                        <span className="reply-stat">{comment.replyCount} reply</span>
                      ) : (
                        <span className="reply-stat">{comment.replyCount} replies</span>
                      )
                    ) : (
                      <span className="reply-stat">No replies yet</span>
                    )
                  ) : (
                    <span className="reply-stat">Loading...</span>
                  )
                ) : (
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
          <PostLoader />
        )}
      </BoardForm>
    </Container>
  );
}

export default Thread;