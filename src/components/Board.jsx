import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, NavBar, Header, Break, PostForm, TopBar } from './styled/Board.styled';
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
    </Container>
  )
}

export default Board;