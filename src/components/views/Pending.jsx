import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break, PostForm, BoardForm } from '../styled/Board.styled';
import { ReplyFormLink, TopBar, BottomBar } from '../styled/Thread.styled';
import ImageBanner from '../ImageBanner';
import Post from '../Post';
import PostLoader from '../PostLoader';
import SettingsModal from '../SettingsModal';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import getDate from '../../utils/getDate';
import handleStyleChange from '../../utils/handleStyleChange';
import useError from '../../hooks/useError';
import useSuccess from '../../hooks/useSuccess';


const Pending = () => {
  const {
    defaultSubplebbits,
    isSettingsOpen, setIsSettingsOpen,
    pendingComment,
    selectedStyle,
    selectedThread, setSelectedThread,
    showPostFormLink
  } = useGeneralStore(state => state);

  const comment = pendingComment;
  
  const [visible] = useState(true);
  const [errorMessage] = useState(null);
  const [successMessage] = useState(null);
  useError(errorMessage, [errorMessage]);
  useSuccess(successMessage, [successMessage]);
  const { subplebbitAddress, threadCid } = useParams();
  const navigate = useNavigate();
  const commentMediaInfo = getCommentMediaInfo(comment);
  const fallbackImgUrl = "/assets/filedeleted-res.gif";


  const [selectedAddress, setSelectedAddress] = useState(comment.subplebbitAddress);
  const [selectedTitle, setSelectedTitle] = useState(null);

  // temporary title from JSON, gets subplebbitAddress and threadCid from URL
  useEffect(() => {
    setSelectedAddress(subplebbitAddress);
    setSelectedThread(threadCid);
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
    if (selectedSubplebbit) {
      setSelectedTitle(selectedSubplebbit.title);
    }
  }, [subplebbitAddress, setSelectedAddress, setSelectedTitle, defaultSubplebbits]);

  // mobile navbar board select functionality
  const handleSelectChange = (event) => {
    const selected = event.target.value;
    const selectedTitle = defaultSubplebbits.find((subplebbit) => subplebbit.address === selected).title;
    setSelectedTitle(selectedTitle);
    setSelectedAddress(selected);
    navigate(`/p/${selected}`);
  };


  return (
    <Container>
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
          <Link to={`/p/${selectedAddress}`}>Return</Link>
          ]
        </span>
        <span className="return-button catalog-button" id="catalog-button-desktop">
          [
          <Link to={`/p/${selectedAddress}/catalog`}>Catalog</Link>
          ]
        </span>
        {comment ? (
          <span className="reply-stat">Preview</span>
        ) : (
          <span className="reply-stat">Fetching IPFS...</span>
        )}
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
                          <a key={`fa-${"pending"}`} href={commentMediaInfo.url} target="_blank">{
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
                      {comment.displayName
                        ? comment.displayName.length > 20
                        ? <>
                            <span key={`n-${"pending"}`} className="name"
                            data-tooltip-id="tooltip"
                            data-tooltip-content={comment.displayName}
                            data-tooltip-place="top">
                              {comment.displayName.slice(0, 20) + " (...)"}
                            </span>
                          </> 
                          : <span key={`n-${"pending"}`} className="name">
                            {comment.displayName}</span>
                        : <span key={`n-${"pending"}`} className="name">
                          Anonymous</span>}
                        &nbsp;
                      &nbsp;
                      <span className="poster-address">
                        (u/
                          <span key={`pa-${"pending"}`} className="poster-address">
                          {comment.author?.address}
                        </span>)
                      </span>
                      &nbsp;
                      <span className="date-time" data-utc="data">{getDate(comment?.timestamp)}</span>
                      &nbsp;
                      <span className="post-number">
                        <Link to="" onClick={() => {}} title="Link to this post">c/</Link>
                        &nbsp;
                        <span key="pending" style={{color: 'red', fontWeight: '700'}}>Pending</span>
                      </span>&nbsp;&nbsp;
                      <button key={`pmb-${"pending"}`} className="post-menu-button" onClick={() => {}} title="Post menu" style={{ all: 'unset', cursor: 'pointer' }}>▶</button>
                    </span>
                    <blockquote key={`blockquote-${"pending"}`}>
                      <Post content={comment.content} key={`post-${"pending"}`} />
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
                        {comment.displayName
                        ? comment.displayName.length > 15
                        ? <>
                            <span key={`mob-n-${"pending"}`} className="name-mobile"
                            data-tooltip-id="tooltip"
                            data-tooltip-content={comment.displayName}
                            data-tooltip-place="top">
                              {comment.displayName.slice(0, 15) + " (...)"}
                            </span>
                          </> 
                          : <span key={`mob-n-${"pending"}`} className="name-mobile">
                            {comment.displayName}</span>
                        : <span key={`mob-n-${"pending"}`} className="name-mobile">
                          Anonymous</span>}
                        &nbsp;
                        <span key={`mob-pa-${"pending"}`} className="poster-address-mobile">
                          (u/
                          <span key={`mob-ha-${"pending"}`} className="highlight-address-mobile">
                            {comment.author?.address}
                          </span>
                          )&nbsp;
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
                          <Post content={comment.content} key={`post-mobile-${"pending"}`} /> 
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
    </Container>
  );
}

export default Pending;