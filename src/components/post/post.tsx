import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Comment } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { getCommentMediaInfoMemoized, getHasThumbnail } from '../../lib/utils/media-utils';
import { getFormattedDate } from '../../lib/utils/time-utils';
import { isPostPageView } from '../../lib/utils/view-utils';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useReplies from '../../hooks/use-replies';
import styles from './post.module.css';
import Markdown from '../markdown';
import Media from '../media';

const ReplyDesktop = ({ reply }: Comment) => {
  const { t } = useTranslation();
  const { author, content, link, linkHeight, linkWidth, parentCid, pinned, postCid, shortCid, subplebbitAddress, timestamp } = reply || {};
  const { displayName, shortAddress } = author || {};

  const commentMediaInfo = getCommentMediaInfoMemoized(reply);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const isReplyingToReply = postCid !== parentCid;

  return (
    <div className={styles.replyDesktop}>
      <div className={styles.sideArrows}>{'>>'}</div>
      <div className={styles.reply}>
        <div className={styles.postInfo}>
          <span className={styles.checkbox}>
            <input type='checkbox' />
          </span>
          <span className={styles.nameBlock}>
            <span className={styles.name}>{displayName || 'Anonymous'} </span>
            <span className={styles.userAddress}>(u/{shortAddress}) </span>
          </span>
          <span className={styles.dateTime}>{getFormattedDate(timestamp)} </span>
          <span className={styles.postNum}>
            <span className={styles.postNumLink}>
              <Link to={`/p/${subplebbitAddress}/c/${reply.cid}`} className={styles.linkToPost} title='Link to post'>
                c/
              </Link>
              <span className={styles.replyToPost} title='Reply to post'>
                {shortCid}
              </span>
            </span>
            {pinned && (
              <span className={styles.stickyIconWrapper}>
                <img src='assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
              </span>
            )}
          </span>
          <span className={styles.postMenuBtn}>▶</span>
        </div>
        {link && (
          <div className={styles.file}>
            <div className={styles.fileText}>
              {t('link')}:{' '}
              <a href={link} target='_blank' rel='noopener noreferrer'>
                {link.length > 30 ? link?.slice(0, 30) + '...' : link}
              </a>
              {!showThumbnail && (commentMediaInfo?.type === 'iframe' || commentMediaInfo?.type === 'video') && (
                <span>
                  {' '}
                  [
                  <span className={styles.closeMedia} onClick={() => setShowThumbnail(true)}>
                    {t('close')}
                  </span>
                  ]
                </span>
              )}
            </div>
            {hasThumbnail && (
              <Media
                commentMediaInfo={commentMediaInfo}
                isMobile={false}
                isReply={true}
                linkHeight={linkHeight}
                linkWidth={linkWidth}
                showThumbnail={showThumbnail}
                setShowThumbnail={setShowThumbnail}
              />
            )}
          </div>
        )}
        {content && (
          <blockquote className={styles.postMessage}>
            {isReplyingToReply && (
              <>
                <Link to={`/p/${subplebbitAddress}/c/${parentCid}`} className={styles.quoteLink}>
                  {`c/${Plebbit.getShortCid(parentCid)}`}
                </Link>
                <br />
              </>
            )}
            <Markdown content={content} />
          </blockquote>
        )}
      </div>
    </div>
  );
};

