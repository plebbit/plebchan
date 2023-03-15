import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import useBoardStore from '../useBoardStore';
import { Container, NavBar, Header, Break, PostForm, PostFormLink, PostFormTable } from './styles/Board.styled';
import { TopBar } from './styles/Thread.styled';
import { Threads } from './styles/Catalog.styled';
import { useFeed, useAccountsActions } from '@plebbit/plebbit-react-hooks';
import ImageBanner from './ImageBanner';
import CaptchaModal from './CaptchaModal';
import onError from '../utils/onError';
import onSuccess from '../utils/onSuccess';
import InfiniteScroll from 'react-infinite-scroller';


const Catalog = ({ setBodyStyle }) => {

  const {
    selectedTitle,
    setSelectedTitle,
    selectedAddress,
    setSelectedAddress,
    setSelectedThread,
    selectedStyle,
    setSelectedStyle,
    captchaResponse,
    setCaptchaResponse
  } = useBoardStore(state => state);

  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const [showPostFormLink, setShowPostFormLink] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const { publishComment } = useAccountsActions();
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const { feed, hasMore, loadMore } = useFeed([`${selectedAddress}`], 'new');
  const { subplebbitAddress } = useParams();



  useEffect(() => {
    setSelectedAddress(subplebbitAddress);
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
    if (selectedSubplebbit) {
      setSelectedTitle(selectedSubplebbit.title);
    }
  }, [subplebbitAddress, setSelectedAddress, setSelectedTitle, defaultSubplebbits]);


  useEffect(() => {
    let didCancel = false;
    fetch(
      "https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/subplebbits.json",
      { cache: "no-cache" }
    )
      .then((res) => res.json())
      .then(res => {
        if (!didCancel) {
          setDefaultSubplebbits(res);
        }
      });
    return () => {
      didCancel = true;
    };
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible]);

  // post route handling
  useEffect(() => {
    const path = location.pathname;
    if (path.endsWith('/post')) {
      setShowPostFormLink(false);
      setShowPostForm(true);
    } else {
      setShowPostFormLink(true);
      setShowPostForm(false);
    }
  }, [location.pathname]);

  // automatic dark mode without interefering with user's selected style
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = darkModeMediaQuery.matches;
  
    if (isDarkMode) {
      setSelectedStyle('Tomorrow');
      setBodyStyle({
        background: '#1d1f21 none',
        color: '#c5c8c6',
        fontFamily: 'Arial, Helvetica, sans-serif'
      });
      localStorage.setItem('selectedStyle', 'Tomorrow');
    }
  
    const darkModeListener = (e) => {
      if (e.matches) {
        setSelectedStyle('Tomorrow');
        setBodyStyle({
          background: '#1d1f21 none',
          color: '#c5c8c6',
          fontFamily: 'Arial, Helvetica, sans-serif'
        });
        localStorage.setItem('selectedStyle', 'Tomorrow');
      }
    };
  
    darkModeMediaQuery.addEventListener('change', darkModeListener);
  
    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeListener);
    };
  }, []);



  const tryLoadMore = async () => {
    try {loadMore()} 
    catch (e)
    {await new Promise(resolve => setTimeout(resolve, 1000))}
  }


  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      onSuccess('challenge success', {publishedCid: challengeVerification.publication.cid})
    }
    else if (challengeVerification.challengeSuccess === false) {
      onError('challenge failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
      onError("Error: You seem to have mistyped the CAPTCHA. Please try again.");
    }
  }


  const onChallenge = async (challenges, comment) => {
    let challengeAnswers = [];
    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges)
    }
    catch (error) {
      onError(error);
    }
    if (challengeAnswers) {
      await comment.publishChallengeAnswers(challengeAnswers)
    }
  }


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
          }
        };

        setCaptchaResponse('');
        document.addEventListener('keydown', handleKeyDown);
      };
  
      challengeImg.onerror = () => {
        reject(onError('Could not load challenge image'));
      };
    });
  };



  const handleVoidClick = () => {}


  const handleClickTitle = (title, address) => {
    setSelectedTitle(title);
    setSelectedAddress(address);
  };


  const handleSelectChange = (event) => {
    const selected = event.target.value;
    const selectedTitle = defaultSubplebbits.find((subplebbit) => subplebbit.address === selected).title;
    setSelectedTitle(selectedTitle);
    setSelectedAddress(selected);
    navigate(`/${selected}`);
  }


  const handleClickHelp = () => {
    alert("- Embedding media is optional, posts can be text-only. \n- A CAPTCHA challenge will appear after posting. \n- The CAPTCHA is case-sensitive.");
  };


  const handleClickForm = () => {
    setShowPostFormLink(false);
    setShowPostForm(true);
    navigate(`/${selectedAddress}/catalog/post`);
  };


  const handleClickThread = (thread) => {
    setSelectedThread(thread);
  }


  const handlePublishComment = async () => {
    // Event.preventDefault();
    try {
      const pendingComment = await publishComment({
        content: comment,
        title: subject,
        subplebbitAddress: selectedAddress,
        onChallengeVerification,
        onChallenge,
        onError: onError,
      });
      console.log(`Comment pending with index: ${pendingComment.index}`);
      setName('');
      setSubject('');
      setComment('');
    } catch (error) {
      onError(error);
    }
  };

  const handleCaptchaClose = () => {
    setIsCaptchaOpen(false);
  };


  const handleStyleChange = (event) => {
    switch (event.target.value) {
      case "Yotsuba":
        const yotsubaBodyStyle = {
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(yotsubaBodyStyle);
        setSelectedStyle("Yotsuba");
        localStorage.setItem("selectedStyle", "Yotsuba");
        localStorage.setItem("bodyStyle", JSON.stringify(yotsubaBodyStyle));
        break;
  
      case "Yotsuba-B":
        const yotsubaBBodyStyle = {
          background: "#eef2ff url(/assets/fade-blue.png) top center repeat-x",
          color: "#000",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(yotsubaBBodyStyle);
        setSelectedStyle("Yotsuba-B");
        localStorage.setItem("selectedStyle", "Yotsuba-B");
        localStorage.setItem("bodyStyle", JSON.stringify(yotsubaBBodyStyle));
        break;
  
      case "Futaba":
        const futabaBodyStyle = {
          background: "#ffe",
          color: "maroon",
          fontFamily: "times new roman, serif"
        };
        setBodyStyle(futabaBodyStyle);
        setSelectedStyle("Futaba");
        localStorage.setItem("selectedStyle", "Futaba");
        localStorage.setItem("bodyStyle", JSON.stringify(futabaBodyStyle));
        break;
  
      case "Burichan":
        const burichanBodyStyle = {
          background: "#eef2ff",
          color: "#000",
          fontFamily: "times new roman, serif"
        };
        setBodyStyle(burichanBodyStyle);
        setSelectedStyle("Burichan");
        localStorage.setItem("selectedStyle", "Burichan");
        localStorage.setItem("bodyStyle", JSON.stringify(burichanBodyStyle));
        break;
  
      case "Tomorrow":
        const tomorrowBodyStyle = {
          background: "#1d1f21 none",
          color: "#c5c8c6",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(tomorrowBodyStyle);
        setSelectedStyle("Tomorrow");
        localStorage.setItem("selectedStyle", "Tomorrow");
        localStorage.setItem("bodyStyle", JSON.stringify(tomorrowBodyStyle));
        break;
  
      case "Photon":
        const photonBodyStyle = {
          background: "#eee none",
          color: "#333",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(photonBodyStyle);
        setSelectedStyle("Photon");
        localStorage.setItem("selectedStyle", "Photon");
        localStorage.setItem("bodyStyle", JSON.stringify(photonBodyStyle));
        break;
  
      default:
        const defaultBodyStyle = {
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        };
        setBodyStyle(defaultBodyStyle);
        setSelectedStyle("Yotsuba");
        localStorage.setItem("selectedStyle", "Yotsuba");
        localStorage.setItem("bodyStyle", JSON.stringify(defaultBodyStyle));
    }
  }



  return (
    <Container>
      <CaptchaModal 
      isOpen={isCaptchaOpen} 
      closeModal={handleCaptchaClose} 
      captchaImage={captchaImage} />
      <NavBar selectedStyle={selectedStyle}>
        <>
          {defaultSubplebbits.map(subplebbit => (
            <span className="boardList" key={`span-${subplebbit.address}`}>
              [
              <Link to={`/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => handleClickTitle(subplebbit.title, subplebbit.address)}
              >{subplebbit.title}</Link>
              ]&nbsp;
            </span>
          ))}
          <span className="nav">
            [
            <Link to="" onClick={handleVoidClick}>Settings</Link>
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
                    >{subplebbit.title}</option>
                  ))}
              </select>
            </div>
            <div className="page-jump">
              <Link to="" onClick={handleVoidClick}>Settings</Link>
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
              <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</a>
            ]
          </div>
          <div id="post-form-link-mobile">
            <span className="btn-wrap">
              <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</a>
            </span>
          </div>
        </PostFormLink>
        <PostFormTable id="post-form" showPostForm={showPostForm} selectedStyle={selectedStyle} className="post-form">
        <tbody>
            <tr data-type="Name">
              <td id="td-name">Name</td>
              <td>
                <input name="name" type="text" tabIndex={1} placeholder="Anonymous" value={name} onChange={(event) => setName(event.target.value)} />
              </td>
            </tr>
            <tr data-type="Subject">
              <td>Subject</td>
              <td>
                <input name="sub" type="text" tabIndex={3} value={subject} onChange={(event) => setSubject(event.target.value)} />
                <input id="post-button" type="submit" value="Post" tabIndex={6} onClick={handlePublishComment} />
              </td>
            </tr>
            <tr data-type="Comment">
              <td>Comment</td>
              <td>
                <textarea name="com" cols="48" rows="4" tabIndex={4} wrap="soft" value={comment} onChange={(event) => setComment(event.target.value)}></textarea>
              </td>
            </tr>
            <tr data-type="File">
              <td>Embed File</td>
              <td>
                <input name="embed" type="text" tabIndex={7} placeholder="Paste link" />
                <button id="t-help" type="button" onClick={handleClickHelp} data-tip="Help">?</button>
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
          <Link to={`/${selectedAddress}`}>Return</Link>
          ]
        </div>
        <div id="return-button-mobile">
          <span className="btn-wrap-catalog btn-wrap">
            <Link to={`/${selectedAddress}`}>Return</Link>
          </span>
        </div>
        <hr />
      </TopBar>
      <Threads selectedStyle={selectedStyle}>
        <InfiniteScroll
          pageStart={0}
          loadMore={tryLoadMore}
          hasMore={hasMore}
          loader={<div key={`loader-${feed.length}`}>Loading...</div>}
        >
          {feed.map(thread => {
            return (
              <div key={`thread-${thread.cid}`} className="thread">
                <Link key={`a-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)}>
                  <img key={`img-${thread.cid}`} alt="" src="/assets/plebchan-psycho.png" />
                </Link>
                <div key={`ti-${thread.cid}`} className="thread-icons" >
                  <span key={`si-${thread.cid}`} className="thread-icon sticky-icon" title="Sticky"></span>
                </div>
                <div key={`meta-${thread.cid}`} className="meta" title="(R)eplies / (I)mage Replies" >
                  R:
                  <b key={`b-${thread.cid}`}>{thread.replyCount}</b>
                </div>
                <div key={`t-${thread.cid}`} className="teaser">
                  <b key={`b2-${thread.cid}`}>{thread.title ? `${thread.title}` : null}</b>
                  {thread.content ? `: ${thread.content}` : null}
                </div>
              </div>
            )})}
        </InfiniteScroll>
      </Threads>
    </Container>
  );
}

export default Catalog;