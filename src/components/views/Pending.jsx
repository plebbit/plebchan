import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useAccount, useAccountComment } from '@plebbit/plebbit-react-hooks';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break, PostForm, BoardForm } from '../styled/views/Board.styled';
import { ReplyFormLink, TopBar, BottomBar } from '../styled/views/Thread.styled';
import ImageBanner from '../ImageBanner';
import Post from '../Post';
import PostLoader from '../PostLoader';
import SettingsModal from '../modals/SettingsModal';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getDate from '../../utils/getDate';
import handleQuoteClick from '../../utils/handleQuoteClick';
import handleStyleChange from '../../utils/handleStyleChange';
import useError from '../../hooks/useError';
import useStateString from '../../hooks/useStateString';
import packageJson from '../../../package.json'
const {version} = packageJson


const Pending = () => {
  const {
    defaultSubplebbits,
    isSettingsOpen, setIsSettingsOpen,
    selectedAddress, setSelectedAddress,
    selectedStyle,
    selectedTitle, setSelectedTitle,
    showPostFormLink
  } = useGeneralStore(state => state);

  const { index } = useParams();

  const account = useAccount();
  const comment = useAccountComment({commentIndex: index});

  useEffect(() => {
    setSelectedAddress(comment?.subplebbitAddress);
  }, [comment, setSelectedAddress]);

  const stateString = useStateString(comment)

  const errorString = useMemo(() => {
    if (comment?.state === 'failed') {
      let errorString = 'Failed fetching pending thread. Pending index: ' + index;
      if (comment.error) {
        errorString += `: ${comment.error.toString().slice(0, 300)}`
      }
      return errorString
    }
  }, [comment?.state, comment?.error, index])

  useEffect(() => {
    if (errorString) {
      setErrorMessage(errorString);
    }
  }, [errorString]);

  const [visible] = useState(true);

  const [errorMessage, setErrorMessage] = useState(null);
  useError(errorMessage, [errorMessage]);

  const navigate = useNavigate();
  const [commentMediaInfo, setCommentMediaInfo] = useState(null);
  const fallbackImgUrl = "assets/filedeleted-res.gif";

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
        <SettingsModal
        selectedStyle={selectedStyle}
        isOpen={isSettingsOpen}
        closeModal={() => setIsSettingsOpen(false)} />
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
              <Link to={`/profile/c/${index}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
                  <option value="all">All</option>
                  <option value="subscriptions">Subscriptions</option>
                  {defaultSubplebbits.map(subplebbit => (
                      <option key={`option-${subplebbit.address}`} value={subplebbit.address}
                      >{subplebbit.title ? subplebbit.title : subplebbit.address}</option>
                    ))}
                </select>
                <span style={{cursor: 'pointer'}} onClick={
                  () => alert(
                    'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                    )
                }>Create Board</span>
              </div>
              <div className="page-jump">
                <Link to={`/profile/c/${index}/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
              <div className="board-title">{selectedTitle ?? null}</div>
              <div className="board-address">{selectedAddress ? ("p/" + selectedAddress) : null}</div>
              </>
          </>
        </Header>
        <Break selectedStyle={selectedStyle} />
        <PostForm selectedStyle={selectedStyle} name="post" action="" method="post" enctype="multipart/form-data">
          <ReplyFormLink id="post-form-link" showReplyFormLink={showPostFormLink} selectedStyle={selectedStyle} >
            <div id="return-button-mobile">
              <span className="btn-wrap">
                <Link to={`/p/${selectedAddress}`} onClick={()=> {window.scrollTo(0, 0)}}>Return</Link>
              </span>
            </div>
            <div id="catalog-button-mobile">
              <span className="btn-wrap">
                <Link to={`/p/${selectedAddress}/catalog`} onClick={()=> {window.scrollTo(0, 0)}}>Catalog</Link>
              </span>
            </div>
            <div>&nbsp;</div>
          </ReplyFormLink>
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
            <Link to={`/p/${selectedAddress}`} onClick={()=> {window.scrollTo(0, 0)}}>Return</Link>
            ]
          </span>
          <span className="return-button catalog-button" id="catalog-button-desktop">
            [
            <Link to={`/p/${selectedAddress}/catalog`} onClick={()=> {window.scrollTo(0, 0)}}>Catalog</Link>
            ]
          </span>
            <span className={stateString ? "reply-stat ellipsis" : ""}>{stateString}</span>
          <hr />
        </TopBar>
        <Tooltip id="tooltip" className="tooltip" />
        <BoardForm selectedStyle={selectedStyle}>
          {comment !== undefined ? (
            <>
              <div className="thread">
                <div className="op-container">
                  <div className="post op">
                    <div className="post-info">
                    {commentMediaInfo?.url ? (
                        <div key={`f-${"pending"}`} className="file" style={{marginBottom: "5px"}}>
                          <div key={`ft-${"pending"}`} className="file-text">
                            Link:&nbsp;
                            <a key={`fa-${"pending"}`} href={commentMediaInfo.url} 
                            target="_blank" rel="noreferrer">{
                            commentMediaInfo?.url.length > 30 ?
                            commentMediaInfo?.url.slice(0, 30) + "(...)" :
                            commentMediaInfo?.url
                            }</a>&nbsp;({commentMediaInfo?.type})
                          </div>
                          {commentMediaInfo?.type === "webpage" ? (
                            <span key={`fta-${"pending"}`} className="file-thumb">
                              <img key={`fti-${"pending"}`} src={comment.thumbnailUrl} alt="thumbnail" onError={(e) => e.target.src = fallbackImgUrl} />
                            </span>
                          ) : null}
                          {commentMediaInfo?.type === "image" ? (
                            <span key={`fta-${"pending"}`} className="file-thumb">
                              <img key={`fti-${"pending"}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            </span>
                          ) : null}
                          {commentMediaInfo?.type === "video" ? (
                            <span key={`fta-${"pending"}`} className="file-thumb">
                              <video controls key={`fti-${"pending"}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            </span>
                          ) : null}
                          {commentMediaInfo?.type === "audio" ? (
                            <span key={`fta-${"pending"}`} className="file-thumb">
                              <audio controls key={`fti-${"pending"}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                      <span className="name-block">
                          {comment.title ? (
                            comment.title.length > 75 ?
                            <>
                              <span key={`q-${"pending"}`} className="title"
                              data-tooltip-id="tooltip"
                              data-tooltip-content={comment.title}
                              data-tooltip-place="top">
                                {comment.title.slice(0, 75) + " (...)"}
                              </span>
                            </>
                          : <span key={`q-${"pending"}`} className="title">
                            {comment.title}
                            </span>) 
                          : null}
                        &nbsp;
                        {comment.author?.displayName
                          ? comment.author?.displayName.length > 20
                          ? <>
                              <span key={`n-${"pending"}`} className="name"
                              data-tooltip-id="tooltip"
                              data-tooltip-content={comment.author?.displayName}
                              data-tooltip-place="top">
                                {comment.author?.displayName.slice(0, 20) + " (...)"}
                              </span>
                            </> 
                            : <span key={`n-${"pending"}`} className="name">
                              {comment.author?.displayName}</span>
                          : <span key={`n-${"pending"}`} className="name">
                            Anonymous</span>}
                          &nbsp;
                        &nbsp;
                        <span className="poster-address">
                          (u/{account.author?.shortAddress})
                        </span>
                        &nbsp;
                        <span className="date-time" data-utc="data">{getDate(comment?.timestamp)}</span>
                        &nbsp;
                        <span className="post-number">
                          <Link to="" title="Link to this post">c/</Link>
                          <span key="pending" style={{color: 'red', fontWeight: '700'}}>Pending</span>
                        </span>&nbsp;&nbsp;
                        <button key={`pmb-${"pending"}`} className="post-menu-button" title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>▶</button>
                      </span>
                      <blockquote key={`blockquote-${"pending"}`}>
                        <Post content={comment.content} comment={comment} handleQuoteClick={handleQuoteClick} key={`post-${"pending"}`} />
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>
              <div className="thread-mobile" key="thread-mobile">
                <hr />
                <div className="op-container" key="op-container">
                    <div key={`mob-po-${"pending"}`} className="post op">
                      <div key={`mob-pi-${"pending"}`} className="post-info-mobile">
                        <button style={{ all: 'unset', cursor: 'pointer' }} key={`mob-pb-${"pending"}`} className="post-menu-button-mobile" onClick={() => {}}>...</button>
                        <span className="name-block-mobile">
                          {comment.author?.displayName
                          ? comment.author?.displayName.length > 15
                          ? <>
                              <span key={`mob-n-${"pending"}`} className="name-mobile"
                              data-tooltip-id="tooltip"
                              data-tooltip-content={comment.author?.displayName}
                              data-tooltip-place="top">
                                {comment.author?.displayName.slice(0, 15) + " (...)"}
                              </span>
                            </> 
                            : <span key={`mob-n-${"pending"}`} className="name-mobile">
                              {comment.author?.displayName}</span>
                          : <span key={`mob-n-${"pending"}`} className="name-mobile">
                            Anonymous</span>}
                          &nbsp;
                          <span key={`mob-pa-${"pending"}`} className="poster-address-mobile">
                            (u/{account.author?.shortAddress})&nbsp;
                          </span>
                          <br key={`mob-br1-${"pending"}`} />
                          {comment.title ? (
                              comment.title.length > 30 ?
                              <>
                                <span key={`mob-t-${"pending"}`} className="subject-mobile"
                                data-tooltip-id="tooltip"
                                data-tooltip-content={comment.title}
                                data-tooltip-place="top">
                                  {comment.title.slice(0, 30) + " (...)"}
                                </span>
                              </>
                              : <span key={`mob-t-${"pending"}`} className="subject-mobile">
                                {comment.title}
                              </span>) : null}
                        </span>
                        <span key={`mob-dt-${"pending"}`} className="date-time-mobile">
                          {getDate(comment?.timestamp)}
                          &nbsp;
                          <button id="reply-button" style={{ all: 'unset' }} key={`mob-no-${"pending"}`}>c/</button>
                          &nbsp;
                          <span key="pending-mob" style={{color: 'red', fontWeight: '700'}}>Pending</span>
                        </span>
                      </div>
                      {commentMediaInfo?.url ? (
                        commentMediaInfo.type === "webpage" ? (
                          <div key={`mob-f-${"pending"}`} className="file-mobile">
                            <span key={`mob-ft${"pending"}`} className="file-thumb-mobile">
                              <img key={`mob-img-${"pending"}`} src={comment.thumbnailUrl} alt="thumbnail" onError={(e) => e.target.src = fallbackImgUrl} />
                              <div key={`mob-fi-${"pending"}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                            </span>
                          </div>
                        ) : commentMediaInfo.type === "image" ? (
                          <div key={`mob-f-${"pending"}`} className="file-mobile">
                            <span key={`mob-ft${"pending"}`} className="file-thumb-mobile">
                              <img key={`mob-img-${"pending"}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                              <div key={`mob-fi-${"pending"}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                            </span>
                          </div>
                        ) : commentMediaInfo.type === "video" ? (
                          <div key={`mob-f-${"pending"}`} className="file-mobile">
                            <span key={`mob-ft${"pending"}`} className="file-thumb-mobile">
                              <video controls key={`mob-img-${"pending"}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                              <div key={`mob-fi-${"pending"}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                            </span>
                          </div>
                        ) : commentMediaInfo.type === "audio" ? (
                          <div key={`mob-f-${"pending"}`} className="file-mobile">
                            <span key={`mob-ft${"pending"}`} className="file-thumb-mobile">
                              <audio controls key={`mob-img-${"pending"}`} src={commentMediaInfo.url} alt={commentMediaInfo.type} onError={(e) => e.target.src = fallbackImgUrl} />
                              <div key={`mob-fi-${"pending"}`} className="file-info-mobile">{commentMediaInfo.type}</div>
                            </span>
                          </div>
                        ) : null
                      ) : null}
                      <blockquote key={`mob-bq-${"pending"}`} className="post-message-mobile">
                        {comment.content ? (
                          <>
                            <Post content={comment.content} handleQuoteClick={handleQuoteClick} comment={comment} key={`post-mobile-${"pending"}`} /> 
                          </>
                        ) : null}
                      </blockquote>
                    </div>
                  </div>
              </div>
              <BottomBar selectedStyle={selectedStyle}>
                  <div id="bottombar-desktop">
                    <hr />
                  </div>
              </BottomBar>
            </>
          ) : (
            <PostLoader />
          )}
        </BoardForm>
        <div style={{
          textAlign: "center",
          fontSize: "11px",
          marginTop: "2em",
          marginBottom: "2em",
        }}>
          plebchan v{version}. GPL-2.0
        </div>
      </Container>
    </>
  );
}

export default Pending;