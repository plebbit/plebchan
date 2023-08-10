import React, { useCallback, useLayoutEffect, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip } from 'react-tooltip';
import { useAccount, useFeed, usePublishComment, usePublishCommentEdit, useSubplebbit, useSubscribe } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import { Container, NavBar, Header, Break, PostForm, PostFormLink, PostFormTable, PostMenu, BoardForm } from '../styled/views/Board.styled';
import { Threads, PostMenuCatalog } from '../styled/views/Catalog.styled';
import { TopBar, Footer, AuthorDeleteAlert } from '../styled/views/Thread.styled';
import CatalogLoader from '../CatalogLoader';
import EditModal from '../modals/EditModal';
import ImageBanner from '../ImageBanner';
import VerifiedAuthor from '../VerifiedAuthor';
import CreateBoardModal from '../modals/CreateBoardModal';
import ModerationModal from '../modals/ModerationModal';
import OfflineIndicator from '../OfflineIndicator';
import SettingsModal from '../modals/SettingsModal';
import countLinks from '../../utils/countLinks';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import handleStyleChange from '../../utils/handleStyleChange';
import useAnonModeRef from '../../hooks/useAnonModeRef';
import useClickForm from '../../hooks/useClickForm';
import useError from '../../hooks/useError';
import useStateString from '../../hooks/useStateString';
import useSuccess from '../../hooks/useSuccess';
import useAnonModeStore from '../../hooks/stores/useAnonModeStore';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import packageJson from '../../../package.json'
const {version} = packageJson

