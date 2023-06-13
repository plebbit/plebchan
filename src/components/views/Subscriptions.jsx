import React, { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useState, useRef } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Virtuoso } from 'react-virtuoso';
import { useAccount, useAccountComments, useFeed, usePublishCommentEdit, useSubplebbits } from '@plebbit/plebbit-react-hooks';
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils'
import { debounce } from 'lodash';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break, TopBar, BoardForm, PostMenu } from '../styled/views/Board.styled';
import { AuthorDeleteAlert, Footer } from '../styled/views/Thread.styled';
import { PostMenuCatalog } from '../styled/views/Catalog.styled';
import EditModal from '../modals/EditModal';
import EditLabel from '../EditLabel';
import ImageBanner from '../ImageBanner';
import ModerationModal from '../modals/ModerationModal';
import OfflineIndicator from '../OfflineIndicator';
import Post from '../Post';
import PostLoader from '../PostLoader';
import PostOnHover from '../PostOnHover';
import StateLabel from '../StateLabel';
import ReplyModal from '../modals/ReplyModal';
import SettingsModal from '../modals/SettingsModal';
import findShortParentCid from '../../utils/findShortParentCid';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getDate from '../../utils/getDate';
import handleAddressClick from '../../utils/handleAddressClick';
import handleImageClick from '../../utils/handleImageClick';
import handleQuoteClick from '../../utils/handleQuoteClick';
import handleQuoteHover from '../../utils/handleQuoteHover';
import handleStyleChange from '../../utils/handleStyleChange';
import removeHighlight from '../../utils/removeHighlight';
import useError from '../../hooks/useError';
import useFeedStateString from '../../hooks/useFeedStateString';
import useSuccess from '../../hooks/useSuccess';
import packageJson from '../../../package.json'
const {version} = packageJson


