import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip } from 'react-tooltip';
import { Virtuoso } from 'react-virtuoso';
import { useAccount, useAccountComments, useFeed, usePublishComment, usePublishCommentEdit, useSubplebbit, useSubscribe } from '@plebbit/plebbit-react-hooks';
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils'
import { debounce } from 'lodash';
import { Container, NavBar, Header, Break, PostFormLink, PostFormTable, PostForm, TopBar, BoardForm, PostMenu } from '../styled/views/Board.styled';
import { Footer } from '../styled/views/Thread.styled';
import { AlertModal } from '../styled/modals/AlertModal.styled';
import { PostMenuCatalog } from '../styled/views/Catalog.styled';
import EditModal from '../modals/EditModal';
import EditLabel from '../EditLabel';
import ImageBanner from '../ImageBanner';
import AdminListModal from '../modals/AdminListModal';
import ModerationModal from '../modals/ModerationModal';
import BoardSettings from '../BoardSettings';
import OfflineIndicator from '../OfflineIndicator';
import PendingLabel from '../PendingLabel';
import Post from '../Post';
import PostLoader from '../PostLoader';
import PostOnHover from '../PostOnHover';
import StateLabel from '../StateLabel';
import VerifiedAuthor from '../VerifiedAuthor';
import CreateBoardModal from '../modals/CreateBoardModal';
import ReplyModal from '../modals/ReplyModal';
import SettingsModal from '../modals/SettingsModal';
import findShortParentCid from '../../utils/findShortParentCid';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getDate from '../../utils/getDate';
import getFormattedTime from '../../utils/getFormattedTime';
import handleAddressClick from '../../utils/handleAddressClick';
import handleImageClick from '../../utils/handleImageClick';
import handleQuoteClick from '../../utils/handleQuoteClick';
import handleQuoteHover from '../../utils/handleQuoteHover';
import handleStyleChange from '../../utils/handleStyleChange';
import removeHighlight from '../../utils/removeHighlight';
import useAnonModeRef from '../../hooks/useAnonModeRef';
import useClickForm from '../../hooks/useClickForm';
import useError from '../../hooks/useError';
import useStateString from '../../hooks/useStateString';
import useSuccess from '../../hooks/useSuccess';
import useAnonModeStore from '../../hooks/stores/useAnonModeStore';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import packageJson from '../../../package.json';
const {version} = packageJson;
let lastVirtuosoStates = {};


