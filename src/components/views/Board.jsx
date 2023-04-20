import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { Tooltip } from 'react-tooltip';
import { useFeed, usePublishComment } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break, PostFormLink, PostFormTable, PostForm, TopBar, BoardForm } from '../styled/Board.styled';
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
import renderComments from '../../utils/renderComments';
import useClickForm from '../../hooks/useClickForm';
import useError from '../../hooks/useError';
import useSuccess from '../../hooks/useSuccess';


const Board = () => {
  const {
    setCaptchaResponse,
    setChallengesArray,
    defaultSubplebbits,
    setIsCaptchaOpen,
    isSettingsOpen, setIsSettingsOpen,
    setPendingComment,
    selectedAddress, setSelectedAddress,
    setSelectedParentCid,
    setSelectedShortCid,
    selectedStyle,
    setSelectedThread,
    selectedTitle, setSelectedTitle,
    showPostForm,
    showPostFormLink,
  } = useGeneralStore(state => state);

  const nameRef = useRef();
  const subjectRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const { feed, hasMore, loadMore } = useFeed({subplebbitAddresses: [`${selectedAddress}`], sortType: 'new'});
  const [selectedFeed, setSelectedFeed] = useState(feed);
  const { subplebbitAddress } = useParams();

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  useError(errorMessage, [errorMessage]);
  useSuccess(successMessage, [successMessage]);

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
    const debouncedHandleScroll = debounce(() => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    }, 50);
  
    window.addEventListener('scroll', debouncedHandleScroll);
  
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [prevScrollPos, visible]);
  

  const tryLoadMore = async () => {
    try {
      await loadMore();
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };


  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      setSuccessMessage('Challenge success.', {publishedCid: challengeVerification.publication?.cid});
      navigate(`/p/${selectedAddress}/c/${challengeVerification.publication?.cid}`);
    }
    else if (challengeVerification.challengeSuccess === false) {
      setErrorMessage('Challenge failed.', {reason: challengeVerification.reason, errors: challengeVerification.errors});
      console.log("challenge failed", challengeVerification.reason, challengeVerification.errors)
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
    onChallengeVerification,
    onError: (error) => {
      setErrorMessage(error);
    },
  });
  

  const { publishComment, index } = usePublishComment(publishCommentOptions);

  useEffect(() => {
    if (index !== undefined) {
      navigate(`/profile/c/${index}`);
      setSuccessMessage('Comment pending with index ' + index + '.');
    }
  }, [index]);

  
  const resetFields = () => {
    nameRef.current.value = '';
    subjectRef.current.value = '';
    commentRef.current.value = '';
    linkRef.current.value = '';
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      author: {
        displayName: nameRef.current.value || undefined,
      },
      title: subjectRef.current.value || undefined,
      content: commentRef.current.value || undefined,
      link: linkRef.current.value || undefined,
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
  
        const handleKeyDown = async (event) => {
          if (event.key === 'Enter') {
            const currentCaptchaResponse = useGeneralStore.getState().captchaResponse;
            resolve(currentCaptchaResponse);
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
              <Link to={`/p/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => handleClickTitle(subplebbit.title, subplebbit.address)}
              >{subplebbit.title ? subplebbit.title : subplebbit.address}</Link>
              ]&nbsp;
            </span>
          ))}
          <span className="nav">
            [
            <Link to={`/p/${selectedAddress}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
              <Link to={`/p/${selectedAddress}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
              <a onClick={useClickForm()} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</a>
            ]
          </div>
          <div id="post-form-link-mobile">
            <span className="btn-wrap">
              <a onClick={useClickForm()} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</a>
            </span>
          </div>
        </PostFormLink>
        <PostFormTable id="post-form" showPostForm={showPostForm} selectedStyle={selectedStyle} className="post-form">
          <tbody>
            <tr data-type="Name">
              <td id="td-name">Name</td>
              <td>
                <input name="name" type="text" tabIndex={1} placeholder="Anonymous" ref={nameRef} />
              </td>
            </tr>
            <tr data-type="Subject">
              <td>Subject</td>
              <td>
                <input name="sub" type="text" tabIndex={3} ref={subjectRef}/>
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
                  () => alert("- Embedding media is optional, posts can be text-only. \n- A CAPTCHA challenge will appear after posting. \n- The CAPTCHA is case-sensitive.")
                } data-tip="Help">?</button>
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
          <Link to={`/p/${selectedAddress}/catalog`}>Catalog</Link>
          ]
        </div>
        <div id="stats" style={{float: "right", marginTop: "5px"}}>
          {feed.length > 0 ? (null) : (<span>Fetching IPFS...</span>)}
        </div>
        <div id="catalog-button-mobile">
          <span className="btn-wrap">
            <Link to={`/p/${selectedAddress}/catalog`}>Catalog</Link>
          </span>
        </div>
      </TopBar>
      <Tooltip id="tooltip" className="tooltip" />
      <BoardForm selectedStyle={selectedStyle}>
        <div className="board">
          {feed.length < 1 ? (
            <PostLoader />
          ) : (
            <InfiniteScroll
              pageStart={0}
              loadMore={tryLoadMore}
              hasMore={hasMore}
            >
              {selectedFeed.map((thread) => {
              const { replies: { pages: { topAll: { comments } = {} } = {} } = {} } = thread;
              const { renderedComments, omittedCount } = renderComments(comments);
              const commentMediaInfo = getCommentMediaInfo(thread);
              const fallbackImgUrl = "/assets/filedeleted-res.gif";
              return (
              <Fragment key={`fr-${thread.cid}`}>
                <div key={`t-${thread.cid}`} className="thread">
                  <div key={`c-${thread.cid}`} className="op-container">
                    <div key={`po-${thread.cid}`} className="post op op-desktop">
                      <hr key={`hr-${thread.cid}`} />
                      <div key={`pi-${thread.cid}`} className="post-info">
                      {commentMediaInfo?.url ? (
                        <div key={`f-${thread.cid}`} className="file" style={{marginBottom: "5px"}}>
                          <div key={`ft-${thread.cid}`} className="file-text">
                            Link:&nbsp;
                            <a key={`fa-${thread.cid}`} href={commentMediaInfo.url} target="_blank"
                            rel="noopener noreferrer">{
                            commentMediaInfo?.url.length > 30 ?
                            commentMediaInfo?.url.slice(0, 30) + "(...)" :
                            commentMediaInfo?.url
                            }</a>&nbsp;({commentMediaInfo?.type})
                          </div>
                          {commentMediaInfo?.type === "webpage" ? (
                            <span key={`fta-${thread.cid}`} className="file-thumb">
                              <img key={`fti-${thread.cid}`} src={thread.thumbnailUrl} alt="thumbnail" onError={(e) => e.target.src = fallbackImgUrl} />
                            </span>
                          ) : null}
                          {commentMediaInfo?.type === "image" ? (
                            <span key={`fta-${thread.cid}`} className="file-thumb">
                              <img key={`fti-${thread.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            </span>
                          ) : null}
                          {commentMediaInfo?.type === "video" ? (
                            <span key={`fta-${thread.cid}`} className="file-thumb">
                              <video controls width="" key={`fti-${thread.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            </span>
                          ) : null}
                          {commentMediaInfo?.type === "audio" ? (
                            <span key={`fta-${thread.cid}`} className="file-thumb">
                              <audio controls key={`fti-${thread.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                        <span key={`nb-${thread.cid}`} className="name-block">
                          {thread.title ? (
                            thread.title.length > 75 ?
                            <Fragment key={`fragment2-${thread.cid}`}>
                              <span key={`q-${thread.cid}`} className="title"
                              data-tooltip-id="tooltip"
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
                              <span key={`n-${thread.cid}`} className="name"
                              data-tooltip-id="tooltip"
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
                          <span key={`pa-${thread.cid}`} className="poster-address">
                            {thread.author.shortAddress}
                          </span>)
                          &nbsp;
                          <span key={`dt-${thread.cid}`} className="date-time" data-utc="data">{getDate(thread.timestamp)}</span>
                          &nbsp;
                          <span key={`pn-${thread.cid}`} className="post-number post-number-desktop">
                            <Link to={() => {}} key={`pl1-${thread.cid}`} onClick={() => {}} title="Link to this post">c/</Link>
                            <Link to={`/p/${selectedAddress}/c/${thread.cid}`} id="reply-button" key={`pl2-${thread.cid}`} 
                            onClick={(e) => {
                              if (e.button === 2) return;
                              e.preventDefault();
                              setIsReplyOpen(true); 
                              setSelectedShortCid(thread.shortCid); 
                              setSelectedParentCid(thread.cid);
                              }} title="Reply to this post">{thread.shortCid}</Link>
                            &nbsp;
                            <span key={`rl1-${thread.cid}`}>&nbsp;
                              [
                              <Link key={`rl2-${thread.cid}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="reply-link" >Reply</Link>
                              ]
                            </span>
                          </span>&nbsp;
                          <button key={`pmb-${thread.cid}`} className="post-menu-button" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }} data-cmd="post-menu">▶</button>
                          <div key={`bi-${thread.cid}`} id="backlink-id" className="backlink">
                            {thread.replies?.pages?.topAll.comments
                              .sort((a, b) => a.timestamp - b.timestamp)
                              .map((reply) => (
                                <div key={`div-${reply.cid}`} style={{display: 'inline-block'}}>
                                <Link key={`ql-${reply.cid}`}
                                to={() => {}} className="quote-link" 
                                onClick={(event) => handleQuoteClick(reply, null, event)}>
                                  c/{reply.shortCid}</Link>
                                  &nbsp;
                                </div>
                              ))
                            }
                          </div>
                        </span>
                        {thread.content ? (
                          thread.content.length > 1000 ?
                          <Fragment key={`fragment5-${thread.cid}`}>
                            <blockquote key={`bq-${thread.cid}`}>
                            <Post content={thread.content.slice(0, 1000)} key={`post-${thread.cid}`} />
                              <span key={`ttl-s-${thread.cid}`} className="ttl"> (...) 
                              <br key={`ttl-s-br1-${thread.cid}`} /><br key={`ttl-s-br2${thread.cid}`} />
                              Post too long.&nbsp;
                                <Link key={`ttl-l-${thread.cid}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">Click here</Link>
                                &nbsp;to view. </span>
                            </blockquote>
                          </Fragment>
                        : <blockquote key={`bq-${thread.cid}`}>
                            <Post content={thread.content} key={`post-${thread.cid}`} />
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
                        <Link key={`oc2-${thread.cid}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">here</Link>
                        &nbsp;to view.
                      </span>
                    </span>) : null}
                  </span>
                  {renderedComments?.map((reply) => {
                    const replyMediaInfo = getCommentMediaInfo(reply);
                    const fallbackImgUrl = "/assets/filedeleted-res.gif";
                    const shortParentCid = findShortParentCid(reply.parentCid, selectedFeed);
                    return (
                      <div key={`rc-${reply.cid}`} className="reply-container">
                        <div key={`sa-${reply.cid}`} className="side-arrows">{'>>'}</div>
                        <div key={`pr-${reply.cid}`} className="post-reply post-reply-desktop">
                          <div key={`pi-${reply.cid}`} className="post-info">
                            <span key={`nb-${reply.cid}`} className="nameblock">
                              {reply.author.displayName
                                ? reply.author.displayName.length > 12
                                ? <Fragment key={`fragment6-${reply.cid}`}>
                                    <span key={`mob-n-${reply.cid}`} className="name"
                                    data-tooltip-id="tooltip"
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
                                  <span key={`mob-ha-${reply.cid}`}>
                                    {reply.author.shortAddress}
                                  </span>
                                )
                              </span>
                            </span>
                            &nbsp;
                            <span key={`dt-${reply.cid}`} className="date-time" data-utc="data">{getDate(reply.timestamp)}</span>
                            &nbsp;
                            <span key={`pn-${reply.cid}`} className="post-number post-number-desktop">
                              <Link to={() => {}} key={`pl1-${reply.cid}`} onClick={() => {}} title="Link to this post">c/</Link>
                              <Link to={`/p/${selectedAddress}/c/${thread.cid}`} id="reply-button" key={`pl2-${reply.cid}`} 
                              onClick={(e) => {
                                if (e.button === 2) return;
                                e.preventDefault();
                                setIsReplyOpen(true); 
                                setSelectedShortCid(reply.shortCid); 
                                setSelectedParentCid(reply.cid);
                              }} title="Reply to this post">{reply.shortCid}</Link>
                            </span>&nbsp;
                            <button key={`pmb-${reply.cid}`} className="post-menu-button" onClick={() => {}} title="Post menu" style={{ all: 'unset', cursor: 'pointer' }} data-cmd="post-menu">▶</button>
                            <div id="backlink-id" className="backlink">
                              {reply.replies?.pages?.topAll.comments
                                .sort((a, b) => a.timestamp - b.timestamp)
                                .map((reply) => (
                                  <div key={`div-${reply.cid}`} style={{display: 'inline-block'}}>
                                  <Link to={() => {}} key={`ql-${reply.cid}`}
                                    className="quote-link" 
                                    onClick={(event) => handleQuoteClick(reply, reply.shortCid, event)}>
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
                                <a key={`fa-${reply.cid}`} href={replyMediaInfo.url} target="_blank"
                                rel="noopener noreferrer">{
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
                          {reply.content ? (
                            reply.content.length > 500 ?
                            <Fragment key={`fragment8-${reply.cid}`}>
                              <blockquote key={`pm-${reply.cid}`} comment={reply} className="post-message">
                                <Link to={() => {}} key={`r-pm-${reply.cid}`} className="quotelink" onClick={(event) => handleQuoteClick(reply, shortParentCid, thread.shortCid, event)}>
                                    {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                                </Link>
                                <Post content={reply.content.slice(0, 500)} key={`post-${reply.cid}`} />
                                <span key={`ttl-s-${reply.cid}`} className="ttl"> (...)
                                <br key={`ttl-s-br1-${reply.cid}`} /><br key={`ttl-s-br2${reply.cid}`} />
                                Comment too long.&nbsp;
                                  <Link key={`ttl-l-${reply.cid}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">Click here</Link>
                                &nbsp;to view. </span>
                              </blockquote>
                            </Fragment>
                          : <blockquote key={`pm-${reply.cid}`} className="post-message">
                              <Link to={() => {}} key={`r-pm-${reply.cid}`} className="quotelink" onClick={(event) => handleQuoteClick(reply, shortParentCid, thread.shortCid, event)}>
                                  {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                              </Link>
                              <Post content={reply.content} key={`post-${reply.cid}`} comment={reply} />
                            </blockquote>)
                          : null}
                        </div>
                      </div>
                      )
                  })}
                </div>
                <div key={`mob-t-${thread.cid}`} className="thread-mobile">
                  <hr key={`mob-hr-${thread.cid}`} />
                  <div key={`mob-c-${thread.cid}`} className="op-container">
                    <div key={`mob-po-${thread.cid}`} className="post op op-mobile">
                      <div key={`mob-pi-${thread.cid}`} className="post-info-mobile">
                        <button key={`mob-pb-${thread.cid}`} className="post-menu-button-mobile" onClick={() => {}} style={{ all: 'unset', cursor: 'pointer' }}>...</button>
                        <span key={`mob-nbm-${thread.cid}`} className="name-block-mobile">
                          {thread.author.displayName
                          ? thread.author.displayName.length > 15
                          ? <Fragment key={`fragment9-${thread.cid}`}>
                              <span key={`mob-n-${thread.cid}`} className="name-mobile"
                              data-tooltip-id="tooltip"
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
                            <span key={`mob-ha-${thread.cid}`} className="highlight-address-mobile">
                              {thread.author.shortAddress}
                            </span>
                            )&nbsp;
                          </span>
                          <br key={`mob-br1-${thread.cid}`} />
                          {thread.title ? (
                            thread.title.length > 30 ?
                            <Fragment key={`fragment11-${thread.cid}`}>
                              <span key={`mob-t-${thread.cid}`} className="subject-mobile"
                              data-tooltip-id="tooltip"
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
                        <span key={`mob-dt-${thread.cid}`} className="date-time-mobile post-number-mobile">
                          {getDate(thread.timestamp)}
                          &nbsp;
                          <Link to={() => {}} key={`mob-no-${thread.cid}`} onClick={() => {}} title="Link to this post">c/</Link>
                          <Link to={`/p/${selectedAddress}/c/${thread.cid}`} id="reply-button" key={`mob-no2-${thread.cid}`} 
                            onClick={(e) => {
                              if (e.button === 2) return;
                              e.preventDefault();
                              setIsReplyOpen(true); 
                              setSelectedShortCid(thread.shortCid); 
                              setSelectedParentCid(thread.cid);
                            }} title="Reply to this post">{thread.shortCid}
                          </Link>
                        </span>
                      </div>
                      {thread.link ? (
                        <div key={`mob-f-${thread.cid}`} className="file-mobile">
                          <a key={`link-a-${thread.cid}`} href={commentMediaInfo?.url} target="_blank"
                          rel="noopener noreferrer">
                            {commentMediaInfo?.url ? (
                              commentMediaInfo.type === "webpage" ? (
                                  <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile">
                                    <img key={`mob-img-${thread.cid}`} src={thread.thumbnailUrl} alt="thumbnail" onError={(e) => e.target.src = fallbackImgUrl} />
                                    <div key={`mob-fi-${thread.cid}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                  </span>
                              ) : commentMediaInfo.type === "image" ? (
                                  <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile">
                                    <img key={`mob-img-${thread.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                                    <div key={`mob-fi-${thread.cid}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                  </span>
                              ) : commentMediaInfo.type === "video" ? (
                                  <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile">
                                    <video key={`fti-${thread.cid}`} 
                                    src={commentMediaInfo.url} 
                                    alt={commentMediaInfo.type}
                                    style={{ pointerEvents: "none" }} 
                                    onError={(e) => e.target.src = fallbackImgUrl} />
                                    <div key={`mob-fi-${thread.cid}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                  </span>
                              ) : commentMediaInfo.type === "audio" ? (
                                  <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile">
                                    <audio key={`mob-img-${thread.cid}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                                    <div key={`mob-fi-${thread.cid}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                  </span>
                              ) : null
                            ) : null}
                          </a>
                        </div>
                      ) : null}
                      {thread.content ? (
                        thread.content.length > 500 ?
                        <Fragment key={`fragment12-${thread.cid}`}>
                          <blockquote key={`mob-bq-${thread.cid}`} className="post-message-mobile">
                            <Post content={thread.content.slice(0, 500)} key={`post-mobile-${thread.cid}`} />
                            <span key={`mob-ttl-s-${thread.cid}`} className="ttl"> (...)
                            <br key={`mob-ttl-s-br1-${thread.cid}`} /><br key={`mob-ttl-s-br2${thread.cid}`} />
                            Post too long.&nbsp;
                              <Link key={`mob-ttl-l-${thread.cid}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">Click here</Link>
                              &nbsp;to view. </span>
                          </blockquote>
                        </Fragment>
                      : <blockquote key={`mob-bq-${thread.cid}`} className="post-message-mobile">
                          <Post content={thread.content} key={`post-mobile-${thread.cid}`} />
                        </blockquote>)
                      : null}
                    </div>
                    <div key={`mob-pl-${thread.cid}`} className="post-link-mobile">
                      <span key={`mob-info-${thread.cid}`} className="info-mobile">{
                      thread.replyCount === 0 ?
                      ("No replies")
                      : thread.replyCount === 1 ?
                      ("1 reply")
                      : thread.replyCount > 1 ?
                      (thread.replyCount + " replies")
                      : null
                      }</span>
                      <Link key={`rl2-${thread.cid}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="button-mobile" >View Thread</Link>
                    </div>
                  </div>
                  {renderedComments?.map((reply) => {
                    const replyMediaInfo = getCommentMediaInfo(reply);
                    const shortParentCid = findShortParentCid(reply.parentCid, selectedFeed);
                    return (
                    <div key={`mob-rc-${reply.cid}`} className="reply-container">
                      <div key={`mob-pr-${reply.cid}`} className="post-reply post-reply-mobile">
                        <div key={`mob-pi-${reply.cid}`} className="post-info-mobile">
                          <button key={`pmbm-${reply.cid}`} className="post-menu-button-mobile" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>...</button>
                          <span key={`mob-nb-${reply.cid}`} className="name-block-mobile">
                            {reply.author.displayName
                            ? reply.author.displayName.length > 12
                            ? <Fragment key={`fragment13-${reply.cid}`}>
                                <span key={`mob-n-${reply.cid}`} className="name-mobile"
                                data-tooltip-id="tooltip"
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
                              <span key={`mob-ha-${reply.cid}`} className="highlight-address-mobile">
                                {reply.author.shortAddress}
                              </span>
                              )&nbsp;
                            </span>
                            <br key={`mob-br-${reply.cid}`} />
                          </span>
                          <span key={`mob-dt-${reply.cid}`} className="date-time-mobile post-number-mobile">
                          {getDate(reply.timestamp)}&nbsp;
                            <Link to={() => {}} key={`mob-pl1-${reply.cid}`} onClick={() => {}} title="Link to this post">c/</Link>
                            <Link to={`/p/${selectedAddress}/c/${thread.cid}`} id="reply-button" key={`mob-pl2-${reply.cid}`} 
                              onClick={(e) => {
                                if (e.button === 2) return;
                                e.preventDefault();
                                setIsReplyOpen(true); 
                                setSelectedShortCid(reply.shortCid); 
                                setSelectedParentCid(reply.cid);
                              }} title="Reply to this post">{reply.shortCid}
                            </Link>
                          </span>
                        </div>
                        {reply.link ? (
                          <div key={`mob-f-${reply.cid}`} className="file-mobile">
                            <a key={`link-a-${reply.cid}`} href={replyMediaInfo?.url} target="_blank" rel="noopener noreferrer">
                              {replyMediaInfo?.url ? (
                                replyMediaInfo.type === "webpage" ? (
                                    <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                      <img key={`mob-img-${reply.cid}`} src={reply.thumbnailUrl} alt="thumbnail" onError={(e) => e.target.src = fallbackImgUrl} />
                                      <div key={`mob-fi-${reply.cid}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                    </span>
                                ) : replyMediaInfo.type === "image" ? (
                                    <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                      <img key={`mob-img-${reply.cid}`} src={replyMediaInfo.url} alt={replyMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                                      <div key={`mob-fi-${reply.cid}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                    </span>
                                ) : replyMediaInfo.type === "video" ? (
                                    <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                        <video key={`fti-${reply.cid}`} 
                                        src={replyMediaInfo.url} 
                                        alt={replyMediaInfo.type} 
                                        style={{ pointerEvents: "none" }}
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                      <div key={`mob-fi-${reply.cid}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                    </span>
                                ) : replyMediaInfo.type === "audio" ? (
                                    <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                      <audio key={`mob-img-${reply.cid}`} src={replyMediaInfo.url} alt={replyMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                                      <div key={`mob-fi-${reply.cid}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                    </span>
                                ) : null
                              ) : null}
                            </a>
                          </div>
                        ) : null}
                        {reply.content ? (
                          reply.content.length > 500 ?
                          <Fragment key={`fragment15-${reply.cid}`}>
                            <blockquote key={`mob-pm-${reply.cid}`} className="post-message">
                              <Link to={() => {}} key={`mob-r-pm-${reply.cid}`} className="quotelink" onClick={(event) => handleQuoteClick(reply, shortParentCid, thread.shortCid, event)}>
                                {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                              </Link>
                              <Post content={reply.content.slice(0, 500)} key={`post-mobile-${reply.cid}`} comment={reply} />
                              <span key={`mob-ttl-s-${reply.cid}`} className="ttl"> (...)
                              <br key={`mob-ttl-s-br1-${reply.cid}`} /><br key={`mob-ttl-s-br2${reply.cid}`} />
                              Comment too long.&nbsp;
                                <Link key={`mob-ttl-l-${reply.cid}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">Click here</Link>
                              &nbsp;to view. </span>
                            </blockquote>
                          </Fragment>
                        : <blockquote key={`mob-pm-${reply.cid}`} className="post-message">
                            <Link to={() => {}} key={`mob-r-pm-${reply.cid}`} className="quotelink" onClick={(event) => handleQuoteClick(reply, shortParentCid, thread.shortCid, event)}>
                              {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                            </Link>
                            <Post content={reply.content} key={`post-mobile-${reply.cid}`} comment={reply} />
                          </blockquote>)
                        : null}
                          {reply.replyCount > 0 ? (
                            <div key={`back-mob-${reply.cid}`} className='backlink backlink-mobile'>
                            {reply.replies?.pages?.topAll.comments
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .map((reply) => (
                              <div key={`div-back${reply.cid}`} style={{display: 'inline-block'}}>
                              <Link key={`ql-${reply.cid}`} to={() => {}}
                              onClick={(event) => handleQuoteClick(reply, reply.shortCid, event)} className="quote-link">
                                c/{reply.shortCid}</Link>
                                &nbsp;
                              </div>
                            ))}
                            </div>
                          ) : null}
                      </div>
                    </div>
                  )})}
                </div>
              </Fragment>
              )})}
            </InfiniteScroll>
          )}
        </div>
      </BoardForm>
    </Container>
  );
}

export default Board;