const Subscriptions = () => {
  const {
    defaultSubplebbits,
    editedComment,
    isSettingsOpen, setIsSettingsOpen,
    setModeratingCommentCid,
    selectedAddress,
    setCaptchaResponse,
    setChallengesArray,
    setIsAuthorDelete,
    setIsAuthorEdit,
    setIsCaptchaOpen,
    isModerationOpen, setIsModerationOpen,
    setResolveCaptchaPromise,
    setSelectedAddress,
    setSelectedParentCid,
    setSelectedShortCid,
    selectedStyle,
    setSelectedThread,
    setSelectedTitle,
  } = useGeneralStore(state => state);

  const account = useAccount();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useError();
  const [, setSuccessMessage] = useSuccess();

  const threadMenuRefs = useRef({});
  const replyMenuRefs = useRef({});
  const postMenuCatalogRef = useRef(null);
  const backlinkRefs = useRef({});
  const quoteRefs = useRef({});
  const backlinkRefsMobile = useRef({});
  const quoteRefsMobile = useRef({});
  const postOnHoverRef = useRef(null);

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [originalCommentContent, setOriginalCommentContent] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [commentCid, setCommentCid] = useState(null);
  const [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
  const [triggerPublishCommentEdit, setTriggerPublishCommentEdit] = useState(false);
  const [openMenuCid, setOpenMenuCid] = useState(null);
  const [outOfViewCid, setOutOfViewCid] = useState(null);
  const [outOfViewPosition, setOutOfViewPosition] = useState({top: 0, left: 0});
  const [postOnHoverHeight, setPostOnHoverHeight] = useState(0);
  const [deletePost, setDeletePost] = useState(false);
  const [moderatorPermissions, setModeratorPermissions] = useState({});

  const { feed, hasMore, loadMore } = useFeed({subplebbitAddresses: account?.subscriptions, sortType: 'new'});
  const [selectedFeed, setSelectedFeed] = useState(feed.sort((a, b) => b.timestamp - a.timestamp));
  const {subplebbits} = useSubplebbits({subplebbitAddresses: account?.subscriptions, sortType: 'new'});

  const stateString = useFeedStateString(subplebbits);
  

  useEffect(() => {
    let permissions = {};

    selectedFeed.forEach(thread => {
      const subplebbit = subplebbits.find(s => s.address === thread.subplebbitAddress);

      if (subplebbit && subplebbit.roles !== undefined) { 
        const role = subplebbit.roles[account?.author.address]?.role;
    
        if (role === 'moderator' || role === 'admin' || role === 'owner') {
          permissions[thread.subplebbitAddress] = true;
        } else {
          permissions[thread.subplebbitAddress] = false;
        }
      }
    });

    setModeratorPermissions(permissions);
  }, [account?.author.address, selectedFeed, subplebbits]);


  const handleOptionClick = () => {
    setOpenMenuCid(null);
  };

  
  const handleOutsideClick = useCallback((e) => {
    if (openMenuCid !== null && !postMenuCatalogRef.current.contains(e.target)) {
      setOpenMenuCid(null);
    }
  }, [openMenuCid, postMenuCatalogRef]);
  

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

  
  const errorString = useMemo(() => {
    for (const subplebbit of subplebbits) {
      if (subplebbit?.updatingState !== 'failed') {
        return
      }
    }
    for (const subplebbit of subplebbits) {
      if (subplebbit?.error) {
        return `Failed fetching subplebbit: ${subplebbit?.error.toString().slice(0, 300)}`
      }
    }
  }, [subplebbits])

  useEffect(() => {
    if (errorString && errorString !== errorMessage) {
      setErrorMessage(errorString);
    }
  }, [errorString, setErrorMessage, errorMessage]);


  useEffect(() => {
    setSelectedFeed(feed.sort((a, b) => b.timestamp - a.timestamp));
  }, [feed]);


  const flattenedRepliesByThread = useMemo(() => {
    return selectedFeed.reduce((acc, thread) => {
      const replies = flattenCommentsPages(thread.replies);
      acc[thread.cid] = replies;
      return acc;
    }, {});
  }, [selectedFeed]);
  

  const allParentCids = useMemo(() => {
    const allRepliesCids = Object.values(flattenedRepliesByThread).flatMap(replies => replies.map(reply => reply.cid));
    const allThreadCids = selectedFeed.map(thread => thread.cid);
    return [...allThreadCids, ...allRepliesCids];
  }, [flattenedRepliesByThread, selectedFeed]);  
  

  const filter = useMemo(() => ({
    parentCids: allParentCids
  }), [allParentCids]);
  

  const { accountComments } = useAccountComments({ filter });
  

  const filteredRepliesByThread = useMemo(() => {
    const maxRepliesPerThread = 5;

    const accountRepliesNotYetInCommentReplies = selectedFeed.reduce((acc, thread) => {
      const replyCids = new Set(flattenedRepliesByThread[thread.cid].map(reply => reply.cid));
      acc[thread.cid] = accountComments.filter(accountReply => !replyCids.has(accountReply.cid) && accountReply.parentCid === thread.cid);
      return acc;
    }, {});

    return selectedFeed.reduce((acc, thread) => {
      const combinedReplies = [...flattenedRepliesByThread[thread.cid], ...accountRepliesNotYetInCommentReplies[thread.cid]].sort((a, b) => a.timestamp - b.timestamp);
      acc[thread.cid] = {
        displayedReplies: combinedReplies.slice(0, maxRepliesPerThread),
        omittedCount: Math.max(combinedReplies.length - maxRepliesPerThread, 0),
      };
      return acc;
    }, {});
  }, [flattenedRepliesByThread, accountComments, selectedFeed]);


  const pendingReplyCounts = useMemo(() => {
    return selectedFeed.reduce((acc, thread) => {
      const replyCids = new Set(flattenedRepliesByThread[thread.cid].map(reply => reply.cid));
      acc[thread.cid] = accountComments.filter(accountReply => !replyCids.has(accountReply.cid) && accountReply.parentCid === thread.cid).length;
      return acc;
    }, {});
  }, [flattenedRepliesByThread, accountComments, selectedFeed]);

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
        setSuccessMessage('Challenge Success');
    } 
    else if (challengeVerification.challengeSuccess === false) {
      setErrorMessage('Challenge Failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
    }
  };


  const onChallenge = async (challenges, comment) => {
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

        setResolveCaptchaPromise(resolve);
      };
  
      challengeImg.onerror = () => {
        reject(setErrorMessage('Could not load challenges'));
      };
    });
  };


  const [publishCommentEditOptions, setPublishCommentEditOptions] = useState({
    commentCid: commentCid,
    content: editedComment || undefined,
    subplebbitAddress: selectedAddress,
    onChallenge,
    onChallengeVerification,
    onError: (error) => {
      setErrorMessage(error);
    },
  });


  const {error, publishCommentEdit } = usePublishCommentEdit(publishCommentEditOptions);

  useEffect(() => {
    if (error && error !== errorMessage) {
        setErrorMessage(error);
    }
  }, [error, setErrorMessage, errorMessage]);


  const handleAuthorDeleteClick = (commentCid) => {
    handleOptionClick(commentCid);

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AuthorDeleteAlert selectedStyle={selectedStyle}>
            <div className='author-delete-alert'>
              <p>Are you sure you want to delete this post?</p>
              <div className="author-delete-buttons">
                <button onClick={onClose}>No</button>
                <button
                  onClick={() => {
                    setIsAuthorDelete(true);
                    setIsAuthorEdit(false);
                    setCommentCid(commentCid);
                    setPublishCommentEditOptions(prevOptions => ({
                      ...prevOptions,
                      deleted: true,
                    }));
                    setTriggerPublishCommentEdit(true);
                    onClose();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </AuthorDeleteAlert>
        );
      }
    });
  };


  const handleAuthorEditClick = (comment) => {
    handleOptionClick(comment.cid);
    setIsAuthorEdit(true);
    setIsAuthorDelete(false);
    setCommentCid(comment.cid);
    setOriginalCommentContent(comment.content);
    setIsEditModalOpen(true);
  }
  
  
  useEffect(() => {
    setPublishCommentEditOptions((prevOptions) => ({
      ...prevOptions,
      commentCid: commentCid,
      content: editedComment || undefined,
    }));
  }, [commentCid, editedComment]);


  useEffect(() => {
    if (editedComment !== '') {
      setTriggerPublishCommentEdit(true);
    }
  }, [editedComment, setIsAuthorEdit]);

  
  useEffect(() => {
    if (publishCommentEditOptions && triggerPublishCommentEdit) {
      (async () => {
        await publishCommentEdit();
        setTriggerPublishCommentEdit(false);
      })();
    }
  }, [publishCommentEditOptions, triggerPublishCommentEdit, publishCommentEdit]);

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
      navigate(`/p/subscriptions`);
      return;
    } else if (selected === 'all') {
      navigate(`/p/all`);
      return;
    }

    const selectedTitle = defaultSubplebbits?.find((subplebbit) => subplebbit.address === selected).title;
    setSelectedTitle(selectedTitle);
    setSelectedAddress(selected);
    navigate(`/p/${selected}`);
  };

  
  useLayoutEffect(() => {
    if (postOnHoverRef.current) {
      const rect = postOnHoverRef.current.getBoundingClientRect();
      setPostOnHoverHeight(rect.height);
    }
  }, [outOfViewCid]);
  

  return (
    <>
      <Helmet>
        <title>Subscriptions - plebchan</title>
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
        <ModerationModal 
        selectedStyle={selectedStyle}
        isOpen={isModerationOpen}
        closeModal={() => {setIsModerationOpen(false); setDeletePost(false)}}
        deletePost={deletePost} />
        <EditModal
        selectedStyle={selectedStyle}
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        originalCommentContent={originalCommentContent} />
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
                <Link to={`/p/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => handleClickTitle(subplebbit.title, subplebbit.address)}
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
              <Link to={`/p/subscriptions/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
                  <select id="board-select-mobile" value="subscriptions" onChange={handleSelectChange}>
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
                  <Link to={`/p/subscriptions/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
          <div id="catalog-button-desktop">
            [
            <Link to={`/p/subscriptions/catalog`}>Catalog</Link>
            ]
          </div>
          {feed.length > 0 ? (
            null
          ) : (
            <div id="stats" style={{float: "right", marginTop: "5px"}}>
              <span className={stateString ? "ellipsis" : ""}>{stateString}</span>
            </div>
          )}
          <div id="catalog-button-mobile">
            <span className="btn-wrap">
              <Link to={`/p/subscriptions/catalog`}>Catalog</Link>
            </span>
          </div>
        </TopBar>
        <Tooltip id="tooltip" className="tooltip" />
        <BoardForm selectedStyle={selectedStyle}>
          <div className="board">
            { feed.length < 1 ? (
              null
            ) : (
              <Virtuoso
                increaseViewportBy={2000}
                data={selectedFeed}
                itemContent={(index, thread) => {
                  const { displayedReplies, omittedCount } = filteredRepliesByThread[thread.cid] || {};
                  const commentMediaInfo = getCommentMediaInfo(thread);
                  const fallbackImgUrl = "assets/filedeleted-res.gif";
                  setIsModerator(moderatorPermissions[thread.subplebbitAddress]);
                  return (
                <Fragment key={`fr-${index}`}>
                  <div key={`t-${index}`} className="thread">
                    <div key={`c-${index}`} className="op-container">
                      <div key={`po-${index}`} className="post op op-desktop">
                        <hr key={`hr-${index}`} />
                        <div key={`pi-${index}`} className="post-info">
                        {commentMediaInfo?.url ? (
                          <div key={`f-${index}`} className="file" style={{marginBottom: "5px"}}>
                            <div key={`ft-${index}`} className="file-text">
                              Link:&nbsp;
                              <a key={`fa-${index}`} href={commentMediaInfo.url} target="_blank"
                              rel="noopener noreferrer">{
                              commentMediaInfo?.url.length > 30 ?
                              commentMediaInfo?.url.slice(0, 30) + "(...)" :
                              commentMediaInfo?.url
                              }</a>&nbsp;({commentMediaInfo?.type})
                            </div>
                            {commentMediaInfo?.type === "webpage" ? (
                              <div key={`enlarge-${index}`} className="img-container">
                                <span key={`fta-${index}`} className="file-thumb">
                                  {thread.thumbnailUrl ? (
                                    <img key={`fti-${index}`} 
                                    src={commentMediaInfo.thumbnail} alt={commentMediaInfo.type}
                                    onClick={handleImageClick}
                                    style={{cursor: "pointer"}}
                                    onError={(e) => e.target.src = fallbackImgUrl} />
                                  ) : null}
                                </span>
                              </div>
                            ) : null}
                            {commentMediaInfo?.type === "image" ? (
                              <div key={`enlarge-${index}`} className="img-container">
                                <span key={`fta-${index}`} className="file-thumb">
                                  <img key={`fti-${index}`} 
                                  src={commentMediaInfo.url} alt={commentMediaInfo.type}
                                  onClick={handleImageClick}
                                  style={{cursor: "pointer"}}
                                  onError={(e) => e.target.src = fallbackImgUrl} />
                                </span>
                              </div>
                            ) : null}
                            {commentMediaInfo?.type === "video" ? (
                              <span key={`fta-${index}`} className="file-thumb">
                                <video controls width="" key={`fti-${index}`} 
                                src={commentMediaInfo.url} alt={commentMediaInfo.type}
                                onError={(e) => e.target.src = fallbackImgUrl} />
                              </span>
                            ) : null}
                            {commentMediaInfo?.type === "audio" ? (
                              <span key={`fta-${index}`} className="file-thumb">
                                <audio controls key={`fti-${index}`} 
                                src={commentMediaInfo.url} alt={commentMediaInfo.type}
                                onError={(e) => e.target.src = fallbackImgUrl} />
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                          <span key={`nb-${index}`} className="name-block">
                            {thread.title ? (
                              thread.title.length > 75 ?
                              <Fragment key={`fragment2-${index}`}>
                                <span key={`q-${index}`} className="title"
                                data-tooltip-id="tooltip"
                                data-tooltip-content={thread.title}
                                data-tooltip-place="top">
                                  {thread.title.slice(0, 75) + " (...)"}
                                </span>
                              </Fragment>
                            : <span key={`q-${index}`} className="title">
                              {thread.title}
                              </span>) 
                            : null}&nbsp;
                            {thread.author.displayName
                            ? thread.author.displayName.length > 20
                            ? <Fragment key={`fragment3-${index}`}>
                                <span key={`n-${index}`} className="name"
                                data-tooltip-id="tooltip"
                                data-tooltip-content={thread.author.displayName}
                                data-tooltip-place="top">
                                  {thread.author.displayName.slice(0, 20) + " (...)"}
                                </span>
                              </Fragment> 
                              : <span key={`n-${index}`} className="name">
                                {thread.author.displayName}</span>
                            : <span key={`n-${index}`} className="name">
                              Anonymous</span>}
                            &nbsp;
                            (u/
                            <span key={`pa-${index}`} className="poster-address address-desktop"
                            id="reply-button" style={{cursor: "pointer"}}
                              onClick={() => handleAddressClick(thread.author.shortAddress)}
                            >
                              {thread.author.shortAddress}
                            </span>)
                            &nbsp;
                            <span key={`dt-${index}`} className="date-time" data-utc="data">{getDate(thread.timestamp)}</span>
                            &nbsp;
                            <span key={`pn-${index}`} className="post-number post-number-desktop">
                              <span key={`pl1-${index}`}>c/</span>
                              <Link to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`} id="reply-button" key={`pl2-${index}`} 
                              onClick={(e) => {
                                if (e.button === 2) return;
                                e.preventDefault();
                                setIsReplyOpen(true); 
                                setSelectedShortCid(thread.shortCid); 
                                setSelectedParentCid(thread.cid);
                                setSelectedAddress(thread.subplebbitAddress);
                                }} title="Reply to this post">{thread.shortCid}
                              </Link>
                              &nbsp;p/
                              <Link key={`p-t-${index}`} to={`/p/${thread.subplebbitAddress}`} id="reply-button" title="Visit this board">
                                {thread.subplebbitAddress.includes(".eth") ? thread.subplebbitAddress : (
                                  <span key={`short-add${index}`}
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={thread.subplebbitAddress}
                                  data-tooltip-place="top"
                                  >{thread.subplebbitAddress.slice(0, 10) + "(...)"}</span>
                                )}
                              </Link>
                              <OfflineIndicator key={`oi-${index}`}
                              address={thread.subplebbitAddress} 
                              className="offline-sub"
                              tooltipPlace="top" />
                              <span key={`rl1-${index}`}>&nbsp;&nbsp;
                                [
                                <Link key={`rl2-${index}`} to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="reply-link" >Reply</Link>
                                ]
                              </span>
                            </span>&nbsp;
                            <PostMenu 
                              key={`pmb-${index}`} 
                              title="Post menu"
                              ref={el => { 
                                threadMenuRefs.current[thread.cid] = el;
                              }}
                              className='post-menu-button' 
                              rotated={openMenuCid === thread.cid}
                              onClick={(event) => {
                                event.stopPropagation();
                                const rect = threadMenuRefs.current[thread.cid].getBoundingClientRect();
                                setMenuPosition({top: rect.top + window.scrollY, left: rect.left});
                                setOpenMenuCid(prevCid => (prevCid === thread.cid ? null : thread.cid));
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
                              <div className={`post-menu-thread post-menu-thread-${thread.cid}`}
                              style={{ display: openMenuCid === thread.cid ? 'block' : 'none' }}
                              >
                                <ul className="post-menu-catalog">
                                  <li onClick={() => handleOptionClick(thread.cid)}>Hide thread</li>
                                  {thread.author.shortAddress === account?.author.shortAddress ? (
                                    <>
                                      <li onClick={() => {handleAuthorEditClick(thread); setSelectedAddress(thread.subplebbitAddress);}}>Edit post</li>
                                      <li onClick={() => {handleAuthorDeleteClick(thread.cid); setSelectedAddress(thread.subplebbitAddress);}}>Delete post</li>
                                    </>
                                  ) : null}
                                  {isModerator ? (
                                    <>
                                      {thread.author.shortAddress === account?.author.shortAddress ? (
                                        null
                                      ) : (
                                        <li onClick={() => {
                                          setSelectedAddress(thread.subplebbitAddress);
                                          setModeratingCommentCid(thread.cid)
                                          setIsModerationOpen(true); 
                                          handleOptionClick(thread.cid);
                                          setDeletePost(true);
                                        }}>
                                        Delete post
                                        </li>
                                      )}
                                      <li
                                      onClick={() => {
                                        setSelectedAddress(thread.subplebbitAddress);
                                        setModeratingCommentCid(thread.cid)
                                        setIsModerationOpen(true); 
                                        handleOptionClick(thread.cid);
                                      }}>
                                        Mod tools
                                      </li>
                                    </>
                                  ) : null}
                                  {(commentMediaInfo && (
                                    commentMediaInfo.type === 'image' || 
                                    (commentMediaInfo.type === 'webpage' && 
                                    commentMediaInfo.thumbnail))) ? ( 
                                      <li 
                                      onMouseOver={() => {setIsImageSearchOpen(true)}}
                                      onMouseLeave={() => {setIsImageSearchOpen(false)}}>
                                        Image search »
                                        <ul className="dropdown-menu post-menu-catalog"
                                          style={{display: isImageSearchOpen ? 'block': 'none'}}>
                                          <li onClick={() => handleOptionClick(thread.cid)}>
                                            <a 
                                            href={`https://lens.google.com/uploadbyurl?url=${commentMediaInfo.url}`}
                                            target="_blank" rel="noreferrer"
                                            >Google</a>
                                          </li>
                                          <li onClick={() => handleOptionClick(thread.cid)}>
                                            <a
                                            href={`https://yandex.com/images/search?url=${commentMediaInfo.url}`}
                                            target="_blank" rel="noreferrer"
                                            >Yandex</a>
                                          </li>
                                          <li onClick={() => handleOptionClick(thread.cid)}>
                                            <a
                                            href={`https://saucenao.com/search.php?url=${commentMediaInfo.url}`}
                                            target="_blank" rel="noreferrer"
                                            >SauceNAO</a>
                                          </li>
                                        </ul>
                                      </li>
                                    ) : null
                                  }
                                </ul>
                              </div>
                              </PostMenuCatalog>, document.body
                            )}
                            <div key={`bi-${index}`} id="backlink-id" className="backlink">
                              {thread.replies?.pages?.topAll.comments
                                .sort((a, b) => a.timestamp - b.timestamp)
                                .map((reply, index) => (
                                  <div key={`div-${index}`} style={{display: 'inline-block'}} 
                                  ref={el => {
                                    backlinkRefs.current[reply.cid] = el;
                                  }}>
                                  <Link key={`ql-${index}`}
                                  to={() => {}} className="quote-link" 
                                  onClick={(event) => handleQuoteClick(reply, null, event)}
                                  onMouseOver={(event) => {
                                    event.stopPropagation();
                                    handleQuoteHover(reply, null, () => {
                                      setOutOfViewCid(reply.cid);
                                      const rect = backlinkRefs.current[reply.cid].getBoundingClientRect();
                                      const distanceToRight = window.innerWidth - rect.right;
                                      const distanceToTop = rect.top;
                                      const distanceToBottom = window.innerHeight - rect.bottom;
                                      let top;

                                      if (distanceToTop < postOnHoverHeight / 2) {
                                        top = window.scrollY - 5;
                                      } else if (distanceToBottom < postOnHoverHeight / 2) {
                                        top = window.scrollY - postOnHoverHeight + window.innerHeight - 10;
                                      } else {
                                        top = rect.top + window.scrollY - postOnHoverHeight / 2;
                                      }
                                    
                                      if (distanceToRight < 200) {
                                        setOutOfViewPosition({
                                          top,
                                          right: window.innerWidth - rect.left - 10,
                                          maxWidth: rect.left - 5
                                        });
                                      } else {
                                        setOutOfViewPosition({
                                          top,
                                          left: rect.left + rect.width + 5,
                                          maxWidth: window.innerWidth - rect.left - rect.width - 5
                                        });
                                      }
                                    });
                                  }}
                                  onMouseLeave={() => {
                                    removeHighlight();
                                    setOutOfViewCid(null);
                                  }}>
                                    c/{reply.shortCid}</Link>
                                    &nbsp;
                                  </div>
                                ))
                              }
                            </div>
                          </span>
                          {thread.content ? (
                            thread.content?.length > 1000 ?
                            <Fragment key={`fragment5-${index}`}>
                              <blockquote key={`bq-${index}`}>
                                <Post content={thread.content?.slice(0, 1000)} key={`post-${index}`} />
                                <span key={`ttl-s-${index}`} className="ttl"> (...) 
                                  <br key={`ttl-s-br1-${index}`} />
                                  <EditLabel key={`edit-label-thread-${index}`} 
                                  commentCid={thread.cid}
                                  className="ttl"/>
                                  <StateLabel key={`state-label-thread-${index}`}
                                  commentIndex={thread.index}
                                  className="ttl ellipsis"/>
                                  <br key={`ttl-s-br2${index}`} />
                                  Post too long.&nbsp;
                                  <Link key={`ttl-l-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">Click here</Link>
                                  &nbsp;to view. 
                                </span>
                              </blockquote>
                            </Fragment>
                          : <blockquote key={`bq-${index}`}>
                              <Post content={thread.content} key={`post-${index}`} />
                              <EditLabel key={`edit-label-thread-${index}`} 
                              commentCid={thread.cid}
                              className="ttl"/>
                              <StateLabel key={`state-label-thread-${index}`}
                              commentIndex={thread.index}
                              className="ttl ellipsis"/>
                            </blockquote>)
                          : null}
                        </div>
                      </div>
                    </div>
                    <span key={`summary-${index}`} className="summary">
                      {omittedCount > 0 ? (
                      <span key={`oc-${index}`} className="ttl">
                        <span key={`oc1-${index}`}>
                          {omittedCount} post{omittedCount > 1 ? "s" : ""} omitted. Click&nbsp;
                          <Link key={`oc2-${index}`} to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">here</Link>
                          &nbsp;to view.
                        </span>
                      </span>) : null}
                    </span>
                    {displayedReplies?.map((reply, index) => {
                      const replyMediaInfo = getCommentMediaInfo(reply);
                      const fallbackImgUrl = "assets/filedeleted-res.gif";
                      const shortParentCid = findShortParentCid(reply.parentCid, selectedFeed);
                      return (
                        <div key={`rc-${index}`} className="reply-container">
                          <div key={`sa-${index}`} className="side-arrows">{'>>'}</div>
                          <div key={`pr-${index}`} className="post-reply post-reply-desktop">
                            <div key={`pi-${index}`} className="post-info">
                              <span key={`nb-${index}`} className="nameblock">
                                {reply.author.displayName
                                  ? reply.author.displayName.length > 20
                                  ? <Fragment key={`fragment6-${index}`}>
                                      <span key={`mob-n-${index}`} className="name"
                                      data-tooltip-id="tooltip"
                                      data-tooltip-content={reply.author.displayName}
                                      data-tooltip-place="top">
                                        {reply.author.displayName.slice(0, 20) + " (...)"}
                                      </span>
                                    </Fragment>
                                    : <span key={`mob-n-${index}`} className="name">
                                      {reply.author.displayName}</span>
                                  : <span key={`mob-n-${index}`} className="name">
                                    Anonymous</span>}
                                &nbsp;
                                <span key={`pa-${index}`} className="poster-address address-desktop"
                                  id="reply-button" style={{cursor: "pointer"}}
                                  onClick={() => handleAddressClick(reply.author.shortAddress)}
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
                              <span key={`dt-${index}`} className="date-time" data-utc="data">{getDate(reply.timestamp)}</span>
                              &nbsp;
                              <span key={`pn-${index}`} className="post-number post-number-desktop">
                                <span id="reply-button" style={{cursor: 'pointer'}} key={`pl1-${index}`} title="Link to this post">c/</span>
                                {reply.shortCid ? (
                                  <Link to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`} id="reply-button" key={`pl2-${index}`} 
                                  onClick={(e) => {
                                    if (e.button === 2) return;
                                    e.preventDefault();
                                    setIsReplyOpen(true); 
                                    setSelectedShortCid(reply.shortCid); 
                                    setSelectedParentCid(reply.cid);
                                    setSelectedAddress(thread.subplebbitAddress);
                                  }} title="Reply to this post">{reply.shortCid}</Link>
                                ) : (
                                  <span key="pending" style={{color: 'red', fontWeight: '700'}}>Pending</span>
                                )}
                                &nbsp;p/
                                <Link key={`p-t-${index}`} to={`/p/${thread.subplebbitAddress}`} id="reply-button" title="Visit this board">
                                {thread.subplebbitAddress.includes(".eth") ? 
                                (thread.subplebbitAddress) : 
                                (
                                  <span key={`short-add${index}`}
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content={thread.subplebbitAddress}
                                    data-tooltip-place="top"
                                    >{thread.subplebbitAddress.slice(0, 10) + "(...)"}
                                  </span>
                                )}
                              </Link>
                              <OfflineIndicator key={`offline-reply-${index}`} 
                              address={thread.subplebbitAddress}
                              tooltipPlace="top"
                              className="offline-reply" />
                              </span>&nbsp;
                              <PostMenu 
                                key={`pmb-${index}`} 
                                title="Post menu"
                                ref={el => { 
                                  replyMenuRefs.current[reply.cid] = el; 
                                }}
                                className='post-menu-button' 
                                rotated={openMenuCid === reply.cid}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  const rect = replyMenuRefs.current[reply.cid].getBoundingClientRect();
                                  setMenuPosition({top: rect.top + window.scrollY, left: rect.left});
                                  setOpenMenuCid(prevCid => (prevCid === reply.cid ? null : reply.cid));
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
                              <div className={`post-menu-reply post-menu-reply-${reply.cid}`}
                              style={{ display: openMenuCid === reply.cid ? 'block' : 'none' }}
                              >
                                <ul className="post-menu-catalog">
                                  <li onClick={() => handleOptionClick(reply.cid)}>Hide post</li>
                                  {reply.author.shortAddress === account?.author.shortAddress ? (
                                    <>
                                      <li onClick={() => {handleAuthorEditClick(reply); setSelectedAddress(thread.subplebbitAddress);}}>Edit post</li>
                                      <li onClick={() => {handleAuthorDeleteClick(reply.cid); setSelectedAddress(thread.subplebbitAddress);}}>Delete post</li>
                                    </>
                                  ) : null}
                                  {isModerator ? (
                                    <>
                                      {reply.author.shortAddress === account?.author.shortAddress ? (
                                        null
                                      ) : (
                                        <li onClick={() => {
                                          setSelectedAddress(thread.subplebbitAddress);
                                          setModeratingCommentCid(reply.cid)
                                          setIsModerationOpen(true); 
                                          handleOptionClick(reply.cid);
                                          setDeletePost(true);
                                        }}>
                                        Delete post
                                        </li>
                                      )}
                                      <li
                                      onClick={() => {
                                        setSelectedAddress(thread.subplebbitAddress);
                                        setModeratingCommentCid(reply.cid)
                                        setIsModerationOpen(true); 
                                        handleOptionClick(reply.cid);
                                      }}>
                                        Mod tools
                                      </li>
                                    </>
                                  ) : null}
                                  {(replyMediaInfo && (
                                    replyMediaInfo.type === 'image' || 
                                    (replyMediaInfo.type === 'webpage' && 
                                    replyMediaInfo.thumbnail))) ? ( 
                                      <li 
                                      onMouseOver={() => {setIsImageSearchOpen(true)}}
                                      onMouseLeave={() => {setIsImageSearchOpen(false)}}>
                                        Image search »
                                        <ul className="dropdown-menu post-menu-catalog"
                                          style={{display: isImageSearchOpen ? 'block': 'none'}}>
                                          <li onClick={() => handleOptionClick(reply.cid)}>
                                            <a 
                                            href={`https://lens.google.com/uploadbyurl?url=${replyMediaInfo.url}`}
                                            target="_blank" rel="noreferrer"
                                            >Google</a>
                                          </li>
                                          <li onClick={() => handleOptionClick(reply.cid)}>
                                            <a
                                            href={`https://yandex.com/images/search?url=${replyMediaInfo.url}`}
                                            target="_blank" rel="noreferrer"
                                            >Yandex</a>
                                          </li>
                                          <li onClick={() => handleOptionClick(reply.cid)}>
                                            <a
                                            href={`https://saucenao.com/search.php?url=${replyMediaInfo.url}`}
                                            target="_blank" rel="noreferrer"
                                            >SauceNAO</a>
                                          </li>
                                        </ul>
                                      </li>
                                    ) : null
                                  }
                                </ul>
                              </div>
                              </PostMenuCatalog>, document.body
                            )}
                              <div key={`bi-${index}`} id="backlink-id" className="backlink">
                                {reply.replies?.pages?.topAll.comments
                                  .sort((a, b) => a.timestamp - b.timestamp)
                                  .map((reply, index) => (
                                    <div key={`div-${index}`} style={{display: 'inline-block'}} 
                                    ref={el => {
                                      backlinkRefs.current[reply.cid] = el;
                                    }}>
                                    <Link key={`ql-${index}`}
                                    to={() => {}} className="quote-link" 
                                    onClick={(event) => handleQuoteClick(reply, null, event)}
                                    onMouseOver={(event) => {
                                      event.stopPropagation();
                                      handleQuoteHover(reply, null, () => {
                                        setOutOfViewCid(reply.cid);
                                        const rect = backlinkRefs.current[reply.cid].getBoundingClientRect();
                                        const distanceToRight = window.innerWidth - rect.right;
                                        const distanceToTop = rect.top;
                                        const distanceToBottom = window.innerHeight - rect.bottom;
                                        let top;

                                        if (distanceToTop < postOnHoverHeight / 2) {
                                          top = window.scrollY - 5;
                                        } else if (distanceToBottom < postOnHoverHeight / 2) {
                                          top = window.scrollY - postOnHoverHeight + window.innerHeight - 10;
                                        } else {
                                          top = rect.top + window.scrollY - postOnHoverHeight / 2;
                                        }
                                      
                                        if (distanceToRight < 200) {
                                          setOutOfViewPosition({
                                            top,
                                            right: window.innerWidth - rect.left - 10,
                                            maxWidth: rect.left - 5
                                          });
                                        } else {
                                          setOutOfViewPosition({
                                            top,
                                            left: rect.left + rect.width + 5,
                                            maxWidth: window.innerWidth - rect.left - rect.width - 5
                                          });
                                        }
                                      });
                                    }}
                                    onMouseLeave={() => {
                                      removeHighlight();
                                      setOutOfViewCid(null);
                                    }}>
                                      c/{reply.shortCid}</Link>
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
                                  <a key={`fa-${index}`} href={replyMediaInfo.url} target="_blank"
                                  rel="noopener noreferrer">{
                                  replyMediaInfo?.url.length > 30 ?
                                  replyMediaInfo?.url.slice(0, 30) + "(...)" :
                                  replyMediaInfo?.url
                                  }</a>&nbsp;({replyMediaInfo?.type})
                                </div>
                                {replyMediaInfo?.type === "webpage" ? (
                                  <div key={`enlarge-reply-${index}`} className="img-container">
                                    <span key={`fta-${index}`} className="file-thumb-reply">
                                      {reply.thumbnailUrl ? (
                                        <img key={`fti-${index}`}
                                        src={replyMediaInfo.thumbnail} alt={replyMediaInfo.type}
                                        onClick={handleImageClick}
                                        style={{cursor: "pointer"}}
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                      ) : null}
                                    </span>
                                  </div>
                                ) : null}
                                {replyMediaInfo?.type === "image" ? (
                                  <div key={`enlarge-reply-${index}`} className="img-container">
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
                                    <video controls
                                    key={`fti-${index}`} 
                                    src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                    onError={(e) => e.target.src = fallbackImgUrl} />
                                  </span>
                                ) : null}
                                {replyMediaInfo?.type === "audio" ? (
                                  <span key={`fta-${index}`} className="file-thumb-reply">
                                    <audio controls 
                                    key={`fti-${index}`}
                                    src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                    onError={(e) => e.target.src = fallbackImgUrl} />
                                  </span>
                                ) : null}
                              </div>
                            ) : null}
                            {reply.content ? (
                              reply.content?.length > 500 ?
                              <Fragment key={`fragment8-${index}`}>
                                <blockquote key={`pm-${index}`} comment={reply} className="post-message">
                                  <Link to={() => {}} key={`r-pm-${index}`} className="quotelink"  
                                    ref={el => {
                                      quoteRefs.current[reply.cid] = el;
                                    }}
                                    onClick={(event) => handleQuoteClick(reply, shortParentCid, event)}
                                    onMouseOver={(event) => {
                                      event.stopPropagation();
                                      handleQuoteHover(reply, shortParentCid, () => {
                                      setOutOfViewCid(reply.parentCid);
                                      const rect = quoteRefs.current[reply.cid].getBoundingClientRect();
                                      const distanceToRight = window.innerWidth - rect.right;
                                      const distanceToTop = rect.top;
                                      const distanceToBottom = window.innerHeight - rect.bottom;
                                      let top;

                                      if (distanceToTop < postOnHoverHeight / 2) {
                                        top = window.scrollY - 5;
                                      } else if (distanceToBottom < postOnHoverHeight / 2) {
                                        top = window.scrollY - postOnHoverHeight + window.innerHeight - 10;
                                      } else {
                                        top = rect.top + window.scrollY - postOnHoverHeight / 2;
                                      }
                                    
                                      if (distanceToRight < 200) {
                                        setOutOfViewPosition({
                                          top,
                                          right: window.innerWidth - rect.left - 10,
                                          maxWidth: rect.left - 5
                                        });
                                      } else {
                                        setOutOfViewPosition({
                                          top,
                                          left: rect.left + rect.width + 5,
                                          maxWidth: window.innerWidth - rect.left - rect.width - 5
                                        });
                                      }
                                      });
                                    }}                                
                                    onMouseLeave={() => {
                                      removeHighlight();
                                      setOutOfViewCid(null);
                                    }}>
                                      {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                                  </Link>
                                  <Post content={reply.content?.slice(0, 500)} key={`post-${index}`} />
                                  <span key={`ttl-s-${index}`} className="ttl"> (...)
                                  <br key={`ttl-s-br1-${index}`} />
                                  <EditLabel key={`edit-label-reply-${index}`} 
                                  commentCid={reply.cid}
                                  className="ttl"/>
                                  <StateLabel key={`state-label-reply-${index}`}
                                  commentIndex={reply.index}
                                  className="ttl ellipsis"/>
                                  <br key={`ttl-s-br2${reply.cid}`} />
                                  Comment too long.&nbsp;
                                  <Link key={`ttl-l-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">Click here</Link>
                                  &nbsp;to view. </span>
                                </blockquote>
                              </Fragment>
                            : <blockquote key={`pm-${index}`} className="post-message">
                                <Link to={() => {}} key={`r-pm-${index}`} className="quotelink"  
                                  ref={el => {
                                    quoteRefs.current[reply.cid] = el;
                                  }}
                                  onClick={(event) => handleQuoteClick(reply, shortParentCid, event)}
                                  onMouseOver={(event) => {
                                    event.stopPropagation();
                                    handleQuoteHover(reply, shortParentCid, () => {
                                    setOutOfViewCid(reply.parentCid);
                                    const rect = quoteRefs.current[reply.cid].getBoundingClientRect();
                                    const distanceToRight = window.innerWidth - rect.right;
                                    const distanceToTop = rect.top;
                                    const distanceToBottom = window.innerHeight - rect.bottom;
                                    let top;

                                    if (distanceToTop < postOnHoverHeight / 2) {
                                      top = window.scrollY - 5;
                                    } else if (distanceToBottom < postOnHoverHeight / 2) {
                                      top = window.scrollY - postOnHoverHeight + window.innerHeight - 10;
                                    } else {
                                      top = rect.top + window.scrollY - postOnHoverHeight / 2;
                                    }
                                  
                                    if (distanceToRight < 200) {
                                      setOutOfViewPosition({
                                        top,
                                        right: window.innerWidth - rect.left - 10,
                                        maxWidth: rect.left - 5
                                      });
                                    } else {
                                      setOutOfViewPosition({
                                        top,
                                        left: rect.left + rect.width + 5,
                                        maxWidth: window.innerWidth - rect.left - rect.width - 5
                                      });
                                    }
                                    });
                                  }}                                
                                  onMouseLeave={() => {
                                    removeHighlight();
                                    setOutOfViewCid(null);
                                  }}>
                                    {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                                </Link>
                                <Post content={reply.content} key={`post-${index}`} comment={reply} />
                                <EditLabel key={`edit-label-reply-${index}`} 
                                  commentCid={reply.cid}
                                  className="ttl"/>
                                <StateLabel key={`state-label-reply-${index}`}
                                commentIndex={reply.index}
                                className="ttl ellipsis"/>
                              </blockquote>)
                            : null}
                          </div>
                        </div>
                            )
                        })}
                  </div>
                  <div key={`mob-t-${index}`} className="thread-mobile">
                    {index === 0 ? (
                      <hr key={`mob-hr-${index}`} style={{marginTop: '10px'}} />
                    ) : (
                      <hr key={`mob-hr-${index}`} />
                    )}
                    <div key={`mob-c-${index}`} className="op-container">
                      <div key={`mob-po-${index}`} className="post op op-mobile">
                        <div key={`mob-pi-${index}`} className="post-info-mobile">
                          <button key={`mob-pb-${index}`} className="post-menu-button-mobile" style={{ all: 'unset', cursor: 'pointer' }}>...</button>
                          <span key={`mob-nbm-${index}`} className="name-block-mobile">
                            {thread.author.displayName
                            ? thread.author.displayName.length > 20
                            ? <Fragment key={`fragment9-${index}`}>
                                <span key={`mob-n-${index}`} className="name-mobile"
                                data-tooltip-id="tooltip"
                                data-tooltip-content={thread.author.displayName}
                                data-tooltip-place="top">
                                  {thread.author.displayName.slice(0, 20) + " (...)"}
                                </span>
                              </Fragment> 
                              : <span key={`mob-n-${index}`} className="name-mobile">
                                {thread.author.displayName}</span>
                            : <span key={`mob-n-${index}`} className="name-mobile">
                              Anonymous</span>}
                            &nbsp;
                            <span key={`mob-pa-${index}`} className="poster-address-mobile address-mobile"
                              id="reply-button" style={{cursor: "pointer"}}
                              onClick={() => handleAddressClick(thread.author.shortAddress)}
                            >
                              (u/
                              <span key={`mob-ha-${index}`} className="highlight-address-mobile">
                                {thread.author.shortAddress}
                              </span>
                              )&nbsp;
                            </span>
                            <br key={`mob-br1-${index}`} />
                            {thread.title ? (
                              thread.title.length > 30 ?
                              <Fragment key={`fragment11-${index}`}>
                                <span key={`mob-t-${index}`} className="subject-mobile"
                                data-tooltip-id="tooltip"
                                data-tooltip-content={thread.title}
                                data-tooltip-place="top">
                                  {thread.title.slice(0, 30) + " (...)"}
                                </span>
                              </Fragment>
                            : <span key={`mob-t-${index}`} className="subject-mobile">
                              {thread.title}
                              </span>) 
                            : null}
                          </span>
                            <span key={`p-t-mob-span-${index}`} className="date-time-mobile highlight-address-mobile">
                            p/
                            <Link key={`p-t-${index}`} to={`/p/${thread.subplebbitAddress}`} id="reply-button" title="Visit this board">
                              {thread.subplebbitAddress.includes(".eth") ? 
                              (thread.subplebbitAddress) : 
                              (
                                <span key={`short-add${index}`}
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={thread.subplebbitAddress}
                                  data-tooltip-place="top"
                                  >{thread.subplebbitAddress.slice(0, 10) + "(...)"}
                                </span>
                              )}
                            </Link>
                            <OfflineIndicator key={`offline-indicator-${index}`}
                            address={thread.subplebbitAddress}
                            tooltipPlace="top"
                            className="offline-mobile-sub"  />
                          </span>
                          <span key={`mob-dt-${index}`} className="date-time-mobile post-number-mobile">
                            {getDate(thread.timestamp)}
                            &nbsp;
                            <span key={`mob-no-${index}`}>c/</span>
                            <Link to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`} id="reply-button" key={`mob-no2-${index}`} 
                              onClick={(e) => {
                                if (e.button === 2) return;
                                e.preventDefault();
                                setIsReplyOpen(true); 
                                setSelectedShortCid(thread.shortCid); 
                                setSelectedParentCid(thread.cid);
                                setSelectedAddress(thread.subplebbitAddress);
                              }} title="Reply to this post">{thread.shortCid}
                            </Link>
                          </span>
                        </div>
                        {thread.link ? (
                          <div key={`mob-f-${index}`} className="file-mobile">
                              {commentMediaInfo?.url ? (
                                commentMediaInfo.type === "webpage" ? (
                                  <div key={`enlarge-mob-${index}`} className="img-container">
                                    <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile">
                                      {thread.thumbnailUrl ? (
                                        <img key={`mob-img-${index}`} 
                                        src={commentMediaInfo.thumbnail} alt="thumbnail" 
                                        onClick={handleImageClick}
                                        style={{cursor: "pointer"}}
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                      ) : null}
                                      <div key={`mob-fi-${index}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                    </span>
                                  </div>
                                ) : commentMediaInfo.type === "image" ? (
                                  <div key={`enlarge-mob-${index}`} className="img-container">
                                    <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile">
                                      <img key={`mob-img-${index}`} 
                                      src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                                      onClick={handleImageClick}
                                      style={{cursor: "pointer"}}
                                      onError={(e) => e.target.src = fallbackImgUrl} />
                                      <div key={`mob-fi-${index}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                    </span>
                                  </div>
                                ) : commentMediaInfo.type === "video" ? (
                                    <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile">
                                      <video key={`fti-${index}`} 
                                      src={commentMediaInfo.url} alt={commentMediaInfo.type}
                                      style={{ pointerEvents: "none" }} 
                                      onError={(e) => e.target.src = fallbackImgUrl} />
                                      <div key={`mob-fi-${index}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                    </span>
                                ) : commentMediaInfo.type === "audio" ? (
                                    <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile">
                                      <audio key={`mob-img-${index}`} 
                                      src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                                      onError={(e) => e.target.src = fallbackImgUrl} />
                                      <div key={`mob-fi-${index}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                    </span>
                                ) : null
                              ) : null}
                          </div>
                        ) : null}
                        {thread.content ? (
                          thread.content?.length > 500 ?
                          <Fragment key={`fragment12-${index}`}>
                            <blockquote key={`mob-bq-${index}`} className="post-message-mobile">
                              <Post content={thread.content?.slice(0, 500)} key={`post-mobile-${index}`} />
                              <span key={`mob-ttl-s-${index}`} className="ttl"> (...)
                              <br key={`mob-ttl-s-br1-${index}`} />
                              <EditLabel key={`edit-label-thread-mob-${index}`} 
                              commentCid={thread.cid}
                              className="ttl"/>
                              <StateLabel key={`state-label-thread-mob-${index}`}
                              commentIndex={thread.index}
                              className="ttl ellipsis"/>
                              <br key={`mob-ttl-s-br2${thread.cid}`} />
                              Post too long.&nbsp;
                                <Link key={`mob-ttl-l-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">Click here</Link>
                                &nbsp;to view. </span>
                            </blockquote>
                          </Fragment>
                        : <blockquote key={`mob-bq-${index}`} className="post-message-mobile">
                            <Post content={thread.content} key={`post-mobile-${index}`} />
                            <EditLabel key={`edit-label-thread-mob-${index}`} 
                            commentCid={thread.cid}
                            className="ttl"/>
                            <StateLabel key={`state-label-thread-mob-${index}`}
                            commentIndex={thread.index}
                            className="ttl ellipsis"/>
                          </blockquote>)
                        : null}
                      </div>
                      <div key={`mob-pl-${index}`} className="post-link-mobile">
                        <span key={`mob-info-${index}`} className="info-mobile">{
                        (thread.replyCount + pendingReplyCounts[thread.cid]) === 0 ?
                        ("No replies")
                        : (thread.replyCount + pendingReplyCounts[thread.cid]) === 1 ?
                        ("1 reply")
                        : (thread.replyCount + pendingReplyCounts[thread.cid]) > 1 ?
                        ((thread.replyCount + pendingReplyCounts[thread.cid]) + " replies")
                        : null
                        }</span>
                        <Link key={`rl2-${index}`} to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="button-mobile" >View Thread</Link>
                      </div>
                    </div>
                    {displayedReplies?.map((reply, index) => {
                      const replyMediaInfo = getCommentMediaInfo(reply);
                      const shortParentCid = findShortParentCid(reply.parentCid, selectedFeed);
                      return (
                      <div key={`mob-rc-${index}`} className="reply-container">
                        <div key={`mob-pr-${index}`} className="post-reply post-reply-mobile">
                          <div key={`mob-pi-${index}`} className="post-info-mobile">
                            <button key={`pmbm-${index}`} className="post-menu-button-mobile" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>...</button>
                            <span key={`mob-nb-${index}`} className="name-block-mobile">
                              {reply.author.displayName
                              ? reply.author.displayName.length > 20
                              ? <Fragment key={`fragment13-${index}`}>
                                  <span key={`mob-n-${index}`} className="name-mobile"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={reply.author.displayName}
                                  data-tooltip-place="top">
                                    {reply.author.displayName.slice(0, 20) + " (...)"}
                                  </span>
                                </Fragment>
                                : <span key={`mob-n-${index}`} className="name-mobile">
                                  {reply.author.displayName}</span>
                              : <span key={`mob-n-${index}`} className="name-mobile">
                                Anonymous</span>}
                              &nbsp;
                              <span key={`mob-pa-${index}`} className="poster-address-mobile address-mobile"
                                id="reply-button" style={{cursor: "pointer"}}
                                onClick={() => handleAddressClick(reply.author.shortAddress)}
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
                                )&nbsp;
                              </span>
                              <br key={`mob-br-${index}`} />
                            </span>
                            <span key={`p-t-mob-span-${index}`} className="date-time-mobile highlight-address-mobile">
                            &nbsp;p/
                              <Link key={`p-t-${index}`} to={`/p/${thread.subplebbitAddress}`} id="reply-button" title="Visit this board">
                                {thread.subplebbitAddress.includes(".eth") ? 
                                (thread.subplebbitAddress) : 
                                (
                                  <span key={`short-add${index}`}
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content={thread.subplebbitAddress}
                                    data-tooltip-place="top"
                                    >{thread.subplebbitAddress.slice(0, 10) + "(...)"}
                                  </span>
                                )}
                              </Link>
                              <OfflineIndicator key={`offline-indicator-${index}`}
                              address={thread.subplebbitAddress}
                              tooltipPlace="top"
                              className="offline-mobile-sub-reply"  />
                            </span>
                            <span key={`mob-dt-${index}`} className="date-time-mobile post-number-mobile">
                            {getDate(reply.timestamp)}&nbsp;
                              <span key={`mob-pl1-${index}`}>c/</span>
                              {reply.shortCid ? (
                                <Link to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`} id="reply-button" key={`mob-pl2-${index}`} 
                                  onClick={(e) => {
                                    if (e.button === 2) return;
                                    e.preventDefault();
                                    setIsReplyOpen(true); 
                                    setSelectedShortCid(reply.shortCid); 
                                    setSelectedParentCid(reply.cid);
                                    setSelectedAddress(thread.subplebbitAddress);
                                  }} title="Reply to this post">{reply.shortCid}
                                </Link>
                              ) : (
                                <span key="pending" style={{color: 'red', fontWeight: '700'}}>Pending</span> 
                              )}
                            </span>
                          </div>
                          {reply.link ? (
                            <div key={`mob-f-${index}`} className="file-mobile">
                                {replyMediaInfo?.url ? (
                                  replyMediaInfo.type === "webpage" ? (
                                    <div key={`enlarge-mob-reply-${index}`} className="img-container">
                                      <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                        {reply.thumbnailUrl ? (
                                          <img key={`mob-img-${index}`} 
                                          src={replyMediaInfo.thumbnail} alt="thumbnail" 
                                          onClick={handleImageClick}
                                          style={{cursor: "pointer"}}
                                          onError={(e) => e.target.src = fallbackImgUrl} />
                                        ) : null}
                                        <div key={`mob-fi-${index}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                      </span>
                                    </div>
                                  ) : replyMediaInfo.type === "image" ? (
                                    <div key={`enlarge-mob-reply-${index}`} className="img-container">
                                      <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                        <img key={`mob-img-${index}`} 
                                        src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                        onClick={handleImageClick}
                                        style={{cursor: "pointer"}}
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                        <div key={`mob-fi-${index}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                      </span>
                                    </div>
                                  ) : replyMediaInfo.type === "video" ? (
                                      <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                          <video key={`fti-${index}`} 
                                          src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                          style={{ pointerEvents: "none" }}
                                          onError={(e) => e.target.src = fallbackImgUrl} />
                                        <div key={`mob-fi-${index}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                      </span>
                                  ) : replyMediaInfo.type === "audio" ? (
                                      <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile">
                                        <audio key={`mob-img-${index}`} 
                                        src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                        <div key={`mob-fi-${index}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                      </span>
                                  ) : null
                                ) : null}
                            </div>
                          ) : null}
                          {reply.content ? (
                            reply.content?.length > 500 ?
                            <Fragment key={`fragment15-${index}`}>
                              <blockquote key={`mob-pm-${index}`} className="post-message">
                                <Link to={() => {}} key={`mob-r-pm-${index}`} className="quotelink" 
                                ref={el => {
                                  quoteRefsMobile.current[reply.cid] = el;
                                }}
                                onClick={(event) => handleQuoteClick(reply, shortParentCid, event)}
                                onMouseOver={(event) => {
                                  event.stopPropagation();
                                  handleQuoteHover(reply, shortParentCid, () => {
                                    setOutOfViewCid(reply.parentCid);
                                    const rect = quoteRefsMobile.current[reply.cid].getBoundingClientRect();
                                    const distanceToRight = window.innerWidth - rect.right;
                                    const distanceToTop = rect.top;
                                    const distanceToBottom = window.innerHeight - rect.bottom;
                                    let top;

                                    if (distanceToTop < postOnHoverHeight / 2) {
                                      top = window.scrollY - 5;
                                    } else if (distanceToBottom < postOnHoverHeight / 2) {
                                      top = window.scrollY - postOnHoverHeight + window.innerHeight - 10;
                                    } else {
                                      top = rect.top + window.scrollY - postOnHoverHeight / 2;
                                    }
                                  
                                    if (distanceToRight < 200) {
                                      setOutOfViewPosition({
                                        top,
                                        right: window.innerWidth - rect.left - 10,
                                        maxWidth: rect.left - 5
                                      });
                                    } else {
                                      setOutOfViewPosition({
                                        top,
                                        left: rect.left + rect.width + 5,
                                        maxWidth: window.innerWidth - rect.left - rect.width - 5
                                      });
                                    }
                                  });
                                }}
                                onMouseLeave={() => {
                                  removeHighlight();
                                  setOutOfViewCid(null);
                                }}>
                                  {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                                </Link>
                                <Post content={reply.content?.slice(0, 500)} key={`post-mobile-${index}`} comment={reply} />
                                <span key={`mob-ttl-s-${index}`} className="ttl"> (...)
                                <br key={`mob-ttl-s-br1-${index}`} />
                                <EditLabel key={`edit-label-reply-mob-${index}`} 
                                commentCid={reply.cid}
                                className="ttl"/>
                                <StateLabel key={`state-label-reply-mob-${index}`}
                                commentIndex={reply.index}
                                className="ttl ellipsis"/>
                                <br key={`mob-ttl-s-br2${reply.cid}`} />
                                Comment too long.&nbsp;
                                  <Link key={`mob-ttl-l-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">Click here</Link>
                                &nbsp;to view. </span>
                              </blockquote>
                            </Fragment>
                          : <blockquote key={`mob-pm-${index}`} className="post-message">
                              <Link to={() => {}} key={`mob-r-pm-${index}`} className="quotelink" 
                              ref={el => {
                                quoteRefsMobile.current[reply.cid] = el;
                              }}
                              onClick={(event) => handleQuoteClick(reply, shortParentCid, event)}
                              onMouseOver={(event) => {
                                event.stopPropagation();
                                handleQuoteHover(reply, shortParentCid, () => {
                                  setOutOfViewCid(reply.parentCid);
                                  const rect = quoteRefsMobile.current[reply.cid].getBoundingClientRect();
                                  const distanceToRight = window.innerWidth - rect.right;
                                  const distanceToTop = rect.top;
                                  const distanceToBottom = window.innerHeight - rect.bottom;
                                  let top;

                                  if (distanceToTop < postOnHoverHeight / 2) {
                                    top = window.scrollY - 5;
                                  } else if (distanceToBottom < postOnHoverHeight / 2) {
                                    top = window.scrollY - postOnHoverHeight + window.innerHeight - 10;
                                  } else {
                                    top = rect.top + window.scrollY - postOnHoverHeight / 2;
                                  }
                                
                                  if (distanceToRight < 200) {
                                    setOutOfViewPosition({
                                      top,
                                      right: window.innerWidth - rect.left - 10,
                                      maxWidth: rect.left - 5
                                    });
                                  } else {
                                    setOutOfViewPosition({
                                      top,
                                      left: rect.left + rect.width + 5,
                                      maxWidth: window.innerWidth - rect.left - rect.width - 5
                                    });
                                  }
                                });
                              }}
                              onMouseLeave={() => {
                                removeHighlight();
                                setOutOfViewCid(null);
                              }}>
                                {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                              </Link>
                              <Post content={reply.content} key={`post-mobile-${index}`} comment={reply} />
                              <EditLabel key={`edit-label-reply-mob-${index}`} 
                              commentCid={reply.cid}
                              className="ttl"/>
                              <StateLabel key={`state-label-reply-mob-${index}`}
                              commentIndex={reply.index}
                              className="ttl ellipsis"/>
                            </blockquote>)
                          : null}
                            {reply.replyCount > 0 ? (
                              <div key={`back-mob-${index}`} className='backlink backlink-mobile'>
                              {reply.replies?.pages?.topAll.comments
                              .sort((a, b) => a.timestamp - b.timestamp)
                              .map((reply, index) => (
                                <div key={`div-back${index}`} style={{display: 'inline-block'}} 
                                ref={el => {
                                  backlinkRefsMobile.current[reply.cid] = el;
                                }}>
                                <Link key={`ql-${index}`} to={() => {}}
                                onClick={(event) => handleQuoteClick(reply, reply.shortCid, event)}
                                onMouseOver={(event) => {
                                  event.stopPropagation();
                                  handleQuoteHover(reply, reply.shortCid, () => {
                                    setOutOfViewCid(reply.cid)
                                    const rect = backlinkRefsMobile.current[reply.cid].getBoundingClientRect();
                                    const distanceToRight = window.innerWidth - rect.right;
                                    const distanceToTop = rect.top;
                                    const distanceToBottom = window.innerHeight - rect.bottom;
                                    let top;

                                    if (distanceToTop < postOnHoverHeight / 2) {
                                      top = window.scrollY - 5;
                                    } else if (distanceToBottom < postOnHoverHeight / 2) {
                                      top = window.scrollY - postOnHoverHeight + window.innerHeight - 10;
                                    } else {
                                      top = rect.top + window.scrollY - postOnHoverHeight / 2;
                                    }
                                  
                                    if (distanceToRight < 200) {
                                      setOutOfViewPosition({
                                        top,
                                        right: window.innerWidth - rect.left - 10,
                                        maxWidth: rect.left - 5
                                      });
                                    } else {
                                      setOutOfViewPosition({
                                        top,
                                        left: rect.left + rect.width + 5,
                                        maxWidth: window.innerWidth - rect.left - rect.width - 5
                                      });
                                    }
                                  });
                                }}
                                onMouseLeave={() => {
                                  removeHighlight();
                                  setOutOfViewCid(null);
                                }} 
                                className="quote-link">
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
                  );
                }}
                endReached={tryLoadMore}
                useWindowScroll={true}
                components={{ Footer: hasMore ? () => <PostLoader /> : null }}
              />
            )}
          </div>
          {outOfViewCid && outOfViewPosition && createPortal(
            <div
              ref={postOnHoverRef}
              style={{
                display: "block",
                position: "absolute",
                top: outOfViewPosition.top,
                right: outOfViewPosition.right,
                left: outOfViewPosition.left,
                maxWidth: outOfViewPosition.maxWidth,
              }}
            >
              <PostOnHover
                cid={outOfViewCid}
                feed={feed}
              />
            </div>
          , document.body)}
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
                <Link to="" onClick={() => {}}>Subscriptions</Link>
              ]&nbsp;[
            </span>
            {defaultSubplebbits.map((subplebbit, index) => (
              <span className="boardList" key={`span-${subplebbit.address}`}>
                {index === 0 ? null : "\u00a0"}
                <Link to={`/p/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => handleClickTitle(subplebbit.title, subplebbit.address)}
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
                <Link to={`/p/subscriptions/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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

export default Subscriptions;