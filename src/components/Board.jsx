import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, NavBar, Header, Break, PostForm, TopBar, BoardForm } from './styled/Board.styled';
import { useFeed } from '@plebbit/plebbit-react-hooks';

const ImageBanner = () => {
  const [currentImage, setCurrentImage] = useState(1);

  useEffect(() => {
    setCurrentImage(Math.floor(Math.random() * 5) + 1);
  }, []);

  return (
    <img id="banner-img" src={`banner-${currentImage}.jpg`} alt="banner" />
  );
};

const Board = () => {
  // eslint-disable-next-line
  const { feed, hasMore, loadMore } = useFeed(['news.eth'], 'new');
  const [defaultSubplebbits, setDefaultSubplebbits] = useState([]);

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
          <div className="board-title">Plebs Helping Plebs</div>
          <div className="board-address">p/plebshelpingplebs.eth</div>
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
        <input id="search-box" type="text" placeholder="Search OPs…" />
        [
        <a href="./catalog">Catalog</a>
        ]
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
                  <input type="checkbox" name="id" value="delete"></input>
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
                  <a className="post-menu-button" href="#" title="Post menu" data-cmd="post-menu">▶</a>
                  <div id="backlink-id" className="backlink">
                      <span>
                        <a className="quote-link" href="post-link">{'>>'}00000002</a>
                      </span>
                  </div>
                  <blockquote>
                    <span className="quote">
                      {'>'}imagine being a pleb
                    </span>
                  </blockquote>
                </div>
              </div>
            </div>
            <div id="pc" className="post-container reply-container">
              <div className="side-arrows">{'>>'}</div>
              <div className="post-reply">
                <div className="post-info">
                  <input type="checkbox" name="id" value="delete"></input>
                  <span className="nameblock">
                    <span className="name">Anonymous</span>
                    <span className="poster-address">
                      (User: Qma319kE7rrHNce8vH9fAjPjihUF4EZCaKSK8dBaFtxsVn)
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
                  I can imagine being a pleb
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </BoardForm>
    </Container>
  )
}

export default Board;