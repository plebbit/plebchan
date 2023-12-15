import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip } from 'react-tooltip';
import { Virtuoso } from 'react-virtuoso';
import { useAccount, useFeed, usePublishCommentEdit, useSubplebbit, useSubplebbits } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import { Container, NavBar, Header, Break, PostMenu, BoardForm } from '../styled/views/Board.styled';
import { Threads, PostPreview, PostMenuCatalog } from '../styled/views/Catalog.styled';
import { TopBar, Footer } from '../styled/views/Thread.styled';
import { AlertModal } from '../styled/modals/AlertModal.styled';
import CatalogLoader from '../CatalogLoader';
import DisplayName from '../DisplayName';
import EditModal from '../modals/EditModal';
import ImageBanner from '../ImageBanner';
import VerifiedAuthor from '../VerifiedAuthor';
import CreateBoardModal from '../modals/CreateBoardModal';
import ModerationModal from '../modals/ModerationModal';
import OfflineIndicator from '../OfflineIndicator';
import SettingsModal from '../modals/SettingsModal';
import countLinks from '../../utils/countLinks';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getFormattedTime from '../../utils/getFormattedTime';
import handleShareClick from '../../utils/handleShareClick';
import handleStyleChange from '../../utils/handleStyleChange';
import useError from '../../hooks/useError';
import useFeedRows from '../../hooks/useFeedRows';
import useFeedStateString from '../../hooks/useFeedStateString';
import useSuccess from '../../hooks/useSuccess';
import useWindowWidth from '../../hooks/useWindowWidth';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
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
    setIsModerationOpen,
    setChallengesArray,
    setIsAuthorEdit,
    setIsCaptchaOpen,
    setIsEditModalOpen,
    setModeratingCommentCid,
    setOriginalCommentContent,
    setPendingComment,
    setResolveCaptchaPromise,
    selectedAddress,
    setSelectedAddress,
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
  const [canModerate, setCanModerate] = useState(false);

  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  const account = useAccount();
  const subplebbit = useSubplebbit({ subplebbitAddress: thread.subplebbitAddress });
  const threadMenuRefs = useRef({});
  const threadRefs = useRef({});
  const postMenuRef = useRef(null);
  const postMenuCatalogRef = useRef(null);
  const popupRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
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

  useEffect(() => {
    if (subplebbit.roles !== undefined) {
      const role = subplebbit.roles[account?.author.address]?.role;

      if (role === 'moderator' || role === 'admin' || role === 'owner') {
        setCanModerate(true);
      } else {
        setCanModerate(false);
      }
    }
  }, [account?.author.address, subplebbit.roles]);

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
    subplebbitAddress: selectedAddress,
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
            to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`}
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
        <div key={`ti-`} className='thread-icons'>
          {isMediaShowed ? (
            <OfflineIndicator address={thread.subplebbitAddress} className='thread-icon offline-icon' tooltipPlace='top' />
          ) : (
            <OfflineIndicator
              address={thread.subplebbitAddress}
              className={`thread-icon ${linkCount > 0 ? 'offline-icon-no-link-shifted' : 'offline-icon-no-link'} ${
                isHoveringOnThread === thread.cid ? 'offline-icon-no-link-hovered' : ''
              }`}
              tooltipPlace='top'
            />
          )}
        </div>
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
                  <li
                    onClick={() => {
                      handleOptionClick(thread.cid);
                      setNewSuccessMessage('Link copied to clipboard');
                      handleShareClick(selectedAddress, thread.cid);
                    }}
                  >
                    Share thread
                  </li>
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
                                  setSelectedAddress(thread.subplebbitAddress);
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
                                setSelectedAddress(thread.subplebbitAddress);
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
                      {/* <li onClick={() => handleOptionClick(thread.cid)}>
                        <a
                        href={`https://seedit.eth.limo/#/p/${selectedAddress}/c/${thread.cid}`}
                        target="_blank" rel="noreferrer"
                        >Seedit</a>
                      </li> */}
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
        <Link
          style={{ all: 'unset', cursor: 'pointer' }}
          key={`link2-`}
          to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`}
          onClick={() => setSelectedThread(thread.cid)}
        >
          <div key={`t-`} className='teaser' style={{ maxHeight: `calc(320px - ${displayHeight})` }}>
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
        </Link>
      </div>
    </>
  );
};

const CatalogRow = ({ row }) => {
  const posts = [];
  for (const [index, post] of row.entries()) {
    const key = `${post?.cid}-${index}`;
    posts.push(<CatalogPost key={key} post={post} />);
  }
  return <div>{posts}</div>;
};

const AllCatalog = () => {
  const {
    defaultSubplebbits,
    isModerationOpen,
    setIsModerationOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    originalCommentContent,
    selectedAddress,
    setSelectedAddress,
    selectedStyle,
    setSelectedTitle,
  } = useGeneralStore((state) => state);

  const virtuosoRef = useRef();

  const navigate = useNavigate();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  const addresses = defaultSubplebbits.map((subplebbit) => subplebbit.address);
  const { feed, hasMore, loadMore } = useFeed({ subplebbitAddresses: addresses, sortType: 'active' });
  const { subplebbits } = useSubplebbits({ subplebbitAddresses: addresses, sortType: 'active' });
  let feedData = [...feed];

  const stateString = useFeedStateString(addresses);

  const columnWidth = 180;
  const windowWidth = useWindowWidth();
  const columnCount = Math.floor(windowWidth / columnWidth);
  const rows = useFeedRows(feedData, columnCount);

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

  // desktop navbar board select functionality
  const handleClickTitle = (title, address) => {
    setSelectedTitle(title);
    setSelectedAddress(address);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToTop) {
      lastVirtuosoStates[`allCatalog`] = null;
    }
    const setLastVirtuosoState = () => {
      virtuosoRef.current?.getState((snapshot) => {
        if (snapshot?.scrollTop === 0 || snapshot?.ranges?.length) {
          lastVirtuosoStates['allCatalog'] = snapshot;
        }
      });
    };
    window.addEventListener('scroll', setLastVirtuosoState);

    return () => window.removeEventListener('scroll', setLastVirtuosoState);
  }, [selectedAddress, location.state?.scrollToTop]);

  const lastVirtuosoState = lastVirtuosoStates['allCatalog'];

  return (
    <>
      <Helmet>
        <title>p/All - Catalog - plebchan</title>
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
              <Link to={`/p/all/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>
                Settings
              </Link>
              ] [<Link to='/'>Home</Link>]
            </span>
            <div id='board-nav-mobile' style={{ top: visible ? 0 : '-23px' }}>
              <div className='nav-container'>
                <div className='board-select'>
                  <strong>Board</strong>
                  &nbsp;
                  <select id='board-select-mobile' value='all' onChange={handleSelectChange}>
                    <option value='all'>All</option>
                    <option value='subscriptions'>Subscriptions</option>
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
                  <Link to={`/p/all/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>
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
            <div className='board-title'>p/All</div>
            <div className='board-address'>Default boards, currently curated by devs.</div>
          </>
        </Header>
        <Break selectedStyle={selectedStyle} />
        <TopBar selectedStyle={selectedStyle}>
          <hr />
          <span className='style-changer'>
            Style:  
            <select id='style-selector' onChange={handleStyleChange} value={selectedStyle}>
              <option value='Yotsuba'>Yotsuba</option>
              <option value='Yotsuba-B'>Yotsuba B</option>
              <option value='Futaba'>Futaba</option>
              <option value='Burichan'>Burichan</option>
              <option value='Tomùorrow'>Tomorrow</option>
              <option value='Photon'>Photon</option>
            </select>
          </span>
          <div className='return-button' id='return-button-desktop'>
            [<Link to={{ pathname: `/p/all`, state: { scrollToTop: true } }}>Return</Link>]
          </div>
          <div id='return-button-mobile'>
            <span className='btn-wrap-catalog btn-wrap'>
              <Link to={{ pathname: `/p/all`, state: { scrollToTop: true } }}>Return</Link>
            </span>
          </div>
          {subplebbits.state === 'succeeded' ? null : (
            <div className='stats-all-catalog-container'>
              <span id='stats-all'>{stateString}</span>
              <span className={stateString ? 'ellipsis-all' : ''} />
            </div>
          )}
          <hr />
        </TopBar>
        <Tooltip id='tooltip' className='tooltip' />
        <Threads selectedStyle={selectedStyle}>
          {feed.length > 1 ? (
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
                ]&nbsp;[
                {defaultSubplebbits.map((subplebbit, index) => (
                  <span className='boardList' key={`span-${subplebbit.address}`}>
                    {index === 0 ? null : '\u00a0'}
                    <Link to={`/p/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => handleClickTitle(subplebbit.title, subplebbit.address)}>
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
                <Link to={`/p/all/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>
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

export default AllCatalog;