const Catalog = () => {
  const {
    captchaResponse, setCaptchaResponse,
    setChallengesArray,
    defaultSubplebbits,
    editedComment,
    setIsAuthorDelete,
    setIsAuthorEdit,
    setIsCaptchaOpen,
    isModerationOpen, setIsModerationOpen,
    isSettingsOpen, setIsSettingsOpen,
    setModeratingCommentCid,
    setPendingComment,
    setPendingCommentIndex,
    setResolveCaptchaPromise,
    selectedAddress, setSelectedAddress,
    selectedStyle,
    setSelectedThread,
    selectedTitle, setSelectedTitle,
    showPostForm,
    showPostFormLink,
  } = useGeneralStore(state => state);

  const { anonymousMode } = useAnonModeStore();
  
  const nameRef = useRef();
  const subjectRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();
  const threadMenuRefs = useRef({});
  const postMenuRef = useRef(null);
  const postMenuCatalogRef = useRef(null);
  const selectedThreadCidRef = useRef(null);

  const navigate = useNavigate();
  
  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();
  
  const [triggerPublishComment, setTriggerPublishComment] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isHoveringOnThread, setIsHoveringOnThread] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [originalCommentContent, setOriginalCommentContent] = useState(null);
  const [triggerPublishCommentEdit, setTriggerPublishCommentEdit] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [commentCid, setCommentCid] = useState(null);
  const [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
  const [openMenuCid, setOpenMenuCid] = useState(null);
  const [executeAnonMode, setExecuteAnonMode] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  const { feed, hasMore, loadMore } = useFeed({subplebbitAddresses: [`${selectedAddress}`], sortType: 'active'});
  const { subplebbitAddress } = useParams();
  const subplebbit = useSubplebbit({subplebbitAddress: selectedAddress});
  const account = useAccount();

  const stateString = useStateString(subplebbit);

  useAnonModeRef(selectedThreadCidRef, anonymousMode && executeAnonMode);

  const popupRef = useRef(null);
  const threadRefs = useRef([]);
  const [isEnoughSpaceOnRight, setIsEnoughSpaceOnRight] = useState(null);
  const [isCalculationDone,setIsCalculationDone] = useState(false);
  useLayoutEffect(() => {
    console.log(isHoveringOnThread)
    setIsEnoughSpaceOnRight(null);
    const calculateSpaceOnRight = () => {
      feed.forEach((thread, index) => {
        if (thread.cid === isHoveringOnThread){
           if(threadRefs.current[index] && popupRef.current) {
            const threadRect = threadRefs.current[index].getBoundingClientRect();
            const popupRect = popupRef.current.getBoundingClientRect();
            console.log(threadRect);console.log(popupRect);
            // Get the width of the viewport area inside the browser window
            const viewportWidth = document.documentElement.clientWidth;
  
            // Calculate the space on the right side (relative to the viewport)
            const spaceOnRight = viewportWidth - (threadRect.left + threadRect.width);
  
            // Define the popup width
            const popupWidth = popupRect.width;
            // Check if there is enough space for the popup on the right side
            const EnoughSpaceOnRight = spaceOnRight >= popupWidth;
            console.log("SPACE ? " + EnoughSpaceOnRight);
            setIsEnoughSpaceOnRight(EnoughSpaceOnRight);
            return setIsCalculationDone(true);
          }}
      });
    };
    if(!isCalculationDone && isHoveringOnThread !== ""){
      calculateSpaceOnRight();
    }
  }, [isHoveringOnThread]);

  useEffect(() => {
    if (subplebbit.roles !== undefined) { 
      const role = subplebbit.roles[account?.author.address]?.role;
  
      if (role === 'moderator' || role === 'admin' || role === 'owner') {
        setIsModerator(true);
      } else {
        setIsModerator(false);
      }
    }
  }, [account?.author.address, subplebbit.roles]);


  const handleOptionClick = () => {
    setOpenMenuCid(null);
  };

  const handleOutsideClick = useCallback((e) => {
    if (openMenuCid !== null && !postMenuRef.current.contains(e.target) && !postMenuCatalogRef.current.contains(e.target)) {
      setOpenMenuCid(null);
    }
  }, [openMenuCid, postMenuRef, postMenuCatalogRef]);

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
    setSelectedAddress(subplebbitAddress);
  }, [subplebbitAddress, setSelectedAddress]);


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

  
  const { subscribed, subscribe, unsubscribe } = useSubscribe({subplebbitAddress: selectedAddress});

  // temporary title from JSON, gets subplebbitAddress from URL
  useEffect(() => {
    setSelectedAddress(subplebbitAddress);
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


  const tryLoadMore = async () => {
    try {loadMore()} 
    catch (e)
    {await new Promise(resolve => setTimeout(resolve, 1000))}
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
            address: signer?.address
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
    updateSigner();
  }, [updateSigner]);


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
    subplebbitAddress: selectedAddress || subplebbitAddress,
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
          <AuthorDeleteAlert selectedStyle={selectedStyle}>
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
  }, [editedComment]);

  
  useEffect(() => {
    if (publishCommentEditOptions && triggerPublishCommentEdit) {
      (async () => {
        await publishCommentEdit();
        setTriggerPublishCommentEdit(false);
      })();
    }
  }, [publishCommentEditOptions, triggerPublishCommentEdit, publishCommentEdit]);

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

  const timeElapsedCalc = (date) => {
    const currentDateTime = new Date()
    const targetToDate = new Date(date * 1000 );  // unix timestamp * 1000
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    const targetDateTime = new Date(`${monthNames[targetToDate.getMonth()]} ${targetToDate.getDate()} ${targetToDate.getFullYear()} ${targetToDate.getHours()}:${targetToDate.getMinutes()}:${targetToDate.getSeconds()}`)
    const elapsedDateTime = currentDateTime - targetDateTime;
    const elapsedDay = Math.floor(elapsedDateTime / (1000 * 60 * 60 * 24));
    const elapsedHour = Math.floor((elapsedDateTime / (1000 * 60 * 60)) % 24);
    const elapsedMinute = Math.floor((elapsedDateTime / (1000 * 60)) % 60);

    if(elapsedDay > 0){
      return `${elapsedDay} ${elapsedDay > 0 ? "days" : "day"}`;
    }else if(elapsedHour > 0 ){
      return `${elapsedHour} ${elapsedHour > 0 ? "hours" : "hour"}`;
    }else if(elapsedMinute > 0){
      return `${elapsedMinute} ${elapsedMinute > 0 ? "minutes" : "minute"}`
    }

  }

  const handleMouseOnLeaveThread = () => {
    setIsHoveringOnThread("");
    setIsEnoughSpaceOnRight(null);
    setIsCalculationDone(false);
  }
  return (
    <>
      <Helmet>
        <title>{((selectedTitle ? selectedTitle : selectedAddress) + " - Catalog - plebchan")}</title>
      </Helmet>
      <Container>
        <CreateBoardModal
        selectedStyle={selectedStyle}
        isOpen={isCreateBoardOpen}
        closeModal={() => setIsCreateBoardOpen(false)} />
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
              <Link to={`/p/all`} onClick={() => window.scrollTo(0, 0)}>All</Link>
               / 
              <Link to={`/p/subscriptions`} onClick={() => window.scrollTo(0, 0)}>Subscriptions</Link>
            ]&nbsp;[
            {defaultSubplebbits.map((subplebbit, index) => (
              <span className="boardList" key={`span-${subplebbit.address}`}>
                {index === 0 ? null : "\u00a0"}
                <Link to={`/p/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => {
                setSelectedTitle(subplebbit.title);
                setSelectedAddress(subplebbit.address);
                }}
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
                    'You can create a board with the desktop version of plebchan, which you can download from here: https://github.com/plebbit/plebchan/releases/latest\n\nIf you are comfortable with the command line, you can also run a board (called "subplebbit") using plebbit-cli: https://github.com/plebbit/plebbit-cli\n\n'
                  )
                )
              }
              }>Create Board</span>
              ]
              [
              <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
                    {defaultSubplebbits.map(subplebbit => (
                        <option key={`option-${subplebbit.address}`} value={subplebbit.address}
                        >{subplebbit.title ? subplebbit.title : subplebbit.address}</option>
                      ))}
                  </select> 
                  <span id="button-span" style={{cursor: 'pointer'}} onClick={
                  () => alert(
                    'You can create a board with the desktop version of plebchan, which you can download from here: https://github.com/plebbit/plebchan/releases/latest\n\nIf you are comfortable with the command line, you can also run a board (called "subplebbit") using plebbit-cli: https://github.com/plebbit/plebbit-cli\n\n'
                    )
                  }>Create Board</span>
                </div>
                <div className="page-jump">
                  <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
              <div className="board-title">{subplebbit.title ?? null}</div>
              <div className="board-address">p/{subplebbit.address}
                <OfflineIndicator 
                address={subplebbit.address} 
                className="offline"
                tooltipPlace="top" />
              </div>
              </>
          </>
        </Header>
        <Break selectedStyle={selectedStyle} />
        <PostForm selectedStyle={selectedStyle}>
          <PostFormLink id="post-form-link" showPostFormLink={showPostFormLink} selectedStyle={selectedStyle} >
            <div id="post-form-link-desktop">
              [
                <Link to={`/p/${subplebbitAddress}/catalog/post`} onClick={useClickForm()} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</Link>
              ]
            </div>
            <div id="post-form-link-mobile">
              <span className="btn-wrap">
                <Link to={`/p/${subplebbitAddress}/catalog/post`} onClick={useClickForm()} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</Link>
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
          <div className="return-button" id="return-button-desktop">
            [
            <Link to={`/p/${selectedAddress}`} onClick={()=> {window.scrollTo(0, 0)}}>Return</Link>
            ]
          </div>
          {subplebbit.state === "succeeded" ? (
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
          <div id="return-button-mobile">
            <span className="btn-wrap-catalog btn-wrap">
              <Link to={`/p/${selectedAddress}`} onClick={()=> {window.scrollTo(0, 0)}}>Return</Link>
            </span>
          </div>
          <hr />
        </TopBar>
        <Tooltip id="tooltip" className="tooltip" />
        <Threads selectedStyle={selectedStyle}>
          {subplebbit?.state === "failed" ? (
            null
          ) : (
            subplebbit.state === "succeeded" ? (
                <InfiniteScroll
                  pageStart={0}
                  loadMore={tryLoadMore}
                  hasMore={hasMore}
                  >
                  {subplebbit.rules ? (
                    <div className='thread'
                    onMouseOver={() => {setTimeout(()=>setIsHoveringOnThread('rules'),500)}} 
                    onMouseLeave={() => setIsHoveringOnThread('')}>
                      {/* <!-- hovering div --> */}
                      {isHoveringOnThread == 'rules' ? 
                      <div  
                      className={"thread_popup_right"}>
                        <p className="thread_popup_content" style={{color:"white"}}>
                        <span className="thread_popup_title">Rules </span>
                        by 
                        <span className="thread_popup_authorAdmin"> ## Board Admins </span> 
                        {timeElapsedCalc(subplebbit.createdAt)}</p>
                        <div>
                        <p className="thread_popup_content">Last reply by 
                          <span className="thread_popup_authorAdmin"> Anonymous </span>
                        560 days ago</p>
                        </div>
                      </div> : null }                      
                      <BoardForm selectedStyle={selectedStyle} style={{all: 'unset'}}>
                        <div className='meta' title="(R)eplies / (L)ink Replies">
                          R:&nbsp;<b>0</b>&nbsp;/&nbsp;L:&nbsp;<b>0</b>
                          <div className='thread-icons' 
                          style={{position: 'absolute', top: '-2px', right: '15px'}}>
                            <span className="thread-icon sticky-icon" title="Sticky"
                            style={{
                              imageRendering: "pixelated",}} />
                            <span className="thread-icon closed-icon" title="Closed"
                            style={{
                              imageRendering: "pixelated",}} />
                          </div>
                          <PostMenu 
                            style={{ display: isHoveringOnThread === "rules" ? 'inline-block' : 'none',
                            position: 'absolute', lineHeight: '1em', marginTop: '-1px', outline: 'none',
                            zIndex: '999'}}
                            title="Post menu"
                            ref={el => { 
                              threadMenuRefs.current["rules"] = el; 
                              postMenuRef.current = el; 
                            }}
                            className='post-menu-button' 
                            id='post-menu-button-catalog'
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
                        </div>
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
                      </BoardForm>
                      <Link style={{all: "unset", cursor: "pointer"}} to={`/p/${selectedAddress}/rules`}>
                          <div className="teaser">
                            <b>Rules</b>
                            {": " + subplebbit.rules.map((rule, index) => `${index + 1}. ${rule}`).join(' ')}
                          </div>
                        </Link>
                    </div>
                  ) : null}
                  {subplebbit.description ? (
                    <div className='thread'
                    onMouseOver={() => {setTimeout(()=>setIsHoveringOnThread('description'),500)}} 
                    onMouseLeave={() => setIsHoveringOnThread('')}>
                      {/* <!-- hovering div --> */}
                      {isHoveringOnThread == 'description' ? 
                      <div  
                      className="thread_popup_right">
                        <p className="thread_popup_content" style={{color:"white"}}>
                        <span className="thread_popup_title">Welcome to {subplebbit.title || subplebbit.address} </span> 
                         by  
                        <span className="thread_popup_authorAdmin"> ## Board Admins </span> 
                        {timeElapsedCalc(subplebbit.createdAt)} ago</p>
                        <div> 
                        <p className="thread_popup_content">Last reply by 
                          <span className="thread_popup_authorAdmin"> Anonymous </span>
                        560 days ago</p>
                        </div>
                      </div> : null }
                      <Link style={{all: 'unset', cursor: 'pointer'}} to={`/p/${selectedAddress}/description`}>
                        {subplebbit.suggested?.avatarUrl ? (
                          <img className='card'
                          src={subplebbit.suggested.avatarUrl} alt="board avatar" />
                        ) : null}
                      </Link>
                      {subplebbit.suggested?.avatarUrl ? (
                      <div className='thread-icons'>
                        <span className="thread-icon sticky-icon" title="Sticky"
                            style={{
                              imageRendering: "pixelated",}} />
                        <span className="thread-icon closed-icon" title="Closed"
                            style={{
                              imageRendering: "pixelated",}} />
                      </div>
                      ) : null}
                      <BoardForm selectedStyle={selectedStyle} style={{all: 'unset'}}>
                        <div className='meta' title="(R)eplies / (L)ink Replies">
                          R:&nbsp;<b>0</b>&nbsp;/&nbsp;L:&nbsp;<b>0</b>
                          {subplebbit.suggested?.avatarUrl ? null : (
                            <div className='thread-icons' 
                            style={{position: 'absolute', top: '-2px', right: '15px'}}>
                              <span className="thread-icon sticky-icon" title="Sticky"
                            style={{
                              imageRendering: "pixelated",}} />
                              <span className="thread-icon closed-icon" title="Closed"
                            style={{
                              imageRendering: "pixelated",}} />
                            </div>
                          )}
                          <PostMenu 
                            style={{ display: isHoveringOnThread === "description" ? 'inline-block' : 'none',
                            position: 'absolute', lineHeight: '1em', marginTop: '-1px', outline: 'none',
                            zIndex: '999'}}
                            title="Post menu"
                            ref={el => { 
                              threadMenuRefs.current["description"] = el; 
                              postMenuRef.current = el; 
                            }}
                            className='post-menu-button' 
                            id='post-menu-button-catalog'
                            rotated={openMenuCid === "description"}
                            onClick={(event) => {
                              event.stopPropagation();
                              const rect = threadMenuRefs.current["description"].getBoundingClientRect();
                              setMenuPosition({top: rect.top + window.scrollY, left: rect.left});
                              setOpenMenuCid(prevCid => (prevCid === "description" ? null : "description"));
                            }}                              
                          >
                            ▶
                          </PostMenu>
                        </div>
                        {createPortal(
                          <PostMenuCatalog selectedStyle={selectedStyle} 
                            ref={el => {postMenuCatalogRef.current = el}}
                            onClick={(event) => event.stopPropagation()}
                            style={{position: "absolute", 
                            top: menuPosition.top + 7, 
                            left: menuPosition.left}}>
                            <div className={`post-menu-thread post-menu-thread-${"description"}`}
                            style={{ display: openMenuCid === "description" ? 'block' : 'none' }}
                            >
                              <ul className="post-menu-catalog">
                                <li onClick={() => handleOptionClick("description")}>Hide thread</li>
                                {/* {isModerator ? (
                                  <>
                                    change description
                                  </>
                                ) : null} */}
                                {subplebbit.suggested?.avatarUrl ? (
                                  <li 
                                  onMouseOver={() => {setIsImageSearchOpen(true)}}
                                  onMouseLeave={() => {setIsImageSearchOpen(false)}}>
                                    Image search »
                                    <ul className="dropdown-menu post-menu-catalog"
                                      style={{display: isImageSearchOpen ? 'block': 'none'}}>
                                      <li onClick={() => handleOptionClick("description")}>
                                        <a 
                                        href={`https://lens.google.com/uploadbyurl?url=${subplebbit.suggested.avatarUrl}`}
                                        target="_blank" rel="noreferrer"
                                        >Google</a>
                                      </li>
                                      <li onClick={() => handleOptionClick("description")}>
                                        <a
                                        href={`https://yandex.com/images/search?url=${subplebbit.suggested.avatarUrl}`}
                                        target="_blank" rel="noreferrer"
                                        >Yandex</a>
                                      </li>
                                      <li onClick={() => handleOptionClick("description")}>
                                        <a
                                        href={`https://saucenao.com/search.php?url=${subplebbit.suggested.avatarUrl}`}
                                        target="_blank" rel="noreferrer"
                                        >SauceNAO</a>
                                      </li>
                                    </ul>
                                  </li>
                                ) : null}
                              </ul>
                            </div>
                          </PostMenuCatalog>, document.body
                        )}
                      </BoardForm>
                      <Link style={{all: "unset", cursor: "pointer"}} to={`/p/${selectedAddress}/description`} 
                        onClick={() => setSelectedThread("description")}>
                          <div className="teaser">
                            <b>Welcome to {subplebbit.title || subplebbit.address}</b>
                            {": " + subplebbit.description}
                          </div>
                        </Link>
                    </div>
                  ) : null}
                  {feed.map((thread, index) => {
                    const commentMediaInfo = getCommentMediaInfo(thread);
                    const fallbackImgUrl = "assets/filedeleted-res.gif";
                    const linkCount = countLinks(thread);
                    return (
                        <div key={`thread-${index}`} className="thread" >
                            {/* <!-- hovering div --> */}
                            {isHoveringOnThread == thread.cid  ? 
                            <div ref={popupRef} 
                            style={{
                            opacity: isCalculationDone && isEnoughSpaceOnRight !== null ? 1 : 0,
                            left: isCalculationDone && isEnoughSpaceOnRight !== null && isEnoughSpaceOnRight ? '100%' : 'auto',
                            right: isCalculationDone && isEnoughSpaceOnRight !== null && !isEnoughSpaceOnRight ? '100%' : 'auto',}}
                            className="thread_popup">
                              <p className="thread_popup_content">
                              <span className="thread_popup_title" >
                                {thread.title ? `${thread.title} ` : "Posted "}
                              </span>
                              by 
                              <span className="thread_popup_author"> 
                              {thread.author.displayName ?` ${thread.author.displayName} ` : " Anonymous "} 
                              </span> 
                              {thread.timestamp ? timeElapsedCalc(thread.timestamp) : null}</p>
                              <div>
                              {thread.replyCount > 0 ?
                              <p className="thread_popup_content">
                              Last reply by <span className="thread_popup_author"> Anonymous </span> 
                              {timeElapsedCalc(thread.lastReplyTimestamp)} ago</p>
                              : null}
                              </div>
                            </div> : null }
                          {commentMediaInfo?.url ? (
                            <Link style={{all: "unset", cursor: "pointer"}} key={`link-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} 
                            onClick={() => setSelectedThread(thread.cid)}>
                              {commentMediaInfo?.type === "webpage" ? (
                                thread.thumbnailUrl ? (
                                <img
                                onMouseOver={() => setIsHoveringOnThread(thread.cid)}
                                onMouseLeave={()=>{handleMouseOnLeaveThread()}}
                                ref={(el) => (threadRefs.current[index] = el)} className="card" key={`img-${index}`}
                                src={commentMediaInfo.thumbnail} alt={commentMediaInfo.type}
                                onError={(e) => {
                                  e.target.src = fallbackImgUrl
                                  e.target.onerror = null;
                                }}  />
                                ) : null
                              ) : null}
                              {commentMediaInfo?.type === "image" ? (
                                <img 
                                onMouseOver={() => setIsHoveringOnThread(thread.cid)}
                                onMouseLeave={() => {handleMouseOnLeaveThread()}}
                                ref={(el) => (threadRefs.current[index] = el)} className="card" key={`img-${index}`}
                                src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                                onError={(e) => {
                                  e.target.src = fallbackImgUrl
                                  e.target.onerror = null;}}  />
                              ) : null}
                              {commentMediaInfo?.type === "video" ? (
                                  <video
                                  onMouseOver={() => setIsHoveringOnThread(thread.cid)}
                                  onMouseLeave={() => {handleMouseOnLeaveThread()}}
                                  ref={(el) => (threadRefs.current[index] = el)}  className="card" key={`fti-${index}`} 
                                  src={commentMediaInfo.url} 
                                  alt={commentMediaInfo.type} 
                                  onError={(e) => e.target.src = fallbackImgUrl} /> 
                              ) : null}
                              {commentMediaInfo?.type === "audio" ? (
                                  <audio
                                onMouseOver={() => setIsHoveringOnThread(thread.cid)}
                                onMouseLeave={() => {handleMouseOnLeaveThread()}}
                                ref={(el) => (threadRefs.current[index] = el)}  className="card" controls 
                                  key={`fti-${index}`} 
                                  src={commentMediaInfo.url} 
                                  alt={commentMediaInfo.type} 
                                  onError={(e) => e.target.src = fallbackImgUrl} />
                              ) : null}
                            </Link>
                          ) : null}
                          {(commentMediaInfo && (
                          commentMediaInfo.type === 'image' || 
                          commentMediaInfo.type === 'video' ||
                          (commentMediaInfo.type === 'webpage' && 
                          commentMediaInfo.thumbnail))) ? (
                          <div key={`ti-${index}`} className="thread-icons" >
                            {thread.pinned ? (
                              <span key={`si-${index}`} className="thread-icon sticky-icon" title="Sticky"
                              style={{
                                imageRendering: "pixelated",}} />
                            ) : null}
                            {thread.locked ? (
                              <span key={`li-${index}`} className="thread-icon closed-icon" title="Closed"
                              style={{
                                imageRendering: "pixelated",}} />
                            ) : null}
                          </div>
                          ) : null}
                          <BoardForm selectedStyle={selectedStyle} 
                          style={{ all: "unset"}}>
                            <div key={`meta-${index}`} className="meta" title="(R)eplies / (L)ink Replies" >
                              R:&nbsp;<b key={`b-${index}`}>{thread.replyCount}</b>
                              {linkCount > 0 ? (
                                <>
                                  &nbsp;/
                                  L:&nbsp;<b key={`i-${index}`}>{linkCount}</b>
                                </>
                              ) : null}
                              {(commentMediaInfo && (
                                commentMediaInfo.type === 'image' || 
                                commentMediaInfo.type === 'video' || 
                                (commentMediaInfo.type === 'webpage' && 
                                commentMediaInfo.thumbnail))) ? null : (
                                <div className='thread-icons' 
                                style={{position: 'absolute', top: '-2px', right: '15px'}}>
                                  {thread.pinned ? (
                                    <span key={`si-${index}`} className="thread-icon sticky-icon" title="Sticky"
                                    style={{
                                      imageRendering: "pixelated",}} />
                                  ) : null}
                                  {thread.locked ? (
                                    <span key={`li-${index}`} className="thread-icon closed-icon" title="Closed"
                                    style={{
                                      imageRendering: "pixelated",}} />
                                  ) : null}
                                </div>
                              )}
                            <PostMenu 
                              style={{ display: isHoveringOnThread === thread.cid ? 'inline-block' : 'none',
                              position: 'absolute', lineHeight: '1em', marginTop: '-1px', outline: 'none',
                              zIndex: '999'}}
                              key={`pmb-${index}`} 
                              title="Post menu"
                              ref={el => { 
                                threadMenuRefs.current[thread.cid] = el; 
                                postMenuRef.current = el; 
                              }}
                              className='post-menu-button' 
                              id='post-menu-button-catalog'
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
                            </div>
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
                                  </ul>
                                </div>
                              </PostMenuCatalog>, document.body
                            )}
                          </BoardForm>
                          <Link style={{all: "unset", cursor: "pointer"}} key={`link2-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} 
                          onClick={() => setSelectedThread(thread.cid)}>
                            <div
                            key={`t-${index}`} className="teaser">
                            <div style={{cursor:"text"}}
                                onMouseOver={() => { 
                                !commentMediaInfo?.url  && setIsHoveringOnThread(thread.cid)}}
                                onMouseLeave={()=>{handleMouseOnLeaveThread()}}
                                ref={(el) => (threadRefs.current[index] = el)}>
                              <b
                              key={`b2-${index}`}>{thread.title ? `${thread.title}` : null}</b>
                              {thread.content ? `: ${thread.content}` : null}
                            </div>
                            </div>
                          </Link>
                        </div>
                    )})}
                </InfiniteScroll>
          ) : (<CatalogLoader />)
        )}
        </Threads>
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
                <Link to={`/p/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => {
                setSelectedTitle(subplebbit.title);
                setSelectedAddress(subplebbit.address);
                }}
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
                    'You can create a board with the desktop version of plebchan, which you can download from here: https://github.com/plebbit/plebchan/releases/latest\n\nIf you are comfortable with the command line, you can also run a board (called "subplebbit") using plebbit-cli: https://github.com/plebbit/plebbit-cli\n\n'
                  )
                )
              }
              }>Create Board</span>
              ]
                [
                <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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

export default Catalog;