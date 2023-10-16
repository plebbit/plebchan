import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useComment } from '@plebbit/plebbit-react-hooks';
import getDate from '../utils/getDate';
import getCommentMediaInfo from '../utils/getCommentMediaInfo';
import findShortParentCid from '../utils/findShortParentCid';
import Post from './Post';
import EditLabel from './EditLabel';
import useStateString from '../hooks/useStateString';
import { BoardForm, Container } from './styled/views/Board.styled';
import useGeneralStore from '../hooks/stores/useGeneralStore';

const PostOnHover = ({ cid, feed }) => {
  const selectedStyle = useGeneralStore((state) => state.selectedStyle);
  const account = useAccount();
  const reply = useComment({ commentCid: cid });
  const replyMediaInfo = getCommentMediaInfo(reply);
  const fallbackImgUrl = 'assets/filedeleted-res.gif';
  const selectedFeed = feed;
  const thread = useComment({ commentCid: reply.parentCid });
  const shortParentCid = findShortParentCid(reply.parentCid, selectedFeed);
  const stateString = useStateString(reply);

  return (
    <Container
      selectedStyle={selectedStyle}
      style={{
        margin: '0',
        padding: '0',
        whiteSpace: 'normal',
        maxWidth: '100vw',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        wordBreak: 'break-all',
        boxSizing: 'border-box',
      }}
    >
      <BoardForm selectedStyle={selectedStyle} style={{ margin: '0', padding: '0' }}>
        <div className='board'>
          <div className='thread'>
            {reply.state === 'succeeded' ? (
              <div className='reply-container'>
                <div className='post-reply post-reply-desktop'>
                  <div className='post-info'>
                    <span className='nameblock'>
                      {reply.author?.displayName ? (
                        reply.author?.displayName.length > 20 ? (
                          <Fragment>
                            <span className='name' data-tooltip-id='tooltip' data-tooltip-content={reply.author?.displayName} data-tooltip-place='top'>
                              {reply.author?.displayName.slice(0, 20) + ' (...)'}
                            </span>
                          </Fragment>
                        ) : (
                          <span className='name'>{reply.author?.displayName}</span>
                        )
                      ) : (
                        <span className='name'>Anonymous</span>
                      )}
                      &nbsp;
                      <span className='poster-address address-desktop' id='reply-button' style={{ cursor: 'pointer' }}>
                        (u/
                        {reply.author?.shortAddress ? <span>{reply.author?.shortAddress}</span> : <span>{account?.author?.shortAddress}</span>})
                      </span>
                    </span>
                    &nbsp;
                    <span className='date-time' data-utc='data'>
                      {getDate(reply.timestamp)}
                    </span>
                    &nbsp;
                    <span className='post-number post-number-desktop'>
                      <span>c/</span>
                      <Link to={() => {}} id='reply-button' title='Reply to this post'>
                        {reply.shortCid}
                      </Link>
                    </span>
                    &nbsp;
                    <div id='backlink-id' className='backlink'>
                      {reply.replies?.pages?.topAll.comments
                        .sort((a, b) => a.timestamp - b.timestamp)
                        .map((reply, index) => (
                          <div key={`div-${index}`} style={{ display: 'inline-block' }}>
                            <Link key={`link-${index}`} to={() => {}} className='quote-link'>
                              c/{reply.shortCid}
                            </Link>
                            &nbsp;
                          </div>
                        ))}
                    </div>
                  </div>
                  {replyMediaInfo?.url ? (
                    <div className='file' style={{ marginBottom: '5px' }}>
                      <div className='reply-file-text'>
                        Link:&nbsp;
                        <a href={replyMediaInfo.url} target='_blank' rel='noopener noreferrer'>
                          {replyMediaInfo?.url.length > 30 ? replyMediaInfo?.url.slice(0, 30) + '(...)' : replyMediaInfo?.url}
                        </a>
                        &nbsp;{replyMediaInfo?.type === 'iframe' ? null : ` (${replyMediaInfo?.type})`}
                      </div>
                      {replyMediaInfo?.type === 'iframe' && (
                        <div className='img-container'>
                          <span className='file-thumb-reply'>
                            {replyMediaInfo.thumbnail && <img src={replyMediaInfo.thumbnail} alt='thumbnail' onError={(e) => (e.target.src = fallbackImgUrl)} />}
                          </span>
                        </div>
                      )}
                      {replyMediaInfo?.type === 'webpage' ? (
                        <div className='img-container'>
                          <span className='file-thumb-reply'>
                            {reply.thumbnailUrl ? (
                              <img
                                src={replyMediaInfo.thumbnail}
                                alt={replyMediaInfo.type}
                                style={{ cursor: 'pointer' }}
                                onError={(e) => (e.target.src = fallbackImgUrl)}
                              />
                            ) : null}
                          </span>
                        </div>
                      ) : null}
                      {replyMediaInfo?.type === 'image' ? (
                        <div className='img-container'>
                          <span className='file-thumb-reply'>
                            <img src={replyMediaInfo.url} alt={replyMediaInfo.type} style={{ cursor: 'pointer' }} onError={(e) => (e.target.src = fallbackImgUrl)} />
                          </span>
                        </div>
                      ) : null}
                      {replyMediaInfo?.type === 'video' ? (
                        <span className='file-thumb-reply'>
                          <video controls src={replyMediaInfo.url} alt={replyMediaInfo.type} onError={(e) => (e.target.src = fallbackImgUrl)} />
                        </span>
                      ) : null}
                      {replyMediaInfo?.type === 'audio' ? (
                        <span className='file-thumb-reply'>
                          <audio controls src={replyMediaInfo.url} alt={replyMediaInfo.type} onError={(e) => (e.target.src = fallbackImgUrl)} />
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {reply.content ? (
                    reply.content?.length > 500 ? (
                      <Fragment>
                        <blockquote comment={reply} className='post-message'>
                          {shortParentCid ? (
                            <Link to={() => {}} className='quotelink'>
                              {`c/${shortParentCid}`}
                              {shortParentCid === thread.shortCid ? ' (OP)' : null}
                            </Link>
                          ) : null}
                          <Post content={reply.content?.slice(0, 500)} />
                          <span className='ttl'>
                            {' '}
                            (...)
                            <br /> <EditLabel commentCid={reply.cid} className='ttl' />
                            <br />
                            Comment too long. Click the link to view.
                          </span>
                        </blockquote>
                      </Fragment>
                    ) : (
                      <blockquote className='post-message'>
                        {shortParentCid ? (
                          <Link to={() => {}} className='quotelink'>
                            {`c/${shortParentCid}`}
                            {shortParentCid === thread.shortCid ? ' (OP)' : null}
                          </Link>
                        ) : null}
                        <Post content={reply.content} comment={reply} />
                        <EditLabel commentCid={reply.cid} className='ttl' />
                      </blockquote>
                    )
                  ) : null}
                </div>
              </div>
            ) : (
              <div className='reply-container'>
                <span className='ellipsis'>{stateString}</span>
              </div>
            )}
          </div>
          <div className='thread-mobile'>
            {reply.state === 'succeeded' ? (
              <div className='reply-container'>
                <div className='post-reply post-reply-mobile'>
                  <div className='post-info-mobile'>
                    <span className='name-block-mobile'>
                      {reply.author?.displayName ? (
                        reply.author?.displayName.length > 20 ? (
                          <Fragment>
                            <span className='name-mobile'>{reply.author?.displayName.slice(0, 20) + ' (...)'}</span>
                          </Fragment>
                        ) : (
                          <span className='name-mobile'>{reply.author?.displayName}</span>
                        )
                      ) : (
                        <span className='name-mobile'>Anonymous</span>
                      )}
                      &nbsp;
                      <span className='poster-address-mobile address-mobile' id='reply-button' style={{ cursor: 'pointer' }}>
                        (u/
                        {reply.author?.shortAddress ? (
                          <span className='highlight-address-mobile'>{reply.author?.shortAddress}</span>
                        ) : (
                          <span>{account?.author?.shortAddress}</span>
                        )}
                        )&nbsp;
                      </span>
                      <br />
                    </span>
                    <span className='date-time-mobile post-number-mobile'>
                      {getDate(reply.timestamp)}&nbsp;
                      <span>c/</span>
                      <Link to={() => {}} id='reply-button'>
                        {reply.shortCid}
                      </Link>
                    </span>
                  </div>
                  {reply.link ? (
                    <div className='file-mobile'>
                      {replyMediaInfo?.url ? (
                        replyMediaInfo.type === 'webpage' ? (
                          <div className='img-container'>
                            <span className='file-thumb-mobile'>
                              {reply.thumbnailUrl ? (
                                <img src={replyMediaInfo.thumbnail} alt='thumbnail' style={{ cursor: 'pointer' }} onError={(e) => (e.target.src = fallbackImgUrl)} />
                              ) : null}
                              <div className='file-info-mobile'>{replyMediaInfo.type}</div>
                            </span>
                          </div>
                        ) : replyMediaInfo.type === 'image' ? (
                          <div className='img-container'>
                            <span className='file-thumb-mobile'>
                              <img src={replyMediaInfo.url} alt={replyMediaInfo.type} style={{ cursor: 'pointer' }} onError={(e) => (e.target.src = fallbackImgUrl)} />
                              <div className='file-info-mobile'>{replyMediaInfo.type}</div>
                            </span>
                          </div>
                        ) : replyMediaInfo.type === 'video' ? (
                          <span className='file-thumb-mobile'>
                            <video
                              src={replyMediaInfo.url}
                              alt={replyMediaInfo.type}
                              style={{ pointerEvents: 'none' }}
                              onError={(e) => (e.target.src = fallbackImgUrl)}
                            />
                            <div className='file-info-mobile'>{replyMediaInfo.type}</div>
                          </span>
                        ) : replyMediaInfo.type === 'audio' ? (
                          <span className='file-thumb-mobile'>
                            <audio src={replyMediaInfo.url} alt={replyMediaInfo.type} onError={(e) => (e.target.src = fallbackImgUrl)} />
                            <div className='file-info-mobile'>{replyMediaInfo.type}</div>
                          </span>
                        ) : null
                      ) : null}
                    </div>
                  ) : null}
                  {reply.content ? (
                    reply.content?.length > 500 ? (
                      <Fragment>
                        <blockquote className='post-message'>
                          {shortParentCid ? (
                            <Link to={() => {}} className='quotelink'>
                              {`c/${shortParentCid}`}
                              {shortParentCid === thread.shortCid ? ' (OP)' : null}
                            </Link>
                          ) : null}
                          <Post content={reply.content?.slice(0, 500)} comment={reply} />
                          <span className='ttl'>
                            {' '}
                            (...)
                            <br />
                            <EditLabel commentCid={reply.cid} className='ttl' />
                            <br />
                            Comment too long. Click the link to view.{' '}
                          </span>
                        </blockquote>
                      </Fragment>
                    ) : (
                      <blockquote className='post-message'>
                        {shortParentCid ? (
                          <Link to={() => {}} className='quotelink'>
                            {`c/${shortParentCid}`}
                            {shortParentCid === thread.shortCid ? ' (OP)' : null}
                          </Link>
                        ) : null}
                        <Post content={reply.content} comment={reply} />
                        <EditLabel commentCid={reply.cid} className='ttl' />
                      </blockquote>
                    )
                  ) : null}
                </div>
              </div>
            ) : (
              <div className='reply-container'>
                <span className='ellipsis'>{stateString}</span>
              </div>
            )}
          </div>
        </div>
      </BoardForm>
    </Container>
  );
};

export default PostOnHover;
