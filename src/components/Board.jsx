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
  const {feed, hasMore, loadMore} = useFeed(['memes.eth'], 'new');

  console.log({feed});

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

  return (
    <Container>
      <NavBar>
        <>
          {defaultSubplebbits.map(subplebbit => (
            <span className="boardList" key={subplebbit.address}>[
              <a href="/board">{subplebbit.title}</a>
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
            <div className="board-title">Crypto</div>
            <div className="board-address">p/QmPjewdKya8iVkuQiiXQ5qRBsgVUAZg2LQ2m8v3LNJ7Ht8</div>
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
          <div id="t" className="thread">
            <div id="pc" className="post-container op-container">
              <div id="p" className="post op">
                <span id="sa">
                <img alt="H" className="ext-button thread-hide-button" data-cmd="hide" data-id="1-test" src="./post_expand_minus.png" title="Hide thread" />
                </span>
                <div id="pi" className="post-info">
                   
                  <span className="name-block">
                    <span className="name">Tom</span>
                     
                    <span className="poster-address">
                      (User: plebeius.eth)
                    </span>
                  </span>
                   
                  <span className="date-time" data-utc="data">2 weeks ago</span>
                   
                  <span className="post-number">
                    <a href="post-link" title="Link to this post">No.</a>
                    <a href="post-link" title="Reply to this post">00000001</a>
                       
                    <span>
                      [
                      <a className="reply-link" href="post-link">Reply</a>
                      ]
                    </span>
                  </span>
                  <a className="post-menu-button" href="post-menu" title="Post menu" data-cmd="post-menu">▶</a>
                  <div id="backlink-id" className="backlink">
                      <span>
                        <a className="quote-link" href="post-link">{'>>'}00000002</a>
                      </span>
                  </div>
                  <blockquote>
                    <span className="quote">
                      {'>'}wen mvp
                    </span>
                    <br />
                    two more weeks
                  </blockquote>
                </div>
              </div>
            </div>
            {feed.map(post => (
              <div id="pc" className="post-container reply-container">
                <div className="side-arrows">{'>>'}</div>
                <div className="post-reply">
                  <div className="post-info">
                     
                    <span className="nameblock">
                      <span className="name">Anonymous</span>
                       
                      <span className="poster-address">
                        (User: {post.author.address})
                      </span>
                    </span>
                     
                    <span className="date-time" data-utc="data">2 weeks ago</span>
                     
                    <span className="post-number">
                      <a href="post-link" title="Link to this post">No.</a>
                      <a href="post-link" title="Reply to this post">00000002</a>
                    </span>
                    <a className="post-menu-button" href="#" title="Post menu" data-cmd="post-menu">▶</a>
                  </div>
                  <blockquote className="post-message">
                    <span className="quote">
                        {'>'}{post.title}
                      </span>
                      <br />
                      {post.content}
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bottom-control">
          <span></span>
        </div>
      </BoardForm>
    </Container>
  )
}

export default Board;