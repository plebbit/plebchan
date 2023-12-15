import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip } from 'react-tooltip';
import { useAccount, useAccountComments, useComment, usePublishComment, usePublishCommentEdit, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils';
import { debounce } from 'lodash';
import { Container, NavBar, Header, Break, PostForm, PostFormTable, PostMenu, PostMenuMobile } from '../styled/views/Board.styled';
import { ReplyFormLink, TopBar, BottomBar, BoardForm, Footer } from '../styled/views/Thread.styled';
import { AlertModal } from '../styled/modals/AlertModal.styled';
import { PostMenuCatalog } from '../styled/views/Catalog.styled';
import BoardStats from '../BoardStats';
import EditLabel from '../EditLabel';
import Embed from '../Embed';
import ImageBanner from '../ImageBanner';
import OfflineIndicator from '../OfflineIndicator';
import PendingLabel from '../PendingLabel';
import Post from '../Post';
import PostLoader from '../PostLoader';
import PostOnHover from '../PostOnHover';
import StateLabel from '../StateLabel';
import VerifiedAuthor from '../VerifiedAuthor';
import CreateBoardModal from '../modals/CreateBoardModal';
import AdminListModal from '../modals/AdminListModal';
import EditModal from '../modals/EditModal';
import ModerationModal from '../modals/ModerationModal';
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
import handleShareClick from '../../utils/handleShareClick';
import handleStyleChange from '../../utils/handleStyleChange';
import removeHighlight from '../../utils/removeHighlight';
import useAnonMode from '../../hooks/useAnonMode';
import useClickForm from '../../hooks/useClickForm';
import useError from '../../hooks/useError';
import useStateString from '../../hooks/useStateString';
import useSuccess from '../../hooks/useSuccess';
import useAnonModeStore from '../../hooks/stores/useAnonModeStore';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import packageJson from '../../../package.json';
const { version } = packageJson;
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : '';

const Thread = () => {
  const {
    captchaResponse,
    setCaptchaResponse,
    setChallengesArray,
    defaultSubplebbits,
    editedComment,
    editedComments,
    setIsAuthorDelete,
    setIsAuthorEdit,
    setIsCaptchaOpen,
    isModerationOpen,
    setIsModerationOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    setModeratingCommentCid,
    setReplyQuoteCid,
    setResolveCaptchaPromise,
    setPendingComment,
    setPendingCommentIndex,
    setSelectedAddress,
    setSelectedParentCid,
    setSelectedShortCid,
    selectedStyle,
    selectedThread,
    setSelectedThread,
    setSelectedText,
    selectedTitle,
    setSelectedTitle,
    showPostForm,
    showPostFormLink,
    setTriggerInsertion,
  } = useGeneralStore((state) => state);

  const { anonymousMode } = useAnonModeStore();

  const account = useAccount();
  const navigate = useNavigate();
  const handleClickForm = useClickForm();

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  const nameRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();
  const threadMenuRefs = useRef({});
  const threadMenuRefsMobile = useRef({});
  const replyMenuRefs = useRef({});
  const replyMenuRefsMobile = useRef({});
  const postMenuRef = useRef(null);
  const postMenuMobileRef = useRef(null);
  const postMenuCatalogRef = useRef(null);
  const backlinkRefs = useRef({});
  const quoteRefs = useRef({});
  const postRefs = useRef({});
  const postOnHoverRef = useRef(null);
  const backlinkRefsMobile = useRef({});
  const quoteRefsMobile = useRef({});

  const [triggerPublishComment, setTriggerPublishComment] = useState(false);
  const [triggerPublishCommentEdit, setTriggerPublishCommentEdit] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [originalCommentContent, setOriginalCommentContent] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isClientRedirectMenuOpen, setIsClientRedirectMenuOpen] = useState(false);
  const [canModerate, setCanModerate] = useState(false);
  const [commentCid, setCommentCid] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [mobileMenuPosition, setMobileMenuPosition] = useState({ top: 0, left: 0 });
  const [openMenuCid, setOpenMenuCid] = useState(null);
  const [openMobileMenuCid, setOpenMobileMenuCid] = useState(null);
  const [outOfViewCid, setOutOfViewCid] = useState(null);
  const [outOfViewPosition, setOutOfViewPosition] = useState({ top: 0, left: 0 });
  const [postOnHoverHeight, setPostOnHoverHeight] = useState(0);
  const [executeAnonMode, setExecuteAnonMode] = useState(false);
  const [cidTracker, setCidTracker] = useState({});
  const [isThreadThumbnailClicked, setIsThreadThumbnailClicked] = useState({});
  const [isReplyThumbnailClicked, setIsReplyThumbnailClicked] = useState({});
  const [isMobileThreadThumbnailClicked, setIsMobileThreadThumbnailClicked] = useState({});
  const [isMobileReplyThumbnailClicked, setIsMobileReplyThumbnailClicked] = useState({});
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  useAnonMode(selectedThread, anonymousMode && executeAnonMode);

  const [isAdminListOpen, setIsAdminListOpen] = useState(false);
  const originalComment = useComment({ commentCid: selectedThread });
  const [comment, setComment] = useState(originalComment);
  const { subplebbitAddress, threadCid } = useParams();
  const subplebbit = useSubplebbit({ subplebbitAddress: originalComment.subplebbitAddress });
  const selectedAddress = subplebbit.address;
  const isOwner = subplebbit?.roles?.[comment.author?.address]?.role === 'owner';
  const isAdmin = subplebbit?.roles?.[comment.author?.address]?.role === 'admin';
  const isModerator = subplebbit?.roles?.[comment.author?.address]?.role === 'moderator';

  const stateString = useStateString(comment);

  const commentMediaInfo = getCommentMediaInfo(comment);
  const fallbackImgUrl = 'assets/filedeleted-res.gif';

  useEffect(() => {
    let updatedComment = { ...originalComment };

    if (editedComments[originalComment.cid]) {
      updatedComment = { ...originalComment, ...editedComments[originalComment.cid] };

      if (updatedComment.removed) {
        updatedComment.content = '[removed]';
        updatedComment.link = undefined;
      }
    }

    setComment(updatedComment);
  }, [originalComment, editedComments]);

  const handleThumbnailClick = (index, type) => {
    switch (type) {
      case 'thread':
        setIsThreadThumbnailClicked((prevState) => ({
          ...prevState,
          [index]: !prevState[index],
        }));
        break;
      case 'reply':
        setIsReplyThumbnailClicked((prevState) => ({
          ...prevState,
          [index]: !prevState[index],
        }));
        break;
      case 'mobileThread':
        setIsMobileThreadThumbnailClicked((prevState) => ({
          ...prevState,
          [index]: !prevState[index],
        }));
        break;
      case 'mobileReply':
        setIsMobileReplyThumbnailClicked((prevState) => ({
          ...prevState,
          [index]: !prevState[index],
        }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (subplebbit.roles !== undefined) {
      const role = subplebbit.roles[account?.author?.address]?.role;

      if (role === 'moderator' || role === 'admin' || role === 'owner') {
        setCanModerate(true);
      } else {
        setCanModerate(false);
      }
    }
  }, [account?.author.address, subplebbit.roles]);

  const handleOptionClick = () => {
    setOpenMenuCid(null);
  };

  const handleMobileOptionClick = () => {
    setOpenMobileMenuCid(null);
  };

  const handleOutsideClick = useCallback(
    (e) => {
      if (openMenuCid !== null && !postMenuRef.current.contains(e.target) && !postMenuCatalogRef.current.contains(e.target)) {
        setOpenMenuCid(null);
      }
    },
    [openMenuCid, postMenuRef, postMenuCatalogRef],
  );

  const handleMobileOutsideClick = useCallback(
    (e) => {
      if (openMobileMenuCid !== null && !postMenuMobileRef.current.contains(e.target)) {
        setOpenMobileMenuCid(null);
      }
    },
    [openMobileMenuCid, postMenuMobileRef],
  );

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
    if (openMobileMenuCid !== null) {
      document.addEventListener('click', handleMobileOutsideClick);
    } else {
      document.removeEventListener('click', handleMobileOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleMobileOutsideClick);
    };
  }, [openMobileMenuCid, handleMobileOutsideClick]);

  useEffect(() => {
    if (postOnHoverRef.current) {
      const rect = postOnHoverRef.current.getBoundingClientRect();
      setPostOnHoverHeight(rect.height);
    }
  }, [outOfViewCid]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (comment.state === 'failed' && selectedAddress === undefined) {
      navigate('/404');
    }
  }, [selectedAddress, navigate, comment.state]);

  const errorString = useMemo(() => {
    if (comment?.state === 'failed') {
      let errorString = 'Failed fetching thread.';
      if (comment.error) {
        errorString += `: ${comment.error.toString().slice(0, 300)}`;
      }
      return errorString;
    }
  }, [comment?.state, comment?.error]);

  useEffect(() => {
    if (errorString) {
      setNewErrorMessage(errorString);
    }
  }, [errorString, setNewErrorMessage]);

  const flattenedReplies = useMemo(() => flattenCommentsPages(comment.replies), [comment.replies]);

  const threadAndRepliesCids = useMemo(() => new Set([selectedThread || 'n/a', ...flattenedReplies.map((reply) => reply.cid)]), [selectedThread, flattenedReplies]);

  const filter = useCallback((accountComment) => threadAndRepliesCids.has(accountComment.parentCid), [threadAndRepliesCids]);

  const { accountComments } = useAccountComments({ filter });

  const accountRepliesNotYetInCommentReplies = useMemo(() => {
    const commentReplyCids = new Set(flattenedReplies.map((reply) => reply.cid));
    return accountComments.filter((accountReply) => {
      return (
        !commentReplyCids.has(accountReply.cid) && (accountReply.parentCid === selectedThread || flattenedReplies.some((reply) => reply.cid === accountReply.parentCid))
      );
    });
  }, [flattenedReplies, accountComments, selectedThread]);

  const sortedReplies = useMemo(
    () => [...accountRepliesNotYetInCommentReplies, ...flattenedReplies].sort((a, b) => a.timestamp - b.timestamp),
    [accountRepliesNotYetInCommentReplies, flattenedReplies],
  );

  // let post.jsx access full cid of user-typed short cid
  useEffect(() => {
    const newCidTracker = {};
    sortedReplies.forEach((reply) => {
      newCidTracker[reply.shortCid] = reply.cid;
    });
    setCidTracker(newCidTracker);
  }, [sortedReplies]);

  useEffect(() => {
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
    if (threadCid) {
      setSelectedThread(threadCid);
    }
    if (subplebbitAddress) {
      setSelectedAddress(subplebbitAddress);
    } else if (subplebbit?.address) {
      setSelectedAddress(subplebbit.address);
    }
    if (selectedSubplebbit) {
      setSelectedTitle(selectedSubplebbit.title);
    } else if (subplebbit?.title) {
      setSelectedTitle(subplebbit.title);
    }
  }, [subplebbitAddress, threadCid, defaultSubplebbits, subplebbit, setSelectedThread, setSelectedAddress, setSelectedTitle]);

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

  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      if (challengeVerification.publication?.cid !== undefined) {
        return;
      } else {
        setNewSuccessMessage('Challenge Success');
        console.log('challenge success', challengeVerification);
      }
    } else if (challengeVerification.challengeSuccess === false) {
      setNewErrorMessage(`Challenge Failed, reason: ${challengeVerification.reason}. Errors: ${challengeVerification.errors}`);
      console.log('challenge failed', challengeVerification);
    }
  };

  const onChallenge = async (challenges, comment) => {
    setPendingComment(comment);
    let challengeAnswers = [];

    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges);
    } catch (error) {
      setNewErrorMessage(error.message);
      console.log(error);
    }
    if (challengeAnswers) {
      await comment.publishChallengeAnswers(challengeAnswers);
    }
  };

  useEffect(() => {
    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      subplebbitAddress: comment.subplebbitAddress,
    }));
  }, [comment.subplebbitAddress]);

  const [publishCommentOptions, setPublishCommentOptions] = useState({
    subplebbitAddress: comment.subplebbitAddress,
    onChallenge,
    onChallengeVerification,
    onError: (error) => {
      setNewErrorMessage(error.message);
      console.log(error);
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

    if (commentRef.current.value === '' && linkRef.current.value === '') {
      setNewErrorMessage('Please enter a comment or link.');
      return;
    }

    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      author: {
        displayName: nameRef.current.value || undefined,
        ...(anonymousMode ? {} : { address: account?.author.address }),
      },
      content: commentRef.current.value || undefined,
      link: linkRef.current.value || undefined,
      parentCid: selectedThread,
    }));

    setTriggerPublishComment(true);
  };

  const updateSigner = useCallback(async () => {
    if (anonymousMode) {
      setExecuteAnonMode(true);

      let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};
      let signer;

      if (!storedSigners[selectedThread]) {
        signer = await account?.plebbit.createSigner();
        storedSigners[selectedThread] = { privateKey: signer?.privateKey, address: signer?.address };
        localStorage.setItem('storedSigners', JSON.stringify(storedSigners));
      } else {
        const signerPrivateKey = storedSigners[selectedThread].privateKey;

        try {
          signer = await account?.plebbit.createSigner({ type: 'ed25519', privateKey: signerPrivateKey });
        } catch (error) {
          console.log(error);
        }
      }

      setPublishCommentOptions((prevPublishCommentOptions) => {
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
  }, [selectedThread, anonymousMode, account]);

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
        reject(setNewErrorMessage('Could not load challenges'));
      };
    });
  };

  const [publishCommentEditOptions, setPublishCommentEditOptions] = useState({
    commentCid: commentCid,
    content: editedComment || undefined,
    subplebbitAddress: comment.subplebbitAddress,
    onChallenge,
    onChallengeVerification,
    onError: (error) => {
      setNewErrorMessage(error.message);
      console.log(error);
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
              <div className='author-delete-buttons'>
                <button onClick={onClose}>No</button>
                <button
                  onClick={() => {
                    setIsAuthorDelete(true);
                    setIsAuthorEdit(false);
                    setPublishCommentEditOptions((prevOptions) => ({
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
      },
    });
  };

  const handleAuthorEditClick = (comment) => {
    handleOptionClick(comment.cid);
    setIsAuthorEdit(true);
    setIsAuthorDelete(false);
    setCommentCid(comment.cid);
    setOriginalCommentContent(comment.content);
    setIsEditModalOpen(true);
  };

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
  }, [editedComment]);

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

  return (
    <>
      <Helmet>
        <title>
          {(comment.content?.slice(0, 40) ?? comment.title?.slice(0, 40) ?? 'Thread') + ' - ' + (selectedTitle ? selectedTitle : selectedAddress) + ' - plebchan'}
        </title>
      </Helmet>
      <Container>
        <AdminListModal selectedStyle={selectedStyle} isOpen={isAdminListOpen} closeModal={() => setIsAdminListOpen(false)} roles={subplebbit?.roles} />
        <CreateBoardModal selectedStyle={selectedStyle} isOpen={isCreateBoardOpen} closeModal={() => setIsCreateBoardOpen(false)} />
        <ReplyModal selectedStyle={selectedStyle} isOpen={isReplyOpen} closeModal={() => setIsReplyOpen(false)} />
        <SettingsModal selectedStyle={selectedStyle} isOpen={isSettingsOpen} closeModal={() => setIsSettingsOpen(false)} />
        <ModerationModal
          selectedStyle={selectedStyle}
          isOpen={isModerationOpen}
          closeModal={() => {
            setIsModerationOpen(false);
            setDeletePost(false);
          }}
          deletePost={deletePost}
        />
        <EditModal selectedStyle={selectedStyle} isOpen={isEditModalOpen} closeModal={() => setIsEditModalOpen(false)} originalCommentContent={originalCommentContent} />
        <NavBar selectedStyle={selectedStyle}>
          <>
            <span className='boardList'>
              [<Link to={{ pathname: `/p/all`, state: { scrollToTop: true } }}>All</Link>
               / 
              <Link to={{ pathname: `/p/subscriptions`, state: { scrollToTop: true } }}>Subscriptions</Link>
              ]&nbsp;[
              {defaultSubplebbits.map((subplebbit, index) => (
                <span className='boardList' key={`span-${subplebbit.address}`}>
                  {index === 0 ? null : '\u00a0'}
                  <Link
                    to={`/p/${subplebbit.address}`}
                    key={`a-${subplebbit.address}`}
                    onClick={() => {
                      setSelectedTitle(subplebbit.title);
                      setSelectedAddress(subplebbit.address);
                    }}
                  >
                    {subplebbit.title ? subplebbit.title : subplebbit.address}
                  </Link>
                  {index !== defaultSubplebbits.length - 1 ? ' /' : null}
                </span>
              ))}
              ]
            </span>
            <span className='nav'>
              [
              <span
                id='button-span'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  window.electron && window.electron.isElectron
                    ? setIsCreateBoardOpen(true)
                    : alert(
                        'HOW TO CREATE A BOARD (currently via CLI only):\n\n(1) have a computer you can use as server, because users will connect to your board peer-to-peer;\n\n(2) go to https://github.com/plebbit/plebbit-cli#install and follow the instructions to run your daemon, create a subplebbit (board) and edit its settings;\n\n(3) users can always connect to your board via its address, but it can be added below by submitting a pull request here: https://github.com/plebbit/temporary-default-subplebbits. This will be automated with a plebbit DAO using the plebbit token.',
                      );
                }}
              >
                Create Board
              </span>
              ] [
              <Link to={`/p/${selectedAddress}/c/${selectedThread}/settings`} onClick={() => setIsSettingsOpen(true)}>
                Settings
              </Link>
              ] [<Link to='/'>Home</Link>]
            </span>
            <div id='board-nav-mobile' style={{ top: visible ? 0 : '-23px' }}>
              <div className='nav-container'>
                <div className='board-select'>
                  <strong>Board</strong>
                  &nbsp;
                  <select id='board-select-mobile' value={selectedAddress} onChange={handleSelectChange}>
                    <option value='all'>All</option>
                    <option value='subscriptions'>Subscriptions</option>
                    {!defaultSubplebbits.some((subplebbit) => subplebbit.address === selectedAddress) && <option value={selectedAddress}>{selectedAddress}</option>}
                    {defaultSubplebbits.map((subplebbit) => (
                      <option key={`option-${subplebbit.address}`} value={subplebbit.address}>
                        {subplebbit.title ? subplebbit.title : subplebbit.address}
                      </option>
                    ))}
                  </select>
                   
                  <span
                    id='button-span'
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      alert(
                        'HOW TO CREATE A BOARD (currently via CLI only):\n\n(1) have a computer you can use as server, because users will connect to your board peer-to-peer;\n\n(2) go to https://github.com/plebbit/plebbit-cli#install and follow the instructions to run your daemon, create a subplebbit (board) and edit its settings;\n\n(3) users can always connect to your board via its address, but it can be added below by submitting a pull request here: https://github.com/plebbit/temporary-default-subplebbits. This will be automated with a plebbit DAO using the plebbit token.',
                      )
                    }
                  >
                    Create Board
                  </span>
                </div>
                <div className='page-jump'>
                  <Link to={`/p/${selectedAddress}/c/${selectedThread}/settings`} onClick={() => setIsSettingsOpen(true)}>
                    Settings
                  </Link>
                  &nbsp;
                  <Link
                    to='/'
                    onClick={() => {
                      handleStyleChange({ target: { value: 'Yotsuba' } });
                    }}
                  >
                    Home
                  </Link>
                </div>
              </div>
            </div>
            <div id='separator-mobile'>&nbsp;</div>
            <div id='separator-mobile'>&nbsp;</div>
          </>
        </NavBar>
        <Header selectedStyle={selectedStyle}>
          <>
            <div className='banner'>
              <ImageBanner />
            </div>
            <>
              <div className='board-title'>{subplebbit.title ?? null}</div>
              <div className='board-address'>
                p/{subplebbit.address}
                <OfflineIndicator address={subplebbit.address} className='offline' tooltipPlace='top' />
              </div>
            </>
          </>
        </Header>
        <Break selectedStyle={selectedStyle} />
        <PostForm selectedStyle={selectedStyle} name='post' action='' method='post' enctype='multipart/form-data'>
          <ReplyFormLink id='post-form-link' showReplyFormLink={showPostFormLink} selectedStyle={selectedStyle}>
            <div id='return-button-mobile'>
              <span className='btn-wrap'>
                <Link to={`/p/${selectedAddress}`}>Return</Link>
              </span>
            </div>
            <div id='catalog-button-mobile'>
              <span className='btn-wrap'>
                <Link to={{ pathname: `/p/${selectedAddress}/catalog`, state: { scrollToTop: true } }}>Catalog</Link>
              </span>
            </div>
            <div id='bottom-button-mobile'>
              <span className='btn-wrap'>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.scrollTo(0, document.body.scrollHeight)}
                  onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
                >
                  Bottom
                </span>
              </span>
            </div>
            <div id='post-form-link-desktop'>
              [
              <Link
                to={`/p/${subplebbitAddress}/c/${selectedThread}/post`}
                onClick={() => {
                  handleClickForm();
                  setSelectedShortCid(comment.shortCid);
                }}
                onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
              >
                Post a Reply
              </Link>
              ]
            </div>
            <div id='post-form-link-mobile'>
              <span className='btn-wrap'>
                <Link
                  to={`/p/${subplebbitAddress}/c/${selectedThread}/post`}
                  onClick={() => {
                    handleClickForm();
                    setSelectedShortCid(comment.shortCid);
                  }}
                  onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
                >
                  Post a Reply
                </Link>
              </span>
            </div>
          </ReplyFormLink>
          <PostFormTable id='post-form' showPostForm={showPostForm} selectedStyle={selectedStyle} className='post-form'>
            <tbody>
              <tr data-type='Name'>
                <td id='td-name'>Name</td>
                <td>
                  {account?.author.displayName ? (
                    <input name='name' type='text' tabIndex={1} defaultValue={account?.author?.displayName} ref={nameRef} />
                  ) : (
                    <input name='name' type='text' placeholder='Anonymous' tabIndex={1} ref={nameRef} />
                  )}
                  <input id='post-button' type='submit' value='Post' tabIndex={6} onClick={handleSubmit} />
                </td>
              </tr>
              <tr data-type='Comment'>
                <td>Comment</td>
                <td>
                  <textarea name='com' cols='48' rows='4' tabIndex={4} wrap='soft' ref={commentRef} />
                </td>
              </tr>
              <tr data-type='File'>
                <td>Link</td>
                <td>
                  <input name='embed' type='text' tabIndex={7} placeholder='Paste link' ref={linkRef} />
                  <button
                    id='t-help'
                    type='button'
                    onClick={() =>
                      alert(
                        '- Embedding media is optional, posts can be text-only. \n- A CAPTCHA challenge will appear after posting. \n- The CAPTCHA is case-sensitive.',
                      )
                    }
                    data-tip='Help'
                  >
                    ?
                  </button>
                </td>
              </tr>
            </tbody>
          </PostFormTable>
        </PostForm>
        <BoardStats subplebbitAddress={subplebbitAddress} />
        <TopBar selectedStyle={selectedStyle}>
          <hr />
          <span className='style-changer'>
            Style:  
            <select id='style-selector' onChange={handleStyleChange} value={selectedStyle}>
              <option value='Yotsuba'>Yotsuba</option>
              <option value='Yotsuba-B'>Yotsuba B</option>
              <option value='Futaba'>Futaba</option>
              <option value='Burichan'>Burichan</option>
              <option value='Tomorrow'>Tomorrow</option>
              <option value='Photon'>Photon</option>
            </select>
          </span>
          <span className='return-button' id='return-button-desktop'>
            [<Link to={`/p/${selectedAddress}`}>Return</Link>]
          </span>
          <span className='return-button catalog-button' id='catalog-button-desktop'>
            [<Link to={{ pathname: `/p/${selectedAddress}/catalog`, state: { scrollToTop: true } }}>Catalog</Link>]
          </span>
          <span className='return-button catalog-button' id='bottom-button-desktop'>
            [
            <span
              id='button'
              style={{ cursor: 'pointer' }}
              onClick={() => window.scrollTo(0, document.body.scrollHeight)}
              onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
              onTouchStart={() => window.scrollTo(0, document.body.scrollHeight)}
            >
              Bottom
            </span>
            ]
          </span>
          {comment ? (
            comment.replyCount !== undefined ? (
              comment.replyCount > 0 ? (
                comment.replyCount === 1 ? (
                  <span className='reply-stat'>{comment.replyCount} reply</span>
                ) : (
                  <span className='reply-stat'>{comment.replyCount} replies</span>
                )
              ) : (
                <span className='reply-stat'>No replies yet</span>
              )
            ) : (
              <span className={stateString ? 'reply-stat ellipsis' : ''}>{stateString}</span>
            )
          ) : (
            <span className={stateString ? 'reply-stat ellipsis' : ''}>{stateString}</span>
          )}
          <hr />
        </TopBar>
        <Tooltip id='tooltip' className='tooltip' />
        <BoardForm selectedStyle={selectedStyle}>
          {comment !== undefined ? (
            comment.state === 'fetching-ipfs' ? (
              <PostLoader />
            ) : (
              <>
                <div className='thread'>
                  <div className='op-container'>
                    <div className='post op op-desktop'>
                      <div className='post-info'>
                        {commentMediaInfo?.url ? (
                          <div key={`f-${index}`} className='file' style={{ marginBottom: '5px' }}>
                            <div key={`ft-${index}`} className='file-text'>
                              Link:&nbsp;
                              <a key={`fa-${index}`} href={commentMediaInfo.url} target='_blank' rel='noopener noreferrer'>
                                {commentMediaInfo?.url.length > 30 ? commentMediaInfo?.url.slice(0, 30) + '(...)' : commentMediaInfo?.url}
                              </a>
                              {commentMediaInfo?.type === 'iframe' ? null : ` (${commentMediaInfo?.type})`}
                              {((isThreadThumbnailClicked[index] && (commentMediaInfo.type === 'iframe' || commentMediaInfo.type === 'video')) ||
                                (commentMediaInfo.type === 'iframe' && !commentMediaInfo.thumbnail)) && (
                                <span>
                                   [
                                  <span
                                    className='reply-link'
                                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => {
                                      handleThumbnailClick(index, 'thread');
                                    }}
                                  >
                                    {isThreadThumbnailClicked[index] ? 'Close' : 'Embed'}
                                  </span>
                                  ]
                                </span>
                              )}
                            </div>
                            {commentMediaInfo?.type === 'iframe' && (
                              <div key={`enlarge-${index}`} className={`img-container ${isThreadThumbnailClicked[index] ? 'expanded-container' : ''}`}>
                                <span key={`fta-${index}`} className='file-thumb'>
                                  {isThreadThumbnailClicked[index] && commentMediaInfo.url ? (
                                    <Embed url={commentMediaInfo.url} key={`fti-${index}`} />
                                  ) : commentMediaInfo.thumbnail ? (
                                    <img
                                      key={`fti-${index}`}
                                      src={commentMediaInfo.thumbnail}
                                      alt='thumbnail'
                                      onClick={() => {
                                        handleThumbnailClick(index, 'thread');
                                      }}
                                      style={{ cursor: 'pointer' }}
                                      onError={(e) => (e.target.src = fallbackImgUrl)}
                                    />
                                  ) : null}
                                </span>
                              </div>
                            )}
                            {commentMediaInfo?.type === 'webpage' ? (
                              <div key={`enlarge-${index}`} className='img-container'>
                                <span key={`fta-${index}`} className='file-thumb'>
                                  {comment.thumbnailUrl ? (
                                    <img
                                      key={`fti-${index}`}
                                      src={commentMediaInfo.thumbnail}
                                      alt={commentMediaInfo.type}
                                      onClick={(e) => {
                                        handleImageClick(e);
                                        handleThumbnailClick(index, 'thread');
                                      }}
                                      style={{ cursor: 'pointer' }}
                                      onError={(e) => (e.target.src = fallbackImgUrl)}
                                    />
                                  ) : null}
                                </span>
                              </div>
                            ) : null}
                            {commentMediaInfo?.type === 'image' ? (
                              <div key={`enlarge-${index}`} className='img-container'>
                                <span key={`fta-${index}`} className='file-thumb'>
                                  <img
                                    key={`fti-${index}`}
                                    src={commentMediaInfo.url}
                                    alt={commentMediaInfo.type}
                                    onClick={(e) => {
                                      handleImageClick(e);
                                      handleThumbnailClick(index, 'thread');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    onError={(e) => (e.target.src = fallbackImgUrl)}
                                  />
                                </span>
                              </div>
                            ) : null}
                            {commentMediaInfo?.type === 'video' ? (
                              <div key={`enlarge-${index}`} className={`img-container ${isThreadThumbnailClicked[index] ? 'expanded-container' : ''}`}>
                                <span key={`fta-${index}`} className='file-thumb'>
                                  {isThreadThumbnailClicked[index] ? (
                                    <video
                                      className='enlarged'
                                      key={`fti-${index}`}
                                      src={commentMediaInfo.url}
                                      controls
                                      style={{ cursor: 'pointer' }}
                                      onError={(e) => (e.target.src = fallbackImgUrl)}
                                    />
                                  ) : (
                                    <video
                                      key={`fti-${index}`}
                                      src={commentMediaInfo.url}
                                      alt='thumbnail'
                                      onClick={() => {
                                        handleThumbnailClick(index, 'thread');
                                      }}
                                      style={{ cursor: 'pointer' }}
                                      onError={(e) => (e.target.src = fallbackImgUrl)}
                                    />
                                  )}
                                </span>
                              </div>
                            ) : null}
                            {commentMediaInfo?.type === 'audio' ? (
                              <span key={`fta-${index}`} className='file-thumb'>
                                <audio
                                  controls
                                  key={`fti-${index}`}
                                  src={commentMediaInfo.url}
                                  alt={commentMediaInfo.type}
                                  onError={(e) => (e.target.src = fallbackImgUrl)}
                                />
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                        <span className='name-block'>
                          {comment.title ? (
                            comment.title.length > 75 ? (
                              <>
                                <span key={`q-${comment.cid}`} className='title' data-tooltip-id='tooltip' data-tooltip-content={comment.title} data-tooltip-place='top'>
                                  {comment.title.slice(0, 75) + ' (...)'}
                                </span>
                              </>
                            ) : (
                              <span key={`q-${comment.cid}`} className='title'>
                                {comment.title}
                              </span>
                            )
                          ) : null}
                          &nbsp;
                          {comment?.author?.displayName ? (
                            comment?.author?.displayName.length > 20 ? (
                              <>
                                <span
                                  key={`n-${comment.cid}`}
                                  className={`name ${isAdmin || isOwner ? 'capcode-admin' : isModerator ? 'capcode' : ''}`}
                                  data-tooltip-id='tooltip'
                                  data-tooltip-content={comment?.author?.displayName}
                                  data-tooltip-place='top'
                                >
                                  {comment?.author?.displayName.slice(0, 20) + ' (...)'}
                                </span>
                              </>
                            ) : (
                              <span key={`n-${comment.cid}`} className={`name ${isAdmin || isOwner ? 'capcode-admin' : isModerator ? 'capcode' : ''}`}>
                                {comment?.author?.displayName}
                              </span>
                            )
                          ) : (
                            <span key={`n-${comment.cid}`} className={`name ${isAdmin || isOwner ? 'capcode-admin' : isModerator ? 'capcode' : ''}`}>
                              Anonymous
                            </span>
                          )}
                          {isOwner ? (
                            <span onClick={() => setIsAdminListOpen(true)} className='name capcode-admin'>
                              &nbsp;## Board Owner
                            </span>
                          ) : isAdmin ? (
                            <span onClick={() => setIsAdminListOpen(true)} className='name capcode-admin'>
                              &nbsp;## Board Admin
                            </span>
                          ) : isModerator ? (
                            <span onClick={() => setIsAdminListOpen(true)} className='name capcode'>
                              &nbsp;## Board Mod
                            </span>
                          ) : null}
                          &nbsp;
                          <span
                            className='poster-address address-desktop'
                            id='reply-button'
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleAddressClick(<VerifiedAuthor commentCid={comment.cid}>{({ shortAuthorAddress }) => shortAuthorAddress}</VerifiedAuthor>)}
                          >
                            (u/
                            <span key={`pa-${comment.cid}`} className='poster-address'>
                              <VerifiedAuthor commentCid={comment.cid}>
                                {({ shortAuthorAddress, authorAddressChanged }) => (
                                  <>
                                    <span className='author-address-hidden'>{comment.author?.shortAddress}</span>
                                    <span className={`author-address-visible ${authorAddressChanged ? 'authorAddressChanged' : ''}`}>{shortAuthorAddress}</span>
                                  </>
                                )}
                              </VerifiedAuthor>
                            </span>
                            )
                          </span>
                          &nbsp;
                          <span className='date-time' data-tooltip-id='tooltip' data-tooltip-content={getFormattedTime(comment?.timestamp)} data-tooltip-place='top'>
                            {getDate(comment?.timestamp)}
                          </span>
                          &nbsp;
                          <span className='post-number post-number-desktop'>
                            <span>c/</span>
                            <Link
                              to={() => {}}
                              id='reply-button'
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                let text = document.getSelection().toString();
                                text = text ? `>${text}` : text;
                                setSelectedText(text);
                                if (isReplyOpen) {
                                  setReplyQuoteCid(comment.shortCid);
                                  setTriggerInsertion(Date.now());
                                } else {
                                  setIsReplyOpen(true);
                                  setSelectedShortCid(comment.shortCid);
                                  setSelectedParentCid(comment.cid);
                                }
                              }}
                              title='Reply to this post'
                            >
                              {comment.shortCid}
                            </Link>
                          </span>
                          &nbsp;
                          {comment.pinned ? (
                            <>
                              &nbsp;
                              <img src='assets/sticky.gif' alt='Sticky' title='Sticky' style={{ marginBottom: '-1px', imageRendering: 'pixelated' }} />
                            </>
                          ) : null}
                          {comment.locked ? (
                            <>
                              &nbsp;
                              <img src='assets/closed.gif' alt='Closed' title='Closed' style={{ marginBottom: '-1px', imageRendering: 'pixelated' }} />
                            </>
                          ) : null}
                          <PostMenu
                            key={`pmb-${index}`}
                            title='Post menu'
                            ref={(el) => {
                              threadMenuRefs.current[comment.cid] = el;
                              postMenuRef.current = el;
                            }}
                            className='post-menu-button'
                            rotated={openMenuCid === comment.cid}
                            onClick={(event) => {
                              event.stopPropagation();
                              const rect = threadMenuRefs.current[comment.cid].getBoundingClientRect();
                              setMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                              setOpenMenuCid((prevCid) => (prevCid === comment.cid ? null : comment.cid));
                            }}
                          >
                            ▶
                          </PostMenu>
                          {createPortal(
                            <PostMenuCatalog
                              selectedStyle={selectedStyle}
                              ref={(el) => {
                                postMenuCatalogRef.current = el;
                              }}
                              onClick={(event) => event.stopPropagation()}
                              style={{ position: 'absolute', top: menuPosition.top + 7, left: menuPosition.left }}
                            >
                              <div className={`post-menu-thread post-menu-thread-${comment.cid}`} style={{ display: openMenuCid === comment.cid ? 'block' : 'none' }}>
                                <ul className='post-menu-catalog'>
                                  <li
                                    onClick={() => {
                                      handleOptionClick(comment.cid);
                                      setNewSuccessMessage('Link copied to clipboard');
                                      handleShareClick(selectedAddress, comment.cid);
                                    }}
                                  >
                                    Share thread
                                  </li>
                                  <VerifiedAuthor commentCid={comment.cid}>
                                    {({ authorAddress }) => (
                                      <>
                                        {authorAddress === account?.author.address || authorAddress === account?.signer.address ? (
                                          <>
                                            <li onClick={() => handleAuthorEditClick(comment)}>Edit post</li>
                                            <li onClick={() => handleAuthorDeleteClick(comment)}>Delete post</li>
                                          </>
                                        ) : null}
                                        {canModerate ? (
                                          <>
                                            {authorAddress === account?.author.address || authorAddress === account?.signer.address ? null : (
                                              <li
                                                onClick={() => {
                                                  setModeratingCommentCid(comment.cid);
                                                  setIsModerationOpen(true);
                                                  handleOptionClick(comment.cid);
                                                  setDeletePost(true);
                                                }}
                                              >
                                                Delete post
                                              </li>
                                            )}
                                            <li
                                              onClick={() => {
                                                setModeratingCommentCid(comment.cid);
                                                setIsModerationOpen(true);
                                                handleOptionClick(comment.cid);
                                              }}
                                            >
                                              Mod tools
                                            </li>
                                          </>
                                        ) : null}
                                      </>
                                    )}
                                  </VerifiedAuthor>
                                  {commentMediaInfo && (commentMediaInfo.type === 'image' || (commentMediaInfo.type === 'webpage' && commentMediaInfo.thumbnail)) ? (
                                    <li
                                      onMouseOver={() => {
                                        setIsImageSearchOpen(true);
                                      }}
                                      onMouseLeave={() => {
                                        setIsImageSearchOpen(false);
                                      }}
                                    >
                                      Image search »
                                      <ul className='dropdown-menu post-menu-catalog' style={{ display: isImageSearchOpen ? 'block' : 'none' }}>
                                        <li onClick={() => handleOptionClick(comment.cid)}>
                                          <a href={`https://lens.google.com/uploadbyurl?url=${commentMediaInfo.url}`} target='_blank' rel='noreferrer'>
                                            Google
                                          </a>
                                        </li>
                                        <li onClick={() => handleOptionClick(comment.cid)}>
                                          <a href={`https://yandex.com/images/search?url=${commentMediaInfo.url}`} target='_blank' rel='noreferrer'>
                                            Yandex
                                          </a>
                                        </li>
                                        <li onClick={() => handleOptionClick(comment.cid)}>
                                          <a href={`https://saucenao.com/search.php?url=${commentMediaInfo.url}`} target='_blank' rel='noreferrer'>
                                            SauceNAO
                                          </a>
                                        </li>
                                      </ul>
                                    </li>
                                  ) : null}
                                  <li
                                    onMouseOver={() => {
                                      setIsClientRedirectMenuOpen(true);
                                    }}
                                    onMouseLeave={() => {
                                      setIsClientRedirectMenuOpen(false);
                                    }}
                                  >
                                    View on »
                                    <ul className='dropdown-menu post-menu-catalog' style={{ display: isClientRedirectMenuOpen ? 'block' : 'none' }}>
                                      <li onClick={() => handleOptionClick(comment.cid)}>
                                        <a href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}/c/${comment.cid}`} target='_blank' rel='noreferrer'>
                                          Plebbit
                                        </a>
                                      </li>
                                      <li onClick={() => handleOptionClick(comment.cid)}>
                                        <a href={`https://seedit.eth.limo/#/p/${selectedAddress}/c/${comment.cid}`} target='_blank' rel='noreferrer'>
                                          Seedit
                                        </a>
                                      </li>
                                      <li onClick={() => handleOptionClick(comment.cid)}>
                                        <a href={`https://plebones.eth.limo/#/p/${selectedAddress}/c/${comment.cid}`} target='_blank' rel='noreferrer'>
                                          Plebones
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </div>
                            </PostMenuCatalog>,
                            document.body,
                          )}
                          <div key={`bi-${index}`} id='backlink-id' className='backlink'>
                            {comment.replies?.pages?.topAll.comments
                              .sort((a, b) => a.timestamp - b.timestamp)
                              .map((reply, index) => (
                                <div
                                  key={`div-${index}`}
                                  style={{ display: 'inline-block' }}
                                  ref={(el) => {
                                    backlinkRefs.current[reply.cid] = el;
                                  }}
                                >
                                  <Link
                                    key={`ql-${index}`}
                                    to={() => {}}
                                    className='quote-link'
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
                                            maxWidth: rect.left - 5,
                                          });
                                        } else {
                                          setOutOfViewPosition({
                                            top,
                                            left: rect.left + rect.width + 5,
                                            maxWidth: window.innerWidth - rect.left - rect.width - 5,
                                          });
                                        }
                                      });
                                    }}
                                    onMouseLeave={() => {
                                      removeHighlight();
                                      setOutOfViewCid(null);
                                    }}
                                  >
                                    c/{reply.shortCid}
                                  </Link>
                                  &nbsp;
                                </div>
                              ))}
                          </div>
                        </span>
                        <blockquote key={`blockquote-${comment.cid}`}>
                          <Post
                            key={`post-${comment.cid}`}
                            content={comment.content}
                            postQuoteRef={(quoteShortParentCid, ref) => {
                              postRefs.current[quoteShortParentCid] = ref;
                            }}
                            postQuoteOnClick={(quoteShortParentCid) => {
                              handleQuoteClick(comment, quoteShortParentCid, null);
                            }}
                            postQuoteOnOver={(quoteShortParentCid) => {
                              const quoteParentCid = cidTracker[quoteShortParentCid];
                              if (outOfViewCid !== quoteParentCid) {
                                handleQuoteHover(comment, quoteShortParentCid, () => {
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
                                      maxWidth: rect.left - 5,
                                    });
                                  } else {
                                    setOutOfViewPosition({
                                      top,
                                      left: rect.left + rect.width + 5,
                                      maxWidth: window.innerWidth - rect.left - rect.width - 5,
                                    });
                                  }
                                });
                              }
                            }}
                            postQuoteOnLeave={() => {
                              removeHighlight();
                              setOutOfViewCid(null);
                            }}
                          />
                          <EditLabel key={`edit-label-thread-${index}`} commentCid={comment.cid} className='ttl' />
                          <StateLabel key={`state-label-thread-${index}`} commentIndex={comment.index} className='ttl ellipsis' />
                        </blockquote>
                      </div>
                    </div>
                  </div>
                  {comment.replyCount === undefined ? <PostLoader /> : null}
                  {sortedReplies.map((reply, index) => {
                    if (editedComments[reply.cid]) {
                      reply = editedComments[reply.cid];
                      if (reply.removed) {
                        reply.content = '[removed]';
                        reply.link = undefined;
                      }
                    }
                    const replyMediaInfo = getCommentMediaInfo(reply);
                    const fallbackImgUrl = 'assets/filedeleted-res.gif';
                    const isReplyOwner = subplebbit?.roles?.[reply.author.address]?.role === 'owner';
                    const isReplyAdmin = subplebbit?.roles?.[reply.author.address]?.role === 'admin';
                    const isReplyModerator = subplebbit?.roles?.[reply.author.address]?.role === 'moderator';
                    const shortParentCid = findShortParentCid(reply.parentCid, comment);
                    let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};
                    let signerAddress;
                    if (storedSigners[selectedThread]) {
                      signerAddress = storedSigners[selectedThread].address;
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
                      <div key={`pc-${index}`} className='reply-container'>
                        <div key={`sa-${index}`} className='side-arrows'>
                          {'>>'}
                        </div>
                        <div key={`pr-${index}`} className='post-reply post-reply-desktop'>
                          <div key={`pi-${index}`} className='post-info'>
                            &nbsp;
                            <span key={`nb-${index}`} className='nameblock'>
                              {reply.author?.displayName ? (
                                reply.author?.displayName.length > 20 ? (
                                  <>
                                    <span
                                      key={`mob-n-${index}`}
                                      className={`name ${isReplyAdmin || isReplyOwner ? 'capcode-admin' : isModerator ? 'capcode' : ''}`}
                                      data-tooltip-id='tooltip'
                                      data-tooltip-content={reply.author?.displayName}
                                      data-tooltip-place='top'
                                    >
                                      {reply.author?.displayName.slice(0, 20) + ' (...)'}
                                    </span>
                                  </>
                                ) : (
                                  <span key={`mob-n-${index}`} className={`name ${isReplyAdmin || isReplyOwner ? 'capcode-admin' : isModerator ? 'capcode' : ''}`}>
                                    {reply.author?.displayName ?? reply.displayName}
                                  </span>
                                )
                              ) : (
                                <span key={`mob-n-${index}`} className={`name ${isReplyAdmin || isReplyOwner ? 'capcode-admin' : isModerator ? 'capcode' : ''}`}>
                                  Anonymous
                                </span>
                              )}
                              {isReplyOwner ? (
                                <span onClick={() => setIsAdminListOpen(true)} className='name capcode-admin'>
                                  &nbsp;## Board Owner
                                </span>
                              ) : isReplyAdmin ? (
                                <span onClick={() => setIsAdminListOpen(true)} className='name capcode-admin'>
                                  &nbsp;## Board Admin
                                </span>
                              ) : isReplyModerator ? (
                                <span onClick={() => setIsAdminListOpen(true)} className='name capcode'>
                                  &nbsp;## Board Mod
                                </span>
                              ) : null}
                              &nbsp;(u/
                              <span
                                key={`pa-${index}`}
                                className='poster-address address-desktop'
                                id='reply-button'
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleAddressClick(reply.author?.shortAddress)}
                              >
                                {reply.author?.shortAddress ? (
                                  <VerifiedAuthor commentCid={reply.cid}>
                                    {({ shortAuthorAddress, authorAddressChanged }) => (
                                      <>
                                        <span className='author-address-hidden'>{reply.author.shortAddress}</span>
                                        <span className={`author-address-visible ${authorAddressChanged ? 'authorAddressChanged' : ''}`}>{shortAuthorAddress}</span>
                                      </>
                                    )}
                                  </VerifiedAuthor>
                                ) : (
                                  <span key={`mob-ha-${index}`}>{signerAddress?.slice(8, 20)}</span>
                                )}
                              </span>
                              )
                            </span>
                            &nbsp;
                            <span key={`dt-${index}`} className='date-time'>
                              <span
                                key={`tooltip-fix-${index}`}
                                data-tooltip-id='tooltip'
                                data-tooltip-content={getFormattedTime(reply?.timestamp)}
                                data-tooltip-place='top'
                              >
                                {getDate(reply?.timestamp)}&nbsp;
                              </span>
                              <span key={`pn-${index}`} className='post-number post-number-desktop'>
                                <span key={`pl1-${index}`}>c/</span>
                                {reply.shortCid ? (
                                  <Link
                                    id='reply-button'
                                    key={`pl2-${index}`}
                                    onClick={() => {
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
                                    }}
                                    title='Reply to this post'
                                  >
                                    {reply.shortCid}
                                  </Link>
                                ) : (
                                  <PendingLabel key='pending' commentIndex={reply.index} />
                                )}
                              </span>
                            </span>
                            &nbsp;
                            <PostMenu
                              key={`pmb-${index}`}
                              title='Post menu'
                              ref={(el) => {
                                replyMenuRefs.current[reply.cid] = el;
                                postMenuRef.current = el;
                              }}
                              className='post-menu-button'
                              rotated={openMenuCid === reply.cid}
                              onClick={(event) => {
                                event.stopPropagation();
                                const rect = replyMenuRefs.current[reply.cid].getBoundingClientRect();
                                setMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                                setOpenMenuCid((prevCid) => (prevCid === reply.cid ? null : reply.cid));
                              }}
                            >
                              ▶
                            </PostMenu>
                            {createPortal(
                              <PostMenuCatalog
                                selectedStyle={selectedStyle}
                                ref={(el) => {
                                  postMenuCatalogRef.current = el;
                                }}
                                onClick={(event) => event.stopPropagation()}
                                style={{ position: 'absolute', top: menuPosition.top + 7, left: menuPosition.left }}
                              >
                                <div className={`post-menu-reply post-menu-reply-${reply.cid}`} style={{ display: openMenuCid === reply.cid ? 'block' : 'none' }}>
                                  <ul className='post-menu-catalog'>
                                    <li
                                      onClick={() => {
                                        handleOptionClick(reply.cid);
                                        setNewSuccessMessage('Link copied to clipboard');
                                        handleShareClick(comment.subplebbitAddress, comment.cid);
                                      }}
                                    >
                                      Share post
                                    </li>
                                    <VerifiedAuthor commentCid={reply.cid}>
                                      {({ authorAddress }) => (
                                        <>
                                          {authorAddress === account?.author.address || authorAddress === account?.signer.address ? (
                                            <>
                                              <li onClick={() => handleAuthorEditClick(reply)}>Edit post</li>
                                              <li onClick={() => handleAuthorDeleteClick(reply)}>Delete post</li>
                                            </>
                                          ) : null}
                                          {canModerate ? (
                                            <>
                                              {authorAddress === account?.author.address || authorAddress === account?.signer.address ? null : (
                                                <li
                                                  onClick={() => {
                                                    setModeratingCommentCid(reply.cid);
                                                    setIsModerationOpen(true);
                                                    handleOptionClick(reply.cid);
                                                    setDeletePost(true);
                                                  }}
                                                >
                                                  Delete post
                                                </li>
                                              )}
                                              <li
                                                onClick={() => {
                                                  setModeratingCommentCid(reply.cid);
                                                  setIsModerationOpen(true);
                                                  handleOptionClick(reply.cid);
                                                }}
                                              >
                                                Mod tools
                                              </li>
                                            </>
                                          ) : null}
                                        </>
                                      )}
                                    </VerifiedAuthor>
                                    {replyMediaInfo && (replyMediaInfo.type === 'image' || (replyMediaInfo.type === 'webpage' && replyMediaInfo.thumbnail)) ? (
                                      <li
                                        onMouseOver={() => {
                                          setIsImageSearchOpen(true);
                                        }}
                                        onMouseLeave={() => {
                                          setIsImageSearchOpen(false);
                                        }}
                                      >
                                        Image search »
                                        <ul className='dropdown-menu post-menu-catalog' style={{ display: isImageSearchOpen ? 'block' : 'none' }}>
                                          <li onClick={() => handleOptionClick(reply.cid)}>
                                            <a href={`https://lens.google.com/uploadbyurl?url=${replyMediaInfo.url}`} target='_blank' rel='noreferrer'>
                                              Google
                                            </a>
                                          </li>
                                          <li onClick={() => handleOptionClick(reply.cid)}>
                                            <a href={`https://yandex.com/images/search?img_url=${replyMediaInfo.url}&rpt=imageview`} target='_blank' rel='noreferrer'>
                                              Yandex
                                            </a>
                                          </li>
                                          <li onClick={() => handleOptionClick(reply.cid)}>
                                            <a href={`https://saucenao.com/search.php?url=${replyMediaInfo.url}`} target='_blank' rel='noreferrer'>
                                              SauceNAO
                                            </a>
                                          </li>
                                        </ul>
                                      </li>
                                    ) : null}
                                    <li
                                      onMouseOver={() => {
                                        setIsClientRedirectMenuOpen(true);
                                      }}
                                      onMouseLeave={() => {
                                        setIsClientRedirectMenuOpen(false);
                                      }}
                                    >
                                      View on »
                                      <ul className='dropdown-menu post-menu-catalog' style={{ display: isClientRedirectMenuOpen ? 'block' : 'none' }}>
                                        <li onClick={() => handleOptionClick(reply.cid)}>
                                          <a href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}/c/${reply.cid}`} target='_blank' rel='noreferrer'>
                                            Plebbit
                                          </a>
                                        </li>
                                        <li onClick={() => handleOptionClick(reply.cid)}>
                                          <a href={`https://seedit.eth.limo/#/p/${selectedAddress}/c/${reply.cid}`} target='_blank' rel='noreferrer'>
                                            Seedit
                                          </a>
                                        </li>
                                        <li onClick={() => handleOptionClick(reply.cid)}>
                                          <a href={`https://plebones.eth.limo/#/p/${selectedAddress}/c/${reply.cid}`} target='_blank' rel='noreferrer'>
                                            Plebones
                                          </a>
                                        </li>
                                      </ul>
                                    </li>
                                  </ul>
                                </div>
                              </PostMenuCatalog>,
                              document.body,
                            )}
                            <div key={`bi-${index}`} id='backlink-id' className='backlink'>
                              {reply.replies?.pages?.topAll.comments
                                .sort((a, b) => a.timestamp - b.timestamp)
                                .map((reply, index) => (
                                  <div
                                    key={`div-${index}`}
                                    style={{ display: 'inline-block' }}
                                    ref={(el) => {
                                      backlinkRefs.current[reply.cid] = el;
                                    }}
                                  >
                                    <Link
                                      key={`ql-${index}`}
                                      to={() => {}}
                                      className='quote-link'
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
                                              maxWidth: rect.left - 5,
                                            });
                                          } else {
                                            setOutOfViewPosition({
                                              top,
                                              left: rect.left + rect.width + 5,
                                              maxWidth: window.innerWidth - rect.left - rect.width - 5,
                                            });
                                          }
                                        });
                                      }}
                                      onMouseLeave={() => {
                                        removeHighlight();
                                        setOutOfViewCid(null);
                                      }}
                                    >
                                      c/{reply.shortCid}
                                    </Link>
                                    &nbsp;
                                  </div>
                                ))}
                            </div>
                          </div>
                          {replyMediaInfo?.url ? (
                            <div key={`f-${index}`} className='file' style={{ marginBottom: '5px' }}>
                              <div key={`ft-${index}`} className='file-text'>
                                Link:&nbsp;
                                <a key={`fa-${index}`} href={replyMediaInfo.url} target='_blank' rel='noopener noreferrer'>
                                  {replyMediaInfo?.url.length > 30 ? replyMediaInfo?.url.slice(0, 30) + '(...)' : replyMediaInfo?.url}
                                </a>
                                {replyMediaInfo?.type === 'iframe' ? null : ` (${replyMediaInfo?.type})`}
                                {((isReplyThumbnailClicked[index] && (replyMediaInfo.type === 'iframe' || replyMediaInfo.type === 'video')) ||
                                  (replyMediaInfo.type === 'iframe' && !replyMediaInfo.thumbnail)) && (
                                  <span>
                                     [
                                    <span
                                      className='reply-link'
                                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                      onClick={() => {
                                        handleThumbnailClick(index, 'reply');
                                      }}
                                    >
                                      {isReplyThumbnailClicked[index] ? 'Close' : 'Embed'}
                                    </span>
                                    ]
                                  </span>
                                )}
                              </div>
                              {replyMediaInfo?.type === 'iframe' && (
                                <div key={`enlarge-${index}`} className={`img-container ${isReplyThumbnailClicked[index] ? 'expanded-container' : ''}`}>
                                  <span
                                    key={`fta-${index}`}
                                    className='file-thumb-reply'
                                    style={isReplyThumbnailClicked[index] || !replyMediaInfo.thumbnail ? {} : { width: replyDisplayWidth, height: replyDisplayHeight }}
                                  >
                                    {isReplyThumbnailClicked[index] && replyMediaInfo.url ? (
                                      <Embed url={replyMediaInfo.url} key={`fti-${index}`} />
                                    ) : replyMediaInfo.thumbnail ? (
                                      <img
                                        key={`fti-${index}`}
                                        src={replyMediaInfo.thumbnail}
                                        alt='thumbnail'
                                        onClick={() => {
                                          handleThumbnailClick(index, 'reply');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        onError={(e) => (e.target.src = fallbackImgUrl)}
                                      />
                                    ) : null}
                                  </span>
                                </div>
                              )}
                              {replyMediaInfo?.type === 'webpage' ? (
                                <div key={`enlarge-reply-${index}`} className='img-container'>
                                  <span
                                    key={`fta-${index}`}
                                    className='file-thumb-reply'
                                    style={isReplyThumbnailClicked[index] || !reply.thumbnailUrl ? {} : { width: replyDisplayWidth, height: replyDisplayHeight }}
                                  >
                                    {reply.thumbnailUrl ? (
                                      <img
                                        key={`fti-${index}`}
                                        src={replyMediaInfo.thumbnail}
                                        alt={replyMediaInfo.type}
                                        onClick={(e) => {
                                          handleImageClick(e);
                                          handleThumbnailClick(index, 'reply');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        onError={(e) => (e.target.src = fallbackImgUrl)}
                                      />
                                    ) : null}
                                  </span>
                                </div>
                              ) : null}
                              {replyMediaInfo?.type === 'image' ? (
                                <div key={`enlarge-reply-${index}`} className='img-container'>
                                  <span
                                    key={`fta-${index}`}
                                    className='file-thumb-reply'
                                    style={isReplyThumbnailClicked[index] ? {} : { width: replyDisplayWidth, height: replyDisplayHeight }}
                                  >
                                    <img
                                      key={`fti-${index}`}
                                      src={replyMediaInfo.url}
                                      alt={replyMediaInfo.type}
                                      onClick={(e) => {
                                        handleImageClick(e);
                                        handleThumbnailClick(index, 'reply');
                                      }}
                                      style={{ cursor: 'pointer' }}
                                      onError={(e) => (e.target.src = fallbackImgUrl)}
                                    />
                                  </span>
                                </div>
                              ) : null}
                              {replyMediaInfo?.type === 'video' ? (
                                <div key={`enlarge-reply-${index}`} className={`img-container ${isReplyThumbnailClicked[index] ? 'expanded-container' : ''}`}>
                                  <span
                                    key={`fta-${index}`}
                                    className='file-thumb-reply'
                                    style={isReplyThumbnailClicked[index] ? {} : { width: replyDisplayWidth, height: replyDisplayHeight }}
                                  >
                                    {isReplyThumbnailClicked[index] ? (
                                      <video
                                        controls
                                        className='enlarged'
                                        key={`fti-${index}`}
                                        src={replyMediaInfo.url}
                                        alt={replyMediaInfo.type}
                                        style={{ cursor: 'pointer' }}
                                        onError={(e) => (e.target.src = fallbackImgUrl)}
                                      />
                                    ) : (
                                      <video
                                        key={`fti-${index}`}
                                        src={replyMediaInfo.url}
                                        alt='thumbnail'
                                        onClick={() => {
                                          handleThumbnailClick(index, 'reply');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        onError={(e) => (e.target.src = fallbackImgUrl)}
                                      />
                                    )}
                                  </span>
                                </div>
                              ) : null}
                              {replyMediaInfo?.type === 'audio' ? (
                                <span
                                  key={`fta-${index}`}
                                  className='file-thumb-reply'
                                  style={isReplyThumbnailClicked[index] ? {} : { width: replyDisplayWidth, height: replyDisplayHeight }}
                                >
                                  <audio
                                    controls
                                    key={`fti-${index}`}
                                    src={replyMediaInfo.url}
                                    alt={replyMediaInfo.type}
                                    onError={(e) => (e.target.src = fallbackImgUrl)}
                                  />
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                          <blockquote key={`pm-${index}`} className='post-message'>
                            <Link
                              to={() => {}}
                              key={`r-pm-${index}`}
                              className='quotelink'
                              ref={(el) => {
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
                                      maxWidth: rect.left - 5,
                                    });
                                  } else {
                                    setOutOfViewPosition({
                                      top,
                                      left: rect.left + rect.width + 5,
                                      maxWidth: window.innerWidth - rect.left - rect.width - 5,
                                    });
                                  }
                                });
                              }}
                              onMouseLeave={() => {
                                removeHighlight();
                                setOutOfViewCid(null);
                              }}
                            >
                              {`c/${shortParentCid}`}
                              {shortParentCid === comment.shortCid ? ' (OP)' : null}
                            </Link>
                            <Post
                              key={`post-${index}`}
                              content={reply.content}
                              postQuoteRef={(quoteShortParentCid, ref) => {
                                postRefs.current[quoteShortParentCid] = ref;
                              }}
                              postQuoteOnClick={(quoteShortParentCid) => {
                                handleQuoteClick(reply, quoteShortParentCid, null);
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
                                        maxWidth: rect.left - 5,
                                      });
                                    } else {
                                      setOutOfViewPosition({
                                        top,
                                        left: rect.left + rect.width + 5,
                                        maxWidth: window.innerWidth - rect.left - rect.width - 5,
                                      });
                                    }
                                  });
                                }
                              }}
                              postQuoteOnLeave={() => {
                                removeHighlight();
                                setOutOfViewCid(null);
                              }}
                            />
                            <EditLabel key={`edit-label-reply-${index}`} commentCid={reply.cid} className='ttl' />
                            <StateLabel key={`state-label-reply-${index}`} commentIndex={reply.index} className='ttl ellipsis' />
                          </blockquote>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='thread-mobile' key='thread-mobile'>
                  <hr />
                  <div className='op-container' key='op-container'>
                    <div key={`mob-po-${comment.cid}`} className='post op op-mobile'>
                      <div key={`mob-pi-${comment.cid}`} className='post-info-mobile'>
                        <button
                          key={`mob-pb-${index}`}
                          className='post-menu-button-mobile'
                          ref={(el) => {
                            threadMenuRefsMobile.current[comment.cid] = el;
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            const rect = threadMenuRefsMobile.current[comment.cid].getBoundingClientRect();
                            setMobileMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                            setOpenMobileMenuCid((prevCid) => (prevCid === comment.cid ? null : comment.cid));
                          }}
                          style={{ all: 'unset', cursor: 'pointer' }}
                        >
                          ...
                        </button>
                        {createPortal(
                          <PostMenuMobile
                            selectedStyle={selectedStyle}
                            ref={(el) => {
                              postMenuMobileRef.current = el;
                            }}
                            onClick={(event) => event.stopPropagation()}
                            style={{
                              position: 'absolute',
                              display: openMobileMenuCid === comment.cid ? 'block' : 'none',
                              top: mobileMenuPosition.top + 20,
                              left: mobileMenuPosition.left,
                            }}
                          >
                            <ul className={`post-menu-mobile-thread-${comment.cid}`}>
                              <li
                                onClick={() => {
                                  handleMobileOptionClick(comment.cid);
                                  setNewSuccessMessage('Link copied to clipboard');
                                  handleShareClick(selectedAddress, comment.cid);
                                }}
                              >
                                Share thread
                              </li>
                              <VerifiedAuthor commentCid={comment.cid}>
                                {({ authorAddress }) => (
                                  <>
                                    {authorAddress === account?.author.address || authorAddress === account?.signer.address ? (
                                      <>
                                        <li onClick={() => handleAuthorEditClick(comment)}>Edit post</li>
                                        <li onClick={() => handleAuthorDeleteClick(comment)}>Delete post</li>
                                      </>
                                    ) : null}
                                    {canModerate ? (
                                      <>
                                        {authorAddress === account?.author.address || authorAddress === account?.signer.address ? null : (
                                          <li
                                            onClick={() => {
                                              setModeratingCommentCid(comment.cid);
                                              setIsModerationOpen(true);
                                              handleMobileOptionClick(comment.cid);
                                              setDeletePost(true);
                                            }}
                                          >
                                            Delete post
                                          </li>
                                        )}
                                        <li
                                          onClick={() => {
                                            setModeratingCommentCid(comment.cid);
                                            setIsModerationOpen(true);
                                            handleMobileOptionClick(comment.cid);
                                          }}
                                        >
                                          Mod tools
                                        </li>
                                      </>
                                    ) : null}
                                  </>
                                )}
                              </VerifiedAuthor>
                              {commentMediaInfo && (commentMediaInfo.type === 'image' || (commentMediaInfo.type === 'webpage' && commentMediaInfo.thumbnail)) ? (
                                <>
                                  <a
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                    href={`https://lens.google.com/uploadbyurl?url=${commentMediaInfo.url}`}
                                    target='_blank'
                                    rel='noreferrer'
                                  >
                                    <li onClick={() => handleMobileOptionClick(comment.cid)}>Search image on Google</li>
                                  </a>
                                  <a
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                    href={`https://yandex.com/images/search?url=${commentMediaInfo.url}`}
                                    target='_blank'
                                    rel='noreferrer'
                                  >
                                    <li onClick={() => handleMobileOptionClick(comment.cid)}>Search image on Yandex</li>
                                  </a>
                                  <a
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                    href={`https://saucenao.com/search.php?url=${commentMediaInfo.url}`}
                                    target='_blank'
                                    rel='noreferrer'
                                  >
                                    <li onClick={() => handleMobileOptionClick(comment.cid)}>Search image on SauceNAO</li>
                                  </a>
                                </>
                              ) : null}
                              <a
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}`}
                                target='_blank'
                                rel='noreferrer'
                              >
                                <li onClick={() => handleOptionClick(comment.cid)}>View on plebbit</li>
                              </a>
                              <a
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                href={`https://plebones.eth.limo/#/p/${selectedAddress}`}
                                target='_blank'
                                rel='noreferrer'
                              >
                                <li onClick={() => handleOptionClick(comment.cid)}>View on plebones</li>
                              </a>
                            </ul>
                          </PostMenuMobile>,
                          document.body,
                        )}
                        <span className='name-block-mobile'>
                          {comment?.author?.displayName ? (
                            comment?.author?.displayName.length > 15 ? (
                              <>
                                <span
                                  key={`mob-n-${comment.cid}`}
                                  className='name-mobile'
                                  data-tooltip-id='tooltip'
                                  data-tooltip-content={comment?.author?.displayName}
                                  data-tooltip-place='top'
                                >
                                  {comment?.author?.displayName.slice(0, 15) + ' (...)'}
                                </span>
                              </>
                            ) : (
                              <span key={`mob-n-${comment.cid}`} className='name-mobile'>
                                {comment?.author?.displayName}
                              </span>
                            )
                          ) : (
                            <span key={`mob-n-${comment.cid}`} className='name-mobile'>
                              Anonymous
                            </span>
                          )}
                          {isOwner ? (
                            <span onClick={() => setIsAdminListOpen(true)} className='name capcode-admin'>
                              &nbsp;## Board Owner
                            </span>
                          ) : isAdmin ? (
                            <span onClick={() => setIsAdminListOpen(true)} className='name capcode-admin'>
                              &nbsp;## Board Admin
                            </span>
                          ) : isModerator ? (
                            <span onClick={() => setIsAdminListOpen(true)} className='name capcode'>
                              &nbsp;## Board Mod
                            </span>
                          ) : null}
                          &nbsp;
                          <span
                            key={`mob-pa-${comment.cid}`}
                            className='poster-address-mobile address-mobile'
                            id='reply-button'
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleAddressClick(<VerifiedAuthor commentCid={comment.cid}>{({ shortAuthorAddress }) => shortAuthorAddress}</VerifiedAuthor>)}
                          >
                            (u/
                            <span key={`mob-ha-${comment.cid}`} className='highlight-address-mobile poster-address'>
                              <VerifiedAuthor commentCid={comment.cid}>
                                {({ shortAuthorAddress, authorAddressChanged }) => (
                                  <>
                                    <span className='author-address-hidden'>{comment.author?.shortAddress}</span>
                                    <span className={`author-address-visible ${authorAddressChanged ? 'authorAddressChanged' : ''}`}>{shortAuthorAddress}</span>
                                  </>
                                )}
                              </VerifiedAuthor>
                            </span>
                            )&nbsp;
                          </span>
                          <span key={`ti-mob-${index}`} className='thread-icons-mobile'>
                            {comment.pinned ? (
                              <img
                                src='assets/sticky.gif'
                                alt='Sticky'
                                title='Sticky'
                                style={{ all: 'unset', marginBottom: '-2px', paddingLeft: '2px', imageRendering: 'pixelated' }}
                              />
                            ) : null}
                            {comment.locked ? (
                              <img
                                src='assets/closed.gif'
                                alt='Closed'
                                title='Closed'
                                style={{ all: 'unset', marginBottom: '-2px', paddingLeft: '2px', imageRendering: 'pixelated' }}
                              />
                            ) : null}
                          </span>
                          <br key={`mob-br1-${comment.cid}`} />
                          {comment.title ? (
                            comment.title.length > 30 ? (
                              <>
                                <span
                                  key={`mob-t-${comment.cid}`}
                                  className='subject-mobile'
                                  data-tooltip-id='tooltip'
                                  data-tooltip-content={comment.title}
                                  data-tooltip-place='top'
                                >
                                  {comment.title.slice(0, 30) + ' (...)'}
                                </span>
                              </>
                            ) : (
                              <span key={`mob-t-${comment.cid}`} className='subject-mobile'>
                                {comment.title}
                              </span>
                            )
                          ) : null}
                        </span>
                        <span key={`mob-dt-${comment.cid}`} className='date-time-mobile post-number-mobile'>
                          <span
                            key={`tooltip-fix-${comment.cid}`}
                            data-tooltip-id='tooltip'
                            data-tooltip-content={getFormattedTime(comment?.timestamp)}
                            data-tooltip-place='top'
                          >
                            {getDate(comment?.timestamp)}
                          </span>
                          &nbsp;
                          <span key={`mob-no-${comment.cid}`}>c/</span>
                          <Link
                            to={() => {}}
                            id='reply-button'
                            key={`mob-no2-${comment.cid}`}
                            title='Reply to this post'
                            onClick={() => {
                              let text = document.getSelection().toString();
                              text = text ? `>${text}` : text;
                              setSelectedText(text);
                              if (isReplyOpen) {
                                setReplyQuoteCid(comment.shortCid);
                                setTriggerInsertion(Date.now());
                              } else {
                                setIsReplyOpen(true);
                                setSelectedShortCid(comment.shortCid);
                                setSelectedParentCid(comment.cid);
                              }
                            }}
                          >
                            {comment.shortCid}
                          </Link>
                        </span>
                      </div>
                      {comment.link ? (
                        <div key={`mob-f-${index}`} className='file-mobile'>
                          {commentMediaInfo?.type === 'iframe' && (
                            <div key={`enlarge-mob-${index}`} className='img-container'>
                              <span key={`mob-fta-${index}`} className='file-thumb-mobile' style={isMobileThreadThumbnailClicked[index] ? {} : { marginBottom: '25px' }}>
                                {isMobileThreadThumbnailClicked[index] && commentMediaInfo.url ? (
                                  <div style={{ width: '92vw' }}>
                                    <Embed url={commentMediaInfo.url} key={`fti-mobile-${index}`} />
                                  </div>
                                ) : commentMediaInfo.thumbnail ? (
                                  <img
                                    key={`mob-fti-${index}`}
                                    src={commentMediaInfo.thumbnail}
                                    alt='thumbnail'
                                    onClick={() => {
                                      handleThumbnailClick(index, 'mobileThread');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    onError={(e) => (e.target.src = fallbackImgUrl)}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      handleThumbnailClick(index, 'mobileThread');
                                    }}
                                  >
                                    Embed
                                  </span>
                                )}
                                {commentMediaInfo?.type === 'video' || commentMediaInfo?.type === 'iframe' ? (
                                  isMobileThreadThumbnailClicked[index] ? (
                                    <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '15px' }}>
                                      <span
                                        className='button-mobile'
                                        style={{ float: 'none', cursor: 'pointer' }}
                                        onClick={() => {
                                          handleThumbnailClick(index, 'mobileThread');
                                        }}
                                      >
                                        Close
                                      </span>
                                    </div>
                                  ) : (
                                    <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                      webpage
                                    </div>
                                  )
                                ) : (
                                  <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                    webpage
                                  </div>
                                )}
                              </span>
                            </div>
                          )}
                          {commentMediaInfo?.url ? (
                            commentMediaInfo.type === 'webpage' ? (
                              <div key={`enlarge-mob-${index}`} className='img-container'>
                                <span key={`mob-ft${comment.cid}`} className='file-thumb-mobile'>
                                  {comment.thumbnailUrl ? (
                                    <img
                                      key={`mob-img-${index}`}
                                      src={commentMediaInfo.thumbnail}
                                      alt='thumbnail'
                                      onClick={(e) => {
                                        handleImageClick(e);
                                        handleThumbnailClick(index, 'mobileThread');
                                      }}
                                      style={{ cursor: 'pointer' }}
                                      onError={(e) => (e.target.src = fallbackImgUrl)}
                                    />
                                  ) : null}
                                  <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                    {commentMediaInfo?.type}
                                  </div>
                                </span>
                              </div>
                            ) : commentMediaInfo.type === 'image' ? (
                              <div key={`enlarge-mob-${index}`} className='img-container'>
                                <span key={`mob-ft${comment.cid}`} className='file-thumb-mobile'>
                                  <img
                                    key={`mob-img-${index}`}
                                    src={commentMediaInfo.url}
                                    alt={commentMediaInfo.type}
                                    onClick={(e) => {
                                      handleImageClick(e);
                                      handleThumbnailClick(index, 'mobileThread');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    onError={(e) => (e.target.src = fallbackImgUrl)}
                                  />
                                  <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                    {commentMediaInfo?.type}
                                  </div>
                                </span>
                              </div>
                            ) : commentMediaInfo.type === 'video' ? (
                              <span key={`mob-ft${comment.cid}`} className='file-thumb-mobile'>
                                {isMobileThreadThumbnailClicked[index] ? (
                                  <video
                                    key={`fti-${index}`}
                                    src={commentMediaInfo.url}
                                    alt={commentMediaInfo.type}
                                    controls
                                    style={{ cursor: 'pointer' }}
                                    onError={(e) => (e.target.src = fallbackImgUrl)}
                                  />
                                ) : (
                                  <video
                                    key={`fti-${index}`}
                                    src={commentMediaInfo.url}
                                    alt='thumbnail'
                                    onClick={() => {
                                      handleThumbnailClick(index, 'mobileThread');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    id='video-thumbnail-mobile'
                                    onError={(e) => (e.target.src = fallbackImgUrl)}
                                  />
                                )}
                                {commentMediaInfo?.type === 'video' || commentMediaInfo?.type === 'iframe' ? (
                                  isMobileThreadThumbnailClicked[index] ? (
                                    <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '15px' }}>
                                      <span
                                        className='button-mobile'
                                        style={{ float: 'none', cursor: 'pointer' }}
                                        onClick={() => {
                                          handleThumbnailClick(index, 'mobileThread');
                                        }}
                                      >
                                        Close
                                      </span>
                                    </div>
                                  ) : (
                                    <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                      video
                                    </div>
                                  )
                                ) : (
                                  <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                    video
                                  </div>
                                )}
                              </span>
                            ) : commentMediaInfo.type === 'audio' ? (
                              <span key={`mob-ft${comment.cid}`} className='file-thumb-mobile'>
                                <audio key={`mob-img-${index}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => (e.target.src = fallbackImgUrl)} />
                                <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                  {commentMediaInfo?.type}
                                </div>
                              </span>
                            ) : null
                          ) : null}
                        </div>
                      ) : null}
                      <blockquote key={`mob-bq-${comment.cid}`} className='post-message-mobile'>
                        {comment.content ? (
                          <>
                            <Post
                              key={`post-${comment.cid}`}
                              content={comment.content}
                              postQuoteRef={(quoteShortParentCid, ref) => {
                                postRefs.current[quoteShortParentCid] = ref;
                              }}
                              postQuoteOnClick={(quoteShortParentCid) => {
                                handleQuoteClick(comment, quoteShortParentCid, null);
                              }}
                              postQuoteOnOver={(quoteShortParentCid) => {
                                const quoteParentCid = cidTracker[quoteShortParentCid];
                                if (outOfViewCid !== quoteParentCid) {
                                  handleQuoteHover(comment, quoteShortParentCid, () => {
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
                                        maxWidth: rect.left - 5,
                                      });
                                    } else {
                                      setOutOfViewPosition({
                                        top,
                                        left: rect.left + rect.width + 5,
                                        maxWidth: window.innerWidth - rect.left - rect.width - 5,
                                      });
                                    }
                                  });
                                }
                              }}
                              postQuoteOnLeave={() => {
                                removeHighlight();
                                setOutOfViewCid(null);
                              }}
                            />
                            <EditLabel key={`edit-label-thread-mob-${index}`} commentCid={comment.cid} className='ttl' />
                            <StateLabel key={`state-label-thread-mob-${index}`} commentIndex={comment.index} className='ttl ellipsis' />
                          </>
                        ) : null}
                      </blockquote>
                    </div>
                  </div>
                  {comment.replyCount === undefined ? <PostLoader /> : null}
                  {sortedReplies.map((reply, index) => {
                    const replyMediaInfo = getCommentMediaInfo(reply);
                    const shortParentCid = findShortParentCid(reply.parentCid, comment);
                    const isReplyOwner = subplebbit?.roles?.[reply.author.address]?.role === 'owner';
                    const isReplyAdmin = subplebbit?.roles?.[reply.author.address]?.role === 'admin';
                    const isReplyModerator = subplebbit?.roles?.[reply.author.address]?.role === 'moderator';
                    let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};
                    let signerAddress;
                    if (storedSigners[selectedThread]) {
                      signerAddress = storedSigners[selectedThread].address;
                    }
                    return (
                      <div key={`mob-rc-${index}`} className='reply-container'>
                        <div key={`mob-pr-${index}`} className='post-reply post-reply-mobile'>
                          <div key={`mob-pi-${index}`} className='post-info-mobile'>
                            <button
                              key={`mob-pb-${index}`}
                              className='post-menu-button-mobile'
                              ref={(el) => {
                                replyMenuRefsMobile.current[reply.cid] = el;
                              }}
                              onClick={(event) => {
                                event.stopPropagation();
                                const rect = replyMenuRefsMobile.current[reply.cid].getBoundingClientRect();
                                setMobileMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                                setOpenMobileMenuCid((prevCid) => (prevCid === reply.cid ? null : reply.cid));
                              }}
                              style={{ all: 'unset', cursor: 'pointer' }}
                            >
                              ...
                            </button>
                            {createPortal(
                              <PostMenuMobile
                                selectedStyle={selectedStyle}
                                ref={(el) => {
                                  postMenuMobileRef.current = el;
                                }}
                                onClick={(event) => event.stopPropagation()}
                                style={{
                                  position: 'absolute',
                                  display: openMobileMenuCid === reply.cid ? 'block' : 'none',
                                  top: mobileMenuPosition.top + 20,
                                  left: mobileMenuPosition.left,
                                }}
                              >
                                <ul className={`post-menu-mobile-thread-${reply.cid}`}>
                                  <li
                                    onClick={() => {
                                      handleMobileOptionClick(reply.cid);
                                      setNewSuccessMessage('Link copied to clipboard');
                                      handleShareClick(comment.subplebbitAddress, comment.cid);
                                    }}
                                  >
                                    Share post
                                  </li>
                                  <VerifiedAuthor commentCid={reply.cid}>
                                    {({ authorAddress }) => (
                                      <>
                                        {authorAddress === account?.author.address || authorAddress === account?.signer.address ? (
                                          <>
                                            <li onClick={() => handleAuthorEditClick(reply)}>Edit post</li>
                                            <li onClick={() => handleAuthorDeleteClick(reply)}>Delete post</li>
                                          </>
                                        ) : null}
                                        {canModerate ? (
                                          <>
                                            {authorAddress === account?.author.address || authorAddress === account?.signer.address ? null : (
                                              <li
                                                onClick={() => {
                                                  setModeratingCommentCid(reply.cid);
                                                  setIsModerationOpen(true);
                                                  handleMobileOptionClick(reply.cid);
                                                  setDeletePost(true);
                                                }}
                                              >
                                                Delete post
                                              </li>
                                            )}
                                            <li
                                              onClick={() => {
                                                setModeratingCommentCid(reply.cid);
                                                setIsModerationOpen(true);
                                                handleMobileOptionClick(reply.cid);
                                              }}
                                            >
                                              Mod tools
                                            </li>
                                          </>
                                        ) : null}
                                      </>
                                    )}
                                  </VerifiedAuthor>
                                  {replyMediaInfo && (replyMediaInfo.type === 'image' || (replyMediaInfo.type === 'webpage' && replyMediaInfo.thumbnail)) ? (
                                    <>
                                      <a
                                        style={{ color: 'inherit', textDecoration: 'none' }}
                                        href={`https://lens.google.com/uploadbyurl?url=${replyMediaInfo.url}`}
                                        target='_blank'
                                        rel='noreferrer'
                                      >
                                        <li onClick={() => handleMobileOptionClick(reply.cid)}>Search image on Google</li>
                                      </a>
                                      <a
                                        style={{ color: 'inherit', textDecoration: 'none' }}
                                        href={`https://yandex.com/images/search?url=${replyMediaInfo.url}`}
                                        target='_blank'
                                        rel='noreferrer'
                                      >
                                        <li onClick={() => handleMobileOptionClick(reply.cid)}>Search image on Yandex</li>
                                      </a>
                                      <a
                                        style={{ color: 'inherit', textDecoration: 'none' }}
                                        href={`https://saucenao.com/search.php?url=${replyMediaInfo.url}`}
                                        target='_blank'
                                        rel='noreferrer'
                                      >
                                        <li onClick={() => handleMobileOptionClick(reply.cid)}>Search image on SauceNAO</li>
                                      </a>
                                    </>
                                  ) : null}
                                  <a
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                    href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}`}
                                    target='_blank'
                                    rel='noreferrer'
                                  >
                                    <li onClick={() => handleOptionClick(reply.cid)}>View on plebbit</li>
                                  </a>
                                  <a
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                    href={`https://seedit.eth.limo/#/p/${selectedAddress}`}
                                    target='_blank'
                                    rel='noreferrer'
                                  >
                                    <li onClick={() => handleOptionClick(reply.cid)}>View on seedit</li>
                                  </a>
                                  <a
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                    href={`https://plebones.eth.limo/#/p/${selectedAddress}`}
                                    target='_blank'
                                    rel='noreferrer'
                                  >
                                    <li onClick={() => handleOptionClick(reply.cid)}>View on plebones</li>
                                  </a>
                                </ul>
                              </PostMenuMobile>,
                              document.body,
                            )}
                            <span key={`mob-nb-${index}`} className='name-block-mobile'>
                              {reply.author?.displayName ? (
                                reply.author?.displayName.length > 12 ? (
                                  <>
                                    <span
                                      key={`mob-n-${index}`}
                                      className='name-mobile'
                                      data-tooltip-id='tooltip'
                                      data-tooltip-content={reply.author?.displayName}
                                      data-tooltip-place='top'
                                    >
                                      {reply.author?.displayName.slice(0, 12) + ' (...)'}
                                    </span>
                                  </>
                                ) : (
                                  <span key={`mob-n-${index}`} className='name-mobile'>
                                    {reply.author?.displayName}
                                  </span>
                                )
                              ) : (
                                <span key={`mob-n-${index}`} className='name-mobile'>
                                  Anonymous
                                </span>
                              )}
                              {isReplyOwner ? (
                                <span onClick={() => setIsAdminListOpen(true)} className='name capcode-admin'>
                                  &nbsp;## Board Owner
                                </span>
                              ) : isReplyAdmin ? (
                                <span onClick={() => setIsAdminListOpen(true)} className='name capcode-admin'>
                                  &nbsp;## Board Admin
                                </span>
                              ) : isReplyModerator ? (
                                <span onClick={() => setIsAdminListOpen(true)} className='name capcode'>
                                  &nbsp;## Board Mod
                                </span>
                              ) : null}
                              <span key={`fix1-ha-${index}`} className='poster-address-mobile'>
                                &nbsp;(u/
                              </span>
                              <span
                                key={`mob-pa-${index}`}
                                className='poster-address-mobile poster-address'
                                id='reply-button'
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleAddressClick(reply.author?.shortAddress)}
                              >
                                {reply.author?.shortAddress ? (
                                  <VerifiedAuthor commentCid={reply.cid}>
                                    {({ shortAuthorAddress, authorAddressChanged }) => (
                                      <>
                                        <span className='author-address-hidden'>{reply.author.shortAddress}</span>
                                        <span className={`author-address-visible ${authorAddressChanged ? 'authorAddressChanged' : ''}`}>{shortAuthorAddress}</span>
                                      </>
                                    )}
                                  </VerifiedAuthor>
                                ) : (
                                  <span key={`mob-ha-${index}`}>{signerAddress?.slice(8, 20)}</span>
                                )}
                              </span>
                              <span key={`fix2-ha-${index}`} className='poster-address-mobile'>
                                )
                              </span>
                              <br key={`mob-br-${index}`} />
                            </span>
                            <span key={`mob-dt-${index}`} className='date-time-mobile post-number-mobile'>
                              <span
                                key={`tooltip-fix-mob-${index}`}
                                data-tooltip-id='tooltip'
                                data-tooltip-content={getFormattedTime(reply?.timestamp)}
                                data-tooltip-place='top'
                              >
                                {getDate(reply?.timestamp)}&nbsp;
                              </span>
                              <span key={`mob-pl1-${index}`}>c/</span>
                              {reply.shortCid ? (
                                <Link
                                  id='reply-button'
                                  key={`mob-pl2-${index}`}
                                  onClick={() => {
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
                                  }}
                                  title='Reply to this post'
                                >
                                  {reply.shortCid}
                                </Link>
                              ) : (
                                <PendingLabel key='pending-mob' commentIndex={reply.index} />
                              )}
                            </span>
                          </div>
                          {reply.link ? (
                            <div key={`mob-f-${reply.cid}`} className='file-mobile'>
                              {replyMediaInfo?.url ? (
                                replyMediaInfo.type === 'iframe' ? (
                                  <div key={`enlarge-mob-${index}`} className='img-container'>
                                    <span
                                      key={`mob-fta-${index}`}
                                      className='file-thumb-mobile'
                                      style={isMobileReplyThumbnailClicked[index] ? {} : { marginBottom: '25px' }}
                                    >
                                      {isMobileReplyThumbnailClicked[index] && replyMediaInfo.url ? (
                                        <div style={{ width: '92vw' }}>
                                          <Embed url={replyMediaInfo.url} key={`fti-mobile-reply-${index}`} />
                                        </div>
                                      ) : replyMediaInfo.thumbnail ? (
                                        <img
                                          key={`mob-fti-${index}`}
                                          src={replyMediaInfo.thumbnail}
                                          alt='thumbnail'
                                          onClick={() => {
                                            handleThumbnailClick(index, 'mobileReply');
                                          }}
                                          style={{ cursor: 'pointer' }}
                                          onError={(e) => (e.target.src = fallbackImgUrl)}
                                        />
                                      ) : (
                                        <span
                                          onClick={() => {
                                            handleThumbnailClick(index, 'mobileReply');
                                          }}
                                        >
                                          Embed
                                        </span>
                                      )}
                                      {replyMediaInfo?.type === 'video' || replyMediaInfo?.type === 'iframe' ? (
                                        isMobileReplyThumbnailClicked[index] ? (
                                          <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '15px' }}>
                                            <span
                                              className='button-mobile'
                                              style={{ float: 'none', cursor: 'pointer', borderRadius: '3px', padding: '6px 10px 5px' }}
                                              onClick={() => {
                                                handleThumbnailClick(index, 'mobileReply');
                                              }}
                                            >
                                              Close
                                            </span>
                                          </div>
                                        ) : (
                                          <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                            webpage
                                          </div>
                                        )
                                      ) : (
                                        <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                          webpage
                                        </div>
                                      )}
                                    </span>
                                  </div>
                                ) : replyMediaInfo.type === 'webpage' ? (
                                  <div key={`enlarge-mob-reply-${index}`} className='img-container'>
                                    <span key={`mob-ft${reply.cid}`} className='file-thumb-mobile'>
                                      {reply.thumbnailUrl ? (
                                        <img
                                          key={`mob-img-${index}`}
                                          src={replyMediaInfo.thumbnail}
                                          alt='thumbnail'
                                          onClick={(e) => {
                                            handleImageClick(e);
                                            handleThumbnailClick(index, 'mobileReply');
                                          }}
                                          style={{ cursor: 'pointer' }}
                                          onError={(e) => (e.target.src = fallbackImgUrl)}
                                        />
                                      ) : null}
                                      <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                        {replyMediaInfo.type}
                                      </div>
                                    </span>
                                  </div>
                                ) : replyMediaInfo.type === 'image' ? (
                                  <div key={`enlarge-mob-reply-${index}`} className='img-container'>
                                    <span key={`mob-ft${reply.cid}`} className='file-thumb-mobile'>
                                      <img
                                        key={`mob-img-${index}`}
                                        src={replyMediaInfo.url}
                                        alt={replyMediaInfo.type}
                                        onClick={(e) => {
                                          handleImageClick(e);
                                          handleThumbnailClick(index, 'mobileReply');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        onError={(e) => (e.target.src = fallbackImgUrl)}
                                      />
                                      <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                        {replyMediaInfo.type}
                                      </div>
                                    </span>
                                  </div>
                                ) : replyMediaInfo.type === 'video' ? (
                                  <span key={`mob-ft${reply.cid}`} className='file-thumb-mobile'>
                                    {isMobileReplyThumbnailClicked[index] ? (
                                      <video
                                        key={`fti-${index}`}
                                        src={replyMediaInfo.url}
                                        alt={replyMediaInfo.type}
                                        controls
                                        style={{ all: 'unset', width: '100%', height: '100%', cursor: 'pointer' }}
                                        onError={(e) => (e.target.src = fallbackImgUrl)}
                                      />
                                    ) : (
                                      <video
                                        key={`fti-${index}`}
                                        src={replyMediaInfo.url}
                                        alt='thumbnail'
                                        onClick={() => {
                                          handleThumbnailClick(index, 'mobileReply');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        id='video-thumbnail-mobile'
                                        onError={(e) => (e.target.src = fallbackImgUrl)}
                                      />
                                    )}
                                  </span>
                                ) : replyMediaInfo.type === 'audio' ? (
                                  <span key={`mob-ft${reply.cid}`} className='file-thumb-mobile'>
                                    <audio key={`mob-img-${index}`} src={replyMediaInfo.url} alt={replyMediaInfo.type} onError={(e) => (e.target.src = fallbackImgUrl)} />
                                    <div key={`mob-fi-${index}`} className='file-info-mobile'>
                                      {replyMediaInfo.type}
                                    </div>
                                  </span>
                                ) : null
                              ) : null}
                            </div>
                          ) : null}
                          <blockquote key={`mob-pm-${index}`} className='post-message-mobile'>
                            <span
                              style={{ cursor: 'pointer' }}
                              key={`mob-ql-${index}`}
                              className='quotelink-mobile'
                              ref={(el) => {
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
                                      maxWidth: rect.left - 5,
                                    });
                                  } else {
                                    setOutOfViewPosition({
                                      top,
                                      left: rect.left + rect.width + 5,
                                      maxWidth: window.innerWidth - rect.left - rect.width - 5,
                                    });
                                  }
                                });
                              }}
                              onMouseLeave={() => {
                                removeHighlight();
                                setOutOfViewCid(null);
                              }}
                            >
                              {`c/${shortParentCid}`}
                              {shortParentCid === comment.shortCid ? ' (OP)' : null}
                            </span>
                            <Post
                              key={`post-mobile-${index}`}
                              content={reply.content}
                              postQuoteRef={(quoteShortParentCid, ref) => {
                                postRefs.current[quoteShortParentCid] = ref;
                              }}
                              postQuoteOnClick={(quoteShortParentCid) => {
                                handleQuoteClick(reply, quoteShortParentCid, null);
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
                                        maxWidth: rect.left - 5,
                                      });
                                    } else {
                                      setOutOfViewPosition({
                                        top,
                                        left: rect.left + rect.width + 5,
                                        maxWidth: window.innerWidth - rect.left - rect.width - 5,
                                      });
                                    }
                                  });
                                }
                              }}
                              postQuoteOnLeave={() => {
                                removeHighlight();
                                setOutOfViewCid(null);
                              }}
                            />
                            <EditLabel key={`edit-label-reply-mob-${index}`} commentCid={reply.cid} className='ttl' />
                            <StateLabel key={`state-label-reply-mob-${index}`} commentIndex={reply.index} className='ttl ellipsis' />
                          </blockquote>
                          {reply.replyCount > 0 ? (
                            <div key={`back-mob-${index}`} className='backlink backlink-mobile'>
                              {reply.replies?.pages?.topAll.comments
                                .sort((a, b) => a.timestamp - b.timestamp)
                                .map((reply, index) => (
                                  <div
                                    key={`div-back${index}`}
                                    style={{ display: 'inline-block' }}
                                    ref={(el) => {
                                      backlinkRefsMobile.current[reply.cid] = el;
                                    }}
                                  >
                                    <span
                                      style={{ cursor: 'pointer' }}
                                      key={`ql-${index}`}
                                      className='quote-link'
                                      onClick={(event) => handleQuoteClick(reply, reply.shortCid, event)}
                                      onMouseOver={(event) => {
                                        event.stopPropagation();
                                        handleQuoteHover(reply, reply.shortCid, () => {
                                          setOutOfViewCid(reply.cid);
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
                                              maxWidth: rect.left - 5,
                                            });
                                          } else {
                                            setOutOfViewPosition({
                                              top,
                                              left: rect.left + rect.width + 5,
                                              maxWidth: window.innerWidth - rect.left - rect.width - 5,
                                            });
                                          }
                                        });
                                      }}
                                      onMouseLeave={() => {
                                        removeHighlight();
                                        setOutOfViewCid(null);
                                      }}
                                    >
                                      c/{reply.shortCid}
                                    </span>
                                    &nbsp;
                                  </div>
                                ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <BottomBar selectedStyle={selectedStyle}>
                  <div id='bottombar-desktop'>
                    <hr />
                    <span className='bottom-bar-return'>
                      [<Link to={{ pathname: `/p/${selectedAddress}`, state: { scrollToTop: true } }}>Return</Link>]
                    </span>
                    <span className='bottom-bar-catalog'>
                      [<Link to={{ pathname: `/p/${selectedAddress}/catalog`, state: { scrollToTop: true } }}>Catalog</Link>]
                    </span>
                    <span className='bottom-bar-top'>
                      [
                      <span
                        id='button'
                        onClick={() => window.scrollTo(0, 0)}
                        onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
                        onTouchStart={() => window.scrollTo(0, 0)}
                      >
                        Top
                      </span>
                      ]
                    </span>
                    <span className='quickreply-button'>
                      [
                      <span
                        id='button'
                        onClick={() => {
                          setIsReplyOpen(true);
                          setSelectedParentCid(comment.cid);
                          setSelectedShortCid(comment.shortCid);
                        }}
                        onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
                      >
                        Post a Reply
                      </span>
                      ]
                    </span>
                    {comment ? (
                      comment.replyCount !== undefined ? (
                        comment.replyCount > 0 ? (
                          comment.replyCount === 1 ? (
                            <span className='reply-stat'>{comment.replyCount} reply</span>
                          ) : (
                            <span className='reply-stat'>{comment.replyCount} replies</span>
                          )
                        ) : (
                          <span className='reply-stat'>No replies yet</span>
                        )
                      ) : (
                        <span className={stateString ? 'reply-stat ellipsis' : ''}>{stateString}</span>
                      )
                    ) : (
                      <span className={stateString ? 'reply-stat ellipsis' : ''}>{stateString}</span>
                    )}
                    <hr />
                  </div>
                </BottomBar>
                {comment.replyCount > 2 ? (
                  <div id='bottombar-mobile'>
                    <hr style={{ marginTop: '30px' }} />
                    <TopBar selectedStyle={selectedStyle} style={{ marginTop: '-5px' }}>
                      <span className='style-changer'>
                        Style:  
                        <select id='style-selector' onChange={handleStyleChange} value={selectedStyle}>
                          <option value='Yotsuba'>Yotsuba</option>
                          <option value='Yotsuba-B'>Yotsuba B</option>
                          <option value='Futaba'>Futaba</option>
                          <option value='Burichan'>Burichan</option>
                          <option value='Tomorrow'>Tomorrow</option>
                          <option value='Photon'>Photon</option>
                        </select>
                      </span>
                      {comment ? (
                        comment.replyCount !== undefined ? (
                          comment.replyCount > 0 ? (
                            comment.replyCount === 1 ? (
                              <span className='reply-stat'>{comment.replyCount} reply</span>
                            ) : (
                              <span className='reply-stat'>{comment.replyCount} replies</span>
                            )
                          ) : (
                            <span className='reply-stat'>No replies yet</span>
                          )
                        ) : (
                          <span className='reply-stat'>Loading...</span>
                        )
                      ) : null}
                      <hr />
                    </TopBar>
                    <ReplyFormLink id='post-form-link' selectedStyle={selectedStyle}>
                      <div id='post-form-link-mobile' className='post-button-mobile'>
                        <span className='btn-wrap'>
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setIsReplyOpen(true);
                              setSelectedParentCid(comment.cid);
                              setSelectedShortCid(comment.shortCid);
                            }}
                            onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
                          >
                            Post a Reply
                          </span>
                        </span>
                      </div>
                      <div id='btns-container'>
                        <div id='return-button-mobile'>
                          <span className='btn-wrap'>
                            <Link to={`/p/${selectedAddress}`}>Return</Link>
                          </span>
                        </div>
                        <div id='catalog-button-mobile' style={{ paddingRight: '2px' }}>
                          <span className='btn-wrap'>
                            <Link to={{ pathname: `/p/${selectedAddress}/catalog`, state: { scrollToTop: true } }}>Catalog</Link>
                          </span>
                        </div>
                        <span className='bottom-bar-top'>
                          <span className='btn-wrap'>
                            <span
                              onClick={() => window.scrollTo(0, 0)}
                              onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
                              onTouchStart={() => window.scrollTo(0, 0)}
                              style={{ cursor: 'pointer', marginRight: '10px', marginLeft: '10px' }}
                            >
                              Top
                            </span>
                          </span>
                        </span>
                      </div>
                    </ReplyFormLink>
                  </div>
                ) : null}
              </>
            )
          ) : null}
          {outOfViewCid &&
            outOfViewPosition &&
            createPortal(
              <div
                ref={postOnHoverRef}
                style={{
                  display: 'block',
                  position: 'absolute',
                  top: outOfViewPosition.top,
                  right: outOfViewPosition.right,
                  left: outOfViewPosition.left,
                  maxWidth: outOfViewPosition.maxWidth,
                }}
              >
                <PostOnHover cid={outOfViewCid} feed={comment} />
              </div>,
              document.body,
            )}
        </BoardForm>
        <Footer selectedStyle={selectedStyle}>
          <Break
            id='break'
            selectedStyle={selectedStyle}
            style={{
              marginTop: '-36px',
              width: '100%',
            }}
          />
          <Break
            selectedStyle={selectedStyle}
            style={{
              width: '100%',
            }}
          />
          <span
            className='style-changer'
            style={{
              float: 'right',
              marginTop: '2px',
            }}
          >
            Style:  
            <select id='style-selector' onChange={handleStyleChange} value={selectedStyle}>
              <option value='Yotsuba'>Yotsuba</option>
              <option value='Yotsuba-B'>Yotsuba B</option>
              <option value='Futaba'>Futaba</option>
              <option value='Burichan'>Burichan</option>
              <option value='Tomorrow'>Tomorrow</option>
              <option value='Photon'>Photon</option>
            </select>
          </span>
          <NavBar
            selectedStyle={selectedStyle}
            style={{
              marginTop: '42px',
            }}
          >
            <>
              <span className='boardList'>
                [<Link to={{ pathname: `/p/all`, state: { scrollToTop: true } }}>All</Link>
                 / 
                <Link to={{ pathname: `/p/subscriptions`, state: { scrollToTop: true } }}>Subscriptions</Link>
                ]&nbsp;
              </span>
              {defaultSubplebbits.map((subplebbit, index) => (
                <span className='boardList' key={`span-${subplebbit.address}`}>
                  {index === 0 ? null : '\u00a0'}
                  <Link
                    to={`/p/${subplebbit.address}`}
                    key={`a-${subplebbit.address}`}
                    onClick={() => {
                      setSelectedTitle(subplebbit.title);
                      setSelectedAddress(subplebbit.address);
                    }}
                  >
                    {subplebbit.title ? subplebbit.title : subplebbit.address}
                  </Link>
                  {index !== defaultSubplebbits.length - 1 ? ' /' : null}
                </span>
              ))}
              <span className='nav'>
                [
                <span
                  id='button-span'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.electron && window.electron.isElectron
                      ? setIsCreateBoardOpen(true)
                      : alert(
                          'HOW TO CREATE A BOARD (currently via CLI only):\n\n(1) have a computer you can use as server, because users will connect to your board peer-to-peer;\n\n(2) go to https://github.com/plebbit/plebbit-cli#install and follow the instructions to run your daemon, create a subplebbit (board) and edit its settings;\n\n(3) users can always connect to your board via its address, but it can be added below by submitting a pull request here: https://github.com/plebbit/temporary-default-subplebbits. This will be automated with a plebbit DAO using the plebbit token.',
                        );
                  }}
                >
                  Create Board
                </span>
                ] [
                <Link to={`/p/${selectedAddress}/c/${selectedThread}/settings`} onClick={() => setIsSettingsOpen(true)}>
                  Settings
                </Link>
                ] [
                <Link to='/' onClick={() => handleStyleChange({ target: { value: 'Yotsuba' } })}>
                  Home
                </Link>
                ]
              </span>
            </>
          </NavBar>
          <div id='version'>
            plebchan v{version}
            {commitRef}. GPL-2.0
          </div>
          <div
            className='footer-links'
            style={{
              textAlign: 'center',
              fontSize: 'x-small',
              fontFamily: 'arial',
              marginTop: '5px',
              marginBottom: '15px',
            }}
          >
            <a style={{ textDecoration: 'underline' }} href='https://plebbit.com' target='_blank' rel='noopener noreferrer'>
              About
            </a>
            &nbsp;•&nbsp;
            <a style={{ textDecoration: 'underline' }} href='https://github.com/plebbit/plebchan/releases/latest' target='_blank' rel='noopener noreferrer'>
              App
            </a>
            &nbsp;•&nbsp;
            <a style={{ textDecoration: 'underline' }} href='https://twitter.com/plebchan_eth' target='_blank' rel='noopener noreferrer'>
              Twitter
            </a>
            &nbsp;•&nbsp;
            <a style={{ textDecoration: 'underline' }} href='https://t.me/plebbit' target='_blank' rel='noopener noreferrer'>
              Telegram
            </a>
          </div>
        </Footer>
      </Container>
    </>
  );
};

export default Thread;