const Board = () => {
  const {
    setCaptchaResponse,
    setChallengesArray,
    defaultSubplebbits,
    editedComment,
    feedCacheStates,
    setFeedCacheState,
    setIsAuthorDelete,
    setIsAuthorEdit,
    setIsCaptchaOpen,
    isModerationOpen, setIsModerationOpen,
    isSettingsOpen, setIsSettingsOpen,
    setModeratingCommentCid,
    setPendingComment,
    setPendingCommentIndex,
    setReplyQuoteCid,
    setResolveCaptchaPromise,
    selectedAddress, setSelectedAddress,
    setSelectedParentCid,
    setSelectedShortCid,
    selectedStyle,
    setSelectedThread,
    setSelectedText,
    setSelectedTitle,
    showPostForm,
    showPostFormLink,
    setTriggerInsertion,
  } = useGeneralStore(state => state);

  const { anonymousMode } = useAnonModeStore();

  // temporary hardcode
  const plebtokenRules = [
    "This community is strictly SFW. Any NSFW language or content will be removed.",
    <span>Only post about the plebbit token ($PLEB). For general cryptocurrency discussion, go to <Link className='quotelink' to="/p/business-and-finance.eth">p/business-and-finance.eth</Link>.</span>,
    "FUD is allowed unless blatantly meaningless and spammy."
  ]
  
  const account = useAccount();
  const navigate = useNavigate();
  const { subplebbitAddress } = useParams();
  
  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  const nameRef = useRef();
  const subjectRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();
  const threadMenuRefs = useRef({});
  const replyMenuRefs = useRef({});
  const postMenuCatalogRef = useRef(null);
  const backlinkRefs = useRef({});
  const quoteRefs = useRef({});
  const postRefs = useRef({});
  const backlinkRefsMobile = useRef({});
  const quoteRefsMobile = useRef({});
  const postOnHoverRef = useRef(null);
  const selectedThreadCidRef = useRef(null);
  const virtuosoRef = useRef();

  const { feed, loadMore } = useFeed({subplebbitAddresses: [`${selectedAddress}`], sortType: 'active'});
  const subplebbit = useSubplebbit({subplebbitAddress: selectedAddress});
  const { subscribed, subscribe, unsubscribe } = useSubscribe({subplebbitAddress: selectedAddress});
  const stateString = useStateString(subplebbit);

  const [isAdminListOpen, setIsAdminListOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [originalCommentContent, setOriginalCommentContent] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [triggerPublishComment, setTriggerPublishComment] = useState(false);
  const [triggerPublishCommentEdit, setTriggerPublishCommentEdit] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(feed);
  const [deletePost, setDeletePost] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isClientRedirectMenuOpen, setIsClientRedirectMenuOpen] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [commentCid, setCommentCid] = useState(null);
  const [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
  const [openMenuCid, setOpenMenuCid] = useState(null);
  const [outOfViewCid, setOutOfViewCid] = useState(null);
  const [outOfViewPosition, setOutOfViewPosition] = useState({top: 0, left: 0});
  const [postOnHoverHeight, setPostOnHoverHeight] = useState(0);
  const [executeAnonMode, setExecuteAnonMode] = useState(false);
  const [cidTracker, setCidTracker] = useState({});
  const [isThreadThumbnailClicked, setIsThreadThumbnailClicked] = useState({});
  const [isReplyThumbnailClicked, setIsReplyThumbnailClicked] = useState({});
  const [isMobileThreadThumbnailClicked, setIsMobileThreadThumbnailClicked] = useState({});
  const [isMobileReplyThumbnailClicked, setIsMobileReplyThumbnailClicked] = useState({});
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  const setSelectedThreadCid = (cid) => { selectedThreadCidRef.current = cid };
  const isFeedCached = feedCacheStates[selectedAddress];

  useAnonModeRef(selectedThreadCidRef, anonymousMode && executeAnonMode);


  useEffect(() => {
    if (feed) {
      setFeedCacheState(selectedAddress, true);
    }
  }, [selectedAddress, setFeedCacheState, feed]);


  useEffect(() => {
    if (subplebbit?.roles !== undefined) { 
      const role = subplebbit?.roles[account?.author.address]?.role;
  
      if (role === 'moderator' || role === 'admin' || role === 'owner') {
        setIsModerator(true);
      } else {
        setIsModerator(false);
      }
    }
  }, [account?.author.address, subplebbit?.roles]);


  const handleThumbnailClick = (index, type) => {
    switch(type) {
      case 'thread':
        setIsThreadThumbnailClicked(prevState => ({
          ...prevState,
          [index]: !prevState[index],
        }));
        break;
      case 'reply':
        setIsReplyThumbnailClicked(prevState => ({
          ...prevState,
          [index]: !prevState[index],
        }));
        break;
      case 'mobileThread':
        setIsMobileThreadThumbnailClicked(prevState => ({
          ...prevState,
          [index]: !prevState[index],
        }));
        break;
      case 'mobileReply':
        setIsMobileReplyThumbnailClicked(prevState => ({
          ...prevState,
          [index]: !prevState[index],
        }));
        break;
      default:
        break;
    }
  };
  

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


  useEffect(() => {
    if (postOnHoverRef.current) {
      const rect = postOnHoverRef.current.getBoundingClientRect();
      setPostOnHoverHeight(rect.height);
    }
  }, [outOfViewCid]);
  

  const errorString = useMemo(() => {
    if (subplebbit?.state === 'failed') {
      let errorString = 'Failed fetching board "' + selectedAddress + '".';
      if (subplebbit.error) {
        errorString += `: ${subplebbit.error.toString().slice(0, 300)}`
      }
      return errorString
    }
  }, [subplebbit?.state, subplebbit?.error, selectedAddress])


  useEffect(() => {
    if (errorString) {
      setNewErrorMessage(errorString);
    }
  }, [errorString, setNewErrorMessage]);


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

  const allReplies = useMemo(() => {
    return selectedFeed.flatMap(thread => filteredRepliesByThread[thread.cid]?.displayedReplies || []);
  }, [selectedFeed, filteredRepliesByThread]);

  // let post.jsx access full cid of user-typed short cid
  useEffect(() => {
    const newCidTracker = {};
    allReplies.forEach((reply) => {
      newCidTracker[reply.shortCid] = reply.cid;
    });
    setCidTracker(newCidTracker);
  }, [allReplies]);
  

  useEffect(() => {
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
    if (subplebbitAddress) {
      setSelectedAddress(subplebbitAddress);
    } else if (subplebbit?.address) {
      setSelectedAddress(subplebbit.address)
    }
    if (selectedSubplebbit) {
      setSelectedTitle(selectedSubplebbit.title);
    } else if (subplebbit?.title) {
      setSelectedTitle(subplebbit.title);
    }
  }, [subplebbitAddress, setSelectedAddress, setSelectedTitle, defaultSubplebbits, subplebbit?.address, subplebbit?.title]);
  
  // sets useFeed to address from URL
  useEffect(() => {
    setSelectedFeed(feed);
  }, [feed]);

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
  

  const tryLoadMore = async () => {
    try {
      await loadMore();
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };


  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      if (challengeVerification.publication?.cid !== undefined) {
        navigate(`/p/${subplebbitAddress}/c/${challengeVerification.publication?.cid}`);
        console.log('challenge success');
      } else {
        setNewSuccessMessage('Challenge Success');
      }
    }
    else if (challengeVerification.challengeSuccess === false) {
      setNewErrorMessage(`Challenge Failed, reason: ${challengeVerification.reason}. Errors: ${challengeVerification.errors}`);
      console.log('challenge failed', challengeVerification);
    }
  };


  const onChallenge = async (challenges, comment) => {
    setPendingComment(comment);
    let challengeAnswers = [];
    
    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges)
    }
    catch (error) {
      setNewErrorMessage(error.message); console.log(error);
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
      setNewErrorMessage(error.message); console.log(error);
    },
  });
  

  const { publishComment, index } = usePublishComment(publishCommentOptions);

  useEffect(() => {
    if (index !== undefined) {
      setPendingCommentIndex(index);
      navigate(`/profile/c/${index}`);
    }
  }, [index, navigate, setPendingCommentIndex]);

  
  const resetFields = useCallback(() => {
    if (nameRef.current) {
      nameRef.current.value = '';
    }
    if (subjectRef.current) {
      subjectRef.current.value = '';
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
    
    if (subjectRef.current.value === "") {
      setNewErrorMessage('Subject field is mandatory');
      return;
    }

    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      author: {
        displayName: nameRef.current.value || undefined,
        ...(anonymousMode ? {} : {address: account?.author.address}),
      },
      title: subjectRef.current.value || undefined,
      content: commentRef.current.value || undefined,
      link: linkRef.current.value || undefined,
    }));

    setTriggerPublishComment(true);
  };


  const updateSigner = useCallback(async () => {
    if (anonymousMode) {
      setExecuteAnonMode(true);
  
      let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};
      let signer;
  
      if (!storedSigners[selectedThreadCidRef]) {
        signer = await account?.plebbit.createSigner();
        storedSigners[selectedThreadCidRef] = { privateKey: signer?.privateKey, address: signer?.address };
        localStorage.setItem('storedSigners', JSON.stringify(storedSigners));
      } else {
        const signerPrivateKey = storedSigners[selectedThreadCidRef].privateKey;
          
        try {
          signer = await account?.plebbit.createSigner({type: 'ed25519', privateKey: signerPrivateKey});
        } catch (error) {
          console.log(error);
        }
      }
        
      setPublishCommentOptions(prevPublishCommentOptions => {
        const newPublishCommentOptions = {
          ...prevPublishCommentOptions,
          signer,
          author: {
            ...prevPublishCommentOptions.author,
            address: signer?.address,
          },
        };
  
        if (JSON.stringify(prevPublishCommentOptions) !== JSON.stringify(newPublishCommentOptions)) {
          return newPublishCommentOptions;
        }
  
        return prevPublishCommentOptions;
      });
    }
  }, [selectedThreadCidRef, anonymousMode, account]);
  
  useEffect(() => {
    if (anonymousMode) {
      updateSigner();
    }
  }, [updateSigner, anonymousMode]);
  


  useEffect(() => {
    if (publishCommentOptions && triggerPublishComment) {
      (async () => {
        await publishComment();
        resetFields();
      })();
      setTriggerPublishComment(false);
      setExecuteAnonMode(false);
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
        reject(setNewErrorMessage('Could not load challenges'));
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
      setNewErrorMessage(error.message); console.log(error);
    },
  });
  

  const { publishCommentEdit } = usePublishCommentEdit(publishCommentEditOptions);


  const handleAuthorDeleteClick = (comment) => {
    handleOptionClick(comment.cid);

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal selectedStyle={selectedStyle}>
            <div className='author-delete-alert'>
              <p>Are you sure you want to delete this post?</p>
              <div className="author-delete-buttons">
                <button onClick={onClose}>No</button>
                <button
                  onClick={() => {
                    setIsAuthorDelete(true);
                    setIsAuthorEdit(false);
                    setPublishCommentEditOptions(prevOptions => ({
                      ...prevOptions,
                      commentCid: comment.cid,
                      subplebbitAddress: comment.subplebbitAddress,
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
          </AlertModal>
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
    let isActive = true;
    if (publishCommentEditOptions && triggerPublishCommentEdit) {
      (async () => {
        await publishCommentEdit();
        if (isActive) {
          setTriggerPublishCommentEdit(false);
        }
      })();
    }

    return () => {
      isActive = false;
    };
  }, [triggerPublishCommentEdit, publishCommentEdit, publishCommentEditOptions]);

  
  // desktop navbar board select functionality
  const handleClickTitle = (title, address) => {
    setSelectedTitle(title);
    setSelectedAddress(address);
    setSelectedFeed(feed.filter(feed => feed.title === title));

    if (subplebbitAddress === address) {
      window.location.reload();
    }
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

    const selectedTitle = defaultSubplebbits.find((subplebbit) => subplebbit.address === selected).title;
    setSelectedTitle(selectedTitle);
    setSelectedAddress(selected);
    navigate(`/p/${selected}`);
  };

  
  const handleSubscribe = async () => {
    try {
      if (subscribed === false) {
        await subscribe(selectedAddress);
      } else if (subscribed === true) {
        await unsubscribe(selectedAddress);
      }
    } catch (error) {
      setNewErrorMessage(error.message); console.log(error);
    }
  };


  useEffect(() => {
    const setLastVirtuosoState = () => {
      virtuosoRef.current?.getState((snapshot) => {
        if (snapshot?.scrollTop === 0 || snapshot?.ranges?.length) {
          lastVirtuosoStates[selectedAddress] = snapshot;
        }
      });
    };
    window.addEventListener('scroll', setLastVirtuosoState);

    return () => window.removeEventListener('scroll', setLastVirtuosoState);
  }, [selectedAddress]);
  

  const lastVirtuosoState = lastVirtuosoStates[selectedAddress];


  return (
    <>
      <Helmet>
        <title>{((subplebbit.title ? subplebbit.title : subplebbit.address) + " - plebchan")}</title>
      </Helmet>
      <Container>
        <AdminListModal
        selectedStyle={selectedStyle}
        isOpen={isAdminListOpen}
        closeModal={() => setIsAdminListOpen(false)}
        roles={subplebbit?.roles} />
        <CreateBoardModal
        selectedStyle={selectedStyle}
        isOpen={isCreateBoardOpen}
        closeModal={() => setIsCreateBoardOpen(false)} />
        <EditModal
        selectedStyle={selectedStyle}
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        originalCommentContent={originalCommentContent} />
        <ModerationModal 
        selectedStyle={selectedStyle}
        isOpen={isModerationOpen}
        closeModal={() => {setIsModerationOpen(false); setDeletePost(false)}}
        deletePost={deletePost} />
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
            <span className="boardList">
              [
                <Link to={`/p/all`} onClick={() => window.scrollTo(0, 0)}>All</Link>
                   / 
                <Link to={`/p/subscriptions`} onClick={() => window.scrollTo(0, 0)}>Subscriptions</Link>
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
              () => {
                window.electron && window.electron.isElectron ? (
                  setIsCreateBoardOpen(true)
                ) : (
                  alert(
                    'You can create a board with the desktop version of plebchan:\nhttps://github.com/plebbit/plebchan/releases/latest\n\nIf you are comfortable with the command line, use plebbit-cli:\nhttps://github.com/plebbit/plebbit-cli\n\n'
                  )
                )
              }
              }>Create Board</span>
              ]
              [
              <Link to={`/p/${selectedAddress}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
                    {!defaultSubplebbits.some(subplebbit => subplebbit.address === selectedAddress) && (
                      <option value={selectedAddress}>{selectedAddress}</option>
                    )}
                    {defaultSubplebbits.map(subplebbit => (
                        <option key={`option-${subplebbit.address}`} value={subplebbit.address}
                        >{subplebbit.title ? subplebbit.title : subplebbit.address}</option>
                      ))}
                  </select> 
                  <span id="button-span" style={{cursor: 'pointer'}} onClick={
                    () => {
                      window.electron && window.electron.isElectron ? (
                        setIsCreateBoardOpen(true)
                      ) : (
                        alert(
                          'You can create a board with the desktop version of plebchan:\nhttps://github.com/plebbit/plebchan/releases/latest\n\nIf you are comfortable with the command line, use plebbit-cli:\nhttps://github.com/plebbit/plebbit-cli\n\n'
                        )
                      )
                    }
                  }>Create Board</span>
                </div>
                <div className="page-jump">
                  <Link to={`/p/${selectedAddress}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
            <div className="board-title">{subplebbit.title ?? null}</div>
            <div className="board-address">p/{subplebbit.address}
              <OfflineIndicator 
              address={subplebbit.address} 
              className="offline"
              tooltipPlace="top" />
            </div>
          </>
        </Header>
        <Break selectedStyle={selectedStyle} />
        <PostForm selectedStyle={selectedStyle}>
        <PostFormLink id="post-form-link" showPostFormLink={showPostFormLink} selectedStyle={selectedStyle} >
          <div id="post-form-link-desktop">
            [
              <Link to={`/p/${subplebbitAddress}/post`} onClick={useClickForm()} style={{cursor: 'pointer'}}>Start a New Thread</Link>
            ]
          </div>
          <div id="post-form-link-mobile">
            <span className="btn-wrap">
              <Link to={`/p/${subplebbitAddress}/post`} onClick={useClickForm()} style={{cursor: 'pointer'}}>Start a New Thread</Link>
            </span>
          </div>
        </PostFormLink>
        <PostFormTable id="post-form" showPostForm={showPostForm} selectedStyle={selectedStyle} className="post-form">
          <tbody>
            <tr data-type="Name">
              <td id="td-name">Name</td>
              <td>
                {account && account?.author && account?.author.displayName ? (
                  <input name="name" type="text" tabIndex={1} value={account?.author?.displayName} ref={nameRef} disabled />
                ) : (
                  <input name="name" type="text" placeholder="Anonymous" tabIndex={1} ref={nameRef} />
                )}
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
            <Link to={`/p/${selectedAddress}/catalog`} onClick={()=> {window.scrollTo(0, 0)}}>Catalog</Link>
            ]
            {subplebbit.roles && subplebbit?.roles[account?.author?.address]?.role === "admin" ? (
              <BoardSettings subplebbit={subplebbit} />
            ) : null}
          </div>
          {subplebbit?.state === "succeeded" ? (
            <>
              <span className="subscribe-button-desktop">
                [
                <span id="subscribe" style={{cursor: 'pointer'}}>
                  <span onClick={() => handleSubscribe()}>
                    {subscribed ? "Unsubscribe" : "Subscribe"}
                  </span>
                </span>
                ]
              </span>
              <span className="subscribe-button-mobile">
                <span className="btn-wrap" onClick={() => handleSubscribe()}>
                {subscribed ? "Unsubscribe" : "Subscribe"}
                </span>
              </span>
            </>
          ) : (
            <div id="stats" style={{float: "right", marginTop: "5px"}}>
              <span className={stateString ? "ellipsis" : ""}>{stateString}</span>
            </div>
          )}
          <div id="catalog-button-mobile">
            <span className="btn-wrap">
              <Link to={`/p/${selectedAddress}/catalog`} onClick={()=> {window.scrollTo(0, 0)}}>Catalog</Link>
            </span>
          </div>
        </TopBar>
        <Tooltip id="tooltip" className="tooltip" />
        <BoardForm selectedStyle={selectedStyle}>
          <div className="board">
            {subplebbit?.state === "failed" ? (
              null
            ) : (
              subplebbit?.state === "succeeded" ? (
                <>
                  {subplebbit.rules ? 
                    <>
                      <div className="thread">
                        <div className="op-container">
                          <div className="post op op-desktop">
                            <hr />
                            <div className="post-info">
                              <span className="name-block">
                                <span className="title">Rules</span>
                                &nbsp;
                                <span className="name capcode" 
                                style={{cursor: 'pointer'}}
                                onClick={() => {setIsAdminListOpen(!isAdminListOpen)}}
                                >## Board Admins</span>
                                &nbsp;
                                <span className="date-time"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(subplebbit.createdAt)}
                                  data-tooltip-place="top">{getDate(subplebbit.createdAt)}</span>
                                &nbsp;
                                <img src="assets/sticky.gif" alt="Sticky" title="Sticky" style={{marginBottom: "-1px",
                                  imageRendering: "pixelated",}} />
                                &nbsp;
                                <img src="assets/closed.gif" alt="Closed" title="Closed" style={{marginBottom: "-1px",
                                  imageRendering: "pixelated",}} />
                                <span>&nbsp;
                                    [
                                    <Link to={`/p/${selectedAddress}/rules`} style={{textDecoration: "none"}} className="reply-link">Reply</Link>
                                    ]
                                </span>
                                <PostMenu 
                                  title="Post menu"
                                  ref={el => { 
                                    threadMenuRefs.current["rules"] = el;
                                  }}
                                  className='post-menu-button' 
                                  rotated={openMenuCid === "rules"}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    const rect = threadMenuRefs.current["rules"].getBoundingClientRect();
                                    setMenuPosition({top: rect.top + window.scrollY, left: rect.left});
                                    setOpenMenuCid(prevCid => (prevCid === "rules" ? null : "rules"));
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
                                  <div className={`post-menu-thread post-menu-thread-${"rules"}`}
                                  style={{ display: openMenuCid === "rules" ? 'block' : 'none' }}
                                  >
                                    <ul className="post-menu-catalog">
                                      <li onClick={() => handleOptionClick("rules")}>Hide thread</li>
                                      {/* {isModerator ? (
                                        <>
                                          change rules
                                        </>
                                      ) : null} */}
                                    </ul>
                                  </div>
                                  </PostMenuCatalog>, document.body
                                )}
                              </span>
                              <blockquote>
                                <div className="custom-paragraph">
                                  {subplebbit.rules.map((rule, index) => (
                                    <React.Fragment key={index}>
                                      {index + 1}. {rule}
                                      <br />
                                    </React.Fragment>
                                  ))}
                                </div>
                              </blockquote>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="thread-mobile">
                        <hr style={{marginTop: "10px"}} />
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
                                  <img src="assets/sticky.gif" alt="Sticky" title="Sticky" style={{marginTop: "-1px", marginRight: "2px",
                                  imageRendering: "pixelated",}} />
                                  &nbsp;
                                  <img src="assets/closed.gif" alt="Closed" title="Closed" style={{marginTop: "-1px", marginRight: "2px",
                                  imageRendering: "pixelated",}} />
                                </span>
                                <br />
                                <span className="subject-mobile"
                              style={{marginBottom: "-15px"}}>Rules</span>
                                &nbsp;
                              </span>
                              <span className="date-time-mobile post-number-mobile"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(subplebbit.createdAt)}
                                  data-tooltip-place="top">{getDate(subplebbit.createdAt)}</span>
                              &nbsp;
                            </div>
                            <blockquote className="post-message-mobile">
                              <div className="custom-paragraph">
                                {subplebbit.rules.map((rule, index) => (
                                  <React.Fragment key={index}>
                                    {index + 1}. {rule}
                                    <br />
                                  </React.Fragment>
                                ))}
                              </div>
                            </blockquote>
                          </div>
                          <div className="post-link-mobile">
                            <Link to={`/p/${selectedAddress}/rules`} className="button-mobile">View Thread</Link>
                          </div>
                        </div>
                      </div>
                    </>
                  : subplebbit.address === "plebtoken.eth" ? (
                    <>
                      <div className="thread">
                        <div className="op-container">
                          <div className="post op op-desktop">
                            <hr />
                            <div className="post-info">
                              <span className="name-block">
                                <span className="title">Rules</span>
                                &nbsp;
                                <span className="name capcode" 
                                style={{cursor: 'pointer'}}
                                onClick={() => {setIsAdminListOpen(!isAdminListOpen)}}
                                >## Board Admins</span>
                                &nbsp;
                                <span className="date-time"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(subplebbit.createdAt)}
                                  data-tooltip-place="top">{getDate(subplebbit.createdAt)}</span>
                                &nbsp;
                                <img src="assets/sticky.gif" alt="Sticky" title="Sticky" style={{marginBottom: "-1px",
                                  imageRendering: "pixelated",}} />
                                &nbsp;
                                <img src="assets/closed.gif" alt="Closed" title="Closed" style={{marginBottom: "-1px",
                                  imageRendering: "pixelated",}} />
                                <span>&nbsp;
                                    [
                                    <Link to={`/p/${selectedAddress}/rules`} style={{textDecoration: "none"}} className="reply-link">Reply</Link>
                                    ]
                                </span>
                                <PostMenu 
                                  title="Post menu"
                                  ref={el => { 
                                    threadMenuRefs.current["rules"] = el;
                                  }}
                                  className='post-menu-button' 
                                  rotated={openMenuCid === "rules"}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    const rect = threadMenuRefs.current["rules"].getBoundingClientRect();
                                    setMenuPosition({top: rect.top + window.scrollY, left: rect.left});
                                    setOpenMenuCid(prevCid => (prevCid === "rules" ? null : "rules"));
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
                                  <div className={`post-menu-thread post-menu-thread-${"rules"}`}
                                  style={{ display: openMenuCid === "rules" ? 'block' : 'none' }}
                                  >
                                    <ul className="post-menu-catalog">
                                      <li onClick={() => handleOptionClick("rules")}>Hide thread</li>
                                      {/* {isModerator ? (
                                        <>
                                          change rules
                                        </>
                                      ) : null} */}
                                    </ul>
                                  </div>
                                  </PostMenuCatalog>, document.body
                                )}
                              </span>
                              <blockquote>
                                <div className="custom-paragraph">
                                  {plebtokenRules.map((rule, index) => (
                                    <React.Fragment key={index}>
                                      {index + 1}. {rule}
                                      <br />
                                    </React.Fragment>
                                  ))}
                                </div>
                              </blockquote>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="thread-mobile">
                        <hr style={{marginTop: "10px"}} />
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
                                  <img src="assets/sticky.gif" alt="Sticky" title="Sticky" style={{marginTop: "-1px", marginRight: "2px",
                                  imageRendering: "pixelated",}} />
                                  &nbsp;
                                  <img src="assets/closed.gif" alt="Closed" title="Closed" style={{marginTop: "-1px", marginRight: "2px",
                                  imageRendering: "pixelated",}} />
                                </span>
                                <br />
                                <span className="subject-mobile"
                              style={{marginBottom: "-15px"}}>Rules</span>
                                &nbsp;
                              </span>
                              <span className="date-time-mobile post-number-mobile"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(subplebbit.createdAt)}
                                  data-tooltip-place="top">{getDate(subplebbit.createdAt)}</span>
                              &nbsp;
                            </div>
                            <blockquote className="post-message-mobile">
                              <div className="custom-paragraph">
                                {plebtokenRules.map((rule, index) => (
                                  <React.Fragment key={index}>
                                    {index + 1}. {rule}
                                    <br />
                                  </React.Fragment>
                                ))}
                              </div>
                            </blockquote>
                          </div>
                          <div className="post-link-mobile">
                            <Link to={`/p/${selectedAddress}/rules`} className="button-mobile">View Thread</Link>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {subplebbit.description ?
                    <>
                      <div className="thread">
                        <div className="op-container">
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
                                <span className="date-time"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(subplebbit.createdAt)}
                                  data-tooltip-place="top">{getDate(subplebbit.createdAt)}</span>
                                &nbsp;
                                <img src="assets/sticky.gif" alt="Sticky" title="Sticky" style={{marginBottom: "-1px",
                                  imageRendering: "pixelated",}} />
                                &nbsp;
                                <img src="assets/closed.gif" alt="Closed" title="Closed" style={{marginBottom: "-1px",
                                  imageRendering: "pixelated",}} />
                                <span>&nbsp;
                                    [
                                    <Link to={`/p/${selectedAddress}/description`} style={{textDecoration: "none"}} className="reply-link">Reply</Link>
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
                                  <Post content={subplebbit.description} />
                                </div>
                              </blockquote>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="thread-mobile">
                        {subplebbit.rules ?
                          <hr /> :
                          <hr style={{marginTop: "10px"}} />
                        }
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
                                  <img src="assets/sticky.gif" alt="Sticky" title="Sticky" style={{marginTop: "-1px", marginRight: "2px",
                                  imageRendering: "pixelated",}} />
                                  &nbsp;
                                  <img src="assets/closed.gif" alt="Closed" title="Closed" style={{marginTop: "-1px", marginRight: "2px",
                                  imageRendering: "pixelated",}} />
                                </span>
                                <br />
                                <span className="subject-mobile"
                              style={{marginBottom: "-15px"}}>Welcome to {subplebbit.title || subplebbit.address}</span>
                                &nbsp;
                              </span>
                              <span className="date-time-mobile post-number-mobile"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(subplebbit.createdAt)}
                                  data-tooltip-place="top">{getDate(subplebbit.createdAt)}</span>
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
                                <Post content={subplebbit.description} />
                              </div>
                            </blockquote>
                          </div>
                          <div className="post-link-mobile">
                            <Link to={`/p/${selectedAddress}/description`} className="button-mobile">View Thread</Link>
                          </div>
                        </div>
                      </div>
                    </>
                  : null}
                  <Virtuoso
                  increaseViewportBy={{bottom: 600, top: 600}}
                  data={selectedFeed}
                  itemContent={(index, thread) => {
                    const { displayedReplies, omittedCount } = filteredRepliesByThread[thread.cid] || {};
                    const commentMediaInfo = getCommentMediaInfo(thread);
                    const fallbackImgUrl = "assets/filedeleted-res.gif";
                    let displayWidth, displayHeight, displayWidthMobile, displayHeightMobile;
                    if (thread.linkWidth && thread.linkHeight) {
                        let scale = Math.min(1, 250 / Math.max(thread.linkWidth, thread.linkHeight));
                        displayWidth = `${thread.linkWidth * scale}px`;
                        displayHeight = `${thread.linkHeight * scale}px`;

                        scale = Math.min(1, 100 / Math.max(thread.linkWidth, thread.linkHeight));
                        displayWidthMobile = `${thread.linkWidth * scale}px`;
                        displayHeightMobile = `${thread.linkHeight * scale}px`;
                    } else {
                        displayWidth = '250px';
                        displayHeight = '250px';
                        displayWidthMobile = '100px';
                        displayHeightMobile = '100px';
                    }
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
                                    }</a>&nbsp;({commentMediaInfo?.type === "iframe" ? "video" : commentMediaInfo?.type})
                                    {isThreadThumbnailClicked[index] ? (
                                      <span>
                                        -[
                                          <span className='reply-link' 
                                          style={{textDecoration: 'underline', cursor: 'pointer'}}
                                          onClick={() => {handleThumbnailClick(index, 'thread')}}>Close</span>
                                        ]
                                      </span>
                                    ) : null}
                                  </div>
                                  {commentMediaInfo?.type === 'iframe' && (
                                    <div key={`enlarge-${index}`}
                                    className={`img-container ${isThreadThumbnailClicked[index] ? 'expanded-container' : ''}`}>
                                      <span key={`fta-${index}`} className="file-thumb" style={isThreadThumbnailClicked[index] ? {} : {width: displayWidth, height: displayHeight}}>
                                        {(isThreadThumbnailClicked[index] || !commentMediaInfo.thumbnail) && commentMediaInfo.embedUrl ? (
                                          <iframe 
                                            className='enlarged'
                                            key={`fti-${index}`} 
                                            src={commentMediaInfo.embedUrl}
                                            width={commentMediaInfo.thumbnail ? "560" : "250"} 
                                            height="315"
                                            style={{border: "none"}}
                                            title="Embedded content"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen />
                                        ) : (
                                          <img 
                                            key={`fti-${index}`}
                                            src={commentMediaInfo.thumbnail} 
                                            alt="thumbnail"
                                            onClick={() => {handleThumbnailClick(index, 'thread')}}
                                            style={{cursor: "pointer"}}
                                            onError={(e) => e.target.src = fallbackImgUrl} />
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {commentMediaInfo?.type === "webpage" ? (
                                    <div key={`enlarge-${index}`} className="img-container">
                                      <span key={`fta-${index}`} className="file-thumb" style={isThreadThumbnailClicked[index] || !thread.thumbnailUrl ? {} : {width: displayWidth, height: displayHeight}}>
                                        {thread.thumbnailUrl ? (
                                          <img key={`fti-${index}`} 
                                          src={commentMediaInfo.thumbnail} alt={commentMediaInfo.type}
                                          onClick={(e) => {handleImageClick(e); handleThumbnailClick(index, 'thread')}}
                                          style={{cursor: "pointer"}}
                                          onError={(e) => e.target.src = fallbackImgUrl} />
                                        ) : null}
                                      </span>
                                    </div>
                                  ) : null}
                                  {commentMediaInfo?.type === "image" ? (
                                    <div key={`enlarge-${index}`} className="img-container">
                                      <span key={`fta-${index}`} className="file-thumb" style={isThreadThumbnailClicked[index] ? {} : {width: displayWidth, height: displayHeight}}>
                                        <img key={`fti-${index}`} 
                                        src={commentMediaInfo.url} alt={commentMediaInfo.type}
                                        onClick={(e) => {handleImageClick(e); handleThumbnailClick(index, 'thread')}}
                                        style={{cursor: "pointer"}}
                                        onError={(e) => e.target.src = fallbackImgUrl} />
                                      </span>
                                    </div>
                                  ) : null}
                                  {commentMediaInfo?.type === "video" ? (
                                  <div key={`enlarge-${index}`} className={`img-container ${isThreadThumbnailClicked[index] ? 'expanded-container' : ''}`}>
                                    <span key={`fta-${index}`} className="file-thumb" style={isThreadThumbnailClicked[index] ? {} : {width: displayWidth, height: displayHeight}}>
                                      {isThreadThumbnailClicked[index] ? (
                                        <video 
                                          className='enlarged'
                                          key={`fti-${index}`} 
                                          src={commentMediaInfo.url} 
                                          controls
                                          style={{cursor: "pointer"}}
                                          onError={(e) => e.target.src = fallbackImgUrl} 
                                        />
                                      ) : (
                                        <video 
                                          key={`fti-${index}`}
                                          src={commentMediaInfo.url} 
                                          alt="thumbnail"
                                          onClick={() => {handleThumbnailClick(index, 'thread')}}
                                          style={{cursor: "pointer"}}
                                          onError={(e) => e.target.src = fallbackImgUrl} 
                                        />
                                      )}
                                    </span>
                                  </div>
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
                                    onClick={() => handleAddressClick(<VerifiedAuthor commentCid={thread.cid}>{({ shortAuthorAddress }) => (shortAuthorAddress)}</VerifiedAuthor>)}
                                  >
                                    <VerifiedAuthor commentCid={thread.cid}>{({ shortAuthorAddress }) => (shortAuthorAddress)}</VerifiedAuthor>
                                  </span>)
                                  &nbsp;
                                  <span key={`dt-${index}`} className="date-time"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(thread?.timestamp)}
                                  data-tooltip-place="top">
                                    {getDate(thread.timestamp)}
                                  </span>
                                  &nbsp;
                                  <span key={`pn-${index}`} className="post-number post-number-desktop">
                                    <span key={`pl1-${index}`}>c/</span>
                                    <Link to={`/p/${selectedAddress}/c/${thread.cid}`} id="reply-button" key={`pl2-${index}`} 
                                    onClick={(e) => {
                                      if (e.button === 2) return;
                                      e.preventDefault();
                                      setSelectedThreadCid(thread.cid);
                                      let text = document.getSelection().toString();
                                      text = text ? `>${text}` : text;
                                      setSelectedText(text);
                                      if (isReplyOpen) {
                                        setReplyQuoteCid(thread.shortCid);
                                        setTriggerInsertion(Date.now());
                                      } else {
                                        setIsReplyOpen(true); 
                                        setSelectedShortCid(thread.shortCid); 
                                        setSelectedParentCid(thread.cid);
                                      }
                                      }} title="Reply to this post">{thread.shortCid}</Link>
                                    &nbsp;
                                  {thread.pinned ? (
                                    <>
                                      &nbsp;
                                      <img src="assets/sticky.gif" alt="Sticky" title="Sticky"
                                      style={{marginBottom: "-1px",
                                      imageRendering: "pixelated",}} />
                                    </>
                                  ) : null}
                                  {thread.locked ? (
                                    <>
                                      &nbsp;
                                      <img src="assets/closed.gif" alt="Closed" title="Closed"
                                      style={{
                                        marginBottom: "-1px",
                                        imageRendering: "pixelated",
                                        }} />
                                    </>
                                  ) : null}
                                    <span key={`rl1-${index}`}>&nbsp;
                                      [
                                      <Link key={`rl2-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="reply-link" >Reply</Link>
                                      ]
                                    </span>
                                  </span>
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
                                        <VerifiedAuthor commentCid={thread.cid}>{({ authorAddress }) => (
                                          <>
                                            {authorAddress === account?.author.address || 
                                            authorAddress === account?.signer.address ? (
                                              <>
                                                <li onClick={() => handleAuthorEditClick(thread)}>Edit post</li>
                                                <li onClick={() => handleAuthorDeleteClick(thread)}>Delete post</li>
                                              </>
                                            ) : null}
                                            {isModerator ? (
                                              <>
                                                {authorAddress === account?.author.address ||
                                                authorAddress === account?.signer.address ? (
                                                  null
                                                ) : (
                                                  <li onClick={() => {
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
                                                  setModeratingCommentCid(thread.cid)
                                                  setIsModerationOpen(true); 
                                                  handleOptionClick(thread.cid);
                                                }}>
                                                  Mod tools
                                                </li>
                                              </>
                                            ) : null}
                                          </>
                                        )}</VerifiedAuthor>
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
                                        <li 
                                        onMouseOver={() => {setIsClientRedirectMenuOpen(true)}}
                                        onMouseLeave={() => {setIsClientRedirectMenuOpen(false)}}>
                                          View on »
                                          <ul className="dropdown-menu post-menu-catalog"
                                            style={{display: isClientRedirectMenuOpen ? 'block': 'none'}}>
                                            <li onClick={() => handleOptionClick(thread.cid)}>
                                              <a 
                                              href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}/c/${thread.cid}`}
                                              target="_blank" rel="noreferrer"
                                              >Plebbit</a>
                                            </li>
                                            {/* <li onClick={() => handleOptionClick(thread.cid)}>
                                              <a
                                              href={`https://seedit.eth.limo/#/p/${selectedAddress}/c/${thread.cid}`}
                                              target="_blank" rel="noreferrer"
                                              >Seedit</a>
                                            </li> */}
                                            <li onClick={() => handleOptionClick(thread.cid)}>
                                              <a
                                              href={`https://plebones.netlify.app/#/p/${selectedAddress}/c/${thread.cid}`}
                                              target="_blank" rel="noreferrer"
                                              >Plebones</a>
                                            </li>
                                          </ul>
                                        </li>
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
                                          to={() => {}}
                                          className="quote-link" 
                                          onClick={(event) => handleQuoteClick(reply, null, event)}
                                          onMouseOver={(event) => {
                                            event.stopPropagation();
                                            handleQuoteHover(reply, null, () => {
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
                                              setOutOfViewCid(reply.cid);
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
                              <>
                                {thread.content ? null : <br />}
                                <span key={`oc-${index}`} className="ttl">
                                  <span key={`oc1-${index}`}>
                                    {omittedCount} post{omittedCount > 1 ? "s" : ""} omitted. Click&nbsp;
                                    <Link key={`oc2-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)} className="ttl-link">here</Link>
                                    &nbsp;to view.
                                  </span>
                                </span>
                              </>
                            ) : null}
                          </span>
                          {displayedReplies?.map((reply, index) => {
                            const replyMediaInfo = getCommentMediaInfo(reply);
                            const fallbackImgUrl = "assets/filedeleted-res.gif";
                            const shortParentCid = findShortParentCid(reply.parentCid, selectedFeed);
                            let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};
                            let signerAddress;
                            if (storedSigners[reply.parentCid]) {
                              signerAddress = storedSigners[reply.parentCid].address;
                            }
                            let replyDisplayWidth, replyDisplayHeight;
                            if (reply.linkWidth && reply.linkHeight) {
                                const scale = Math.min(1, 125 / Math.max(reply.linkWidth, reply.linkHeight));
                                replyDisplayWidth = `${reply.linkWidth * scale}px`;
                                replyDisplayHeight = `${reply.linkHeight * scale}px`;
                            } else {
                                replyDisplayWidth = '125px';
                                replyDisplayHeight = '125px';
                            }
                            return (
                              <Fragment key={`fr-reply-${index}`}>
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
                                          onClick={() => handleAddressClick(<VerifiedAuthor commentCid={reply.cid}>{({ shortAuthorAddress }) => (shortAuthorAddress)}</VerifiedAuthor>)}
                                        >
                                          (u/
                                            {reply.author?.shortAddress ?
                                              (
                                                <span key={`mob-ha-${index}`}>
                                                  {reply.author?.shortAddress}
                                                </span>
                                              ) : (
                                                anonymousMode ? (
                                                  <span key={`mob-ha-${index}`}>
                                                    {signerAddress?.slice(8, 20)}
                                                  </span>
                                                ) : (
                                                  <span key={`mob-ha-${index}`}
                                                  >
                                                    {account?.author?.shortAddress}
                                                  </span>
                                                )
                                              )
                                            }
                                          )
                                        </span>
                                      </span>
                                      &nbsp;
                                      <span key={`dt-${index}`} className="date-time"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(reply.timestamp)}
                                  data-tooltip-place="top">{getDate(reply.timestamp)}</span>
                                      &nbsp;
                                      <span key={`pn-${index}`} className="post-number post-number-desktop">
                                        <span key={`pl1-${index}`}>c/</span>
                                        {reply.shortCid ? (
                                          <Link to={`/p/${selectedAddress}/c/${thread.cid}`} id="reply-button" key={`pl2-${index}`} 
                                          onClick={(e) => {
                                            if (e.button === 2) return;
                                            e.preventDefault();
                                            setSelectedThreadCid(thread.cid);
                                            let text = document.getSelection().toString();
                                            text = text ? `>${text}` : text;
                                            setSelectedText(text);
                                            if (isReplyOpen) {
                                              setReplyQuoteCid(reply.shortCid);
                                              setTriggerInsertion(Date.now());
                                            } else {
                                              setIsReplyOpen(true); 
                                              setSelectedShortCid(reply.shortCid); 
                                              setSelectedParentCid(reply.cid);
                                            }
                                          }} title="Reply to this post">{reply.shortCid}</Link>
                                        ) : (
                                          <PendingLabel key="pending" commentIndex={reply.index} />
                                        )}
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
                                          <VerifiedAuthor commentCid={reply.cid}>{({ authorAddress }) => (
                                            <>
                                              {authorAddress === account?.author.address ||
                                              authorAddress === account?.signer.address ? (
                                                <>
                                                  <li onClick={() => handleAuthorEditClick(reply)}>Edit post</li>
                                                  <li onClick={() => handleAuthorDeleteClick(reply)}>Delete post</li>
                                                </>
                                              ) : null}
                                              {isModerator ? (
                                                <>
                                                  {authorAddress === account?.author.address || 
                                                  authorAddress === account?.signer.address ? (
                                                    null
                                                  ) : (
                                                    <li onClick={() => {
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
                                                    setModeratingCommentCid(reply.cid)
                                                    setIsModerationOpen(true); 
                                                    handleOptionClick(reply.cid);
                                                  }}>
                                                    Mod tools
                                                  </li>
                                                </>
                                              ) : null}
                                            </>
                                          )}</VerifiedAuthor>
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
                                          <li 
                                          onMouseOver={() => {setIsClientRedirectMenuOpen(true)}}
                                          onMouseLeave={() => {setIsClientRedirectMenuOpen(false)}}>
                                            View on »
                                            <ul className="dropdown-menu post-menu-catalog"
                                              style={{display: isClientRedirectMenuOpen ? 'block': 'none'}}>
                                              <li onClick={() => handleOptionClick(reply.cid)}>
                                                <a 
                                                href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}/c/${reply.cid}`}
                                                target="_blank" rel="noreferrer"
                                                >Plebbit</a>
                                              </li>
                                              {/* <li onClick={() => handleOptionClick(reply.cid)}>
                                                <a
                                                href={`https://seedit.eth.limo/#/p/${selectedAddress}/c/${reply.cid}`}
                                                target="_blank" rel="noreferrer"
                                                >Seedit</a>
                                              </li> */}
                                              <li onClick={() => handleOptionClick(reply.cid)}>
                                                <a
                                                href={`https://plebones.netlify.app/#/p/${selectedAddress}/c/${reply.cid}`}
                                                target="_blank" rel="noreferrer"
                                                >Plebones</a>
                                              </li>
                                            </ul>
                                          </li>
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
                                          {replyMediaInfo?.type === "video" || "iframe" ? (
                                            isReplyThumbnailClicked[index] ? (
                                              <span>
                                                -[
                                                  <span className='reply-link' 
                                                  style={{textDecoration: 'underline', cursor: 'pointer'}}
                                                  onClick={() => {handleThumbnailClick(index, 'reply')}}>Close</span>
                                                ]
                                              </span>) 
                                            : null)
                                          : null}
                                        </div>
                                        {replyMediaInfo?.type === "webpage" ? (
                                          <div key={`enlarge-reply-${index}`} className="img-container">
                                            <span key={`fta-${index}`} className="file-thumb-reply" style={isReplyThumbnailClicked[index] || !reply.thumbnailUrl ? {} : {width: replyDisplayWidth, height: replyDisplayHeight}}>
                                              {reply.thumbnailUrl ? (
                                                <img key={`fti-${index}`}
                                                src={replyMediaInfo.thumbnail} alt={replyMediaInfo.type}
                                                onClick={(e) => {handleImageClick(e); handleThumbnailClick(index, 'reply')}}
                                                style={{cursor: "pointer"}}
                                                onError={(e) => e.target.src = fallbackImgUrl} />
                                              ) : null}
                                            </span>
                                          </div>
                                        ) : null}
                                        {replyMediaInfo?.type === "image" ? (
                                          <div key={`enlarge-reply-${index}`} className="img-container">
                                            <span key={`fta-${index}`} className="file-thumb-reply" style={isReplyThumbnailClicked[index] ? {} : {width: replyDisplayWidth, height: replyDisplayHeight}}>
                                              <img key={`fti-${index}`}
                                              src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                              onClick={(e) => {handleImageClick(e); handleThumbnailClick(index, 'reply')}}
                                              style={{cursor: "pointer"}}
                                              onError={(e) => e.target.src = fallbackImgUrl} />
                                            </span>
                                          </div>
                                        ) : null}
                                        {replyMediaInfo?.type === "video" ? (
                                          <div key={`enlarge-reply-${index}`} className={`img-container ${isReplyThumbnailClicked[index] ? 'expanded-container' : ''}`}>
                                          <span key={`fta-${index}`} className="file-thumb-reply" style={isReplyThumbnailClicked[index] ? {} : {width: replyDisplayWidth, height: replyDisplayHeight}}>
                                            {isReplyThumbnailClicked[index] ? (
                                              <video controls
                                                className='enlarged'
                                                key={`fti-${index}`} 
                                                src={replyMediaInfo.url} 
                                                alt={replyMediaInfo.type} 
                                                style={{cursor: "pointer"}}
                                                onError={(e) => e.target.src = fallbackImgUrl} 
                                              />
                                            ) : (
                                              <video
                                                key={`fti-${index}`} 
                                                src={replyMediaInfo.url}
                                                alt="thumbnail"
                                                onClick={() => {handleThumbnailClick(index, 'reply')}}
                                                style={{cursor: "pointer"}}
                                                onError={(e) => e.target.src = fallbackImgUrl} 
                                              />
                                            )}
                                          </span>
                                        </div>
                                        ) : null}
                                        {replyMediaInfo?.type === "audio" ? (
                                          <span key={`fta-${index}`} className="file-thumb-reply" style={isReplyThumbnailClicked[index] ? {} : {width: replyDisplayWidth, height: replyDisplayHeight}}>
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
                                          <Post key={`post-${index}`}
                                            content={reply.content?.slice(0, 500)}
                                            postQuoteRef={(quoteShortParentCid, ref) => {
                                              postRefs.current[quoteShortParentCid] = ref;
                                            }}
                                            postQuoteOnClick={(quoteShortParentCid) => {
                                              handleQuoteClick(reply, quoteShortParentCid, null)
                                            }}
                                            postQuoteOnOver={(quoteShortParentCid) => {
                                              const quoteParentCid = cidTracker[quoteShortParentCid];
                                              if (outOfViewCid !== quoteParentCid) {
                                                handleQuoteHover(reply, quoteShortParentCid, () => {
                                                  setOutOfViewCid(quoteParentCid);
              
                                                const rect = postRefs.current[quoteShortParentCid].getBoundingClientRect();
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
                                              })
                                            }}
                                          }
                                            postQuoteOnLeave={() => {
                                              removeHighlight();
                                              setOutOfViewCid(null);
                                            }}
                                          />
                                          <span key={`ttl-s-${index}`} className="ttl"> (...)
                                          <br key={`ttl-s-br1-${index}`} />
                                          <EditLabel key={`edit-label-reply-${index}`} 
                                          commentCid={reply.cid}
                                          className="ttl"/>
                                          <StateLabel key={`state-label-reply-${index}`}
                                          commentIndex={reply.index}
                                          className="ttl ellipsis"/>
                                          <br key={`ttl-s-br2${index}`} />
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
                                          onClick={() => handleQuoteClick(reply, shortParentCid, null)}
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
                                        <Post key={`post-${index}`}
                                          content={reply.content}
                                          postQuoteRef={(quoteShortParentCid, ref) => {
                                            postRefs.current[quoteShortParentCid] = ref;
                                          }}
                                          postQuoteOnClick={(quoteShortParentCid) => {
                                            handleQuoteClick(reply, quoteShortParentCid, null)
                                          }}
                                          postQuoteOnOver={(quoteShortParentCid) => {
                                            const quoteParentCid = cidTracker[quoteShortParentCid];
                                            if (outOfViewCid !== quoteParentCid) {
                                              handleQuoteHover(reply, quoteShortParentCid, () => {
                                                setOutOfViewCid(quoteParentCid);
            
                                              const rect = postRefs.current[quoteShortParentCid].getBoundingClientRect();
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
                                            })
                                          }}
                                        }
                                          postQuoteOnLeave={() => {
                                            removeHighlight();
                                            setOutOfViewCid(null);
                                          }}
                                        />
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
                              </Fragment>
                            )
                          })}
                        </div>
                        <div key={`mob-t-${index}`} className="thread-mobile">
                        {index === 0 && (!subplebbit.rules && !subplebbit.description) ? (
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
                                    onClick={() => handleAddressClick(<VerifiedAuthor commentCid={thread.cid}>{({ shortAuthorAddress }) => (shortAuthorAddress)}</VerifiedAuthor>)}
                                  >
                                    (u/
                                    <span key={`mob-ha-${index}`} className="highlight-address-mobile">
                                      {<VerifiedAuthor commentCid={thread.cid}>{({ shortAuthorAddress }) => (shortAuthorAddress)}</VerifiedAuthor>}
                                    </span>
                                    )&nbsp;
                                  </span>
                                  <span key={`ti-mob-${index}`} className="thread-icons-mobile" style={{float: "right", marginRight: "18px"}}>
                                    {thread.pinned ? (
                                      <img src="assets/sticky.gif" alt="Sticky" title="Sticky"
                                      style={{marginTop: "-1px", marginRight: "2px",
                                      imageRendering: "pixelated",}} />
                                    ) : null}
                                    {thread.locked ? (
                                      <img src="assets/closed.gif" alt="Closed" title="Closed"
                                      style={{marginTop: "-1px", marginRight: "2px",
                                      imageRendering: "pixelated",}} />
                                    ) : null}
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
                                <span key={`mob-dt-${index}`} className="date-time-mobile post-number-mobile"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(thread.timestamp)}
                                  data-tooltip-place="top">
                                  {getDate(thread.timestamp)}
                                  &nbsp;
                                  <span key={`mob-no-${index}`}>c/</span>
                                  <Link to={`/p/${selectedAddress}/c/${thread.cid}`} id="reply-button" key={`mob-no2-${index}`} 
                                    onClick={(e) => {
                                      if (e.button === 2) return;
                                      e.preventDefault();
                                      setSelectedThreadCid(thread.cid);
                                      let text = document.getSelection().toString();
                                      text = text ? `>${text}` : text;
                                      setSelectedText(text);
                                      if (isReplyOpen) {
                                        setReplyQuoteCid(thread.shortCid);
                                        setTriggerInsertion(Date.now());
                                      } else {
                                        setIsReplyOpen(true); 
                                        setSelectedShortCid(thread.shortCid); 
                                        setSelectedParentCid(thread.cid);
                                      }
                                    }} title="Reply to this post">{thread.shortCid}
                                  </Link>
                                </span>
                              </div>
                              {thread.link ? (
                                <div key={`mob-f-${index}`} className="file-mobile">
                                  {commentMediaInfo?.type === 'iframe' && (
                                    <div key={`enlarge-mob-${index}`} className="img-container">
                                      <span key={`mob-fta-${index}`} className="file-thumb-mobile" style={isMobileThreadThumbnailClicked[index] ? {} : {marginBottom: '25px'}}>
                                        {(isMobileThreadThumbnailClicked[index] || !commentMediaInfo.thumbnail) && commentMediaInfo.embedUrl ? (
                                          <div style={{width: "92vw"}}>
                                            <iframe 
                                              key={`mob-fti-${index}`} 
                                              src={commentMediaInfo.embedUrl}
                                              style={{border: "none", height: "250px"}}
                                              title="Embedded content"
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                              allowFullScreen />
                                          </div>
                                        ) : (
                                          <img 
                                            key={`mob-fti-${index}`}
                                            src={commentMediaInfo.thumbnail} 
                                            alt="thumbnail"
                                            onClick={() => {handleThumbnailClick(index, 'mobileThread')}}
                                            style={{cursor: "pointer"}}
                                            onError={(e) => e.target.src = fallbackImgUrl} />
                                        )}
                                        {commentMediaInfo?.type === "video" || "iframe" ? (
                                          isMobileThreadThumbnailClicked[index] ? (
                                            <div style={{textAlign: "center", marginTop: "15px", marginBottom: "15px"}}>
                                              <span className='button-mobile' style={{float: "none", cursor: "pointer"}}
                                              onClick={() => {handleThumbnailClick(index, 'mobileThread')}}
                                              >Close</span>
                                            </div>
                                          ) : (
                                            <div key={`mob-fi-${index}`} className="file-info-mobile">video</div>
                                        )) : <div key={`mob-fi-${index}`} className="file-info-mobile">video</div>}
                                      </span>
                                    </div>
                                  )}
                                    {commentMediaInfo?.url ? (
                                      commentMediaInfo.type === "webpage" ? (
                                        <div key={`enlarge-mob-${index}`} className="img-container">
                                          <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile" style={isMobileThreadThumbnailClicked[index] || !thread.thumbnailUrl ? {} : {width: displayWidthMobile, height: displayHeightMobile, marginBottom: '25px'}}>
                                            {thread.thumbnailUrl ? (
                                              <img key={`mob-img-${index}`} 
                                              src={commentMediaInfo.thumbnail} alt="thumbnail" 
                                              onClick={(e) => {handleImageClick(e); handleThumbnailClick(index, 'mobileThread')}}
                                              style={{cursor: "pointer"}}
                                              onError={(e) => e.target.src = fallbackImgUrl} />
                                            ) : null}
                                            <div key={`mob-fi-${index}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                          </span>
                                        </div>
                                      ) : commentMediaInfo.type === "image" ? (
                                        <div key={`enlarge-mob-${index}`} className="img-container">
                                          <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile" style={isMobileThreadThumbnailClicked[index] ? {} : {width: displayWidthMobile, height: displayHeightMobile, marginBottom: '25px'}}>
                                            <img key={`mob-img-${index}`} 
                                            src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                                            onClick={(e) => {handleImageClick(e); handleThumbnailClick(index, 'mobileThread')}}
                                            style={{cursor: "pointer"}}
                                            onError={(e) => e.target.src = fallbackImgUrl} />
                                            <div key={`mob-fi-${index}`} className="file-info-mobile">{commentMediaInfo?.type}</div>
                                          </span>
                                        </div>
                                      ) : commentMediaInfo.type === "video" ? (
                                          <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile" style={isMobileThreadThumbnailClicked[index] ? {} : {marginBottom: '25px'}}>
                                            {isMobileThreadThumbnailClicked[index] ? (
                                              <video key={`fti-${index}`} 
                                              src={commentMediaInfo.url} alt={commentMediaInfo.type}
                                              controls
                                              style={{ cursor: 'pointer' }} 
                                              onError={(e) => e.target.src = fallbackImgUrl} />
                                            ) : (
                                              <video 
                                                key={`fti-${index}`}
                                                src={commentMediaInfo.url} 
                                                alt="thumbnail"
                                                onClick={() => {handleThumbnailClick(index, 'mobileThread')}}
                                                style={{cursor: "pointer"}}
                                                id="video-thumbnail-mobile"
                                                onError={(e) => e.target.src = fallbackImgUrl} 
                                              />
                                            )}
                                            {commentMediaInfo?.type === "video" || "iframe" ? (
                                              isMobileThreadThumbnailClicked[index] ? (
                                                <div style={{textAlign: "center", marginTop: "15px", marginBottom: "15px"}}>
                                                  <span className='button-mobile' style={{float: "none", cursor: "pointer"}}
                                                  onClick={() => {handleThumbnailClick(index, 'mobileThread')}}
                                                  >Close</span>
                                                </div>
                                              ) : (
                                                <div key={`mob-fi-${index}`} className="file-info-mobile">video</div>
                                            )) : <div key={`mob-fi-${index}`} className="file-info-mobile">video</div>}
                                          </span>
                                      ) : commentMediaInfo.type === "audio" ? (
                                          <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile" style={isMobileThreadThumbnailClicked[index] ? {} : {width: displayWidthMobile, height: displayHeightMobile, marginBottom: '25px'}}>
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
                              <Link key={`rl2-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} 
                              onClick={() => {setSelectedThread(thread.cid); window.scrollTo(0, 0);}}
                              className="button-mobile" >View Thread</Link>
                            </div>
                          </div>
                          {displayedReplies?.map((reply, index) => {
                            const replyMediaInfo = getCommentMediaInfo(reply);
                            const shortParentCid = findShortParentCid(reply.parentCid, selectedFeed);
                            let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};
                            let signerAddress;
                            if (storedSigners[selectedThreadCidRef]) {
                              signerAddress = storedSigners[selectedThreadCidRef].address;
                            }
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
                                      onClick={() => handleAddressClick(<VerifiedAuthor commentCid={reply.cid}>{({ shortAuthorAddress }) => (shortAuthorAddress)}</VerifiedAuthor>)}
                                    >
                                      (u/
                                        {reply.author?.shortAddress ?
                                          (
                                            <span key={`mob-ha-${index}`} className="highlight-address-mobile">
                                              {reply.author?.shortAddress}
                                            </span>
                                          ) : (
                                            anonymousMode ? (
                                              <span key={`mob-ha-${index}`}>
                                                {signerAddress?.slice(8, 20)}
                                              </span>
                                              ) : (
                                              <span key={`mob-ha-${index}`}>
                                                {account?.author?.shortAddress}
                                              </span>
                                            )
                                          )
                                        }
                                      )&nbsp;
                                    </span>
                                    <br key={`mob-br-${index}`} />
                                  </span>
                                  <span key={`mob-dt-${index}`} className="date-time-mobile post-number-mobile"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content={getFormattedTime(reply.timestamp)}
                                  data-tooltip-place="top">
                                  {getDate(reply.timestamp)}&nbsp;
                                    <span key={`mob-pl1-${index}`}>c/</span>
                                    {reply.shortCid ? (
                                      <Link to={`/p/${selectedAddress}/c/${thread.cid}`} id="reply-button" key={`mob-pl2-${index}`} 
                                        onClick={(e) => {
                                          if (e.button === 2) return;
                                          e.preventDefault();
                                          setSelectedThreadCid(thread.cid);
                                          let text = document.getSelection().toString();
                                          text = text ? `>${text}` : text;
                                          setSelectedText(text);
                                          if (isReplyOpen) {
                                            setReplyQuoteCid(reply.shortCid);
                                            setTriggerInsertion(Date.now());
                                          } else {
                                            setIsReplyOpen(true); 
                                            setSelectedShortCid(reply.shortCid); 
                                            setSelectedParentCid(reply.cid);
                                          }
                                        }} title="Reply to this post">{reply.shortCid}
                                      </Link>
                                    ) : (
                                      <PendingLabel key="pending-mob" commentIndex={reply.index} />
                                    )}
                                  </span>
                                </div>
                                {reply.link ? (
                                  <div key={`mob-f-${index}`} className="file-mobile">
                                      {replyMediaInfo?.url ? (
                                        replyMediaInfo.type === "webpage" ? (
                                          <div key={`enlarge-mob-reply-${index}`} className="img-container">
                                            <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile" style={isMobileReplyThumbnailClicked[index] || !reply.thumbnailUrl ? {} : {width: displayWidthMobile, height: displayHeightMobile}}>
                                              {reply.thumbnailUrl ? (
                                                <img key={`mob-img-${index}`} 
                                                src={replyMediaInfo.thumbnail} alt="thumbnail" 
                                                onClick={(e) => {handleImageClick(e); handleThumbnailClick(index, 'mobileReply')}}
                                                style={{cursor: "pointer"}}
                                                onError={(e) => e.target.src = fallbackImgUrl} />
                                              ) : null}
                                              <div key={`mob-fi-${index}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                            </span>
                                          </div>
                                        ) : replyMediaInfo.type === "image" ? (
                                          <div key={`enlarge-mob-reply-${index}`} className="img-container">
                                            <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile" style={isMobileReplyThumbnailClicked[index] ? {} : {width: displayWidthMobile, height: displayHeightMobile}}>
                                              <img key={`mob-img-${index}`} 
                                              src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                                              onClick={(e) => {handleImageClick(e); handleThumbnailClick(index, 'mobileReply')}}
                                              style={{cursor: "pointer"}}
                                              onError={(e) => e.target.src = fallbackImgUrl} />
                                              <div key={`mob-fi-${index}`} className="file-info-mobile">{replyMediaInfo.type}</div>
                                            </span>
                                          </div>
                                        ) : replyMediaInfo.type === "video" ? (
                                          <span key={`mob-ft${thread.cid}`} className="file-thumb-mobile" style={isMobileReplyThumbnailClicked[index] ? {} : {marginBottom: '25px'}}>
                                            {isMobileReplyThumbnailClicked[index] ? (
                                              <video key={`fti-${index}`} 
                                              src={replyMediaInfo.url} alt={replyMediaInfo.type}
                                              controls
                                              style={{ all: 'unset', width: '100%', height: '100%', cursor: 'pointer'}} 
                                              onError={(e) => e.target.src = fallbackImgUrl} />
                                            ) : (
                                              <video 
                                                key={`fti-${index}`}
                                                src={replyMediaInfo.url} 
                                                alt="thumbnail"
                                                onClick={() => {handleThumbnailClick(index, 'mobileReply')}}
                                                style={{cursor: "pointer"}}
                                                id="video-thumbnail-mobile"
                                                onError={(e) => e.target.src = fallbackImgUrl} 
                                              />
                                            )}
                                            {replyMediaInfo?.type === "video" || "iframe" ? (
                                              isMobileReplyThumbnailClicked[index] ? (
                                                <div style={{textAlign: "center", marginTop: "15px", marginBottom: "15px"}}>
                                                  <span className='button-mobile' style={{float: "none", cursor: "pointer"}}
                                                  onClick={() => {handleThumbnailClick(index, 'mobileReply')}}
                                                  >Close</span>
                                                </div>
                                              ) : (
                                                <div key={`mob-fi-${index}`} className="file-info-mobile">video</div>
                                            )) : <div key={`mob-fi-${index}`} className="file-info-mobile">video</div>}
                                          </span>
                                        ) : replyMediaInfo.type === "audio" ? (
                                            <span key={`mob-ft${reply.cid}`} className="file-thumb-mobile" style={isMobileReplyThumbnailClicked[index] ? {} : {width: displayWidthMobile, height: displayHeightMobile}}>
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
                                      <Post key={`post-mobile-${index}`}
                                        content={reply.content?.slice(0, 500)}
                                        postQuoteRef={(quoteShortParentCid, ref) => {
                                          postRefs.current[quoteShortParentCid] = ref;
                                        }}
                                        postQuoteOnClick={(quoteShortParentCid) => {
                                          handleQuoteClick(reply, quoteShortParentCid, null)
                                        }}
                                        postQuoteOnOver={(quoteShortParentCid) => {
                                          const quoteParentCid = cidTracker[quoteShortParentCid];
                                          if (outOfViewCid !== quoteParentCid) {
                                            handleQuoteHover(reply, quoteShortParentCid, () => {
                                              setOutOfViewCid(quoteParentCid);
          
                                            const rect = postRefs.current[quoteShortParentCid].getBoundingClientRect();
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
                                          })
                                        }}
                                      }
                                        postQuoteOnLeave={() => {
                                          removeHighlight();
                                          setOutOfViewCid(null);
                                        }}
                                      />
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
                                    <Post key={`post-mobile-${index}`}
                                      content={reply.content} 
                                      postQuoteRef={(quoteShortParentCid, ref) => {
                                        postRefs.current[quoteShortParentCid] = ref;
                                      }}
                                      postQuoteOnClick={(quoteShortParentCid) => {
                                        handleQuoteClick(reply, quoteShortParentCid, null)
                                      }}
                                      postQuoteOnOver={(quoteShortParentCid) => {
                                        const quoteParentCid = cidTracker[quoteShortParentCid];
                                        if (outOfViewCid !== quoteParentCid) {
                                          handleQuoteHover(reply, quoteShortParentCid, () => {
                                            setOutOfViewCid(quoteParentCid);
        
                                          const rect = postRefs.current[quoteShortParentCid].getBoundingClientRect();
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
                                        })
                                      }}
                                    }
                                      postQuoteOnLeave={() => {
                                        removeHighlight();
                                        setOutOfViewCid(null);
                                      }}
                                    />
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
                  ref={virtuosoRef}
                  restoreStateFrom={lastVirtuosoState}
                  initialScrollTop={lastVirtuosoState?.scrollTop}
                  endReached={tryLoadMore}
                  useWindowScroll={true}
                  components={{Footer: () => {return isFeedCached ? null : <PostLoader />}}}
                  />
                </>
              ) : (<PostLoader />)
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
                <Link to={`/p/all`} onClick={() => window.scrollTo(0, 0)}>All</Link>
                 / 
                <Link to={`/p/subscriptions`} onClick={() => window.scrollTo(0, 0)}>Subscriptions</Link>
              ]&nbsp;
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
                  () => {
                    window.electron && window.electron.isElectron ? (
                      setIsCreateBoardOpen(true)
                    ) : (
                      alert(
                        'You can create a board with the desktop version of plebchan:\nhttps://github.com/plebbit/plebchan/releases/latest\n\nIf you are comfortable with the command line, use plebbit-cli:\nhttps://github.com/plebbit/plebbit-cli\n\n'
                      )
                    )
                  }
                }>Create Board</span>
                ]
                [
                <Link to={`/p/${selectedAddress}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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

export default Board;