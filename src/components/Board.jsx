import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BoardContext } from '../App';
import { Container, NavBar, Header, Break, PostFormLink, PostFormTable, PostForm, TopBar, BoardForm } from './styles/Board.styled';
import ImageBanner from './ImageBanner';
import { useFeed, useAccountsActions } from '@plebbit/plebbit-react-hooks';
import InfiniteScroll from 'react-infinite-scroller';


const Board = ({ setBodyStyle }) => {
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const { selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, selectedThread, setSelectedThread, selectedStyle, setSelectedStyle } = useContext(BoardContext);
  const [showPostFormLink, setShowPostFormLink] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const { feed, hasMore, loadMore } = useFeed([`${selectedAddress}`], 'new');

  // console.log(feed);

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
    navigate(`/${selectedAddress}/post`);
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

  function renderComments(comments) {
    return comments.map(comment => {
      const { replyCount, replies: { pages: { topAll: { comments: nestedComments } } } } = comment;
  
      if (replyCount > 0 && nestedComments.length > 0) {
        const renderedNestedComments = renderComments(nestedComments);
        return [comment, ...renderedNestedComments];
      }
  
      return [comment];
    }).flat();
  }
  

  return (
    <Container>
      <NavBar selectedStyle={selectedStyle}>
        <>
          {defaultSubplebbits.map(subplebbit => (
            <span className="boardList" key={`span-${subplebbit.address}`}>
              [
              <Link to={`/${subplebbit.address}`} key={`a-${subplebbit.address}`} onClick={() => handleClick(subplebbit.title, subplebbit.address)}
              >{subplebbit.title}</Link>
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
            <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Start a New Thread</a>
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
        [
        <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
        ]
        <hr />
      </TopBar>
      <BoardForm selectedStyle={selectedStyle}>
        <div className="board">
          <InfiniteScroll
            pageStart={0}
            loadMore={tryLoadMore}
            hasMore={hasMore}
            loader={<div>Loading...</div>}
          >
            {feed.map(thread => {
            let counter = 1;
            const { replies: { pages: { topAll: { comments } } } } = thread;
            const renderedComments = renderComments(comments);
            return (
            <>
            <div key={`t-${thread.cid}`} className="thread">
              <div key={`c-${thread.cid}`} className="post-container op-container">
                <div key={`po-${thread.cid}`} className="post op">
                  <div key={`pi-${thread.cid}`} className="post-info">
                  &nbsp;
                    <span key={`nb-${thread.cid}`} className="name-block">
                      <span key={`n-${thread.cid}`} className="name">{thread.author.displayName || "Anonymous"}</span>
                      &nbsp;
                      <span key={`pa-${thread.cid}`} className="poster-address">
                        (User: {thread.author.address})
                      </span>
                    </span>
                    &nbsp;
                    <span key={`dt-${thread.cid}`} className="date-time" data-utc="data">2 weeks ago</span>
                    &nbsp;
                    <span key={`pn-${thread.cid}`} className="post-number">
                      <a key={`pl1-${thread.cid}`} href={handleVoidClick} title="Link to this post">No.</a>
                      <a key={`pl2-${thread.cid}`} href={handleVoidClick} title="Reply to this post">00000001</a>
                      &nbsp; &nbsp;
                      <span key={`rl1-${thread.cid}`}>
                        [
                        <Link key={`rl2-${thread.cid}`} to={`/${selectedAddress}/thread/${thread.cid}`} onClick={() => handleClickThread(thread.cid)} className="reply-link" >Reply</Link>
                        ]
                      </span>
                    </span>
                    <a key={`pmb-${thread.cid}`} className="post-menu-button" href={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</a>
                    <div key={`bi-${thread.cid}`} id="backlink-id" className="backlink">
                      <span key={`ql1-${thread.cid}`}>
                        <a key={`ql2-${thread.cid}`} className="quote-link" href={handleVoidClick}>{'>>'}00000002</a>
                      </span>
                    </div>
                    <blockquote key={`bq-${thread.cid}`}>
                      <span key={`q-${thread.cid}`} className="title">
                        {thread.title ? `${thread.title}` : null}
                      </span>
                      <br key={`br1-${thread.cid}`} />
                      {thread.content ? (
                        <>
                          <br key={`br2-${thread.cid}`} />
                          {thread.content}
                        </>
                      ) : null}
                    </blockquote>
                  </div>
                </div>
              </div>
              {renderedComments.map(reply => {
                counter++;
                const counterString = counter.toString().padStart(8, '0');
                return (
              <div key={`pc-${reply.cid}`} className="post-container reply-container">
                <div key={`sa-${reply.cid}`} className="side-arrows">{'>>'}</div>
                <div key={`pr-${reply.cid}`} className="post-reply">
                  <div key={`pi-${reply.cid}`} className="post-info">
                  &nbsp;
                    <span key={`nb-${reply.cid}`} className="nameblock">
                      <span key={`n-${reply.cid}`} className="name">{reply.author.displayName || "Anonymous"}</span>
                      &nbsp;
                      <span key={`pa-${reply.cid}`} className="poster-address">
                        (User: {reply.author.address})
                      </span>
                    </span>
                    &nbsp;
                    <span key={`dt-${reply.cid}`} className="date-time" data-utc="data">2 weeks ago</span>
                    &nbsp;
                    <span key={`pn-${reply.cid}`} className="post-number">
                      <a key={`pl1-${reply.cid}`} href={handleVoidClick} title="Link to this post">No.</a>
                      <a key={`pl2-${reply.cid}`} href={handleVoidClick} title="Reply to this post">{counterString}</a>
                    </span>
                    <a key={`pmb-${reply.cid}`} className="post-menu-button" href={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</a>
                  </div>
                  <blockquote key={`pm-${reply.cid}`} className="post-message">
                    <a className="quotelink" href={handleVoidClick}>
                      {`>>${counterString}`}{<br />}
                    </a>
                    {reply.content}
                  </blockquote>
                </div>
              </div>
              )})}
            </div>
            <hr key={`hr-${thread.cid}`} />
            </>
            )})}
          </InfiniteScroll>
        </div>
      </BoardForm>
    </Container>
  );
}

export default Board;