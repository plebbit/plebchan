import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BoardContext } from '../App';
import { Container, NavBar, Header, Break, PostFormLink, PostFormTable, PostForm, TopBar, BoardForm } from './styles/Board.styled';
import ImageBanner from './ImageBanner';
import { useFeed } from '@plebbit/plebbit-react-hooks';
import InfiniteScroll from 'react-infinite-scroller';

const Board = ({ setBodyStyle }) => {
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const { selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, selectedStyle, setSelectedStyle } = useContext(BoardContext);
  const [showPostFormLink, setShowPostFormLink] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const navigate = useNavigate();

  const { feed, hasMore, loadMore } = useFeed([`${selectedAddress}`], 'new');

  // console.log(feed);

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
    navigate('/board/post-thread');
  };

  const handleStyleChange = (event) => {
    switch (event.target.value) {
      case "Yotsuba":
        setBodyStyle({
          background: "#ffe url(/fade.png) top repeat-x",
          color: "maroon",
          fontFamily: "Arial, Helvetica, sans-serif"
        });
        setSelectedStyle("Yotsuba");
        break;

      case "Yotsuba B":
        setBodyStyle({
          background: "#eef2ff url(/fade-blue.png) top center repeat-x",
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
          background: "#ffe url(/fade.png) top repeat-x",
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
      <PostForm selectedStyle={selectedStyle} name="post" action="" method="post" enctype="multipart/form-data">
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
                <input name="name" type="text" tabIndex={1} placeholder="Anonymous" />
              </td>
            </tr>
            <tr data-type="Subject">
              <td>Subject</td>
              <td>
                <input name="sub" type="text" tabIndex={3} />
                <input id="post-button" type="submit" value="Post" tabIndex={6} />
              </td>
            </tr>
            <tr data-type="Comment">
              <td>Comment</td>
              <td>
                <textarea name="com" cols="48" rows="4" tabIndex={4} wrap="soft"></textarea>
              </td>
            </tr>
            <tr id="captchaFormPart">
              <td>Verification</td>
              <td colSpan={2}>
                <div id="t-root">
                  <input id="t-resp" name="t-response" placeholder="Type the CAPTCHA here" autoComplete='off' type="text" />
                  <button id="t-help" type="button" onClick={handleClickHelp} data-tip="Help" tabIndex={-1}>?</button>
                  <div id="t-cnt">
                    <div id="t-bg"></div>
                    <div id="t-fg"></div>
                  </div>
                  <div id="t-msg"></div>
                  <input name="t-challenge" type="hidden"/>
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
        <hr />
      </TopBar>
      <BoardForm selectedStyle={selectedStyle} id="board-form" name="board-form" action="" method="post">
        <div className="board">
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={<div>Loading...</div>}
          >
            {feed.map(object => {
            let counter = 1;
            const thread = object;
            const { replies: { pages: { topAll: { comments } } } } = object;
            return (
            <>
            <div key={`t-${thread.cid}`} className="thread">
              <div key={`c-${thread.cid}`} className="post-container op-container">
                <div key={`po-${thread.cid}`} className="post op">
                  <div key={`pi-${thread.cid}`} className="post-info">
                  &nbsp;
                    <span key={`nb-${thread.cid}`} className="name-block">
                      <span key={`n-${thread.cid}`} className="name">{thread.author.displayName}</span>
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
                        <Link key={`rl2-${thread.cid}`} to="/board/thread" className="reply-link" >Reply</Link>
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
                      <span key={`q-${thread.cid}`} className="quote">
                        {thread.title ? `>${thread.title}` : null}
                      </span>
                      <br key={`br-${thread.cid}`} />
                      {thread.content}
                    </blockquote>
                  </div>
                </div>
              </div>
              {comments.map(reply => {
                counter++;
                return (
              <div key={`pc-${reply.cid}`} className="post-container reply-container">
                <div key={`sa-${reply.cid}`} className="side-arrows">{'>>'}</div>
                <div key={`pr-${reply.cid}`} className="post-reply">
                  <div key={`pi-${reply.cid}`} className="post-info">
                  &nbsp;
                    <span key={`nb-${reply.cid}`} className="nameblock">
                      <span key={`n-${reply.cid}`} className="name">{reply.author.displayName}</span>
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
                      <a key={`pl2-${reply.cid}`} href={handleVoidClick} title="Reply to this post">{`0000000${counter}`}</a>
                    </span>
                    <a key={`pmb-${reply.cid}`} className="post-menu-button" href={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</a>
                  </div>
                  <blockquote key={`pm-${reply.cid}`} className="post-message">
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