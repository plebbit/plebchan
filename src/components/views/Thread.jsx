import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useAccount, useAccountComments, useComment, usePublishComment } from '@plebbit/plebbit-react-hooks';
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils'
import { debounce } from 'lodash';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break, PostForm, PostFormTable } from '../styled/Board.styled';
import { ReplyFormLink, TopBar, BottomBar, BoardForm, Footer } from '../styled/Thread.styled';
import ImageBanner from '../ImageBanner';
import Post from '../Post';
import PostLoader from '../PostLoader';
import ReplyModal from '../ReplyModal';
import SettingsModal from '../SettingsModal';
import findShortParentCid from '../../utils/findShortParentCid';
import formatState from '../../utils/formatState';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getDate from '../../utils/getDate';
import handleAddressClick from '../../utils/handleAddressClick';
import handleImageClick from '../../utils/handleImageClick';
import handleQuoteClick from '../../utils/handleQuoteClick';
import handleStyleChange from '../../utils/handleStyleChange';
import useClickForm from '../../hooks/useClickForm';
import useError from '../../hooks/useError';
import packageJson from '../../../package.json'
const {version} = packageJson


const Thread = () => {
  const {
    captchaResponse, setCaptchaResponse,
    setChallengesArray,
    defaultSubplebbits,
    setIsCaptchaOpen,
    isSettingsOpen, setIsSettingsOpen,
    setResolveCaptchaPromise,
    setPendingComment,
    setPendingCommentIndex,
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

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const account = useAccount();
  const comment = useComment({commentCid: selectedThread});
  const { subplebbitAddress, threadCid } = useParams();
  const handleClickForm = useClickForm();

  const commentMediaInfo = getCommentMediaInfo(comment);
  const fallbackImgUrl = "assets/filedeleted-res.gif";

  const [errorMessage, setErrorMessage] = useState(null);
  useError(errorMessage, [errorMessage]);

  const [triggerPublishComment, setTriggerPublishComment] = useState(false);


  const flattenedReplies = useMemo(() => 
    flattenCommentsPages(comment.replies), [comment.replies]
  );


  const filter = useMemo(() => ({
    parentCids: [
      selectedThread || 'n/a', ...flattenedReplies.map(reply => reply.cid)
    ]
  }), [flattenedReplies, selectedThread]);


  const { accountComments } = useAccountComments({filter});


  const accountRepliesNotYetInCommentReplies = useMemo(() => {
    const commentReplyCids = new Set(flattenedReplies.map(reply => reply.cid))
    return accountComments.filter(accountReply => !commentReplyCids.has(accountReply.cid))
  }, [flattenedReplies, accountComments]);


  const sortedReplies = useMemo(() => [
    ...accountRepliesNotYetInCommentReplies, ...flattenedReplies
    ].sort((a, b) => a.timestamp - b.timestamp
  ), [accountRepliesNotYetInCommentReplies, flattenedReplies]);

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
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    }, 50);
  
    window.addEventListener('scroll', debouncedHandleScroll);
  
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [prevScrollPos, visible]);

  
  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      console.log('challenge success');
    }
    else if (challengeVerification.challengeSuccess === false) {
      setErrorMessage('challenge failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
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

  
  useEffect(() => {
    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      subplebbitAddress: selectedAddress,
    }));
  }, [selectedAddress]);

  
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
      setPendingCommentIndex(index);
    }
  }, [index, setPendingCommentIndex]);

  
  const resetFields = useCallback(() => {
    if (nameRef.current) {
      nameRef.current.value = '';
    }
    if (commentRef.current) {
      commentRef.current.value = '';
    }
    if (linkRef.current) {
      linkRef.current.value = '';
    }
  }, []);


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

    setTriggerPublishComment(true);
  };
  
  
  useEffect(() => {
    if (publishCommentOptions.content && triggerPublishComment) {
      (async () => {
        await publishComment();
        resetFields();
      })();
    }
  }, [publishCommentOptions, triggerPublishComment, publishComment, resetFields]);


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
            const currentCaptchaResponse = captchaResponse;
            resolve(currentCaptchaResponse);
            setIsCaptchaOpen(false);
            document.removeEventListener('keydown', handleKeyDown);
            event.preventDefault();
          }
        };

        setCaptchaResponse('');
        document.addEventListener('keydown', handleKeyDown);

        setResolveCaptchaPromise(resolve);
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
    <>
      <Helmet>
          <title>
            {(
              (comment.content?.slice(0, 40) ?? comment.title?.slice(0, 40) ?? "Thread") + " - " 
              + (selectedTitle ? selectedTitle : selectedAddress) 
              + " - plebchan"
            )}
          </title>
        </Helmet>
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
              <button style={{all: 'unset', cursor: 'pointer'}} onClick={
                () => alert(
                  'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nrunning boards in the plebchan app is a planned feature.\n\n'
                  )
              }>Create Board</button>
              ]
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
                <button style={{all: 'unset', cursor: 'pointer'}} onClick={
                  () => alert(
                    'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nrunning boards in the plebchan app is a planned feature.\n\n'
                    )
                  }>Create Board</button> 
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
                <span style={{cursor: 'pointer'}} onClick={() => window.scrollTo(0, document.body.scrollHeight)} onMouseOver={(event) => event.target.style.cursor='pointer'}>Bottom</span>
              </span>
            </div>
            <div id="post-form-link-desktop">
              [
                <Link to={`/p/${subplebbitAddress}/c/${selectedThread}/post`} onClick={() => {handleClickForm(); setSelectedShortCid(comment.shortCid)}} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</Link>
              ]
            </div>
            <div id="post-form-link-mobile">
              <span className="btn-wrap">
                <Link to={`/p/${subplebbitAddress}/c/${selectedThread}/post`} onClick={() => {handleClickForm(); setSelectedShortCid(comment.shortCid)}} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</Link>
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
            <span id="button" style={{cursor: 'pointer'}} onClick={() =>  window.scrollTo(0, document.body.scrollHeight)} 
            onMouseOver={(event) => event.target.style.cursor='pointer'} 
            onTouchStart={() =>  window.scrollTo(0, document.body.scrollHeight)}>Bottom</span>
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
              <span className="reply-stat">{formatState(comment.state)}</span>
            )
          ) : (
            <span className="reply-stat">{formatState(comment.state)}</span>
          )}
          <hr />
        </TopBar>
        <Tooltip id="tooltip" className="tooltip" />
        <BoardForm selectedStyle={selectedStyle}>
          {comment !== undefined ? (
            comment.state === "fetching-ipfs" ? (
              <PostLoader />
            ) : (
            <>
              <div className="thread">
                <div className="op-container">
                  <div className="post op op-desktop">
                    <div className="post-info">
                    {commentMediaInfo?.url ? (
                        <div key={`f-${comment.cid}`} className="file" style={{marginBottom: "5px"}}>
                          <div key={`ft-${comment.cid}`} className="file-text">
                            Link:&nbsp;
                            <a key={`fa-${comment.cid}`} href={commentMediaInfo.url} 
                            target="_blank" rel="noreferrer">{
                            commentMediaInfo?.url.length > 30 ?
                            commentMediaInfo?.url.slice(0, 30) + "(...)" :
                            commentMediaInfo?.url
                            }</a>&nbsp;({commentMediaInfo?.type})
                          </div>
                          {commentMediaInfo?.type === "webpage" ? (
                            <div key="enlarge" className="img-container">
                              <span key={`fta-${comment.cid}`} className="file-thumb">
                                {comment.thumbnailUrl ? (
                                  <img key={`fti-${comment.cid}`} 
                                  src={commentMediaInfo.thumbnail} alt={commentMediaInfo.type}
                                  onClick={handleImageClick}
                                  style={{cursor: "pointer"}} 
                                  onError={(e) => e.target.src = fallbackImgUrl} />
                                ) : null}
                              </span>
                            </div>
                          ) : null}
                          {commentMediaInfo?.type === "image" ? (
                            <div key="enlarge" className="img-container">
                              <span key={`fta-${comment.cid}`} className="file-thumb">
                                <img key={`fti-${comment.cid}`} 
                                src={commentMediaInfo.url} alt={commentMediaInfo.type}
                                onClick={handleImageClick}
                                style={{cursor: "pointer"}} 
                                onError={(e) => e.target.src = fallbackImgUrl} />
                              </span>
                            </div>
                          ) : null}
                          {commentMediaInfo?.type === "video" ? (
                            <span key={`fta-${comment.cid}`} className="file-thumb">
                              <video controls key={`fti-${comment.cid}`} 
                              src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                              onError={(e) => e.target.src = fallbackImgUrl} />
                            </span>
                          ) : null}
                          {commentMediaInfo?.type === "audio" ? (
                            <span key={`fta-${comment.cid}`} className="file-thumb">
                              <audio controls key={`fti-${comment.cid}`} 
                              src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                              onError={(e) => e.target.src = fallbackImgUrl} />
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
                        <span className="poster-address address-desktop"
                          id="reply-button" style={{cursor: "pointer"}}
                          onClick={() => handleAddressClick(comment.author?.shortAddress)}>
                          (u/
                            <span key={`pa-${comment.cid}`} className="poster-address">
                            {comment.author?.shortAddress}
                          </span>)
                        </span>
                        &nbsp;
                        <span className="date-time" data-utc="data">{getDate(comment?.timestamp)}</span>
                        &nbsp;
                        <span className="post-number post-number-desktop">
                          <span style={{cursor: 'pointer'}} id="reply-button" title="Link to this post">c/</span>
                          <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} onClick={() => {
                            setIsReplyOpen(true); setSelectedParentCid(comment.cid); setSelectedShortCid(comment.shortCid);
                            }} title="Reply to this post">{comment.shortCid}</button>
                        </span>&nbsp;&nbsp;
                        <button className="post-menu-button" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>▶</button>
                        <div id="backlink-id" className="backlink">
                          {comment?.replies?.pages?.topAll.comments
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .map((reply, index) => (
                              <div key={`div-${index}`} style={{display: 'inline-block'}}>
                              <span style={{cursor: 'pointer'}} key={`ql-${index}`}
                                className="quote-link" 
                                onClick={(event) => handleQuoteClick(reply, null, event)}>
                                c/{reply.shortCid}</span>
                                &nbsp;
                              </div>
                            ))
                          }
                        </div>
                      </span>
                      <blockquote key={`blockquote-${comment.cid}`}>
                        <Post content={comment.content} comment={comment} key={`post-${comment.cid}`} />
                      </blockquote>
                    </div>
                  </div>
                </div>
                {comment.state === "fetching-ipns" ? <PostLoader /> : null}
                {sortedReplies.map((reply, index) => {
                    const replyMediaInfo = getCommentMediaInfo(reply);
                    const fallbackImgUrl = "assets/filedeleted-res.gif";
                    const shortParentCid = findShortParentCid(reply.parentCid, comment);
                    return (
                      <div key={`pc-${index}`} className="reply-container">
                        <div key={`sa-${index}`} className="side-arrows">{'>>'}</div>
                        <div key={`pr-${index}`} className="post-reply post-reply-desktop">
                          <div key={`pi-${index}`} className="post-info">
                          &nbsp;
                            <span key={`nb-${index}`} className="nameblock">
                            {reply.author?.displayName
                            ? reply.author?.displayName.length > 20
                            ? <>
                                <span key={`mob-n-${index}`} className="name"
                                data-tooltip-id="tooltip"
                                data-tooltip-content={reply.author?.displayName}
                                data-tooltip-place="top">
                                  {reply.author?.displayName.slice(0, 20) + " (...)"}
                                </span>
                              </>
                              : <span key={`mob-n-${index}`} className="name">
                                {reply.author?.displayName ?? reply.displayName}</span>
                            : <span key={`mob-n-${index}`} className="name">
                              Anonymous</span>}
                              &nbsp;
                              <span key={`pa-${index}`} className="poster-address address-desktop"
                                id="reply-button" style={{cursor: "pointer"}}
                                onClick={() => handleAddressClick(reply.author?.shortAddress)}
                              >
                                (u/
                                  {reply.author?.shortAddress ?
                                    (
                                      <span key={`mob-ha-${index}`}>
                                        {reply.author?.shortAddress}
                                      </span>
                                    ) : (
                                      <span key={`mob-ha-${index}`}
                                        data-tooltip-id="tooltip"
                                        data-tooltip-content={account?.author?.address}
                                        data-tooltip-place="top"
                                      >
                                        {account?.author?.address.slice(0, 10) + "(...)"}
                                      </span>
                                    )
                                  }
                                )
                              </span>
                            </span>
                            &nbsp;
                            <span key={`dt-${index}`} className="date-time" data-utc="data">{getDate(reply?.timestamp)}</span>
                            &nbsp;
                            <span style={{cursor: 'pointer'}} key={`pn-${index}`} className="post-number post-number-desktop">
                              <span id="reply-button" key={`pl1-${index}`} title="Link to this post">c/</span>
                              {reply.shortCid ? (
                                <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`pl2-${index}`} onClick={() => {
                                  setIsReplyOpen(true); setSelectedParentCid(reply.cid); setSelectedShortCid(reply.shortCid);
                                  }} title="Reply to this post">{reply.shortCid}</button>
                              ) : (
                                <span key="pending" style={{color: 'red', fontWeight: '700'}}>Pending</span>
                              )}
                            </span>&nbsp;
                            <button key={`pmb-${index}`} className="post-menu-button" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>▶</button>
                            <div id="backlink-id" className="backlink">
                              {reply.replies?.pages?.topAll.comments
                                .sort((a, b) => a.timestamp - b.timestamp)
                                .map((reply, index) => (
                                  <div key={`div-${index}`} style={{display: 'inline-block'}}>
                                  <span style={{cursor: 'pointer'}} key={`ql-${index}`}
                                    className="quote-link" 
                                    onClick={(event) => handleQuoteClick(reply, reply.shortCid, event)}>
                                    c/{reply.shortCid}</span>
                                    &nbsp;
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                          {replyMediaInfo?.url ? (
                              <div key={`f-${index}`} className="file" 
                              style={{marginBottom: "5px"}}>
                                <div key={`ft-${index}`} className="reply-file-text">
                                  Link:&nbsp;
                                  <a key={`fa-${index}`} href={replyMediaInfo.url} 
                                  target="_blank" rel="noreferrer">{
                                  replyMediaInfo?.url.length > 30 ?
                                  replyMediaInfo?.url.slice(0, 30) + "(...)" :
                                  replyMediaInfo?.url
                                  }</a>&nbsp;({replyMediaInfo?.type})
                                </div>
                                {replyMediaInfo?.type === "webpage" ? (
                                  <div key="enlarge-reply" className="img-container">
                                    <span key={`fta-${index}`} className="file-thumb-reply">
                                      {reply.thumbnailUrl ? (
                                        <img key={`fti-${index}`}
                                        src={replyMediaInfo.thumbnail} alt="thumbnail" 
                                        onClick={handleImageClick}
                                        style={{cursor: "pointer"}}
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                      ) : null}
                                    </span>
                                  </div>
                                ) : null}
                                {replyMediaInfo?.type === "image" ? (
                                  <div key="enlarge-reply" className="img-container">
                                    <span key={`fta-${index}`} className="file-thumb-reply">
                                      <img key={`fti-${index}`}
                                      src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                      onClick={handleImageClick}
                                      style={{cursor: "pointer"}}
                                      onError={(e) => e.target.src = fallbackImgUrl} />
                                    </span>
                                </div>
                                ) : null}
                                {replyMediaInfo?.type === "video" ? (
                                  <span key={`fta-${index}`} className="file-thumb-reply">
                                    <video controls key={`fti-${index}`} 
                                    src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                    onError={(e) => e.target.src = fallbackImgUrl} />
                                  </span>
                                ) : null}
                                {replyMediaInfo?.type === "audio" ? (
                                  <span key={`fta-${index}`} className="file-thumb-reply">
                                    <audio controls key={`fti-${index}`}
                                    src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                    onError={(e) => e.target.src = fallbackImgUrl} />
                                  </span>
                                ) : null}
                              </div>
                            ) : null}
                          <blockquote key={`pm-${index}`} className="post-message">
                            <span style={{cursor: 'pointer'}} className="quote-link"
                              onClick={(event) => {
                                handleQuoteClick(reply, shortParentCid, comment.shortCid, event);
                              }}
                            >
                              {`c/${shortParentCid}`}{shortParentCid === comment.shortCid ? " (OP)" : null}
                            </span>
                            <Post content={reply.content} comment={reply} key={`post-${index}`} />
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
                    <div key={`mob-po-${comment.cid}`} className="post op op-mobile">
                      <div key={`mob-pi-${comment.cid}`} className="post-info-mobile">
                        <button style={{ all: 'unset', cursor: 'pointer' }} key={`mob-pb-${comment.cid}`} className="post-menu-button-mobile">...</button>
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
                          <span key={`mob-pa-${comment.cid}`} className="poster-address-mobile address-mobile"
                            id="reply-button" style={{cursor: "pointer"}}
                            onClick={() => handleAddressClick(comment.author?.shortAddress)}
                          >
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
                        <span key={`mob-dt-${comment.cid}`} className="date-time-mobile post-number-mobile">
                          {getDate(comment?.timestamp)}
                          &nbsp;
                          <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`mob-no-${comment.cid}`} onClick={() => {
                            setIsReplyOpen(true); setSelectedParentCid(comment.cid); setSelectedShortCid(comment.shortCid);
                            }} title="Link to this post">c/</button>
                          <span id="reply-button" style={{cursor: 'pointer'}} key={`mob-no2-${comment.cid}`} title="Reply to this post">{comment.shortCid}</span>
                        </span>
                      </div>
                      {commentMediaInfo?.url ? (
                        commentMediaInfo.type === "webpage" ? (
                          <div key={`mob-f-${comment.cid}`} className="file-mobile">
                            <div key="enlarge-reply-mob" className="img-container">
                              <span key={`mob-ft${comment.cid}`} className="file-thumb-mobile">
                                {comment.thumbnailUrl ? (
                                  <img key={`mob-img-${comment.cid}`} 
                                  src={commentMediaInfo.thumbnail} alt={commentMediaInfo.type} 
                                  onClick={handleImageClick}
                                  style={{cursor: "pointer"}}
                                  onError={(e) => e.target.src = fallbackImgUrl} />
                                  ) : null}
                                <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                              </span>
                            </div>
                          </div>
                        ) : commentMediaInfo.type === "image" ? (
                          <div key={`mob-f-${comment.cid}`} className="file-mobile">
                            <div key="enlarge-reply-mob" className="img-container">
                              <span key={`mob-ft${comment.cid}`} className="file-thumb-mobile">
                                <img key={`mob-img-${comment.cid}`} 
                                src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                                onClick={handleImageClick}
                                style={{cursor: "pointer"}}
                                onError={(e) => e.target.src = fallbackImgUrl} />
                                <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                              </span>
                            </div>
                          </div>
                        ) : commentMediaInfo.type === "video" ? (
                          <div key={`mob-f-${comment.cid}`} className="file-mobile">
                            <span key={`mob-ft${comment.cid}`} className="file-thumb-mobile">
                              <video controls key={`mob-img-${comment.cid}`} 
                              src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                              onError={(e) => e.target.src = fallbackImgUrl} />
                              <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                            </span>
                          </div>
                        ) : commentMediaInfo.type === "audio" ? (
                          <div key={`mob-f-${comment.cid}`} className="file-mobile">
                            <span key={`mob-ft${comment.cid}`} className="file-thumb-mobile">
                              <audio controls key={`mob-img-${comment.cid}`} 
                              src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                              onError={(e) => e.target.src = fallbackImgUrl} />
                              <div key={`mob-fi-${comment.cid}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                            </span>
                          </div>
                        ) : null
                      ) : null}
                      <blockquote key={`mob-bq-${comment.cid}`} className="post-message-mobile">
                        {comment.content ? (
                          <>
                            <Post content={comment.content} comment={comment} key={`post-mobile-${comment.cid}`} /> 
                          </>
                        ) : null}
                      </blockquote>
                    </div>
                  </div>
                  {comment.replyCount === undefined ? <PostLoader /> : null}
                  {sortedReplies.map((reply, index) => {
                    const replyMediaInfo = getCommentMediaInfo(reply);
                    const shortParentCid = findShortParentCid(reply.parentCid, comment);
                    return (
                    <div key={`mob-rc-${index}`} className="reply-container">
                      <div key={`mob-pr-${index}`} className="post-reply post-reply-mobile">
                        <div key={`mob-pi-${index}`} className="post-info-mobile">
                          <button className="post-menu-button-mobile" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>...</button>
                          <span key={`mob-nb-${index}`} className="name-block-mobile">
                            {reply.author?.displayName
                            ? reply.author?.displayName.length > 12
                            ? <>
                                <span key={`mob-n-${index}`} className="name-mobile"
                                data-tooltip-id="tooltip"
                                data-tooltip-content={reply.author?.displayName}
                                data-tooltip-place="top">
                                  {reply.author?.displayName.slice(0, 12) + " (...)"}
                                </span>
                              </>
                              : <span key={`mob-n-${index}`} className="name-mobile">
                                {reply.author?.displayName}</span>
                            : <span key={`mob-n-${index}`} className="name-mobile">
                              Anonymous</span>}
                            &nbsp;
                            <span key={`mob-pa-${index}`} className="poster-address-mobile address-mobile"
                              id="reply-button" style={{cursor: "pointer"}}
                              onClick={() => handleAddressClick(reply.author?.shortAddress)}
                            >
                              (u/
                                {reply.author?.shortAddress ?
                                  (
                                  <span key={`mob-ha-${index}`} className="highlight-address-mobile">
                                    {reply.author?.shortAddress}
                                  </span>
                                  ) : (
                                    <span key={`mob-ha-${index}`} 
                                      data-tooltip-id="tooltip"
                                      data-tooltip-content={account?.author?.address}
                                      data-tooltip-place="top"
                                        >
                                      {account?.author?.address.slice(0, 8) + "(...)"}
                                    </span>
                                  )
                                }
                              )
                            </span>
                            <br key={`mob-br-${index}`} />
                          </span>
                          <span key={`mob-dt-${index}`} className="date-time-mobile post-number-mobile">
                            {getDate(reply?.timestamp)}&nbsp;
                            <span id="reply-button" style={{cursor: 'pointer'}} key={`mob-pl1-${index}`} title="Link to this post">c/</span>
                            {reply.shortCid ? (
                              <button id="reply-button" style={{ all: 'unset', cursor: 'pointer' }} key={`mob-pl2-${index}`} onClick={() => {
                                setIsReplyOpen(true); setSelectedParentCid(reply.cid); setSelectedShortCid(reply.shortCid);
                                }} title="Reply to this post">{reply.shortCid}</button>
                            ) : (
                              <span key="pending" style={{color: 'red', fontWeight: '700'}}>Pending</span> 
                            )}
                          </span>
                        </div>
                        {reply.link ? (
                            <div key={`mob-f-${reply.cid}`} className="file-mobile">
                                {replyMediaInfo?.url ? (
                                  replyMediaInfo.type === "webpage" ? (
                                    <div key="enlarge-reply-mob" className="img-container">
                                      <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                        {reply.thumbnailUrl ? (
                                          <img key={`mob-img-${reply.cid}`} 
                                          src={replyMediaInfo.thumbnail} alt={replyMediaInfo.type} 
                                          onClick={handleImageClick}
                                          style={{cursor: "pointer"}}
                                          onError={(e) => e.target.src = fallbackImgUrl} />
                                        ) : null}
                                        <div key={`mob-fi-${reply.cid}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                      </span>
                                    </div>
                                  ) : replyMediaInfo.type === "image" ? (
                                    <div key="enlarge-reply-mob" className="img-container">
                                      <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                        <img key={`mob-img-${reply.cid}`} 
                                        src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                        onClick={handleImageClick}
                                        style={{cursor: "pointer"}}
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                        <div key={`mob-fi-${reply.cid}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                      </span>
                                    </div>
                                  ) : replyMediaInfo.type === "video" ? (
                                      <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                        <video key={`fti-${reply.cid}`} 
                                        src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                        style={{ pointerEvents: "none" }}
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                        <div key={`mob-fi-${reply.cid}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                      </span>
                                  ) : replyMediaInfo.type === "audio" ? (
                                      <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                        <audio key={`mob-img-${reply.cid}`} 
                                        src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                        <div key={`mob-fi-${reply.cid}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                      </span>
                                  ) : null
                                ) : null}
                            </div>
                          ) : null}
                        <blockquote key={`mob-pm-${index}`} className="post-message-mobile">
                          <span style={{cursor: 'pointer'}} key={`mob-ql-${index}`} className="quotelink-mobile" 
                          onClick={(event) => handleQuoteClick(reply, shortParentCid, comment.shortCid, event)}>
                            {`c/${shortParentCid}`}{shortParentCid === comment.shortCid ? " (OP)" : null}
                          </span>
                          <Post content={reply.content} comment={reply} key={`post-mobile-${index}`} />
                        </blockquote>
                        {reply.replyCount > 0 ? (
                          <div key={`back-mob-${index}`} className='backlink backlink-mobile'>
                          {reply.replies?.pages?.topAll.comments
                          .sort((a, b) => a.timestamp - b.timestamp)
                          .map((reply, index) => (
                            <div key={`div-back${index}`} style={{display: 'inline-block'}}>
                            <span style={{cursor: 'pointer'}} key={`ql-${index}`} className="quote-link" 
                            onClick={(event) => handleQuoteClick(reply, reply.shortCid, event)}>
                              c/{reply.shortCid}</span>
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
                      <span id="button" onClick={() => window.scrollTo(0, 0)} 
                      onMouseOver={(event) => event.target.style.cursor='pointer'} 
                      onTouchStart={() => window.scrollTo(0, 0)}>Top</span>
                      ]
                    </span>
                    <span className="quickreply-button">
                    [
                      <span id="button" onClick={() => {setIsReplyOpen(true); setSelectedParentCid(comment.cid); setSelectedShortCid(comment.shortCid);}} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</span>
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
                        <span className="reply-stat">{formatState(comment.state)}</span>
                      )
                    ) : (
                      <span className="reply-stat">{formatState(comment.state)}</span>
                    )}
                    <hr />
                  </div>
                </BottomBar>
                {comment.replyCount > 2 ? (
                  <div id="bottombar-mobile">
                    <hr style={{marginTop: "30px"}} />
                    <TopBar selectedStyle={selectedStyle} style={{marginTop: "-5px"}}>
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
                          <span style={{cursor: 'pointer'}} onClick={() => {setIsReplyOpen(true); setSelectedParentCid(comment.cid); setSelectedShortCid(comment.shortCid);}} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</span>
                        </span>
                      </div>
                      <div id="btns-container">
                        <div id="return-button-mobile">
                          <span className="btn-wrap">
                            <Link to={`/p/${selectedAddress}`}>Return</Link>
                          </span>
                        </div>
                        <div id="catalog-button-mobile" style={{paddingRight: "2px"}}>
                          <span className="btn-wrap">
                            <Link to={`/p/${selectedAddress}/catalog`}>Catalog</Link>
                          </span>
                        </div>
                        <span className="bottom-bar-top">
                          <span className="btn-wrap">
                            <span onClick={() => window.scrollTo(0, 0)} 
                            onMouseOver={(event) => event.target.style.cursor='pointer'} 
                            onTouchStart={() => window.scrollTo(0, 0)}
                            style={{cursor: 'pointer', marginRight: "10px", marginLeft: "10px"}}
                            >Top</span>
                          </span>
                        </span>
                      </div>
                    </ReplyFormLink>
                  </div>
                ) : (null)}
            </>
          )) : null}
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

export default Thread;