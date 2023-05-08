import styled from 'styled-components';

export const Threads = styled.div`
  padding: 20px 0;
  text-align: center;
  margin: 0;

  .thread {
    width: 180px;
    max-height: 320px;
    vertical-align: top;
    display: inline-block;
    word-wrap: break-word;
    overflow: hidden;
    margin-top: 5px;
    margin-bottom: 20px;
    padding: 5px 0 3px;
    position: relative;
  }

  video, audio, img {
    max-width: 150px;
    max-height: 150px;
  }

  img {
    display: inline;
    margin: auto;
    box-shadow: 0 0 5px rgba(0, 0, 0, .25);
    border: 0;
  }

  .thread-icons {
    display: inline;
    height: 16px;
    margin: 2px 0 0 -101px;
    position: absolute;
    width: 100px;
    text-align: right;
  }

  .offline-icon {
    height: 16px;
    margin: 2px;
  }

  .offline-icon-no-link {
    height: 13px;
    position: absolute;
    margin-left: 13px;
    margin-top: -2px;
  }

  .sticky-icon {
    background-image: url(assets/sticky.gif);
    width: 16px;
    height: 16px;
    display: inline-block;
  }

  .meta {
    cursor: help;
    font-size: 11px;
    line-height: 8px;
    margin-top: 2px;
    margin-bottom: 1px;
  }

  .teaser {
    display: block;
    padding: 0 15px;
  }
`;