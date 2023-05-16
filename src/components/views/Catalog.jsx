import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useFeed, usePublishComment, useSubplebbit, useSubscribe } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Container, NavBar, Header, Break, PostForm, PostFormLink, PostFormTable } from '../styled/Board.styled';
import { Threads } from '../styled/Catalog.styled';
import { TopBar, Footer } from '../styled/Thread.styled';
import CatalogLoader from '../CatalogLoader';
import ImageBanner from '../ImageBanner';
import OfflineIndicator from '../OfflineIndicator';
import SettingsModal from '../SettingsModal';
import getCommentMediaInfo from '../../utils/getCommentMediaInfo';
import handleStyleChange from '../../utils/handleStyleChange';
import useClickForm from '../../hooks/useClickForm';
import useError from '../../hooks/useError';
import useStateString from '../../hooks/useStateString';
import useSuccess from '../../hooks/useSuccess';
import packageJson from '../../../package.json'
const {version} = packageJson


const Catalog = () => {
  const {
    captchaResponse, setCaptchaResponse,
    setChallengesArray,
    defaultSubplebbits,
    setIsCaptchaOpen,
    isSettingsOpen, setIsSettingsOpen,
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

  const nameRef = useRef();
  const subjectRef = useRef();
  const commentRef = useRef();
  const linkRef = useRef();

  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const { feed, hasMore, loadMore } = useFeed({subplebbitAddresses: [`${selectedAddress}`], sortType: 'new'});
  const { subplebbitAddress } = useParams();
  const subplebbit = useSubplebbit({subplebbitAddress: selectedAddress});

  const stateString = useStateString(subplebbit);

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
      setErrorMessage(errorString);
    }
  }, [errorString]);
  const { subscribed, subscribe, unsubscribe } = useSubscribe({subplebbitAddress: selectedAddress});

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage] = useState(null);
  useError(errorMessage, [errorMessage]);
  useSuccess(successMessage, [successMessage]);

  const [triggerPublishComment, setTriggerPublishComment] = useState(false);

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
      navigate(`/p/${selectedAddress}/c/${challengeVerification.publication?.cid}`);
      console.log('challenge success');
    }
    else if (challengeVerification.challengeSuccess === false) {
      setErrorMessage('Challenge Failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
    }
  };


  const onChallenge = async (challenges, comment) => {
    setPendingComment(comment);
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
      setErrorMessage(error);
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
      setErrorMessage('Subject field is mandatory');
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
  
  
  useEffect(() => {
    if (publishCommentOptions && triggerPublishComment) {
      (async () => {
        await publishComment();
        resetFields();
      })();
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
        reject(setErrorMessage('Could not load challenges'));
      };
    });
  };

  // mobile navbar board select functionality
  const handleSelectChange = (event) => {
    const selected = event.target.value;

    if (selected === 'subscriptions') {
      navigate(`/p/subscriptions`);
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
      setErrorMessage(error);
    }
  };


  return (
    <>
      <Helmet>
        <title>{((selectedTitle ? selectedTitle : selectedAddress) + " - Catalog - plebchan")}</title>
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
              <button style={{all: 'unset', cursor: 'pointer'}} onClick={
                () => alert(
                  'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                  )
              }>Create Board</button>
              ]
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
                  <option value="subscriptions">Subscriptions</option>
                  {defaultSubplebbits.map(subplebbit => (
                      <option key={`option-${subplebbit.address}`} value={subplebbit.address}
                      >{subplebbit.title ? subplebbit.title : subplebbit.address}</option>
                    ))}
                </select> 
                <button style={{all: 'unset', cursor: 'pointer'}} onClick={
                  () => alert(
                    'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                    )
                  }>Create Board</button>
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
              <div className="board-address">p/{selectedAddress}
                <OfflineIndicator 
                address={selectedAddress} 
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
                  <input name="name" type="text" tabIndex={1} placeholder="Anonymous" ref={nameRef} />
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
          {feed.length > 0 ? (
            <>
            <span className="subscribe-button-desktop">
              [
              <button id="subscribe" style={{all: 'unset', cursor: 'pointer'}}
                onClick={() => handleSubscribe()}>{subscribed ? "Unsubscribe" : "Subscribe"}
              </button>
              ]
            </span>
            <button className="subscribe-button-mobile btn-wrap"
              onClick={() => handleSubscribe()}>{subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
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
            feed.length > 0 ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={tryLoadMore}
              hasMore={hasMore}
            >
              {feed.map((thread, index) => {
                const commentMediaInfo = getCommentMediaInfo(thread);
                const fallbackImgUrl = "assets/filedeleted-res.gif";
                return (
                  <Link style={{all: "unset", cursor: "pointer"}} key={`link-${index}`} to={`/p/${selectedAddress}/c/${thread.cid}`} 
                      onClick={() => setSelectedThread(thread.cid)}>
                  <div key={`thread-${index}`} className="thread">
                        {commentMediaInfo?.url ? (
                          <Fragment key="f-catalog">
                            {commentMediaInfo?.type === "webpage" ? (
                              thread.thumbnailUrl ? (
                              <img className="card" key={`img-${index}`}
                              src={commentMediaInfo.thumbnail} alt={commentMediaInfo.type}
                              onError={(e) => {
                                e.target.src = fallbackImgUrl
                                e.target.onerror = null;
                              }}  />
                              ) : null
                            ) : null}
                            {commentMediaInfo?.type === "image" ? (
                              <img className="card" key={`img-${index}`}
                              src={commentMediaInfo.url} alt={commentMediaInfo.type} 
                              onError={(e) => {
                                e.target.src = fallbackImgUrl
                                e.target.onerror = null;}}  />
                            ) : null}
                            {commentMediaInfo?.type === "video" ? (
                              <video className="card" key={`fti-${index}`} 
                              src={commentMediaInfo.url} 
                              alt={commentMediaInfo.type} 
                              style={{ pointerEvents: "none" }}
                              onError={(e) => e.target.src = fallbackImgUrl} /> 
                            ) : null}
                            {commentMediaInfo?.type === "audio" ? (
                              <audio className="card" controls 
                              key={`fti-${index}`} 
                              src={commentMediaInfo.url} 
                              alt={commentMediaInfo.type} 
                              style={{ pointerEvents: "none" }}
                              onError={(e) => e.target.src = fallbackImgUrl} />
                            ) : null}
                          </Fragment>
                        ) : null}
                      {/* <div key={`ti-${index}`} className="thread-icons" >
                        <span key={`si-${index}`} className="thread-icon sticky-icon" title="Sticky"></span>
                      </div> */}
                      <div key={`meta-${index}`} className="meta" title="(R)eplies / (I)mage Replies" >
                        R:
                        <b key={`b-${index}`}>{thread.replyCount}</b>
                      </div>
                      <div key={`t-${index}`} className="teaser">
                          <b key={`b2-${index}`}>{thread.title ? `${thread.title}` : null}</b>
                          {thread.content ? `: ${thread.content}` : null}
                      </div>
                    </div>
                  </Link>
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
                <Link to="" onClick={() => {}}>Subscriptions</Link>
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
              <button style={{all: 'unset', cursor: 'pointer'}} onClick={
                () => alert(
                  'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                  )
              }>Create Board</button>
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