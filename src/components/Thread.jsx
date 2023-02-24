import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, NavBar, Header, Break, PostForm, BoardForm } from './styles/Board.styled';
import { ReplyFormTable, ReplyFormLink, TopBar, BottomBar } from './styles/Thread.styled';
import { BoardContext } from '../App';
import { useComment, useAccountsActions } from '@plebbit/plebbit-react-hooks';
import ImageBanner from './ImageBanner';

const Thread = ({ setBodyStyle }) => {
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const { selectedTitle, setSelectedTitle, selectedAddress, setSelectedAddress, selectedThread, setSelectedThread, selectedStyle, setSelectedStyle } = useContext(BoardContext);
  const [showReplyFormLink, setShowReplyFormLink] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const comment = useComment(`${selectedThread}`);
  
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

  const handleVoidClick = () => {}

  const handleClick = (title, address) => {
    setSelectedTitle(title);
    setSelectedAddress(address);
  };

  const handleClickHelp = () => {
    alert("- The CAPTCHA loads after you click \"Post\" \n- The CAPTCHA is case-sensitive. \n- Make sure to not block any cookies set by plebchan.");
  };

  const handleClickForm = () => {
    setShowReplyFormLink(false);
    setShowReplyForm(true);
    navigate(`/${selectedAddress}/thread/${selectedThread}/post`);
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

  const handleClickTop = () => {
    window.scrollTo(0, 0);
  }

  const handleClickBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  }

  function renderComments(comments) {
    const commentKeys = Object.keys(comments);
    const renderedComments = commentKeys.map(key => {
      const comment = comments[key];
      const { replies: { pages: { topAll: { comments: nestedComments } } } } = comment;
      if (comment.replyCount > 0 && nestedComments) {
        const renderedNestedComments = renderComments(nestedComments);
        return [comment, ...renderedNestedComments];
      }
      return [comment];
    }).flat();
    return renderedComments;
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
          <span className="nav">
            [
            <a href={handleVoidClick}>Settings</a>
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
              <select id="board-select-mobile">
                {defaultSubplebbits.map(subplebbit => (
                  <option key={`option-${subplebbit.address}`} value={subplebbit.address} onClick={() => handleClick(subplebbit.title, subplebbit.address)}>{subplebbit.title}</option>))}
              </select>
            </div>
            <div className="page-jump">
              <a href={handleVoidClick}>Settings</a>
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
        <ReplyFormLink id="post-form-link" showReplyFormLink={showReplyFormLink} selectedStyle={selectedStyle} >
          <div id="return-button-mobile">
            <span className="btn-wrap">
              <Link to={`/${selectedAddress}`}>Return</Link>
            </span>
          </div>
          <div id="catalog-button-mobile">
            <span className="btn-wrap">
              <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
            </span>
          </div>
          <div id="bottom-button-mobile">
            <span className="btn-wrap">
              <a onClick={handleClickBottom} onMouseOver={(event) => event.target.style.cursor='pointer'}>Bottom</a>
            </span>
          </div>
          <div id="post-form-link-desktop">
            [
              <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</a>
            ]
          </div>
          <div id="post-form-link-mobile">
            <span className="btn-wrap">
              <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</a>
            </span>
          </div>
        </ReplyFormLink>
        <ReplyFormTable id="post-form" showReplyForm={showReplyForm} selectedStyle={selectedStyle} className="post-form">
          <tbody>
            <tr data-type="Subject">
              <td>Name</td>
              <td>
                <input name="sub" type="text" placeholder='Anonymous' tabIndex={3} />
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
        </ReplyFormTable>
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
        <span className="return-button" id="return-button-desktop">
          [
          <Link to={`/${selectedAddress}`}>Return</Link>
          ]
        </span>
        <span className="return-button catalog-button" id="catalog-button-desktop">
          [
          <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
          ]
        </span>
        <span className="return-button catalog-button" id="bottom-button-desktop">
          [
          <a href={handleVoidClick} onClick={handleClickBottom} onMouseOver={(event) => event.target.style.cursor='pointer'} onTouchStart={handleClickBottom}>Bottom</a>
          ]
        </span>
        {comment ? (
          comment.replyCount > 0 ? (
            <span className="reply-stat">{comment.replyCount} replies</span>
          ) : (
            <span className="reply-stat">No replies yet</span>
        )) : (
          null
        )}
        <hr />
      </TopBar>
      <BoardForm selectedStyle={selectedStyle}>
        {comment ? (
          <>
            <div className="thread">
              <div className="post-container op-container">
                <div className="post op">
                  <div className="post-info">
                    <div key={`f-${comment.cid}`} className="file">
                        <div key={`ft-${comment.cid}`} className="file-text">
                          File:&nbsp;
                          <a key={`fa-${comment.cid}`} href={`${comment.link}`} target="_blank">filename.something</a>&nbsp;(metadata)
                        </div>
                        <a key={`fta-${comment.cid}`} href={handleVoidClick} target="_blank" className="file-thumb">
                          <img key={`fti-${comment.cid}`} src="/assets/plebchan-psycho.png" alt="filename.something" />
                        </a>
                      </div>
                    <span className="name-block">
                      <span key={`q-${comment.cid}`} className="title">{comment.title}</span>
                      &nbsp;
                      <span className="name">{comment.author.displayName || "Anonymous"}</span>
                      &nbsp;
                      <span className="poster-address">
                        (User: {comment.author.address})
                      </span>
                      &nbsp;
                      <span className="date-time" data-utc="data">2 weeks ago</span>
                      &nbsp;
                      <span className="post-number">
                        <a href={handleVoidClick} title="Link to this post">No.</a>
                        <a href={handleVoidClick} title="Reply to this post">00000001</a>
                      </span>
                      <a key={`pmb-${comment.cid}`} className="post-menu-button" href={handleVoidClick} title="Post menu" data-cmd="post-menu">▶</a>
                      <div id="backlink-id" className="backlink">
                        <span>
                          <a className="quote-link" href={handleVoidClick}>{'>>'}00000002</a>
                        </span>
                      </div>
                    </span>
                    <blockquote>
                      {comment.content}
                    </blockquote>
                  </div>
                </div>
              </div>
              {comment.replyCount > 0 && 
              Object.keys(comment.replies.pages.topAll.comments).map(() => {
                const renderedComments = renderComments(comment.replies.pages.topAll.comments);
                return renderedComments.map(reply => {
                  let counter = 1;
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
                  )
                })
              })}
              <BottomBar selectedStyle={selectedStyle}>
                <div id="bottombar-desktop">
                  <hr />
                  <span className="bottom-bar-return">
                    [
                    <Link to={`/${selectedAddress}`}>Return</Link>
                    ]
                  </span>
                  <span className="bottom-bar-catalog">
                    [
                    <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
                    ]
                  </span>
                  <span className="bottom-bar-top">
                    [
                    <a href={handleVoidClick} onClick={handleClickTop} onMouseOver={(event) => event.target.style.cursor='pointer'} onTouchStart={handleClickTop}>Top</a>
                    ]
                  </span>
                  <span className="quickreply-button">
                  [
                  <a href={handleVoidClick} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</a>
                  ]
                  </span>
                  {comment.replyCount > 0 ? (
                    <span className="reply-stat">{comment.replyCount} replies</span>
                  ) : (
                    <span className="reply-stat">No replies yet</span>
                  )}
                  <hr />
                </div>
              </BottomBar>
              <div id="bottombar-mobile">
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
                  {comment ? (
                    comment.replyCount > 0 ? (
                      <span className="reply-stat">{comment.replyCount} replies</span>
                    ) : (
                      <span className="reply-stat">No replies yet</span>
                  )) : (
                    null
                  )}
                  <hr />
                </TopBar>
                <ReplyFormLink id="post-form-link" showReplyFormLink={showReplyFormLink} selectedStyle={selectedStyle} >
                  <div id="post-form-link-mobile" className="post-button-mobile">
                    <span className="btn-wrap">
                      <a onClick={handleClickForm} onMouseOver={(event) => event.target.style.cursor='pointer'}>Post a Reply</a>
                    </span>
                  </div>
                  <div id="btns-container">
                    <div id="return-button-mobile">
                      <span className="btn-wrap">
                        <Link to={`/${selectedAddress}`}>Return</Link>
                      </span>
                    </div>
                    <div id="catalog-button-mobile">
                      <span className="btn-wrap">
                        <Link to={`/${selectedAddress}/catalog`}>Catalog</Link>
                      </span>
                    </div>
                    <span className="bottom-bar-top">
                      <span className="btn-wrap">
                        <a href={handleVoidClick} onClick={handleClickTop} onMouseOver={(event) => event.target.style.cursor='pointer'} onTouchStart={handleClickTop}>Top</a>
                      </span>
                    </span>
                  </div>
                </ReplyFormLink>
              </div>
            </div>
          </>
         ) : (
          <div>Loading...</div>
        )}
      </BoardForm>
    </Container>
  );
}

export default Thread;