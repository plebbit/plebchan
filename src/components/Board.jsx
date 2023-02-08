import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, NavBar, Header, Break, PostForm, TopBar, BoardForm } from './styles/Board.styled';
import { useFeed } from '@plebbit/plebbit-react-hooks';

const ImageBanner = () => {
  const [currentImage, setCurrentImage] = useState(1);

  useEffect(() => {
    setCurrentImage(Math.floor(Math.random() * 12) + 1);
  }, []);

  return (
    <img id="banner-img" src={`banner-${currentImage}.jpg`} alt="banner" />
  );
};

const Board = () => {
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

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

  const handleClick = (title, address) => {
    setSelectedTitle(title);
    setSelectedAddress(address);
  };

  const {feed, hasMore, loadMore} = useFeed([`${selectedAddress}`], 'new');

  console.log(feed);

  return (
    <Container>
      <NavBar>
        <>
          {defaultSubplebbits.map(subplebbit => (
            <span className="boardList" key={subplebbit.address}>
              [
              <a href="#" onClick={() => handleClick(subplebbit.title, subplebbit.address)}
              >{subplebbit.title}</a>
              ]&nbsp;
            </span>
          ))}
          <span className="nav">[
            <Link to="/">Home</Link>]&nbsp;
          </span>
        </>
      </NavBar>
      <Header>
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
      <Break />
      <PostForm name="post" action="" method="post" enctype="multipart/form-data">
        <div id="post-form-link">
          [
            <a href="#">Start a New Thread</a>
          ]
        </div>
        <table id="post-form"></table>
      </PostForm>
      <TopBar>
        <hr />
        <span className="style-changer">
          Style:
           
          <select id="style-selector">
            <option value="Yotsuba New">Yotsuba</option>
            <option value="Yotsuba B">Yotsuba B</option>
            <option value="Futaba New">Futaba New</option>
            <option value="Burichan">Burichan</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="Photon">Photon</option>
          </select>
        </span>
        <hr />
      </TopBar>
      <BoardForm id="board-form" name="board-form" action="" method="post">
        <div className="board">
          {feed.map(object => {
            const thread = object;
            const { replies: { pages: { topAll: { comments } } } } = object;
            return (
            <>
            <div key={`t-${thread.cid}`} className="thread">
              <div key={`c-${thread.pc}`} className="post-container op-container">
                <div key={`po-${thread.cid}`} className="post op">
                  <span key={`sa-${thread.cid}`}>
                    <img key={`eb-${thread.cid}`} alt="H" className="ext-button thread-hide-button" data-cmd="hide" data-id="1-test" src="./post_expand_minus.png" title="Hide thread" />
                  </span>
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
                      <a key={`pl1-${thread.cid}`} href="post-link" title="Link to this post">No.</a>
                      <a key={`pl2-${thread.cid}`} href="post-link" title="Reply to this post">00000001</a>
                      &nbsp; &nbsp;
                      <span key={`rl1-${thread.cid}`}>
                        [
                        <a key={`rl2-${thread.cid}`} className="reply-link" href="post-link">Reply</a>
                        ]
                      </span>
                    </span>
                    <a key={`pmb-${thread.cid}`} className="post-menu-button" href="post-menu" title="Post menu" data-cmd="post-menu">▶</a>
                    <div key={`bi-${thread.cid}`} id="backlink-id" className="backlink">
                      <span key={`ql1-${thread.cid}`}>
                        <a key={`ql2-${thread.cid}`} className="quote-link" href="post-link">{'>>'}00000002</a>
                      </span>
                    </div>
                    <blockquote key={`t-${thread.cid}`}>
                      <span key={`q-${thread.cid}`} className="quote">
                        {'>'}{thread.title}
                      </span>
                      <br key={`br-${thread.cid}`} />
                      {thread.content}
                    </blockquote>
                  </div>
                </div>
              </div>
              {comments.map(reply => (
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
                      <a key={`pl1-${reply.cid}`} href="post-link" title="Link to this post">No.</a>
                      <a key={`pl2-${reply.cid}`} href="post-link" title="Reply to this post">00000002</a>
                    </span>
                    <a key={`pmb-${reply.cid}`} className="post-menu-button" href="#" title="Post menu" data-cmd="post-menu">▶</a>
                  </div>
                  <blockquote key={`pm-${reply.cid}`} className="post-message">
                    <span key={`q-${reply.cid}`} className="quote">
                      {'>'}{reply.title}
                    </span>
                    <br />
                    {reply.content}
                  </blockquote>
                </div>
              </div>
              ))}
            </div>
            <hr />
            </>
            )})}
        </div>
      </BoardForm>
    </Container>
  );
}

export default Board;