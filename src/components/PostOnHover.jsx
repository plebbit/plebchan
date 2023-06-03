import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAccount, useComment } from "@plebbit/plebbit-react-hooks";
import getDate from "../utils/getDate";
import getCommentMediaInfo from "../utils/getCommentMediaInfo";
import findShortParentCid from "../utils/findShortParentCid";
import Post from "./Post";
import EditLabel from "./EditLabel";
import useStateString from "../hooks/useStateString";
import { BoardForm, Container } from "./styled/views/Board.styled";
import useGeneralStore from "../hooks/stores/useGeneralStore";

const PostOnHover = ({ cid, feed }) => {
  const selectedStyle = useGeneralStore(state => state.selectedStyle);
  const account = useAccount();
  const reply = useComment({commentCid: cid});
  const replyMediaInfo = getCommentMediaInfo(reply);
  const fallbackImgUrl = "assets/filedeleted-res.gif";
  const selectedFeed = feed;
  const thread = useComment({commentCid: reply.parentCid});
  const shortParentCid = findShortParentCid(reply.parentCid, selectedFeed);
  const stateString = useStateString(reply);

  return (
    <Container selectedStyle={selectedStyle} style={{margin: '0', padding: '0',
      whiteSpace: 'nowrap', overflow: 'visible'}}>
      <BoardForm selectedStyle={selectedStyle} style={{margin: '0', padding: '0'}}>
        <div className="board" style={{margin: '0', padding: '0'}}>
          <div className="thread" style={{margin: '0', padding: '0'}}>
            {reply.state === 'succeeded' ? (
              <div className="reply-container">
                <div className="post-reply post-reply-desktop">
                  <div className="post-info">
                    <span className="nameblock">
                      {reply.author?.displayName
                        ? reply.author?.displayName.length > 20
                        ? <Fragment >
                            <span className="name"
                            data-tooltip-id="tooltip"
                            data-tooltip-content={reply.author?.displayName}
                            data-tooltip-place="top">
                              {reply.author?.displayName.slice(0, 20) + " (...)"}
                            </span>
                          </Fragment>
                          : <span className="name">
                            {reply.author?.displayName}</span>
                        : <span className="name">
                          Anonymous</span>}
                      &nbsp;
                      <span className="poster-address address-desktop"
                        id="reply-button" style={{cursor: "pointer"}}
                      >
                        (u/
                          {reply.author?.shortAddress ?
                            (
                              <span >
                                {reply.author?.shortAddress}
                              </span>
                            ) : (
                              <span >
                                {account?.author?.shortAddress}
                              </span>
                            )
                          }
                        )
                      </span>
                    </span>
                    &nbsp;
                    <span className="date-time" data-utc="data">{getDate(reply.timestamp)}</span>
                    &nbsp;
                    <span className="post-number post-number-desktop">
                      <span >c/</span>
                      {reply.shortCid ? (
                        <Link to={() => {}} id="reply-button" 
                        title="Reply to this post">{reply.shortCid}</Link>
                      ) : (
                        <span key="pending" style={{color: 'red', fontWeight: '700'}}>Pending</span>
                      )}
                    </span>&nbsp;
                    <div id="backlink-id" className="backlink">
                      {reply.replies?.pages?.topAll.comments
                        .sort((a, b) => a.timestamp - b.timestamp)
                        .map((reply, index) => (
                          <div key={`div-${index}`} style={{display: 'inline-block'}}>
                          <Link key={`link-${index}`} to={() => {}} 
                            className="quote-link">
                            c/{reply.shortCid}</Link>
                            &nbsp;
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  {replyMediaInfo?.url ? (
                    <div className="file" 
                    style={{marginBottom: "5px"}}>
                      <div className="reply-file-text">
                        Link:&nbsp;
                        <a href={replyMediaInfo.url} target="_blank"
                        rel="noopener noreferrer">{
                        replyMediaInfo?.url.length > 30 ?
                        replyMediaInfo?.url.slice(0, 30) + "(...)" :
                        replyMediaInfo?.url
                        }</a>&nbsp;({replyMediaInfo?.type})
                      </div>
                      {replyMediaInfo?.type === "webpage" ? (
                        <div className="img-container">
                          <span className="file-thumb-reply">
                            {reply.thumbnailUrl ? (
                              <img 
                              src={replyMediaInfo.thumbnail} alt={replyMediaInfo.type}
                              style={{cursor: "pointer"}}
                              onError={(e) => e.target.src = fallbackImgUrl} />
                            ) : null}
                          </span>
                        </div>
                      ) : null}
                      {replyMediaInfo?.type === "image" ? (
                        <div className="img-container">
                          <span className="file-thumb-reply">
                            <img 
                            src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                            style={{cursor: "pointer"}}
                            onError={(e) => e.target.src = fallbackImgUrl} />
                          </span>
                        </div>
                      ) : null}
                      {replyMediaInfo?.type === "video" ? (
                        <span className="file-thumb-reply">
                          <video controls
                          
                          src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                          onError={(e) => e.target.src = fallbackImgUrl} />
                        </span>
                      ) : null}
                      {replyMediaInfo?.type === "audio" ? (
                        <span className="file-thumb-reply">
                          <audio controls 
                          
                          src={replyMediaInfo.url} alt={replyMediaInfo.type} 
                          onError={(e) => e.target.src = fallbackImgUrl} />
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {reply.content ? (
                    reply.content?.length > 500 ?
                    <Fragment >
                      <blockquote comment={reply} className="post-message">
                        <Link to={() => {}} className="quotelink">
                            {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                        </Link>
                        <Post content={reply.content?.slice(0, 500)} />
                        <span className="ttl"> (...)
                        <br /> <EditLabel 
                        commentCid={reply.cid}
                        className="ttl"/><br />
                        Comment too long. Click the link to view.</span>
                      </blockquote>
                    </Fragment>
                  : <blockquote className="post-message">
                      <Link to={() => {}} className="quotelink">
                          {`c/${shortParentCid}`}{shortParentCid === thread.shortCid ? " (OP)" : null}
                      </Link>
                      <Post content={reply.content} comment={reply} />
                      <EditLabel 
                        commentCid={reply.cid}
                        className="ttl"/>
                    </blockquote>)
                  : null}
                </div>
              </div>
              ) : (
              <div className="reply-container">
                <span className="ellipsis">{stateString}</span>
              </div>
            )}
          </div>
        </div>
      </BoardForm>
    </Container>
  );
}

export default PostOnHover;