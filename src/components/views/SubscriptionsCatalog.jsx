import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip } from 'react-tooltip';
import { Virtuoso } from 'react-virtuoso';
import { useAccount, useFeed, usePublishCommentEdit, useSubplebbits } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import { Container, NavBar, Header, Break, PostMenu, BoardForm } from '../styled/views/Board.styled';
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
import useError from '../../hooks/useError';
import useFeedRows from '../../hooks/useFeedRows';
import useFeedStateString from '../../hooks/useFeedStateString';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import useSuccess from '../../hooks/useSuccess';
import useWindowWidth from '../../hooks/useWindowWidth';
import packageJson from '../../../package.json';
const { version } = packageJson
let lastVirtuosoStates = {}


const SubscriptionsCatalog = () => {
  const {
    setCaptchaResponse,
    setChallengesArray,
    defaultSubplebbits,
    editedComment,
    setIsAuthorDelete,
    setIsAuthorEdit,
    setIsCaptchaOpen,
    isModerationOpen, setIsModerationOpen,
    isSettingsOpen, setIsSettingsOpen,
    setModeratingCommentCid,
    setResolveCaptchaPromise,
    selectedAddress, setSelectedAddress,
    selectedStyle,
    setSelectedThread,
    setSelectedTitle,
  } = useGeneralStore(state => state);

  const threadMenuRefs = useRef({});
  const postMenuRef = useRef(null);
  const postMenuCatalogRef = useRef(null);
  const virtuosoRef = useRef();

  const account = useAccount();
  const navigate = useNavigate();
  const [, setNewErrorMessage] = useError();
  const [, setNewSuccessMessage] = useSuccess();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [originalCommentContent, setOriginalCommentContent] = useState(null);
  const [triggerPublishCommentEdit, setTriggerPublishCommentEdit] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [commentCid, setCommentCid] = useState(null);
  const [moderatorPermissions, setModeratorPermissions] = useState({});
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  const { feed, hasMore, loadMore } = useFeed({ subplebbitAddresses: account?.subscriptions, sortType: 'active' });
  const [selectedFeed, setSelectedFeed] = useState(feed.sort((a, b) => b.timestamp - a.timestamp));
  const { subplebbits } = useSubplebbits({ subplebbitAddresses: account?.subscriptions, sortType: 'active' });

  const stateString = useFeedStateString(subplebbits);

  const columnWidth = 180;
  const windowWidth = useWindowWidth();
  const columnCount = Math.floor(windowWidth / columnWidth);
  const rows = useFeedRows(feed, columnCount);


  useEffect(() => {
    let permissions = {};

    selectedFeed.forEach(thread => {
      const subplebbit = subplebbits.find(s => s && s.address === thread.subplebbitAddress);

      if (subplebbit && subplebbit.roles) {
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
      setNewSuccessMessage('Challenge Success');
    }
    else if (challengeVerification.challengeSuccess === false) {
      setNewErrorMessage(`Challenge Failed, reason: ${challengeVerification.reason}. Errors: ${challengeVerification.errors}`);
      console.log('challenge failed', challengeVerification);
    }
  };


  const onChallenge = async (challenges, comment) => {
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


  const CatalogPost = ({ post }) => {
    const thread = post;
    const commentMediaInfo = getCommentMediaInfo(thread);
    const linkCount = countLinks(thread);
    const fallbackImgUrl = "assets/filedeleted-res.gif";
    const [isHoveringOnThread, setIsHoveringOnThread] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [openMenuCid, setOpenMenuCid] = useState(null);
    const isModerator = moderatorPermissions[thread.subplebbitAddress];

    const handleOutsideClick = useCallback((e) => {
      if (openMenuCid !== null && !postMenuRef.current.contains(e.target) && !postMenuCatalogRef.current.contains(e.target)) {
        setOpenMenuCid(null);
      }
    }, [openMenuCid]);

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

    return (
      <div key={`thread-`} className="thread"
        onMouseOver={() => { setIsHoveringOnThread(thread.cid) }}
        onMouseLeave={() => { setIsHoveringOnThread('') }}>
        {commentMediaInfo?.url ? (
          <Link style={{ all: "unset", cursor: "pointer" }} key={`link-`} to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`}
            onClick={() => setSelectedThread(thread.cid)}>
            {commentMediaInfo?.type === "webpage" ? (
              thread.thumbnailUrl ? (
                <img className="card" key={`img-`}
                  src={commentMediaInfo.thumbnail} alt={commentMediaInfo.type}
                  onError={(e) => {
                    e.target.src = fallbackImgUrl
                    e.target.onerror = null;
                  }} />
              ) : null
            ) : null}
            {commentMediaInfo?.type === "image" ? (
              <img className="card" key={`img-`}
                src={commentMediaInfo.url} alt={commentMediaInfo.type}
                onError={(e) => {
                  e.target.src = fallbackImgUrl
                  e.target.onerror = null;
                }} />
            ) : null}
            {commentMediaInfo?.type === "video" ? (
              <video className="card" key={`fti-`}
                src={commentMediaInfo.url}
                alt={commentMediaInfo.type}
                onError={(e) => e.target.src = fallbackImgUrl} />
            ) : null}
            {commentMediaInfo?.type === "audio" ? (
              <audio className="card" controls
                key={`fti-`}
                src={commentMediaInfo.url}
                alt={commentMediaInfo.type}
                onError={(e) => e.target.src = fallbackImgUrl} />
            ) : null}
          </Link>
        ) : null}
        <div key={`ti-`} className={`thread-icons ${(commentMediaInfo && (
          commentMediaInfo.type === 'image' ||
          commentMediaInfo.type === 'video' ||
          (commentMediaInfo.type === 'webpage' &&
            commentMediaInfo.thumbnail))) ? "thread-icon-has-display" : ""}`} >
          {(commentMediaInfo && (
            commentMediaInfo.type === 'image' ||
            commentMediaInfo.type === 'video' ||
            (commentMediaInfo.type === 'webpage' &&
              commentMediaInfo.thumbnail))) ? (
            <OfflineIndicator
              address={thread.subplebbitAddress}
              className="thread-icon offline-icon"
              tooltipPlace="top" />
          ) : (
            <OfflineIndicator
              address={thread.subplebbitAddress}
              className="thread-icon offline-icon-no-link"
              tooltipPlace="top" />
          )}
        </div>
        <BoardForm selectedStyle={selectedStyle}
          style={{ all: "unset" }}>
          <div key={`meta-`} className="meta" title="(R)eplies / (L)ink Replies" >
            R:&nbsp;<b key={`b-`}>{thread.replyCount}</b>
            {linkCount > 0 ? (
              <>
                &nbsp;/
                L:&nbsp;<b key={`i-`}>{linkCount}</b>
              </>
            ) : null}
            <PostMenu
              style={{
                display: isHoveringOnThread === thread.cid ? 'inline-block' : 'none',
                position: 'absolute', lineHeight: '1em', marginTop: '-1px', outline: 'none',
                zIndex: '999'
              }}
              key={`pmb-`}
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
                setMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                setOpenMenuCid(prevCid => (prevCid === thread.cid ? null : thread.cid));
              }}
            >
              ▶
            </PostMenu>
          </div>
          {createPortal(
            <PostMenuCatalog selectedStyle={selectedStyle}
              ref={el => { postMenuCatalogRef.current = el }}
              onClick={(event) => event.stopPropagation()}
              style={{
                position: "absolute",
                top: menuPosition.top + 7,
                left: menuPosition.left
              }}>
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
                    </>
                  )}</VerifiedAuthor>
                  {(commentMediaInfo && (
                    commentMediaInfo.type === 'image' ||
                    (commentMediaInfo.type === 'webpage' &&
                      commentMediaInfo.thumbnail))) ? (
                    <li
                      onMouseOver={() => { setIsImageSearchOpen(true) }}
                      onMouseLeave={() => { setIsImageSearchOpen(false) }}>
                      Image search »
                      <ul className="dropdown-menu post-menu-catalog"
                        style={{ display: isImageSearchOpen ? 'block' : 'none' }}>
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
        <Link style={{ all: "unset", cursor: "pointer" }} key={`link2-`} to={`/p/${thread.subplebbitAddress}/c/${thread.cid}`}
          onClick={() => setSelectedThread(thread.cid)}>
          <div key={`t-`} className="teaser">
            <b key={`b2-`}>{thread.title ? `${thread.title}` : null}</b>
            {thread.content ? `: ${thread.content}` : null}
          </div>
        </Link>
      </div>
    );
  };


  const CatalogRow = ({ row }) => {
    const posts = []
    for (const post of row) {
      posts.push(<CatalogPost key={post?.cid} post={post} />)
    }
    return <div>{posts}</div>
  }

  useEffect(() => {
    const setLastVirtuosoState = () => {
      virtuosoRef.current?.getState((snapshot) => {
        if (snapshot?.scrollTop === 0 || snapshot?.ranges?.length) {
          lastVirtuosoStates[`${selectedAddress}-catalog`] = snapshot;
        }
      });
    };
    window.addEventListener('scroll', setLastVirtuosoState);

    return () => window.removeEventListener('scroll', setLastVirtuosoState);
  }, [selectedAddress]);


  const lastVirtuosoState = lastVirtuosoStates["subscriptionsCatalog"];


  return (
    <>
      <Helmet>
        <title>Subscriptions - Catalog - plebchan</title>
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
          closeModal={() => { setIsModerationOpen(false); setDeletePost(false) }}
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
              <span id="button-span" style={{ cursor: 'pointer' }} onClick={
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
              <Link to={`/p/subscriptions/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
                  <span id="button-span" style={{ cursor: 'pointer' }} onClick={
                    () => alert(
                      'You can create a board with the desktop version of plebchan:\nhttps://github.com/plebbit/plebchan/releases/latest\n\nIf you are comfortable with the command line, use plebbit-cli:\nhttps://github.com/plebbit/plebbit-cli\n\n'
                    )
                  }>Create Board</span>
                </div>
                <div className="page-jump">
                  <Link to={`/p/subscriptions/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
                  &nbsp;
                  <Link to="/" onClick={() => { handleStyleChange({ target: { value: "Yotsuba" } }); window.scrollTo(0, 0); }}>Home</Link>
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
              {account?.subscriptions.length < 1 ? (
                <div className="board-address">You haven't subscribed to any board yet.</div>
              ) : (
                <div className="board-address">
                  You have subscribed to {account?.subscriptions.length} board{account?.subscriptions.length > 1 ? "s" : null}.
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
          <div className="return-button" id="return-button-desktop">
            [
            <Link to={`/p/subscriptions`}>Return</Link>
            ]
          </div>
          <div id="return-button-mobile">
            <span className="btn-wrap-catalog btn-wrap">
              <Link to={`/p/subscriptions`}>Return</Link>
            </span>
          </div>
          {subplebbits.state === "succeeded" ? (
            null
          ) : (
            <div id="stats" style={{ float: "right", marginTop: "5px" }}>
              <span className={stateString ? "ellipsis" : ""}>{stateString}</span>
            </div>
          )}
          <hr />
        </TopBar>
        <Tooltip id="tooltip" className="tooltip" />
        <Threads selectedStyle={selectedStyle}>
          {feed.length > 1 ? (
            <Virtuoso
              increaseViewportBy={{ bottom: 600, top: 600 }}
              totalCount={rows?.length || 0}
              data={rows}
              style={{ maxWidth: '100%' }}
              itemContent={(index, row) => <CatalogRow index={index} row={row} />}
              useWindowScroll={true}
              components={{ Footer: () => hasMore ? <CatalogLoader /> : null }}
              endReached={loadMore}
              ref={virtuosoRef}
              restoreStateFrom={lastVirtuosoState}
              initialScrollTop={lastVirtuosoState?.scrollTop}
            />
          ) : (<CatalogLoader />)}
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
                <span id="button-span" style={{ cursor: 'pointer' }} onClick={
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
                <Link to={`/p/subscriptions/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
                ]
                [
                <Link to="/" onClick={() => handleStyleChange({ target: { value: "Yotsuba" } }
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
            <a style={{ textDecoration: 'underline' }} href="https://plebbit.com" target="_blank" rel="noopener noreferrer">About</a>
            &nbsp;•&nbsp;
            <a style={{ textDecoration: 'underline' }} href="https://github.com/plebbit/plebchan/releases/latest" target="_blank" rel="noopener noreferrer">App</a>
            &nbsp;•&nbsp;
            <a style={{ textDecoration: 'underline' }} href="https://twitter.com/plebchan_eth" target="_blank" rel="noopener noreferrer">Twitter</a>
            &nbsp;•&nbsp;
            <a style={{ textDecoration: 'underline' }} href="https://t.me/plebbit" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
        </Footer>
      </Container>
    </>
  );
}

export default SubscriptionsCatalog;