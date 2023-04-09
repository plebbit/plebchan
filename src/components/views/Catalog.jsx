import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { useFeed, usePublishComment } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break, PostForm, PostFormLink, PostFormTable } from '../styled/Board.styled';
import { Threads } from '../styled/Catalog.styled';
import { TopBar } from '../styled/Thread.styled';
import CatalogLoader from '../CatalogLoader';
import ImageBanner from '../ImageBanner';
import Post from '../Post';
import SettingsModal from '../SettingsModal';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import handleStyleChange from '../../utils/handleStyleChange';
import useClickForm from '../../hooks/useClickForm';
import useError from '../../hooks/useError';
import useSuccess from '../../hooks/useSuccess';


const Catalog = () => {
  const {
    captchaResponse, setCaptchaResponse,
    defaultSubplebbits,
    setIsCaptchaOpen,
    isSettingsOpen, setIsSettingsOpen,
    selectedAddress, setSelectedAddress,
    selectedStyle,
    setSelectedThread,
    selectedTitle, setSelectedTitle,
    showPostForm,
    showPostFormLink,
  } = useGeneralStore(state => state);

  const nameRef = useRef();
  const subjectRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();

  const [captchaImage, setCaptchaImage] = useState('');
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const { feed, hasMore, loadMore } = useFeed({subplebbitAddresses: [`${selectedAddress}`], sortType: 'new'});
  const { subplebbitAddress } = useParams();

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  useError(errorMessage, [errorMessage]);
  useSuccess(successMessage, [successMessage]);

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
      setSuccessMessage('challenge success', {publishedCid: challengeVerification.publication.cid})
    }
    else if (challengeVerification.challengeSuccess === false) {
      setErrorMessage('challenge failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
      setErrorMessage("Error: You seem to have mistyped the CAPTCHA. Please try again.");
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


  const publishCommentOptions = {
    displayName: nameRef.current ? nameRef.current.value : undefined,
    title: subjectRef.current ? subjectRef.current.value : undefined,
    content: commentRef.current ? commentRef.current.value : undefined,
    link: linkRef.current ? linkRef.current.value : undefined,
    subplebbitAddress: selectedAddress,
    onChallenge,
    onChallengeVerification,
  };


  const resetFields = () => {
    nameRef.current.value = '';
    subjectRef.current.value = '';
    commentRef.current.value = '';
    linkRef.current.value = '';
  };


  const { publishComment } = usePublishComment(publishCommentOptions);


  const getChallengeAnswersFromUser = async (challenges) => {
    return new Promise((resolve, reject) => {
      const imageString = challenges?.challenges[0].challenge;
      const imageSource = `data:image/png;base64,${imageString}`;
      const challengeImg = new Image();
      challengeImg.src = imageSource;
  
      challengeImg.onload = () => {
        setIsCaptchaOpen(true);
        setCaptchaImage(imageSource);
  
        const handleKeyDown = (event) => {
          if (event.key === 'Enter') {
            setCaptchaImage('');
            resolve(captchaResponse);
            setIsCaptchaOpen(false);
            document.removeEventListener('keydown', handleKeyDown);
            event.preventDefault();
          }
        };

        setCaptchaResponse('');
        document.addEventListener('keydown', handleKeyDown);
      };
  
      challengeImg.onerror = () => {
        reject(setErrorMessage('Could not load challenge image'));
      };
    });
  };

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
              <Link to={`/p/${subplebbit.address}`} key={`a-${subplebbit.address}`} 
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
            <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
              <Link to={`/p/${selectedAddress}/catalog/settings`} onClick={() => setIsSettingsOpen(true)}>Settings</Link>
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
      <PostForm selectedStyle={selectedStyle}>
        <PostFormLink id="post-form-link" showPostFormLink={showPostFormLink} selectedStyle={selectedStyle} >
          <div id="post-form-link-desktop">
            [
              <a onClick={useClickForm()} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</a>
            ]
          </div>
          <div id="post-form-link-mobile">
            <span className="btn-wrap">
              <a onClick={useClickForm()} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</a>
            </span>
          </div>
        </PostFormLink>
        <PostFormTable id="post-form" showPostForm={showPostForm} selectedStyle={selectedStyle} className="post-form">
        <tbody>
          <tr data-type="Name">
            <td id="td-name">Name</td>
            <td>
              <input name="name" type="text" tabIndex={1} placeholder="Anonymous" ref={nameRef} />
            </td>
          </tr>
          <tr data-type="Subject">
            <td>Subject</td>
            <td>
              <input name="sub" type="text" tabIndex={3} ref={subjectRef}/>
              <input id="post-button" type="submit" value="Post" tabIndex={6} 
              onClick={async () => {await publishComment(); resetFields();}} />
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
          <Link to={`/p/${selectedAddress}`}>Return</Link>
          ]
        </div>
        <div id="return-button-mobile">
          <span className="btn-wrap-catalog btn-wrap">
            <Link to={`/p/${selectedAddress}`}>Return</Link>
          </span>
        </div>
        <div id="stats" style={{float: "right", marginTop: "5px"}}>
          {feed.length > 0 ? (null) : (<span>Fetching IPFS...</span>)}
        </div>
        <hr />
      </TopBar>
      <Threads selectedStyle={selectedStyle}>
        {feed.length < 1 ? (
          <CatalogLoader />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={tryLoadMore}
            hasMore={hasMore}
          >
            {feed.map((thread) => {
              const commentMediaInfo = getCommentMediaInfo(thread);
              const fallbackImgUrl = "/assets/filedeleted-res.gif";
              return (
                <Link style={{all: "unset", cursor: "pointer"}} key={`link-${thread.cid}`} to={`/p/${selectedAddress}/c/${thread.cid}`} onClick={() => setSelectedThread(thread.cid)}>
                  <div key={`thread-${thread.cid}`} className="thread">
                      {commentMediaInfo?.url ? (
                        <Fragment key="f-catalog">
                          {commentMediaInfo?.type === "webpage" ? (
                            <img key={`img-${thread.cid}`} alt="thread" 
                            src={commentMediaInfo.url} 
                            onError={(e) => {
                              e.target.src = fallbackImgUrl
                              e.target.onerror = null;}}  />
                          ) : null}
                          {commentMediaInfo?.type === "image" ? (
                            <img key={`img-${thread.cid}`} alt="thread" 
                            src={commentMediaInfo.url} 
                            onError={(e) => {
                              e.target.src = fallbackImgUrl
                              e.target.onerror = null;}}  />
                          ) : null}
                          {commentMediaInfo?.type === "video" ? (
                            <video key={`fti-${thread.cid}`} 
                            src={commentMediaInfo.url} 
                            alt={commentMediaInfo.type} 
                            style={{ pointerEvents: "none" }}
                            onError={(e) => e.target.src = fallbackImgUrl} /> 
                          ) : null}
                          {commentMediaInfo?.type === "audio" ? (
                            <audio controls 
                            key={`fti-${thread.cid}`} 
                            src={commentMediaInfo.url} 
                            alt={commentMediaInfo.type} 
                            style={{ pointerEvents: "none" }}
                            onError={(e) => e.target.src = fallbackImgUrl} />
                          ) : null}
                        </Fragment>
                      ) : null}
                    {/* <div key={`ti-${thread.cid}`} className="thread-icons" >
                      <span key={`si-${thread.cid}`} className="thread-icon sticky-icon" title="Sticky"></span>
                    </div> */}
                    <div key={`meta-${thread.cid}`} className="meta" title="(R)eplies / (I)mage Replies" >
                      R:
                      <b key={`b-${thread.cid}`}>{thread.replyCount}</b>
                    </div>
                    <div key={`t-${thread.cid}`} className="teaser">
                        <b key={`b2-${thread.cid}`}>{thread.title ? `${thread.title}` : null}</b>
                        {thread.content && `: `}
                        {thread.content && <Post content={thread.content} key="post"/>}
                    </div>
                  </div>
                </Link>
              )})}
          </InfiniteScroll>
        )}
      </Threads>
    </Container>
  );
}

export default Catalog;