import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, NavBar, Header, Break, PostForm, PostFormLink, PostFormTable } from './styles/Board.styled';
import { TopBar } from './styles/Thread.styled';
import { Threads } from './styles/Catalog.styled';
import { BoardContext } from '../App';
import { useFeed, useAccountsActions } from '@plebbit/plebbit-react-hooks';
import ImageBanner from './ImageBanner';
import InfiniteScroll from 'react-infinite-scroller';

const Catalog = ({ setBodyStyle }) => {
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const { selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, selectedStyle, setSelectedStyle } = useContext(BoardContext);
  const [showPostFormLink, setShowPostFormLink] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const { feed, hasMore, loadMore } = useFeed([`${selectedAddress}`], 'new');

  const tryLoadMore = async () => {
    try {loadMore()} 
    catch (e)
    {await new Promise(resolve => setTimeout(resolve, 1000))}
  }

  const { publishComment } = useAccountsActions();

  const onChallengeVerification = (challengeVerification) => {
    if (challengeVerification.challengeSuccess === true) {
      console.log('challenge success', {publishedCid: challengeVerification.publication.cid})
    }
    else if (challengeVerification.challengeSuccess === false) {
      console.error('challenge failed', {reason: challengeVerification.reason, errors: challengeVerification.errors});
      alert("Error: You seem to have mistyped the CAPTCHA. Please try again.");
    }
  }

  const onChallenge = async (challenges, comment) => {
    let challengeAnswers = [];
    try {
      challengeAnswers = await getChallengeAnswersFromUser(challenges)
    }
    catch (error) {
      console.log(error);
    }
    if (challengeAnswers) {
      await comment.publishChallengeAnswers(challengeAnswers)
    }
  }
  
  const onError = (error) => console.error(error)

  const getChallengeAnswersFromUser = async (challenges) => {
    return new Promise((resolve, reject) => {
      const imageString = challenges?.challenges[0].challenge;
      const imageSource = `data:image/png;base64,${imageString}`;
      const challengeImg = new Image();
      challengeImg.src = imageSource;
  
      challengeImg.onload = () => {
        const inputEl = document.getElementById('t-resp');
        const cntEl = document.getElementById('t-cnt');
        cntEl.appendChild(challengeImg);
        inputEl.focus();
  
        const handleKeyDown = (event) => {
          if (event.key === 'Enter') {
            const challengeResponse = inputEl.value;
            inputEl.value = '';
  
            if (cntEl.contains(challengeImg)) {
              cntEl.removeChild(challengeImg);
            }
  
            document.removeEventListener('keydown', handleKeyDown);
  
            resolve(challengeResponse);
          }
        };
  
        document.addEventListener('keydown', handleKeyDown);
      };
  
      challengeImg.onerror = () => {
        reject(new Error('Could not load challenge image'));
      };
    });
  };

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

  const handleVoidClick = () => {}

  const handleClick = (title, address) => {
    setSelectedTitle(title);
    setSelectedAddress(address);
  };

  const handleClickHelp = () => {
    alert("- The CAPTCHA loads after you click \"Post\" \n- The CAPTCHA is case-sensitive. \n- Make sure to not block any cookies set by plebchan.");
  };

  const handleClickForm = () => {
    setShowPostFormLink(false);
    setShowPostForm(true);
    navigate('/board/catalog/post-thread');
  };

  const handlePublishComment = async () => {
    // Event.preventDefault();
    try {
      const pendingComment = await publishComment({
        content: comment,
        title: subject,
        subplebbitAddress: selectedAddress,
        onChallengeVerification,
        onChallenge,
        onError,
      });
      console.log(`Comment pending with index: ${pendingComment.index}`);
      setName('');
      setSubject('');
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };


  const handleStyleChange = (event) => {
    switch (event.target.value) {
      case "Yotsuba":
        setBodyStyle({
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba");
        break;

      case "Yotsuba B":
        setBodyStyle({
          background: "#eef2ff url(/assets/fade-blue.png) top center repeat-x",
          color: "#000",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba B");
        break;

      case "Futaba":
        setBodyStyle({
          background: "#ffe",
          color: "maroon",
          fontFamily: "times new roman, serif"
        });
        setSelectedStyle("Futaba");
        break;

      case "Burichan":
        setBodyStyle({
          background: "#eef2ff",
          color: "#000",
          fontFamily: "times new roman, serif"
        });
        setSelectedStyle("Burichan");
        break;
        
      case "Tomorrow":
        setBodyStyle({
          background: "#1d1f21 none",
          color: "#c5c8c6",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Tomorrow");
        break;

      case "Photon":
        setBodyStyle({
          background: "#eee none",
          color: "#333",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Photon");
        break;

      default:
        setBodyStyle({
          background: "#ffe url(/assets/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba");
    }
  }

  return (
    <Container>
      <NavBar selectedStyle={selectedStyle}>
        <>
          {defaultSubplebbits.map(subplebbit => (
            <span className="boardList" key={`span-${subplebbit.address}`}>
              [
              <a href={handleVoidClick} key={`a-${subplebbit.address}`} onClick={() => handleClick(subplebbit.title, subplebbit.address)}
              >{subplebbit.title}</a>
              ]&nbsp;
            </span>
          ))}
          <span className="nav">[
            <Link id="home-button" to="/" onClick={() => handleStyleChange({target: {value: "Yotsuba"}}
            )}>Home</Link>]&nbsp;
          </span>
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
        <PostFormLink id="post-form-link" showPostFormLink={showPostFormLink} >
          [
            <a onClick={handleClickForm}>Start a New Thread</a>
          ]
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
            <tr id="captchaFormPart">
              <td>Verification</td>
              <td colSpan={2}>
                <div id="t-root">
                  <input id="t-resp" name="t-response" placeholder="Type the CAPTCHA here and hit return" autoComplete='off' type="text" />
                  <button id="t-help" type="button" onClick={handleClickHelp} data-tip="Help" tabIndex={-1}>?</button>
                  <div id="t-cnt">
                  </div>
                </div>
              </td>
            </tr>
            <tr data-type="File">
              <td>Embed File</td>
              <td>
                <input name="embed" type="text" tabIndex={7} placeholder="Paste link" />
              </td>
            </tr>
            <tr></tr>
          </tbody>
        </PostFormTable>
      </PostForm>
      <TopBar selectedStyle={selectedStyle}>
        <hr />
        <span className="style-changer">
          Style:
           
          <select id="style-selector" onChange={handleStyleChange} value={selectedStyle}>
            <option value="Yotsuba">Yotsuba</option>
            <option value="Yotsuba B">Yotsuba B</option>
            <option value="Futaba">Futaba</option>
            <option value="Burichan">Burichan</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="Photon">Photon</option>
          </select>
        </span>
        <span className="return-button">
          [
          <Link to="/board">Return</Link>
          ]
        </span>
        <hr />
      </TopBar>
      <Threads selectedStyle={selectedStyle}>
        <InfiniteScroll
          pageStart={0}
          loadMore={tryLoadMore}
          hasMore={hasMore}
          loader={<div>Loading...</div>}
        >
          {feed.map(thread => {
            return (
              <div key={`${thread.cid}`} className="thread">
                <a key={`a-${thread.cid}`} href={handleVoidClick}>
                  <img key={`img-${thread.cid}`} alt="" src="/assets/plebchan-psycho.png" />
                </a>
                <div key={`ti-${thread.cid}`} className="thread-icons" >
                  <span key={`si-${thread.cid}`} className="thread-icon sticky-icon" title="Sticky"></span>
                </div>
                <div key={`meta-${thread.cid}`} className="meta" title="(R)eplies / (I)mage Replies" >
                  R:
                  <b key={`b-${thread.cid}`}>{thread.replyCount}</b>
                </div>
                <div key={`t-${thread.cid}`} className="teaser">
                  <b>{thread.title ? `${thread.title}` : null}</b>
                  {thread.content ? `${thread.content}` : null}
                </div>
              </div>
            )})}
        </InfiniteScroll>
      </Threads>
    </Container>
  );
}

export default Catalog;