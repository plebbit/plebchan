import React, { useCallback, useLayoutEffect, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip } from 'react-tooltip';
import { Virtuoso } from 'react-virtuoso';
import { useAccount, useFeed, usePublishComment, usePublishCommentEdit, useSubplebbit, useSubscribe } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import { Container, NavBar, Header, Break, PostForm, PostFormLink, PostFormTable, PostMenu, BoardForm } from '../styled/views/Board.styled';
import { Threads, PostPreview, PostMenuCatalog } from '../styled/views/Catalog.styled';
import { TopBar, Footer } from '../styled/views/Thread.styled';
import { AlertModal } from '../styled/modals/AlertModal.styled';
import EditModal from '../modals/EditModal';
import CreateBoardModal from '../modals/CreateBoardModal';
import ModerationModal from '../modals/ModerationModal';
import SettingsModal from '../modals/SettingsModal';
import BoardSettings from '../BoardSettings';
import BoardStats from '../BoardStats';
import CatalogLoader from '../CatalogLoader';
import DisplayName from '../DisplayName';
import ImageBanner from '../ImageBanner';
import OfflineIndicator from '../OfflineIndicator';
import VerifiedAuthor from '../VerifiedAuthor';
import countLinks from '../../utils/countLinks';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getFormattedTime from '../../utils/getFormattedTime';
import handleStyleChange from '../../utils/handleStyleChange';
import useAnonModeRef from '../../hooks/useAnonModeRef';
import useClickForm from '../../hooks/useClickForm';
import useError from '../../hooks/useError';
import useStateString from '../../hooks/useStateString';
import useSuccess from '../../hooks/useSuccess';
import useAnonModeStore from '../../hooks/stores/useAnonModeStore';
import useFeedRows from '../../hooks/useFeedRows';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import useWindowWidth from '../../hooks/useWindowWidth';
import packageJson from '../../../package.json';
const { version } = packageJson;
let lastVirtuosoStates = {};
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : '';