const PostDesktop = ({ post, showAllReplies }: { post: Comment; showAllReplies: boolean }) => {
  const { t } = useTranslation();
  const { author, cid, content, link, linkHeight, linkWidth, locked, pinned, postCid, replyCount, shortCid, subplebbitAddress, timestamp, title } = post || {};
  const { displayName, shortAddress } = author || {};

  const isInPostPage = isPostPageView(useLocation().pathname, useParams());

  const displayTitle = title && title.length > 75 ? title?.slice(0, 75) + '...' : title;
  const displayContent = content && !isInPostPage && content.length > 1000 ? content?.slice(0, 1000) + '(...)' : content;

  const commentMediaInfo = getCommentMediaInfoMemoized(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const replies = useReplies(post);
  const visibleLinkCount = useCountLinksInReplies(post, 5);
  const totalLinkCount = useCountLinksInReplies(post);
  const repliesCount = pinned ? replyCount : replyCount - 5;
  const linkCount = pinned ? totalLinkCount : totalLinkCount - visibleLinkCount;

  return (
    <div className={styles.postDesktop}>
      <div className={styles.hrWrapper}>
        <hr />
      </div>
      {!isInPostPage && (
        <span className={styles.hideButtonWrapper}>
          <span className={`${styles.hideButton} ${styles.hideThread}`} />
        </span>
      )}
      {commentMediaInfo?.url && (
        <div className={styles.file}>
          <div className={styles.fileText}>
            {t('link')}:{' '}
            <a href={commentMediaInfo?.url} target='_blank' rel='noopener noreferrer'>
              {commentMediaInfo.url.length > 30 ? commentMediaInfo?.url?.slice(0, 30) + '...' : commentMediaInfo?.url}
            </a>{' '}
            ({commentMediaInfo?.type})
            {!showThumbnail && (commentMediaInfo?.type === 'iframe' || commentMediaInfo?.type === 'video') && (
              <span>
                {' '}
                [
                <span className={styles.closeMedia} onClick={() => setShowThumbnail(true)}>
                  {t('close')}
                </span>
                ]
              </span>
            )}
          </div>
          {hasThumbnail && (
            <Media
              commentMediaInfo={commentMediaInfo}
              isMobile={false}
              isReply={false}
              linkHeight={linkHeight}
              linkWidth={linkWidth}
              showThumbnail={showThumbnail}
              setShowThumbnail={setShowThumbnail}
            />
          )}
        </div>
      )}
      <div className={styles.postInfo}>
        <span className={styles.checkbox}>
          <input type='checkbox' />
        </span>
        {title && <span className={styles.subject}>{displayTitle} </span>}
        <span className={styles.nameBlock}>
          <span className={styles.name}>{displayName || 'Anonymous'} </span>
          <span className={styles.userAddress}>(u/{shortAddress}) </span>
        </span>
        <span className={styles.dateTime}>{getFormattedDate(timestamp)} </span>
        <span className={styles.postNum}>
          <span className={styles.postNumLink}>
            <Link to={`/p/${subplebbitAddress}/c/${cid}`} className={styles.linkToPost} title={t('link_to_post')}>
              c/
            </Link>
            <span className={styles.replyToPost} title={t('reply_to_post')}>
              {shortCid}
            </span>
          </span>
          {pinned && (
            <span className={styles.stickyIconWrapper}>
              <img src='assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
            </span>
          )}
          {locked && (
            <span className={styles.closedIconWrapper}>
              <img src='assets/icons/closed.gif' alt='' className={styles.closedIcon} title={t('closed')} />
            </span>
          )}
          <span className={styles.replyButton}>
            [<Link to={`/p/${subplebbitAddress}/c/${postCid}`}>{t('reply')}</Link>]
          </span>
        </span>
        <span className={styles.postMenuBtn}>▶</span>
      </div>
      {!content && <div className={styles.spacer} />}
      {content && (
        <blockquote className={styles.postMessage}>
          <Markdown content={displayContent} />
          {content.length > 1000 && !isInPostPage && (
            <span className={styles.abbr}>
              <br />
              Comment too long. <Link to={`/p/${subplebbitAddress}/c/${cid}`}>Click here</Link> to view the full text.
            </span>
          )}
        </blockquote>
      )}
      {(replies.length > 5 || pinned) && !isInPostPage && (
        <span className={styles.summary}>
          <span className={styles.expandButtonWrapper}>
            <span className={styles.expandButton} />
          </span>
          <span>
            {repliesCount} replies {linkCount > 0 && `and ${linkCount} links`} omitted.{' '}
          </span>
          <Link to={`/p/${subplebbitAddress}/c/${cid}`}>Click here</Link> to view.
        </span>
      )}
      {!(pinned && !isInPostPage) &&
        replies &&
        replies.slice(0, showAllReplies ? replies.length : 5).map((reply, index) => (
          <div key={reply.cid} className={styles.replyContainer}>
            <ReplyDesktop index={index} reply={reply} />
          </div>
        ))}
    </div>
  );
};

const ReplyMobile = ({ reply }: Comment) => {
  const { author, content, link, linkHeight, linkWidth, parentCid, pinned, postCid, shortCid, subplebbitAddress, timestamp } = reply || {};
  const { displayName, shortAddress } = author || {};

  const commentMediaInfo = getCommentMediaInfoMemoized(reply);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const isReplyingToReply = postCid !== parentCid;

  return (
    <div className={styles.replyMobile}>
      <div className={styles.reply}>
        <div className={styles.replyContainer}>
          <div className={styles.postInfo}>
            <span className={styles.postMenuBtn}>...</span>
            <span className={styles.nameBlock}>
              <span className={styles.name}>{displayName || 'Anonymous'} </span>
              <span className={styles.address}>(u/{shortAddress})</span>
            </span>
            <span className={styles.dateTimePostNum}>
              {getFormattedDate(timestamp)} <span className={styles.linkToPost}>c/</span>
              <span className={styles.replyToPost}>{shortCid}</span>
            </span>
          </div>
          {hasThumbnail && (
            <Media
              commentMediaInfo={commentMediaInfo}
              isMobile={true}
              isReply={false}
              linkHeight={linkHeight}
              linkWidth={linkWidth}
              showThumbnail={showThumbnail}
              setShowThumbnail={setShowThumbnail}
            />
          )}
          {content && (
            <blockquote className={styles.postMessage}>
              {isReplyingToReply && (
                <>
                  <Link to={`/p/${subplebbitAddress}/c/${parentCid}`} className={styles.quoteLink}>
                    {`c/${Plebbit.getShortCid(parentCid)}`}
                  </Link>
                  <br />
                </>
              )}
              <Markdown content={content} />
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
};

const PostMobile = ({ post, showAllReplies }: { post: Comment; showAllReplies: boolean }) => {
  const { t } = useTranslation();
  const { author, cid, content, link, linkHeight, linkWidth, pinned, replyCount, shortCid, subplebbitAddress, timestamp, title } = post || {};
  const { address, displayName, shortAddress } = author || {};

  const linkCount = useCountLinksInReplies(post);
  const isInPostPage = isPostPageView(useLocation().pathname, useParams());
  const displayTitle = title && title.length > 30 ? title?.slice(0, 30) + '(...)' : title;
  const displayContent = content && !isInPostPage && content.length > 1000 ? content?.slice(0, 1000) : content;

  const commentMediaInfo = getCommentMediaInfoMemoized(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const replies = useReplies(post);

  return (
    <div className={styles.postMobile}>
      <div className={styles.hrWrapper}>
        <hr />
      </div>
      <div className={styles.thread}>
        <div className={styles.postContainer}>
          <div className={styles.postOp}>
            <div className={styles.postInfo}>
              <span className={styles.postMenuBtn} title='Post menu'>
                ...
              </span>
              <span className={styles.nameBlock}>
                <span className={styles.name}>{displayName || 'Anonymous'} </span>
                <span className={styles.address}>(u/{shortAddress || address?.slice(0, 12) + '...'})</span>
                {title && (
                  <>
                    <br />
                    <span className={styles.subject}>{displayTitle}</span>
                  </>
                )}
              </span>
              <span className={styles.dateTimePostNum}>
                {getFormattedDate(timestamp)} <span className={styles.linkToPost}>c/</span>
                <span className={styles.replyToPost}>{shortCid}</span>
              </span>
            </div>
            {hasThumbnail && (
              <Media
                commentMediaInfo={commentMediaInfo}
                isMobile={true}
                isReply={false}
                linkHeight={linkHeight}
                linkWidth={linkWidth}
                showThumbnail={showThumbnail}
                setShowThumbnail={setShowThumbnail}
              />
            )}
            {content && (
              <blockquote className={`${styles.postMessage} ${styles.clampLines}`}>
                <Markdown content={displayContent} />
                {content.length > 1000 && !isInPostPage && (
                  <span className={styles.abbr}>
                    <br />
                    Comment too long. <Link to={`/p/${subplebbitAddress}/c/${cid}`}>Click here</Link> to view the full text.
                  </span>
                )}
              </blockquote>
            )}
          </div>
          {!isInPostPage && (
            <div className={styles.postLink}>
              <span className={styles.info}>
                {replyCount} Replies
                {linkCount > 0 && ` / ${linkCount} Links`}
              </span>
              <Link to={`/p/${subplebbitAddress}/c/${cid}`} className='button'>
                {t('view_thread')}
              </Link>
            </div>
          )}
        </div>
        {!(pinned && !isInPostPage) &&
          replies &&
          replies.slice(0, showAllReplies ? replies.length : 5).map((reply, index) => (
            <div key={reply.cid} className={styles.replyContainer}>
              <ReplyMobile index={index} reply={reply} />
            </div>
          ))}
      </div>
    </div>
  );
};

interface PostProps {
  index?: number;
  post: Comment;
  showAllReplies?: boolean;
}

const Post = ({ post, showAllReplies = false }: PostProps) => {
  return (
    <div className={styles.thread}>
      <div className={styles.postContainer}>
        <PostDesktop post={post} showAllReplies={showAllReplies} />
        <PostMobile post={post} showAllReplies={showAllReplies} />
      </div>
    </div>
  );
};

export default Post;
