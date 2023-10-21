import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useAccount, useAccountComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break, PostForm, BoardForm } from '../styled/views/Board.styled';
import { ReplyFormLink, TopBar, BottomBar } from '../styled/views/Thread.styled';
import BoardStats from '../BoardStats';
import ImageBanner from '../ImageBanner';
import Post from '../Post';
import PostLoader from '../PostLoader';
import CreateBoardModal from '../modals/CreateBoardModal';
import SettingsModal from '../modals/SettingsModal';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getDate from '../../utils/getDate';
import handleImageClick from '../../utils/handleImageClick';
import handleQuoteClick from '../../utils/handleQuoteClick';
import handleStyleChange from '../../utils/handleStyleChange';
import useError from '../../hooks/useError';
import useStateString from '../../hooks/useStateString';
import packageJson from '../../../package.json';
const { version } = packageJson;
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : '';

const Pending = () => {
  const { defaultSubplebbits, isSettingsOpen, setIsSettingsOpen, selectedAddress, setSelectedAddress, selectedStyle, setSelectedTitle, showPostFormLink } =
    useGeneralStore((state) => state);

  const { index } = useParams();

  const account = useAccount();
  const comment = useAccountComment({ commentIndex: index });
  const [, setNewErrorMessage] = useError();
  const [isThumbnailClicked, setIsThumbnailClicked] = useState({});
  const [isMobileThumbnailClicked, setIsMobileThumbnailClicked] = useState({});
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  const subplebbitAddress = comment?.subplebbitAddress;

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const selectedTitle = subplebbit?.title;

  const handleThumbnailClick = (index, isMobile = false) => {
    if (isMobile) {
      setIsMobileThumbnailClicked((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    } else {
      setIsThumbnailClicked((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    }
  };

  useEffect(() => {
    setSelectedAddress(comment?.subplebbitAddress);
  }, [comment, setSelectedAddress]);

  const stateString = useStateString(comment);

  const errorString = useMemo(() => {
    if (comment?.state === 'failed') {
      let errorString = 'Failed fetching pending thread. Pending index: ' + index;
      if (comment.error) {
        errorString += `: ${comment.error.toString().slice(0, 300)}`;
      }
      return errorString;
    }
  }, [comment?.state, comment?.error, index]);

  useEffect(() => {
    if (errorString) {
      setNewErrorMessage(errorString);
    }
  }, [errorString, setNewErrorMessage]);

  const [visible] = useState(true);

  const navigate = useNavigate();
  const [commentMediaInfo, setCommentMediaInfo] = useState(null);
  const fallbackImgUrl = 'assets/filedeleted-res.gif';

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

  // get comment media info
  useEffect(() => {
    if (comment && comment.link) {
      const mediaInfo = getCommentMediaInfo(comment);
      setCommentMediaInfo(mediaInfo);
    }
  }, [comment]);

  return (
    <>
      <Helmet>
        <title>{`plebchan - Pending Thread #${parseInt(index) + 1}`}</title>
      </Helmet>
      <Container>
        <CreateBoardModal selectedStyle={selectedStyle} isOpen={isCreateBoardOpen} closeModal={() => setIsCreateBoardOpen(false)} />
        <SettingsModal selectedStyle={selectedStyle} isOpen={isSettingsOpen} closeModal={() => setIsSettingsOpen(false)} />
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
              <Link to={`/profile/c/${index}/settings`} onClick={() => setIsSettingsOpen(true)}>
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
                  <Link to={`/p/${selectedAddress}/settings`} onClick={() => setIsSettingsOpen(true)}>
                    Settings
                  </Link>
                  &nbsp;
                  <Link
                    to='/'
                    onClick={() => {
                      handleStyleChange({ target: { value: 'Yotsuba' } });
                      window.scrollTo(0, 0);
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
              <div className='board-title'>{selectedTitle ?? null}</div>
              <div className='board-address'>{selectedAddress ? 'p/' + selectedAddress : null}</div>
            </>
          </>
        </Header>
        <Break selectedStyle={selectedStyle} />
        <PostForm selectedStyle={selectedStyle} name='post' action='' method='post' enctype='multipart/form-data'>
          <ReplyFormLink id='post-form-link' showReplyFormLink={showPostFormLink} selectedStyle={selectedStyle}>
            <div id='return-button-mobile'>
              <span className='btn-wrap'>
                <Link
                  to={`/p/${selectedAddress}`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  Return
                </Link>
              </span>
            </div>
            <div id='catalog-button-mobile'>
              <span className='btn-wrap'>
                <Link
                  to={`/p/${selectedAddress}/catalog`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  Catalog
                </Link>
              </span>
            </div>
            <div>&nbsp;</div>
          </ReplyFormLink>
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
            [
            <Link
              to={`/p/${selectedAddress}`}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              Return
            </Link>
            ]
          </span>
          <span className='return-button catalog-button' id='catalog-button-desktop'>
            [
            <Link
              to={`/p/${selectedAddress}/catalog`}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              Catalog
            </Link>
            ]
          </span>
          <div className='stats-pending-container'>
            <span id='stats-pending'>{stateString}</span>
            <span className={stateString ? 'ellipsis-all' : ''} />
          </div>
          <hr />
        </TopBar>
        <Tooltip id='tooltip' className='tooltip' />
        <BoardForm selectedStyle={selectedStyle}>
          {comment !== undefined ? (
            <>
              <div className='thread'>
                <div className='op-container'>
                  <div className='post op'>
                    <div className='post-info'>
                      {commentMediaInfo?.url ? (
                        <div key={`f-${index}`} className='file' style={{ marginBottom: '5px' }}>
                          <div key={`ft-${index}`} className='file-text'>
                            Link:&nbsp;
                            <a key={`fa-${index}`} href={commentMediaInfo.url} target='_blank' rel='noopener noreferrer'>
                              {commentMediaInfo?.url.length > 30 ? commentMediaInfo?.url.slice(0, 30) + '(...)' : commentMediaInfo?.url}
                            </a>
                            &nbsp;({commentMediaInfo?.type === 'iframe' ? 'video' : commentMediaInfo?.type})
                            {isThumbnailClicked[index] ? (
                              <span>
                                -[
                                <span
                                  className='reply-link'
                                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                  onClick={() => {
                                    handleThumbnailClick(index);
                                  }}
                                >
                                  Close
                                </span>
                                ]
                              </span>
                            ) : null}
                          </div>
                          {commentMediaInfo?.type === 'iframe' && (
                            <div key={`enlarge-${index}`} className={`img-container ${isThumbnailClicked[index] ? 'expanded-container' : ''}`}>
                              <span key={`fta-${index}`} className='file-thumb'>
                                {(isThumbnailClicked[index] || !commentMediaInfo.thumbnail) && commentMediaInfo.embedUrl ? (
                                  <iframe
                                    className='enlarged'
                                    key={`fti-${index}`}
                                    src={commentMediaInfo.embedUrl}
                                    width={commentMediaInfo.thumbnail ? '560' : '250'}
                                    height='315'
                                    style={{ border: 'none' }}
                                    title='Embedded content'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                    allowFullScreen
                                  />
                                ) : (
                                  <img
                                    key={`fti-${index}`}
                                    src={commentMediaInfo.thumbnail}
                                    alt='thumbnail'
                                    onClick={() => {
                                      handleThumbnailClick(index);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    onError={(e) => (e.target.src = fallbackImgUrl)}
                                  />
                                )}
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
                                    onClick={handleImageClick}
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
                                  onClick={handleImageClick}
                                  style={{ cursor: 'pointer' }}
                                  onError={(e) => (e.target.src = fallbackImgUrl)}
                                />
                              </span>
                            </div>
                          ) : null}
                          {commentMediaInfo?.type === 'video' ? (
                            <div key={`enlarge-${index}`} className={`img-container ${isThumbnailClicked[index] ? 'expanded-container' : ''}`}>
                              <span key={`fta-${index}`} className='file-thumb'>
                                {isThumbnailClicked[index] ? (
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
                                      handleThumbnailClick(index);
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
                              <span key={`q-${'pending'}`} className='title' data-tooltip-id='tooltip' data-tooltip-content={comment.title} data-tooltip-place='top'>
                                {comment.title.slice(0, 75) + ' (...)'}
                              </span>
                            </>
                          ) : (
                            <span key={`q-${'pending'}`} className='title'>
                              {comment.title}
                            </span>
                          )
                        ) : null}
                        &nbsp;
                        {comment.author?.displayName ? (
                          comment.author?.displayName.length > 20 ? (
                            <>
                              <span
                                key={`n-${'pending'}`}
                                className='name'
                                data-tooltip-id='tooltip'
                                data-tooltip-content={comment.author?.displayName}
                                data-tooltip-place='top'
                              >
                                {comment.author?.displayName.slice(0, 20) + ' (...)'}
                              </span>
                            </>
                          ) : (
                            <span key={`n-${'pending'}`} className='name'>
                              {comment.author?.displayName}
                            </span>
                          )
                        ) : (
                          <span key={`n-${'pending'}`} className='name'>
                            Anonymous
                          </span>
                        )}
                        &nbsp; &nbsp;
                        <span className='poster-address'>(u/{account?.author?.shortAddress})</span>
                        &nbsp;
                        <span className='date-time' data-utc='data'>
                          {getDate(comment?.timestamp)}
                        </span>
                        &nbsp;
                        <span className='post-number'>
                          <Link to='' title='Link to this post'>
                            c/
                          </Link>
                          <span key='pending' style={{ color: 'red', fontWeight: '700' }}>
                            Pending
                          </span>
                        </span>
                        &nbsp;&nbsp;
                        <button key={`pmb-${'pending'}`} className='post-menu-button' title='Post menu' style={{ all: 'unset', cursor: 'pointer' }}>
                          ▶
                        </button>
                      </span>
                      <blockquote key={`blockquote-${'pending'}`}>
                        <Post content={comment.content} comment={comment} handleQuoteClick={handleQuoteClick} key={`post-${'pending'}`} />
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>
              <div className='thread-mobile' key='thread-mobile'>
                <hr />
                <div className='op-container' key='op-container'>
                  <div key={`mob-po-${'pending'}`} className='post op'>
                    <div key={`mob-pi-${'pending'}`} className='post-info-mobile'>
                      <button style={{ all: 'unset', cursor: 'pointer' }} key={`mob-pb-${'pending'}`} className='post-menu-button-mobile' onClick={() => {}}>
                        ...
                      </button>
                      <span className='name-block-mobile'>
                        {comment.author?.displayName ? (
                          comment.author?.displayName.length > 15 ? (
                            <>
                              <span
                                key={`mob-n-${'pending'}`}
                                className='name-mobile'
                                data-tooltip-id='tooltip'
                                data-tooltip-content={comment.author?.displayName}
                                data-tooltip-place='top'
                              >
                                {comment.author?.displayName.slice(0, 15) + ' (...)'}
                              </span>
                            </>
                          ) : (
                            <span key={`mob-n-${'pending'}`} className='name-mobile'>
                              {comment.author?.displayName}
                            </span>
                          )
                        ) : (
                          <span key={`mob-n-${'pending'}`} className='name-mobile'>
                            Anonymous
                          </span>
                        )}
                        &nbsp;
                        <span key={`mob-pa-${'pending'}`} className='poster-address-mobile'>
                          (u/{account?.author?.shortAddress})&nbsp;
                        </span>
                        <br key={`mob-br1-${'pending'}`} />
                        {comment.title ? (
                          comment.title.length > 30 ? (
                            <>
                              <span
                                key={`mob-t-${'pending'}`}
                                className='subject-mobile'
                                data-tooltip-id='tooltip'
                                data-tooltip-content={comment.title}
                                data-tooltip-place='top'
                              >
                                {comment.title.slice(0, 30) + ' (...)'}
                              </span>
                            </>
                          ) : (
                            <span key={`mob-t-${'pending'}`} className='subject-mobile'>
                              {comment.title}
                            </span>
                          )
                        ) : null}
                      </span>
                      <span key={`mob-dt-${'pending'}`} className='date-time-mobile'>
                        {getDate(comment?.timestamp)}
                        &nbsp;
                        <button id='reply-button' style={{ all: 'unset' }} key={`mob-no-${'pending'}`}>
                          c/
                        </button>
                        &nbsp;
                        <span key='pending-mob' style={{ color: 'red', fontWeight: '700' }}>
                          Pending
                        </span>
                      </span>
                    </div>
                    {comment.link ? (
                      <div key={`mob-f-${index}`} className='file-mobile'>
                        {commentMediaInfo?.type === 'iframe' && (
                          <div key={`enlarge-mob-${index}`} className='img-container'>
                            <span key={`mob-fta-${index}`} className='file-thumb-mobile'>
                              {(isMobileThumbnailClicked[index] || !commentMediaInfo.thumbnail) && commentMediaInfo.embedUrl ? (
                                <div style={{ width: '92vw' }}>
                                  <iframe
                                    key={`mob-fti-${index}`}
                                    src={commentMediaInfo.embedUrl}
                                    style={{ border: 'none', height: '250px' }}
                                    title='Embedded content'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                    allowFullScreen
                                  />
                                </div>
                              ) : (
                                <img
                                  key={`mob-fti-${index}`}
                                  src={commentMediaInfo.thumbnail}
                                  alt='thumbnail'
                                  onClick={() => {
                                    handleThumbnailClick(index, true);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                  onError={(e) => (e.target.src = fallbackImgUrl)}
                                />
                              )}
                              {commentMediaInfo?.type === 'video' || commentMediaInfo?.type === 'iframe' ? (
                                isMobileThumbnailClicked[index] ? (
                                  <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '15px' }}>
                                    <span
                                      className='button-mobile'
                                      style={{ float: 'none', cursor: 'pointer' }}
                                      onClick={() => {
                                        handleThumbnailClick(index, true);
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
                                    onClick={handleImageClick}
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
                                  onClick={handleImageClick}
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
                              {isMobileThumbnailClicked[index] ? (
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
                                    handleThumbnailClick(index, true);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                  id='video-thumbnail-mobile'
                                  onError={(e) => (e.target.src = fallbackImgUrl)}
                                />
                              )}
                              {commentMediaInfo?.type === 'video' || commentMediaInfo?.type === 'iframe' ? (
                                isMobileThumbnailClicked[index] ? (
                                  <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '15px' }}>
                                    <span
                                      className='button-mobile'
                                      style={{ float: 'none', cursor: 'pointer' }}
                                      onClick={() => {
                                        handleThumbnailClick(index, true);
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
                    <blockquote key={`mob-bq-${'pending'}`} className='post-message-mobile'>
                      {comment.content ? (
                        <>
                          <Post content={comment.content} handleQuoteClick={handleQuoteClick} comment={comment} key={`post-mobile-${'pending'}`} />
                        </>
                      ) : null}
                    </blockquote>
                  </div>
                </div>
              </div>
              <BottomBar selectedStyle={selectedStyle}>
                <div id='bottombar-desktop'>
                  <hr />
                </div>
              </BottomBar>
            </>
          ) : (
            <PostLoader />
          )}
        </BoardForm>
        <div
          style={{
            textAlign: 'center',
            fontSize: '11px',
            marginTop: '2em',
            marginBottom: '2em',
          }}
        >
          plebchan v{version}
          {commitRef}. GPL-2.0
        </div>
      </Container>
    </>
  );
};

export default Pending;
