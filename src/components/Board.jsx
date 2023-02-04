import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from './styled/Home.styled'
import { NavBar, Header, Break, PostForm } from './styled/Board.styled';
import { useFeed } from '@plebbit/plebbit-react-hooks';

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
            <span className="boardList">[
              <a href="/board" key={subplebbit.address}>{subplebbit.title}</a>
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
            <img alt="plebchan" src="/banner.jpg"/>
          </div>
          <div className="board-title">Plebs Helping Plebs</div>
          <div className="board-address">p/plebshelpingplebs.eth</div>
        </>
      </Header>
      <Break />
      <PostForm>
        {/* <div id="post-form-link">
          [
            <a href="#">Start a New Thread</a>
          ]
        </div>
        <table id="post-form"></table> */}
      </PostForm>
    </Container>
  )
}

export default Board;