const CatalogPost = ({ post }) => {
  const {
    editedComment,
    setDeletePost,
    setIsAuthorDelete,
    captchaResponse,
    setCaptchaResponse,
    selectedAddress,
    setIsModerationOpen,
    setChallengesArray,
    setIsAuthorEdit,
    setIsCaptchaOpen,
    setIsEditModalOpen,
    canModerate,
    setModeratingCommentCid,
    setOriginalCommentContent,
    setPendingComment,
    setResolveCaptchaPromise,
    selectedStyle,
    setSelectedThread,
  } = useGeneralStore((state) => state);

  const thread = post;
  const commentMediaInfo = getCommentMediaInfo(thread);
  const linkCount = countLinks(thread);
  const fallbackImgUrl = 'assets/filedeleted-res.gif';
  const [isHoveringOnThread, setIsHoveringOnThread] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [openMenuCid, setOpenMenuCid] = useState(null);
  const [triggerPublishCommentEdit, setTriggerPublishCommentEdit] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isClientRedirectMenuOpen, setIsClientRedirectMenuOpen] = useState(false);
  const [commentCid, setCommentCid] = useState(null);

  const threadMenuRefs = useRef({});
  const threadRefs = useRef({});
  const postMenuRef = useRef(null);
  const popupRef = useRef(null);
  const imageRef = useRef(null);
  const postMenuCatalogRef = useRef(null);
  const textRef = useRef(null);
  const { subplebbitAddress } = useParams();

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  const subplebbit = useSubplebbit({ subplebbitAddress: selectedAddress });

  const account = useAccount();
  const [spaceOnRight, setSpaceOnRight] = useState(null);
  const [isCalculationDone, setIsCalculationDone] = useState(false);
  const [hoverTimeoutId, setHoverTimeoutId] = useState(null);
  const [isHoveringForMenu, setIsHoveringForMenu] = useState(false);
  const textRect = textRef.current?.getBoundingClientRect();
  const imageRect = imageRef.current?.getBoundingClientRect();
  const popupRect = popupRef.current?.getBoundingClientRect();
  const isMediaShowed =
    thread.link &&
    commentMediaInfo &&
    (commentMediaInfo.type === 'image' ||
      commentMediaInfo.type === 'video' ||
      (commentMediaInfo.type === 'webpage' && commentMediaInfo.thumbnail) ||
      (commentMediaInfo.type === 'iframe' && commentMediaInfo.thumbnail))
      ? true
      : false;

  const { left: textLeft, right: textRight, width: textWidth } = textRef.current?.getBoundingClientRect() || {};
  const { left: imageLeft, right: imageRight, width: imageWidth } = imageRef.current?.getBoundingClientRect() || {};

  useLayoutEffect(() => {
    const executeLayoutEffectLogic = () => {
      let ref;

      if (isMediaShowed) {
        ref = imageRef.current;
      } else {
        ref = textRef.current;
      }

      if (ref && popupRef.current) {
        const rect = ref.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth;
        const spaceRight = viewportWidth - (rect.left + rect.width);
        const spaceLeft = rect.left;

        if (spaceRight < 200 && spaceLeft > spaceRight && spaceLeft < 500) {
          popupRef.current.style.maxWidth = `calc(
              100vw - 
              ${isMediaShowed ? imageWidth : textWidth}px
              - ${spaceRight + 40}px
              )`;
        } else if (spaceRight < 200 && spaceLeft < spaceRight) {
          popupRef.current.style.maxWidth = `calc(100vw - ${isMediaShowed ? imageWidth : textWidth}px)`;
        } else {
          popupRef.current.style.maxWidth = `500px`;
        }

        setSpaceOnRight(spaceRight);
        setIsCalculationDone(true);
      }
    };

    if (isHoveringOnThread) {
      const timeoutId = setTimeout(executeLayoutEffectLogic, 250);
      return () => {
        clearTimeout(timeoutId);
        setIsCalculationDone(false);
      };
    }
  }, [isHoveringOnThread, isMediaShowed, textLeft, textRight, imageLeft, imageRight, textWidth, imageWidth]);

  const handleMouseOnLeaveThread = () => {
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
      setHoverTimeoutId(null);
      setIsHoveringOnThread('');
    } else if (isHoveringOnThread !== '') {
      setIsHoveringOnThread('');
      setIsCalculationDone(false);
    }
  };

  const handleOutsideClick = useCallback(
    (e) => {
      if (openMenuCid !== null && !postMenuRef.current.contains(e.target) && !postMenuCatalogRef.current.contains(e.target)) {
        setOpenMenuCid(null);
      }
    },
    [openMenuCid],
  );

  const handleOptionClick = () => {
    setOpenMenuCid(null);
  };

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

  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      setNewSuccessMessage('Challenge Success');
      console.log('challenge success', challengeVerification);
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

  const [publishCommentEditOptions, setPublishCommentEditOptions] = useState({
    commentCid: commentCid,
    content: editedComment || undefined,
    subplebbitAddress: selectedAddress || subplebbitAddress,
    onChallenge,
    onChallengeVerification,
    onError: (error) => {
      setNewErrorMessage(error.message);
      console.log(error);
    },
  });

  const { publishCommentEdit } = usePublishCommentEdit(publishCommentEditOptions);

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

  let displayWidth, displayHeight;
  if (thread.linkWidth && thread.linkHeight) {
    let scale = Math.min(1, 150 / Math.max(thread.linkWidth, thread.linkHeight));
    displayWidth = `${thread.linkWidth * scale}px`;
    displayHeight = `${thread.linkHeight * scale}px`;
  } else if (thread.link) {
    displayWidth = '150px';
    displayHeight = '150px';
  } else {
    displayWidth = '0px';
    displayHeight = '0px';
  }

  if (post.type === 'rules') {
    return (
      <>
        {isHoveringOnThread === 'rules'
          ? createPortal(
              <PostPreview selectedStyle={selectedStyle}>
                <div
                  ref={popupRef}
                  className='post-preview'
                  onMouseOver={() => handleMouseOnLeaveThread()}
                  style={{
                    visibility: isCalculationDone ? 'visible' : 'hidden',
                    left:
                      isCalculationDone && spaceOnRight > 250
                        ? textRect.right + 5
                        : isCalculationDone && spaceOnRight < 250
                        ? textRect.left - popupRect.width - 5
                        : 'auto',
                    top: popupPosition.top + 5,
                  }}
                >
                  <span className='post-subject'>Rules </span> by 
                  <span className='post-author-admin'> ## Board Mods </span>
                  <span className='post-ago'>{thread.timestamp ? getFormattedTime(thread.timestamp) : null}</span>
                </div>
              </PostPreview>,
              document.body,
            )
          : null}
        <div
          className='thread'
          ref={(el) => {
            threadRefs.current['rules'] = el;
          }}
          onMouseLeave={() => {
            handleMouseOnLeaveThread();
          }}
        >
          <BoardForm
            selectedStyle={selectedStyle}
            style={{ all: 'unset' }}
            onMouseOver={() => {
              setIsHoveringForMenu('rules');
              handleMouseOnLeaveThread();
            }}
            onMouseLeave={() => setIsHoveringForMenu(false)}
          >
            <div className='meta' title='(R)eplies / (L)ink Replies'>
              R:&nbsp;<b>0</b>&nbsp;/&nbsp;L:&nbsp;<b>0</b>
              <div className='thread-icons' style={{ position: 'absolute', top: '-2px', right: '15px' }}>
                <span
                  className='thread-icon sticky-icon'
                  title='Sticky'
                  style={{
                    imageRendering: 'pixelated',
                  }}
                />
                <span
                  className='thread-icon closed-icon'
                  title='Closed'
                  style={{
                    imageRendering: 'pixelated',
                  }}
                />
              </div>
              <PostMenu
                style={{
                  display: isHoveringForMenu === 'rules' ? 'inline-block' : 'none',
                  position: 'absolute',
                  lineHeight: '1em',
                  marginTop: '-1px',
                  outline: 'none',
                  zIndex: '999',
                }}
                title='Post menu'
                ref={(el) => {
                  threadMenuRefs.current['rules'] = el;
                  postMenuRef.current = el;
                }}
                className='post-menu-button'
                id='post-menu-button-catalog'
                rotated={openMenuCid === 'rules'}
                onClick={(event) => {
                  event.stopPropagation();
                  const rect = threadMenuRefs.current['rules'].getBoundingClientRect();
                  setMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                  setOpenMenuCid((prevCid) => (prevCid === 'rules' ? null : 'rules'));
                }}
              >
                ▶
              </PostMenu>
            </div>
            {createPortal(
              <PostMenuCatalog
                selectedStyle={selectedStyle}
                ref={(el) => {
                  postMenuCatalogRef.current = el;
                }}
                onClick={(event) => event.stopPropagation()}
                style={{ position: 'absolute', top: menuPosition.top + 7, left: menuPosition.left }}
              >
                <div className={`post-menu-thread post-menu-thread-${'rules'}`} style={{ display: openMenuCid === 'rules' ? 'block' : 'none' }}>
                  <ul className='post-menu-catalog'>
                    {/* {canModerate ? (
											<>
												change rules
											</>
										) : null} */}
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
                        <li onClick={() => handleOptionClick('rules')}>
                          <a href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}`} target='_blank' rel='noreferrer'>
                            Plebbit
                          </a>
                        </li>
                        {/* <li onClick={() => handleOptionClick("rules")}>
													<a
													href={`https://seedit.eth.limo/#/p/${selectedAddress}`}
													target="_blank" rel="noreferrer"
													>Seedit</a>
												</li> */}
                        <li onClick={() => handleOptionClick('rules')}>
                          <a href={`https://plebones.eth.limo/#/p/${selectedAddress}`} target='_blank' rel='noreferrer'>
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
          </BoardForm>
          <Link style={{ all: 'unset', cursor: 'pointer' }} to={`/p/${selectedAddress}/rules`}>
            <div className='teaser' style={{ maxHeight: '312px' }}>
              <div style={{ cursor: 'pointer' }}>
                <span
                  ref={textRef}
                  onMouseOver={() => {
                    setIsHoveringOnThread('rules');
                    setIsHoveringForMenu('rules');
                    const rect = threadRefs.current['rules'].getBoundingClientRect();
                    setPopupPosition({ top: rect.top + window.scrollY, left: rect.left });
                  }}
                  onMouseLeave={() => setIsHoveringForMenu(false)}
                >
                  <b>Rules</b>
                  {': ' + subplebbit.rules?.map((rule, index) => `${index + 1}. ${rule}`).join(' ')}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </>
    );
  } else if (post.type === 'description') {
    return (
      <>
        {isHoveringOnThread === 'description'
          ? createPortal(
              <PostPreview selectedStyle={selectedStyle}>
                <div
                  ref={popupRef}
                  className='post-preview'
                  onMouseOver={() => handleMouseOnLeaveThread()}
                  style={{
                    visibility: isCalculationDone ? 'visible' : 'hidden',
                    left:
                      isCalculationDone && spaceOnRight > 250
                        ? subplebbit.suggestedAvatarUrl
                          ? imageRect.right + 5
                          : textRect.right + 5
                        : isCalculationDone && spaceOnRight < 250
                        ? subplebbit.suggestedAvatarUrl
                          ? imageRect.left - popupRect.width - 5
                          : textRect.left - popupRect.width - 5
                        : 'auto',
                    top: popupPosition.top + 5,
                  }}
                >
                  <span className='post-subject'>Welcome to {subplebbit.title || subplebbit.address}</span> by 
                  <span className='post-author-admin'> ## Board Mods </span>
                  <span className='post-ago'>{thread.timestamp ? getFormattedTime(thread.timestamp) : null}</span>
                </div>
              </PostPreview>,
              document.body,
            )
          : null}
        <div
          className='thread'
          ref={(el) => {
            threadRefs.current['description'] = el;
          }}
          onMouseLeave={() => {
            handleMouseOnLeaveThread();
          }}
        >
          <Link style={{ all: 'unset', cursor: 'pointer' }} to={`/p/${selectedAddress}/description`}>
            {subplebbit.suggested?.avatarUrl ? (
              <img
                className='card'
                onMouseOver={() => {
                  setIsHoveringOnThread('description');
                  setIsHoveringForMenu('description');
                  const rect = threadRefs.current['description'].getBoundingClientRect();
                  setPopupPosition({ top: rect.top + window.scrollY, left: rect.left });
                }}
                onMouseLeave={() => setIsHoveringForMenu(false)}
                src={subplebbit.suggested?.avatarUrl}
                alt='board avatar'
              />
            ) : null}
          </Link>
          {subplebbit.suggested?.avatarUrl ? (
            <div className='thread-icons'>
              <span
                className='thread-icon sticky-icon'
                title='Sticky'
                style={{
                  imageRendering: 'pixelated',
                }}
              />
              <span
                className='thread-icon closed-icon'
                title='Closed'
                style={{
                  imageRendering: 'pixelated',
                }}
              />
            </div>
          ) : null}
          <BoardForm
            selectedStyle={selectedStyle}
            style={{ all: 'unset' }}
            onMouseOver={() => {
              setIsHoveringForMenu('description');
              handleMouseOnLeaveThread();
            }}
            onMouseLeave={() => setIsHoveringForMenu(false)}
          >
            <div className='meta' title='(R)eplies / (L)ink Replies'>
              R:&nbsp;<b>0</b>&nbsp;/&nbsp;L:&nbsp;<b>0</b>
              {subplebbit.suggested?.avatarUrl ? null : (
                <div className='thread-icons' style={{ position: 'absolute', top: '-2px', right: '15px' }}>
                  <span
                    className='thread-icon sticky-icon'
                    title='Sticky'
                    style={{
                      imageRendering: 'pixelated',
                    }}
                  />
                  <span
                    className='thread-icon closed-icon'
                    title='Closed'
                    style={{
                      imageRendering: 'pixelated',
                    }}
                  />
                </div>
              )}
              <PostMenu
                style={{
                  display: isHoveringForMenu === 'description' ? 'inline-block' : 'none',
                  position: 'absolute',
                  lineHeight: '1em',
                  marginTop: '-1px',
                  outline: 'none',
                  zIndex: '999',
                }}
                title='Post menu'
                ref={(el) => {
                  threadMenuRefs.current['description'] = el;
                  postMenuRef.current = el;
                }}
                className='post-menu-button'
                id='post-menu-button-catalog'
                rotated={openMenuCid === 'description'}
                onClick={(event) => {
                  event.stopPropagation();
                  const rect = threadMenuRefs.current['description'].getBoundingClientRect();
                  setMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                  setOpenMenuCid((prevCid) => (prevCid === 'description' ? null : 'description'));
                }}
              >
                ▶
              </PostMenu>
            </div>
            {createPortal(
              <PostMenuCatalog
                selectedStyle={selectedStyle}
                ref={(el) => {
                  postMenuCatalogRef.current = el;
                }}
                onClick={(event) => event.stopPropagation()}
                style={{ position: 'absolute', top: menuPosition.top + 7, left: menuPosition.left }}
              >
                <div className={`post-menu-thread post-menu-thread-${'description'}`} style={{ display: openMenuCid === 'description' ? 'block' : 'none' }}>
                  <ul className='post-menu-catalog'>
                    {/* {canModerate ? (
                      <>
                        change description
                      </>
                    ) : null} */}
                    {subplebbit.suggested?.avatarUrl ? (
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
                          <li onClick={() => handleOptionClick('description')}>
                            <a href={`https://lens.google.com/uploadbyurl?url=${subplebbit.suggested?.avatarUrl}`} target='_blank' rel='noreferrer'>
                              Google
                            </a>
                          </li>
                          <li onClick={() => handleOptionClick('description')}>
                            <a href={`https://yandex.com/images/search?url=${subplebbit.suggested?.avatarUrl}`} target='_blank' rel='noreferrer'>
                              Yandex
                            </a>
                          </li>
                          <li onClick={() => handleOptionClick('description')}>
                            <a href={`https://saucenao.com/search.php?url=${subplebbit.suggested?.avatarUrl}`} target='_blank' rel='noreferrer'>
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
                        <li onClick={() => handleOptionClick('description')}>
                          <a href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}`} target='_blank' rel='noreferrer'>
                            Plebbit
                          </a>
                        </li>
                        {/* <li onClick={() => handleOptionClick("description")}>
													<a
													href={`https://seedit.eth.limo/#/p/${selectedAddress}`}
													target="_blank" rel="noreferrer"
													>Seedit</a>
												</li> */}
                        <li onClick={() => handleOptionClick('description')}>
                          <a href={`https://plebones.eth.limo/#/p/${selectedAddress}`} target='_blank' rel='noreferrer'>
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
          </BoardForm>
          <Link style={{ all: 'unset', cursor: 'pointer' }} to={`/p/${selectedAddress}/description`} onClick={() => setSelectedThread('description')}>
            <div className='teaser' style={{ maxHeight: '170px' }}>
              <div style={{ cursor: 'pointer' }}>
                <span
                  ref={textRef}
                  onMouseOver={() => {
                    setIsHoveringOnThread('description');
                    setIsHoveringForMenu('description');
                    const rect = threadRefs.current['description'].getBoundingClientRect();
                    setPopupPosition({ top: rect.top + window.scrollY, left: rect.left });
                  }}
                  onMouseLeave={() => setIsHoveringForMenu(false)}
                >
                  <b>Welcome to {subplebbit.title || subplebbit.address}!</b>
                  {': ' + subplebbit.description}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </>
    );
  } else {
    return (
      <>
        {isHoveringOnThread === thread.cid
          ? createPortal(
              <PostPreview selectedStyle={selectedStyle}>
                <div
                  ref={popupRef}
                  className='post-preview'
                  onMouseOver={() => handleMouseOnLeaveThread()}
                  style={{
                    visibility: isCalculationDone ? 'visible' : 'hidden',
                    left:
                      isCalculationDone && spaceOnRight > 250
                        ? isMediaShowed
                          ? imageRect.right + 5
                          : textRect.right + 5
                        : isCalculationDone && spaceOnRight < 250
                        ? isMediaShowed
                          ? imageRect.left - popupRect.width - 5
                          : textRect.left - popupRect.width - 5
                        : 'auto',
                    top: popupPosition.top + 5,
                  }}
                >
                  {thread.title ? <span className='post-subject'>{thread.title} </span> : 'Posted '}
                  by
                  <span className='post-author'>{thread.author.displayName ? ` ${thread.author.displayName} ` : ' Anonymous '}</span>
                  <span className='post-ago'>{thread.timestamp ? getFormattedTime(thread.timestamp) : null}</span>
                  {thread.replyCount > 0 ? (
                    <div className='post-last'>
                      Last reply by
                      <span className='post-author'>
                        {' '}
                        <DisplayName commentCid={thread.lastChildCid} />{' '}
                      </span>
                      <span className='post-ago'>{getFormattedTime(thread.lastReplyTimestamp)}</span>
                    </div>
                  ) : null}
                </div>
              </PostPreview>,
              document.body,
            )
          : null}
        <div
          key={`thread-`}
          className='thread'
          ref={(el) => {
            threadRefs.current[thread.cid] = el;
          }}
          onMouseLeave={() => {
            handleMouseOnLeaveThread();
          }}
        >
          {commentMediaInfo?.url ? (
            <Link
              style={{ all: 'unset', cursor: 'pointer' }}
              key={`link-`}
              to={`/p/${selectedAddress}/c/${thread.cid}`}
              onClick={() => setSelectedThread(thread.cid)}
              onMouseOver={() => {
                setIsHoveringOnThread(thread.cid);
                setIsHoveringForMenu(thread.cid);
                const rect = threadRefs.current[thread.cid].getBoundingClientRect();
                setPopupPosition({ top: rect.top + window.scrollY, left: rect.left });
              }}
              onMouseLeave={() => setIsHoveringForMenu(false)}
            >
              {commentMediaInfo?.type === 'webpage' ? (
                thread.thumbnailUrl ? (
                  <span className='file-thumb' style={{ width: displayWidth, height: displayHeight }}>
                    <img
                      className='card'
                      ref={imageRef}
                      key={`img-`}
                      src={commentMediaInfo.thumbnail}
                      alt={commentMediaInfo.type}
                      onError={(e) => {
                        e.target.src = fallbackImgUrl;
                        e.target.onerror = null;
                      }}
                    />
                  </span>
                ) : null
              ) : null}
              {commentMediaInfo?.type === 'iframe' && (thread.thumbnailUrl || commentMediaInfo.thumbnail) ? (
                <span className='file-thumb' style={{ width: displayWidth, height: displayHeight }}>
                  <img
                    className='card'
                    ref={imageRef}
                    key={`img-`}
                    src={commentMediaInfo.thumbnail}
                    alt={commentMediaInfo.type}
                    onError={(e) => {
                      e.target.src = fallbackImgUrl;
                    }}
                  />
                </span>
              ) : null}
              {commentMediaInfo?.type === 'image' ? (
                <span className='file-thumb' style={{ width: displayWidth, height: displayHeight }}>
                  <img
                    className='card'
                    ref={imageRef}
                    key={`img-`}
                    src={commentMediaInfo.url}
                    alt={commentMediaInfo.type}
                    onError={(e) => {
                      e.target.src = fallbackImgUrl;
                      e.target.onerror = null;
                    }}
                  />
                </span>
              ) : null}
              {commentMediaInfo?.type === 'video' ? (
                <span className='file-thumb' style={{ width: displayWidth, height: displayHeight }}>
                  <video
                    className='card'
                    ref={imageRef}
                    key={`fti-`}
                    src={commentMediaInfo.url}
                    alt={commentMediaInfo.type}
                    onError={(e) => (e.target.src = fallbackImgUrl)}
                  />
                </span>
              ) : null}
              {commentMediaInfo?.type === 'audio' ? (
                <audio
                  className='card'
                  ref={imageRef}
                  controls
                  key={`fti-`}
                  src={commentMediaInfo.url}
                  alt={commentMediaInfo.type}
                  onError={(e) => (e.target.src = fallbackImgUrl)}
                />
              ) : null}
            </Link>
          ) : null}
          {isMediaShowed ? (
            <div key={`ti-`} className='thread-icons'>
              {thread.pinned ? (
                <span
                  key={`si-`}
                  className='thread-icon sticky-icon'
                  title='Sticky'
                  style={{
                    imageRendering: 'pixelated',
                  }}
                />
              ) : null}
              {thread.locked ? (
                <span
                  key={`li-`}
                  className='thread-icon closed-icon'
                  title='Closed'
                  style={{
                    imageRendering: 'pixelated',
                  }}
                />
              ) : null}
            </div>
          ) : null}
          <BoardForm
            selectedStyle={selectedStyle}
            onMouseOver={() => {
              setIsHoveringForMenu(thread.cid);
              handleMouseOnLeaveThread();
            }}
            onMouseLeave={() => setIsHoveringForMenu(false)}
            style={{ all: 'unset' }}
          >
            <div key={`meta-`} className='meta' title='(R)eplies / (L)ink Replies'>
              R:&nbsp;<b key={`b-`}>{thread.replyCount}</b>
              {linkCount > 0 ? (
                <>
                  &nbsp;/ L:&nbsp;<b key={`i-`}>{linkCount}</b>
                </>
              ) : null}
              {isMediaShowed ? null : (
                <div className='thread-icons' style={{ position: 'absolute', top: '-2px', right: '15px' }}>
                  {thread.pinned ? (
                    <span
                      key={`si-`}
                      className='thread-icon sticky-icon'
                      title='Sticky'
                      style={{
                        imageRendering: 'pixelated',
                      }}
                    />
                  ) : null}
                  {thread.locked ? (
                    <span
                      key={`li-`}
                      className='thread-icon closed-icon'
                      title='Closed'
                      style={{
                        imageRendering: 'pixelated',
                      }}
                    />
                  ) : null}
                </div>
              )}
              <PostMenu
                style={{
                  display: isHoveringForMenu === thread.cid ? 'inline-block' : 'none',
                  position: 'absolute',
                  lineHeight: '1em',
                  marginTop: '-1px',
                  outline: 'none',
                  zIndex: '999',
                }}
                key={`pmb-`}
                title='Post menu'
                ref={(el) => {
                  threadMenuRefs.current[thread.cid] = el;
                  postMenuRef.current = el;
                }}
                className='post-menu-button'
                id='post-menu-button-catalog'
                rotated={openMenuCid === thread.cid}
                onClick={(event) => {
                  event.stopPropagation();
                  const rect = threadMenuRefs.current[thread.cid].getBoundingClientRect();
                  setMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                  setOpenMenuCid((prevCid) => (prevCid === thread.cid ? null : thread.cid));
                }}
              >
                ▶
              </PostMenu>
            </div>
            {createPortal(
              <PostMenuCatalog
                selectedStyle={selectedStyle}
                ref={(el) => {
                  postMenuCatalogRef.current = el;
                }}
                onClick={(event) => event.stopPropagation()}
                style={{ position: 'absolute', top: menuPosition.top + 7, left: menuPosition.left }}
              >
                <div className={`post-menu-thread post-menu-thread-${thread.cid}`} style={{ display: openMenuCid === thread.cid ? 'block' : 'none' }}>
                  <ul className='post-menu-catalog'>
                    <a
                      target='_blank'
                      rel='noreferrer'
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      href={`https://pleb.bz/p/${selectedAddress}/c/${thread.cid}?redirect=plebchan.eth.limo`}
                    >
                      <li
                        onClick={() => {
                          handleOptionClick(thread.cid);
                        }}
                      >
                        Share thread
                      </li>
                    </a>
                    <VerifiedAuthor commentCid={thread.cid}>
                      {({ authorAddress }) => (
                        <>
                          {authorAddress === account?.author.address || authorAddress === account?.signer.address ? (
                            <>
                              <li onClick={() => handleAuthorEditClick(thread)}>Edit post</li>
                              <li onClick={() => handleAuthorDeleteClick(thread)}>Delete post</li>
                            </>
                          ) : null}
                          {canModerate ? (
                            <>
                              {authorAddress === account?.author.address || authorAddress === account?.signer.address ? null : (
                                <li
                                  onClick={() => {
                                    setModeratingCommentCid(thread.cid);
                                    setIsModerationOpen(true);
                                    handleOptionClick(thread.cid);
                                    setDeletePost(true);
                                  }}
                                >
                                  Delete post
                                </li>
                              )}
                              <li
                                onClick={() => {
                                  setModeratingCommentCid(thread.cid);
                                  setIsModerationOpen(true);
                                  handleOptionClick(thread.cid);
                                }}
                              >
                                Mod tools
                              </li>
                            </>
                          ) : null}
                        </>
                      )}
                    </VerifiedAuthor>
                    {isMediaShowed ? (
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
                          <li onClick={() => handleOptionClick(thread.cid)}>
                            <a href={`https://lens.google.com/uploadbyurl?url=${commentMediaInfo.url}`} target='_blank' rel='noreferrer'>
                              Google
                            </a>
                          </li>
                          <li onClick={() => handleOptionClick(thread.cid)}>
                            <a href={`https://yandex.com/images/search?url=${commentMediaInfo.url}`} target='_blank' rel='noreferrer'>
                              Yandex
                            </a>
                          </li>
                          <li onClick={() => handleOptionClick(thread.cid)}>
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
                        <li onClick={() => handleOptionClick(thread.cid)}>
                          <a href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}/c/${thread.cid}`} target='_blank' rel='noreferrer'>
                            Plebbit
                          </a>
                        </li>
                        <li onClick={() => handleOptionClick(thread.cid)}>
                          <a href={`https://seedit.eth.limo/#/p/${selectedAddress}/c/${thread.cid}`} target='_blank' rel='noreferrer'>
                            Seedit
                          </a>
                        </li>
                        <li onClick={() => handleOptionClick(thread.cid)}>
                          <a href={`https://plebones.eth.limo/#/p/${selectedAddress}/c/${thread.cid}`} target='_blank' rel='noreferrer'>
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
          </BoardForm>
          <Link style={{ all: 'unset', cursor: 'pointer' }} key={`link2-`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)}>
            <div key={`t-`} className='teaser' style={{ maxHeight: `calc(320px - ${displayHeight})` }}>
              <div style={{ cursor: 'pointer' }}>
                <span
                  key={`teaser-width${thread.cid}`}
                  ref={textRef}
                  onMouseOver={() => {
                    setIsHoveringOnThread(thread.cid);
                    setIsHoveringForMenu(thread.cid);
                    const rect = threadRefs.current[thread.cid].getBoundingClientRect();
                    setPopupPosition({ top: rect.top + window.scrollY, left: rect.left });
                  }}
                  onMouseLeave={() => setIsHoveringForMenu(false)}
                >
                  <b key={`b2-`}>{thread.title ? `${thread.title}${thread.content ? ': ' : ''}` : null}</b>
                  {thread.content ? `${thread.content}` : null}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </>
    );
  }
};

const CatalogRow = ({ row }) => {
  const posts = [];
  for (const [index, post] of row.entries()) {
    const key = `${post?.cid}-${index}`;
    posts.push(<CatalogPost key={key} post={post} />);
  }
  return <div>{posts}</div>;
};

const Catalog = () => {
  const {
    captchaResponse,
    setCaptchaResponse,
    setChallengesArray,
    defaultSubplebbits,
    setIsCaptchaOpen,
    isModerationOpen,
    setIsModerationOpen,
    setCanModerate,
    isSettingsOpen,
    setIsSettingsOpen,
    originalCommentContent,
    setPendingComment,
    setPendingCommentIndex,
    setResolveCaptchaPromise,
    selectedAddress,
    setSelectedAddress,
    selectedStyle,
    selectedTitle,
    setSelectedTitle,
    showPostForm,
    showPostFormLink,
  } = useGeneralStore((state) => state);

  const { anonymousMode } = useAnonModeStore();

  const nameRef = useRef();
  const subjectRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();
  const selectedThreadCidRef = useRef(null);
  const virtuosoRef = useRef();

  const setSelectedThreadCid = (cid) => {
    selectedThreadCidRef.current = cid;
  };

  const navigate = useNavigate();

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  const [triggerPublishComment, setTriggerPublishComment] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [executeAnonMode, setExecuteAnonMode] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  useAnonModeRef(selectedThreadCidRef, anonymousMode && executeAnonMode);

  const account = useAccount();
  const { feed, hasMore, loadMore } = useFeed({ subplebbitAddresses: [`${selectedAddress}`], sortType: 'active' });
  const { subplebbitAddress } = useParams();
  const subplebbit = useSubplebbit({ subplebbitAddress: selectedAddress });
  const stateString = useStateString(subplebbit);
  let feedWithDescriptionAndRules = [...feed];

  if (subplebbit.rules) {
    feedWithDescriptionAndRules.unshift({ type: 'rules', content: subplebbit.rules });
  }

  if (subplebbit.description) {
    feedWithDescriptionAndRules.unshift({ type: 'description', content: subplebbit.description });
  }

  const columnWidth = 180;
  const windowWidth = useWindowWidth();
  const columnCount = Math.floor(windowWidth / columnWidth);
  const rows = useFeedRows(feedWithDescriptionAndRules, columnCount);

  useEffect(() => {
    if (subplebbit.roles !== undefined) {
      const role = subplebbit.roles[account?.author.address]?.role;

      if (role === 'moderator' || role === 'admin' || role === 'owner') {
        setCanModerate(true);
      } else {
        setCanModerate(false);
      }
    }
  }, [account?.author.address, subplebbit.roles, setCanModerate]);

  useEffect(() => {
    setSelectedAddress(subplebbitAddress);
  }, [subplebbitAddress, setSelectedAddress]);

  const errorString = useMemo(() => {
    if (subplebbit?.state === 'failed') {
      let errorString = 'Failed fetching board "' + selectedAddress + '".';
      if (subplebbit.error) {
        errorString += `: ${subplebbit.error.toString().slice(0, 300)}`;
      }
      return errorString;
    }
  }, [subplebbit?.state, subplebbit?.error, selectedAddress]);

  useEffect(() => {
    if (errorString) {
      setNewErrorMessage(errorString);
    }
  }, [errorString, setNewErrorMessage]);

  const { subscribed, subscribe, unsubscribe } = useSubscribe({ subplebbitAddress: selectedAddress });

  useEffect(() => {
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
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
  }, [subplebbitAddress, setSelectedAddress, setSelectedTitle, defaultSubplebbits, subplebbit?.address, subplebbit?.title]);

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
      if (challengeVerification.publication?.cid !== undefined) {
        navigate(`/p/${subplebbitAddress}/c/${challengeVerification.publication?.cid}`);
        console.log('challenge success');
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
      subplebbitAddress: selectedAddress,
    }));
  }, [selectedAddress]);

  const [publishCommentOptions, setPublishCommentOptions] = useState({
    subplebbitAddress: selectedAddress,
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

    if (anonymousMode) {
      setSelectedThreadCid(index);
    }

    setPublishCommentOptions((prevPublishCommentOptions) => ({
      ...prevPublishCommentOptions,
      author: {
        displayName: nameRef.current.value || undefined,
        ...(anonymousMode ? {} : { address: account?.author.address }),
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
      setNewErrorMessage(error.message);
      console.log(error);
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToTop) {
      lastVirtuosoStates[`${selectedAddress}-catalog`] = null;
    }
    const setLastVirtuosoState = () => {
      virtuosoRef.current?.getState((snapshot) => {
        if (snapshot?.scrollTop === 0 || snapshot?.ranges?.length) {
          lastVirtuosoStates[`${selectedAddress}-catalog`] = snapshot;
        }
      });
    };
    window.addEventListener('scroll', setLastVirtuosoState);

    return () => window.removeEventListener('scroll', setLastVirtuosoState);
  }, [selectedAddress, location.state?.scrollToTop]);

  const lastVirtuosoState = lastVirtuosoStates[`${selectedAddress}-catalog`];

  return (
    <>
      <Helmet>
        <title>{(selectedTitle ? selectedTitle : selectedAddress) + ' - Catalog - plebchan'}</title>
      </Helmet>
      <Container>
        <CreateBoardModal selectedStyle={selectedStyle} isOpen={isCreateBoardOpen} closeModal={() => setIsCreateBoardOpen(false)} />
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
              <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>
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
                  <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>
                    Settings
                  </Link>
                  &nbsp;
                  <Link
                    to={{ pathname: '/', state: { scrollToTop: true } }}
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
        <PostForm selectedStyle={selectedStyle}>
          <PostFormLink id='post-form-link' showPostFormLink={showPostFormLink} selectedStyle={selectedStyle}>
            <div id='post-form-link-desktop'>
              [
              <Link to={`/p/${subplebbitAddress}/catalog/post`} onClick={useClickForm()} onMouseOver={(event) => (event.target.style.cursor = 'pointer')}>
                Start a New Thread
              </Link>
              ]
            </div>
            <div id='post-form-link-mobile'>
              <span className='btn-wrap'>
                <Link to={`/p/${subplebbitAddress}/catalog/post`} onClick={useClickForm()} onMouseOver={(event) => (event.target.style.cursor = 'pointer')}>
                  Start a New Thread
                </Link>
              </span>
            </div>
          </PostFormLink>
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
                </td>
              </tr>
              <tr data-type='Subject'>
                <td>Subject</td>
                <td>
                  <input name='sub' type='text' tabIndex={3} ref={subjectRef} />
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
          <div className='return-button' id='return-button-desktop'>
            [<Link to={{ pathname: `/p/${selectedAddress}`, state: { scrollToTop: true } }}>Return</Link>]
            {subplebbit.roles && subplebbit?.roles[account?.author?.address]?.role === 'admin' ? <BoardSettings subplebbit={subplebbit} /> : null}
          </div>
          {subplebbit.state === 'succeeded' ? (
            <>
              <span className='subscribe-button-desktop'>
                [
                <span id='subscribe' style={{ cursor: 'pointer' }}>
                  <span onClick={() => handleSubscribe()}>{subscribed ? 'Unsubscribe' : 'Subscribe'}</span>
                </span>
                ]
              </span>
              <span className='subscribe-button-mobile'>
                <span className='btn-wrap' onClick={() => handleSubscribe()}>
                  {subscribed ? 'Unsubscribe' : 'Subscribe'}
                </span>
              </span>
            </>
          ) : (
            <div id='stats' style={{ float: 'right', marginTop: '5px' }}>
              <span className={stateString ? 'ellipsis' : ''}>{stateString}</span>
            </div>
          )}
          <div id='return-button-mobile'>
            <span className='btn-wrap-catalog btn-wrap'>
              <Link to={{ pathname: `/p/${selectedAddress}`, state: { scrollToTop: true } }}>Return</Link>
            </span>
          </div>
          <hr />
        </TopBar>
        <Tooltip id='tooltip' className='tooltip' />
        <Threads selectedStyle={selectedStyle}>
          {subplebbit?.state !== 'failed' && subplebbit.state === 'succeeded' ? (
            <Virtuoso
              increaseViewportBy={{ bottom: 600, top: 600 }}
              totalCount={rows?.length || 0}
              data={rows}
              style={{ maxWidth: '100%' }}
              itemContent={(index, row) => <CatalogRow index={index} row={row} />}
              useWindowScroll={true}
              components={{ Footer: () => (hasMore ? <CatalogLoader /> : null) }}
              endReached={loadMore}
              ref={virtuosoRef}
              restoreStateFrom={lastVirtuosoState}
              initialScrollTop={lastVirtuosoState?.scrollTop}
            />
          ) : (
            <CatalogLoader />
          )}
        </Threads>
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
                <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>
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

export default Catalog;
