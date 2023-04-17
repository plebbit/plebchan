import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useComment, usePublishComment } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break, PostForm, PostFormTable, BoardForm } from '../styled/Board.styled';
import { ReplyFormLink, TopBar, BottomBar } from '../styled/Thread.styled';
import ImageBanner from '../ImageBanner';
import Post from '../Post';
import PostLoader from '../PostLoader';
import ReplyModal from '../ReplyModal';
import SettingsModal from '../SettingsModal';
import findShortParentCid from '../../utils/findShortParentCid';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getDate from '../../utils/getDate';
import handleQuoteClick from '../../utils/handleQuoteClick';
import handleStyleChange from '../../utils/handleStyleChange';
import renderThreadComments from '../../utils/renderThreadComments';
import useClickForm from '../../hooks/useClickForm';
import useError from '../../hooks/useError';
import useSuccess from '../../hooks/useSuccess';


const Thread = () => {
  const {
    captchaResponse, setCaptchaResponse,
    setChallengesArray,
    defaultSubplebbits,
    setIsCaptchaOpen,
    isSettingsOpen, setIsSettingsOpen,
    pendingComment, setPendingComment,
    selectedAddress, setSelectedAddress,
    setSelectedParentCid,
    setSelectedShortCid,
    selectedStyle,
    selectedThread, setSelectedThread,
    selectedTitle, setSelectedTitle,
    showPostForm,
    showPostFormLink,
  } = useGeneralStore(state => state);

  const nameRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();

  const onChallengeVerificationRef = useRef();

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const comment = useComment({commentCid: selectedThread});
  const { subplebbitAddress, threadCid } = useParams();
  const handleClickForm = useClickForm();

  const commentMediaInfo = getCommentMediaInfo(comment);
  const fallbackImgUrl = "/assets/filedeleted-res.gif";

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  useError(errorMessage, [errorMessage]);
  useSuccess(successMessage, [successMessage]);

  const renderedComments = renderThreadComments(comment, pendingComment);

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
      setSuccessMessage('challenge success', {publishedCid: challengeVerification.publication?.cid});
    }
    else if (challengeVerification.challengeSuccess === false) {
      setErrorMessage('challenge failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
      setErrorMessage("Error: You seem to have mistyped the CAPTCHA. Please try again.");
    }
  };


  const onChallenge = async (challenges, comment) => {
    setPendingComment(comment);
    let challengeAnswers = [];
    
    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges)
    }
    catch (error) {
      setErrorMessage(error);
    }
    if (challengeAnswers) {
      await comment.publishChallengeAnswers(challengeAnswers)
    }
  };

  
  const [publishCommentOptions, setPublishCommentOptions] = useState({
    subplebbitAddress: selectedAddress,
    onChallenge,
    onChallengeVerification: onChallengeVerificationRef.current,
    onError: (error) => {
      setErrorMessage(error);
    },
  });


  const { publishComment, index } = usePublishComment(publishCommentOptions);


  useEffect(() => {
    if (index !== undefined) {
      window.scrollTo(0, document.body.scrollHeight);
      setSuccessMessage('Comment pending with index ' + index + '.');
    }
  }, [index]);
  

  onChallengeVerificationRef.current = onChallengeVerification;

  
  const resetFields = () => {
    nameRef.current.value = '';
    commentRef.current.value = '';
    linkRef.current.value = '';
  };


  useEffect(() => {
    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      subplebbitAddress: selectedAddress,
      onChallengeVerification: onChallengeVerificationRef.current,
    }));
  }, [selectedAddress]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      author: {
        displayName: nameRef.current.value || undefined,
      },
      content: commentRef.current.value || undefined,
      link: linkRef.current.value || undefined,
      parentCid: selectedThread,
    }));
  };
  
  
  useEffect(() => {
    if (publishCommentOptions.content) {
      (async () => {
        await publishComment();
        resetFields();
      })();
    }
  }, [publishCommentOptions]);


  const getChallengeAnswersFromUser = async (challenges) => {
    setChallengesArray(challenges);
    
    return new Promise((resolve, reject) => {
      const imageString = challenges?.challenges[0].challenge;
      const imageSource = `data:image/png;base64,${imageString}`;
      const challengeImg = new Image();
      challengeImg.src = imageSource;
  
      challengeImg.onload = () => {
        setIsCaptchaOpen(true);
  
        const handleKeyDown = (event) => {
          if (event.key === 'Enter') {
            resolve(captchaResponse);
            setIsCaptchaOpen(false);
            document.removeEventListener('keydown', handleKeyDown);
            event.preventDefault();
          }
        };

        setCaptchaResponse('');
        document.addEventListener('keydown', handleKeyDown);
      };
  
      challengeImg.onerror = () => {
        reject(setErrorMessage('Could not load challenges'));
      };
    });
  };

  // mobile navbar board select functionality
  const handleSelectChange = (event) => {
    const selected = event.target.value;
    const selectedTitle = defaultSubplebbits.find((subplebbit) => subplebbit.address === selected).title;
    setSelectedTitle(selectedTitle);
    setSelectedAddress(selected);
    navigate(`/p/${selected}`);
  };


  return (
    <Container>
      <ReplyModal 
      selectedStyle={selectedStyle}
      isOpen={isReplyOpen}
      closeModal={() => setIsReplyOpen(false)} />
      <SettingsModal
      selectedStyle={selectedStyle}
      isOpen={isSettingsOpen}
      closeModal={() => setIsSettingsOpen(false)} />
      <NavBar selectedStyle={selectedStyle}>
        <>
          {defaultSubplebbits.map(subplebbit => (
            <span className="boardList" key={`span-${subplebbit.address}`}>
              [
              <Link key={`a-${subplebbit.address}`} 
              to={`/p/${subplebbit.address}`} 
              onClick={() => {
                setSelectedTitle(subplebbit.title);
                setSelectedAddress(subplebbit.address);
              }}
              >{subplebbit.title ? subplebbit.title : subplebbit.address}</Link>
              ]&nbsp;
            </span>
          ))}
          <span className="nav">
            [
            <Link to={`/p/${selectedAddress}/c/${selectedThread}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
                    >{subplebbit.title ? subplebbit.title : subplebbit.address}</option>
                  ))}
              </select>
            </div>
            <div className="page-jump">
              <Link to={`/p/${selectedAddress}/c/${selectedThread}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
              <Link to={`/p/${selectedAddress}`}>Return</Link>
            </span>
          </div>
          <div id="catalog-button-mobile">
            <span className="btn-wrap">
              <Link to={`/p/${selectedAddress}/catalog`}>Catalog</Link>
            </span>
          </div>
          <div id="bottom-button-mobile">
            <span className="btn-wrap">
              <a onClick={() => window.scrollTo(0, document.body.scrollHeight)} onMouseOver={(event) => event.target.style.cursor='pointer'}>Bottom</a>
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
                <input name="name" type="text" tabIndex={1} placeholder="Anonymous" ref={nameRef} />
                <input id="post-button" type="submit" value="Post" tabIndex={6} 
                onClick={handleSubmit} />
              </td>
            </tr>
            <tr data-type="Comment">
              <td>Comment</td>
              <td>
                <textarea name="com" cols="48" rows="4" tabIndex={4} wrap="soft" ref={commentRef} />
              </td>
            </tr>
            <tr data-type="File">
              <td>Embed File</td>
              <td>
                <input name="embed" type="text" tabIndex={7} placeholder="Paste link" ref={linkRef} />
                <button id="t-help" type="button" onClick={
                  () => alert("- Embedding media is optional, posts can be text-only. \n- A CAPTCHA challenge will appear after posting. \n- The CAPTCHA is case-sensitive.")}
                  data-tip="Help"
                >?</button>
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
          <a onClick={() =>  window.scrollTo(0, document.body.scrollHeight)} 
          onMouseOver={(event) => event.target.style.cursor='pointer'} 
          onTouchStart={() =>  window.scrollTo(0, document.body.scrollHeight)}>Bottom</a>
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
      <Tooltip id="tooltip" className="tooltip" />
      <BoardForm selectedStyle={selectedStyle}>
        {comment !== undefined ? (
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
                            <video controls key={`fti-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                          </span>
                        ) : null}
                        {commentMediaInfo?.type === "audio" ? (
                          <span key={`fta-${comment.cid}`} className="file-thumb">
                            <audio controls key={`fti-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    <span className="name-block">
                        {comment.title ? (
                          comment.title.length > 75 ?
                          <>
                            <span key={`q-${comment.cid}`} className="title"
                            data-tooltip-id="tooltip"
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
                            <span key={`n-${comment.cid}`} className="name"
                            data-tooltip-id="tooltip"
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
                          <span key={`pa-${comment.cid}`} className="poster-address">
                          {comment.author?.shortAddress}
                        </span>)
                      </span>
                      &nbsp;
                      <span className="date-time" data-utc="data">{getDate(comment?.timestamp)}</span>
                      &nbsp;
                      <span className="post-number">
                        <Link to="" onClick={() => {}} title="Link to this post">c/</Link>
                        <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} onClick={() => {
                          setIsReplyOpen(true); setSelectedParentCid(comment.cid); setSelectedShortCid(comment.shortCid);
                          }} title="Reply to this post">{comment.shortCid}</button>
                      </span>&nbsp;&nbsp;
                      <button key={`pmb-${comment.cid}`} className="post-menu-button" onClick={() => {}} title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>▶</button>
                      <div id="backlink-id" className="backlink">
                        {comment?.replies?.pages?.topAll.comments
                          .sort((a, b) => a.timestamp - b.timestamp)
                          .map((reply) => (
                            <div key={`div-${reply.cid}`} style={{display: 'inline-block'}}>
                            <Link to={() => {}} key={`ql-${reply.cid}`}
                              className="quote-link" 
                              onClick={(event) => handleQuoteClick(reply, event)}>
                              c/{reply.shortCid}</Link>
                              &nbsp;
                            </div>
                          ))
                        }
                      </div>
                    </span>
                    <blockquote key={`blockquote-${comment.cid}`}>
                      <Post content={comment.content} handlequoteclick={handleQuoteClick} comment={comment} key={`post-${comment.cid}`} />
                    </blockquote>
                  </div>
                </div>
              </div>
              {comment.replyCount === undefined ? <PostLoader /> : null}
              {comment.replyCount > 0 && 
              renderedComments.map((reply) => {
                  const replyMediaInfo = getCommentMediaInfo(reply);
                  const fallbackImgUrl = "/assets/filedeleted-res.gif";
                  const shortParentCid = findShortParentCid(reply.parentCid, comment);
                  return (
                    <div key={`pc-${reply.cid}-${Math.random()}`} className="reply-container">
                      <div key={`sa-${reply.cid}`} className="side-arrows">{'>>'}</div>
                      <div key={`pr-${reply.cid}`} className="post-reply" id="post-reply">
                        <div key={`pi-${reply.cid}`} className="post-info">
                        &nbsp;
                          <span key={`nb-${reply.cid}`} className="nameblock">
                          {reply.author?.displayName
                          ? reply.author?.displayName.length > 20
                          ? <>
                              <span key={`mob-n-${reply.cid}`} className="name"
                              data-tooltip-id="tooltip"
                              data-tooltip-content={reply.author?.displayName}
                              data-tooltip-place="top">
                                {reply.author?.displayName.slice(0, 20) + " (...)"}
                              </span>
                            </>
                            : <span key={`mob-n-${reply.cid}`} className="name">
                              {reply.author?.displayName ?? reply.displayName}</span>
                          : <span key={`mob-n-${reply.cid}`} className="name">
                            Anonymous</span>}
                            &nbsp;
                            <span key={`pa-${reply.cid}`} className="poster-address">
                              (u/
                              <span key={`mob-ha-${reply.cid}`}>
                                {reply.author?.shortAddress ?? reply.author.address}
                              </span>)
                            </span>
                          </span>
                          &nbsp;
                          <span key={`dt-${reply.cid}`} className="date-time" data-utc="data">{getDate(reply?.timestamp)}</span>
                          &nbsp;
                          <span key={`pn-${reply.cid}`} className="post-number">
                            <Link to="" key={`pl1-${reply.cid}`} onClick={() => {}} title="Link to this post">c/</Link>
                            <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`pl2-${reply.cid}`} onClick={() => { 
                              setIsReplyOpen(true); setSelectedParentCid(reply.cid); setSelectedShortCid(reply.shortCid);
                              }} title="Reply to this post">{reply.shortCid ?? (
                                <span key="pending" style={{color: 'red', fontWeight: '700'}}>Pending</span>
                              )}</button>
                          </span>&nbsp;
                          <button key={`pmb-${reply.cid}`} className="post-menu-button" onClick={() => {}} title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>▶</button>
                          <div id="backlink-id" className="backlink">
                            {reply.replies?.pages?.topAll.comments
                              .sort((a, b) => a.timestamp - b.timestamp)
                              .map((reply) => (
                                <div key={`div-${reply.cid}`} style={{display: 'inline-block'}}>
                                <Link to={() => {}} key={`ql-${reply.cid}`}
                                  className="quote-link" 
                                  onClick={(event) => handleQuoteClick(reply, event)}>
                                  c/{reply.shortCid}</Link>
                                  &nbsp;
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        {replyMediaInfo?.url ? (
                            <div key={`f-${reply.cid}`} className="file" 
                            style={{marginBottom: "5px"}}>
                              <div key={`ft-${reply.cid}`} className="reply-file-text">
                                Link:&nbsp;
                                <a key={`fa-${reply.cid}`} href={replyMediaInfo.url} target="_blank">{
                                replyMediaInfo?.url.length > 30 ?
                                replyMediaInfo?.url.slice(0, 30) + "(...)" :
                                replyMediaInfo?.url
                                }</a>&nbsp;({replyMediaInfo?.type})
                              </div>
                              {replyMediaInfo?.type === "webpage" ? (
                                <span key={`fta-${reply.cid}`} className="file-thumb-reply">
                                  <img key={`fti-${reply.cid}`}
                                  src={reply.thumbnailUrl} 
                                  alt="thumbnail" 
                                  onError={(e) => e.target.src = fallbackImgUrl} />
                                </span>
                              ) : null}
                              {replyMediaInfo?.type === "image" ? (
                                <span key={`fta-${reply.cid}`} className="file-thumb-reply">
                                  <img key={`fti-${reply.cid}`}
                                  src={replyMediaInfo.url} 
                                  alt={replyMediaInfo.type} 
                                  onError={(e) => e.target.src = fallbackImgUrl} />
                                </span>
                              ) : null}
                              {replyMediaInfo?.type === "video" ? (
                                <span key={`fta-${reply.cid}`} className="file-thumb-reply">
                                  <video controls
                                  key={`fti-${reply.cid}`} 
                                  src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                  onError={(e) => e.target.src = fallbackImgUrl} />
                                </span>
                              ) : null}
                              {replyMediaInfo?.type === "audio" ? (
                                <span key={`fta-${reply.cid}`} className="file-thumb-reply">
                                  <audio controls 
                                  key={`fti-${reply.cid}`}
                                  src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                  onError={(e) => e.target.src = fallbackImgUrl} />
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        <blockquote key={`pm-${reply.cid}`} className="post-message">
                          <Link to={() => {}} className="quote-link"
                            onClick={(event) => handleQuoteClick(reply, event)}>
                            {`c/${shortParentCid}`}{<br />}
                          </Link>
                          <Post content={reply.content} comment={reply} handlequoteclick={handleQuoteClick} key={`post-${reply.cid}`} />
                        </blockquote>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="thread-mobile" key="thread-mobile">
              <hr />
              <div className="op-container" key="op-container">
                  <div key={`mob-po-${comment.cid}`} className="post op">
                    <div key={`mob-pi-${comment.cid}`} className="post-info-mobile">
                      <button style={{ all: 'unset', cursor: 'pointer' }} key={`mob-pb-${comment.cid}`} className="post-menu-button-mobile" onClick={() => {}}>...</button>
                      <span className="name-block-mobile">
                        {comment.author?.displayName
                        ? comment.author?.displayName.length > 15
                        ? <>
                            <span key={`mob-n-${comment.cid}`} className="name-mobile"
                            data-tooltip-id="tooltip"
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
                          <span key={`mob-ha-${comment.cid}`} className="highlight-address-mobile">
                            {comment.author?.shortAddress}
                          </span>
                          )&nbsp;
                        </span>
                        <br key={`mob-br1-${comment.cid}`} />
                        {comment.title ? (
                            comment.title.length > 30 ?
                            <>
                              <span key={`mob-t-${comment.cid}`} className="subject-mobile"
                              data-tooltip-id="tooltip"
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
                        <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`mob-no-${comment.cid}`} onClick={() => {
                          setIsReplyOpen(true); setSelectedParentCid(comment.cid); setSelectedShortCid(comment.shortCid);
                          }} title="Link to this post">c/</button>
                        <Link to="" key={`mob-no2-${comment.cid}`} onClick={() => {}} title="Reply to this post">{comment.shortCid}</Link>
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
                            <video controls key={`mob-img-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                          </span>
                        </div>
                      ) : commentMediaInfo.type === "audio" ? (
                        <div key={`mob-f-${comment.cid}`} className="file-mobile">
                          <span key={`mob-ft${comment.cid}`} className="file-thumb-mobile">
                            <audio controls key={`mob-img-${comment.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                          </span>
                        </div>
                      ) : null
                    ) : null}
                    <blockquote key={`mob-bq-${comment.cid}`} className="post-message-mobile">
                      {comment.content ? (
                        <>
                          <Post content={comment.content} handlequoteclick={handleQuoteClick} comment={comment} key={`post-mobile-${comment.cid}`} /> 
                        </>
                      ) : null}
                    </blockquote>
                  </div>
                </div>
                {comment.replyCount === undefined ? <PostLoader /> : null}
                {comment.replyCount > 0 && 
                  renderedComments.map((reply) => {
                  return (
                  <div key={`mob-rc-${reply.cid}-${Math.random()}`} className="reply-container">
                    <div key={`mob-pr-${reply.cid}`} className="post-reply">
                      <div key={`mob-pi-${reply.cid}`} className="post-info-mobile">
                        <button className="post-menu-button-mobile" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>...</button>
                        <span key={`mob-nb-${reply.cid}`} className="name-block-mobile">
                          {reply.author?.displayName
                          ? reply.author?.displayName.length > 12
                          ? <>
                              <span key={`mob-n-${reply.cid}`} className="name-mobile"
                              data-tooltip-id="tooltip"
                              data-tooltip-content={reply.author?.displayName}
                              data-tooltip-place="top">
                                {reply.author?.displayName.slice(0, 12) + " (...)"}
                              </span>
                            </>
                            : <span key={`mob-n-${reply.cid}`} className="name-mobile">
                              {reply.author?.displayName}</span>
                          : <span key={`mob-n-${reply.cid}`} className="name-mobile">
                            Anonymous</span>}
                          &nbsp;
                          <span key={`mob-pa-${reply.cid}`} className="poster-address-mobile">
                            (u/
                            <span key={`mob-ha-${reply.cid}`} className="highlight-address-mobile">
                              {reply.author?.shortAddress}
                            </span>
                            )
                          </span>
                          <br key={`mob-br-${reply.cid}`} />
                        </span>
                        <span key={`mob-dt-${reply.cid}`} className="date-time-mobile">
                          {getDate(reply?.timestamp)}&nbsp;
                          <Link to="" key={`mob-pl1-${reply.cid}`} onClick={() => {}} title="Link to this post">c/</Link>
                          <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`mob-pl2-${reply.cid}`} onClick={() => {
                            setIsReplyOpen(true); setSelectedParentCid(reply.cid); setSelectedShortCid(reply.shortCid);
                            }} title="Reply to this post">{reply.shortCid}</button>
                        </span>
                      </div>
                      <blockquote key={`mob-pm-${reply.cid}`} className="post-message-mobile">
                        <Post content={reply.content} comment={reply} handlequoteclick={handleQuoteClick} key={`post-mobile-${reply.cid}`} />
                      </blockquote>
                      {reply.replyCount > 0 ? (
                        <div key={`back-mob-${reply.cid}`} className='backlink backlink-mobile'>
                        {reply.replies?.pages?.topAll.comments
                        .sort((a, b) => a.timestamp - b.timestamp)
                        .map((reply) => (
                          <div key={`div-back${reply.cid}`} style={{display: 'inline-block'}}>
                          <Link key={`ql-${reply.cid}`}
                          to={() => {}} className="quote-link" 
                          onClick={(event) => handleQuoteClick(reply, event)}>
                            c/{reply.shortCid}</Link>
                            &nbsp;
                          </div>
                        ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  )
                })
              }
            </div>
            <BottomBar selectedStyle={selectedStyle}>
                <div id="bottombar-desktop">
                  <hr />
                  <span className="bottom-bar-return">
                    [
                    <Link to={`/p/${selectedAddress}`}>Return</Link>
                    ]
                  </span>
                  <span className="bottom-bar-catalog">
                    [
                    <Link to={`/p/${selectedAddress}/catalog`}>Catalog</Link>
                    ]
                  </span>
                  <span className="bottom-bar-top">
                    [
                    <a onClick={() => window.scrollTo(0, 0)} 
                    onMouseOver={(event) => event.target.style.cursor='pointer'} 
                    onTouchStart={() => window.scrollTo(0, 0)}>Top</a>
                    ]
                  </span>
                  <span className="quickreply-button">
                  [
                  <Link to="" onClick={() => {}} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</Link>
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
                      <Link to={`/p/${selectedAddress}`}>Return</Link>
                    </span>
                  </div>
                  <div id="catalog-button-mobile">
                    <span className="btn-wrap">
                      <Link to={`/p/${selectedAddress}/catalog`}>Catalog</Link>
                    </span>
                  </div>
                  <span className="bottom-bar-top">
                    <span className="btn-wrap">
                      <a onClick={() => window.scrollTo(0, 0)} 
                      onMouseOver={(event) => event.target.style.cursor='pointer'} 
                      onTouchStart={() => window.scrollTo(0, 0)}>Top</a>
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