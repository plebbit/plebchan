import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Comment } from '@plebbit/plebbit-react-hooks';
import { getCommentMediaInfoMemoized, getHasThumbnail } from '../../lib/utils/media-utils';
import { getFormattedDate } from '../../lib/utils/time-utils';
import useReplies from '../../hooks/use-replies';
import styles from './post.module.css';
import Markdown from '../markdown';
import { Thumbnail } from '../media';

import { countLinksInCommentReplies } from '../../lib/utils/comment-utils';

const ReplyDesktop = ({ index, reply }: { index: number; reply: Comment }) => {
  const { t } = useTranslation();
  const { author, content, link, linkHeight, linkWidth, pinned, shortCid, subplebbitAddress, timestamp } = reply || {};
  const { displayName, shortAddress } = author || {};

  return (
    index < 5 && (
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
          {content && (
            <blockquote className={styles.postMessage}>
              <Markdown content={content} />
            </blockquote>
          )}
        </div>
      </div>
    )
  );
};

const PostDesktop = ({ post }: Comment) => {
  const { t } = useTranslation();
  const { author, cid, content, link, linkHeight, linkWidth, locked, pinned, postCid, shortCid, subplebbitAddress, timestamp, title } = post || {};
  const { displayName, shortAddress } = author || {};
  const displayTitle = title && title.length > 75 ? title.slice(0, 75) + '...' : title;
  const displayContent = content && content.length > 1000 ? content.slice(0, 1000) + '(...)' : content;

  const commentMediaInfo = getCommentMediaInfoMemoized(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);

  const replies = useReplies(post);

  return (
    <div className={styles.postDesktop}>
      <div className={styles.hrWrapper}>
        <hr />
      </div>
      <span className={styles.threadHideButtonWrapper}>
        <span className={`${styles.threadHideButton} ${styles.hideThread}`} />
      </span>
      {commentMediaInfo?.url && (
        <div className={styles.file}>
          <div className={styles.fileText}>
            {t('link')}:{' '}
            <a href={commentMediaInfo?.url} target='_blank' rel='noopener noreferrer'>
              {commentMediaInfo.url.length > 30 ? commentMediaInfo?.url.slice(0, 30) + '...' : commentMediaInfo?.url}
            </a>{' '}
            ({commentMediaInfo?.type})
          </div>
          {hasThumbnail && (
            <span className={styles.fileThumb}>
              <Thumbnail commentMediaInfo={commentMediaInfo} isMobile={false} isReply={false} linkHeight={linkHeight} linkWidth={linkWidth} />
            </span>
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
      {content && (
        <blockquote className={styles.postMessage}>
          <Markdown content={displayContent} />
          {content.length > 1000 && (
            <span className={styles.abbr}>
              <br />
              Comment too long. <Link to={`/p/${subplebbitAddress}/c/${cid}`}>Click here</Link> to view the full text.
            </span>
          )}
        </blockquote>
      )}
      {!pinned &&
        replies.map((reply, index) => (
          <div key={reply.cid} className={styles.replyContainer}>
            <ReplyDesktop index={index} reply={reply} />
          </div>
        ))}
    </div>
  );
};

const PostMobile = ({ post }: Comment) => {
  const { author, cid, content, link, linkHeight, linkWidth, replyCount, shortCid, subplebbitAddress, timestamp, title } = post || {};
  const { address, displayName, shortAddress } = author || {};
  const linkCount = countLinksInCommentReplies(post);
  const displayTitle = title && title.length > 30 ? title.slice(0, 30) + '(...)' : title;
  const displayContent = content && content.length > 1000 ? content.slice(0, 1000) : content;

  const commentMediaInfo = getCommentMediaInfoMemoized(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);

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
                <span className={styles.address}>(u/{shortAddress || address.slice(0, 12) + '...'})</span>
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
              <span className={styles.fileThumb}>
                <Thumbnail commentMediaInfo={commentMediaInfo} isMobile={true} isReply={false} linkHeight={linkHeight} linkWidth={linkWidth} />
                {commentMediaInfo?.type && <div className={styles.fileInfo}>{commentMediaInfo.type}</div>}
              </span>
            )}
            {content && (
              <blockquote className={`${styles.postMessage} ${styles.clampLines}`}>
                <Markdown content={displayContent} />
                {content.length > 1000 && (
                  <span className={styles.abbr}>
                    <br />
                    Comment too long. <Link to={`/p/${subplebbitAddress}/c/${cid}`}>Click here</Link> to view the full text.
                  </span>
                )}
              </blockquote>
            )}
          </div>
          <div className={styles.postLink}>
            <span className={styles.info}>
              {replyCount} Replies
              {linkCount > 0 && ` / ${linkCount} Links`}
            </span>
            <Link to={`/p/${subplebbitAddress}/c/${cid}`} className='button'>
              View Thread
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Post = ({ post }: Comment) => {
  return (
    <div className={styles.thread}>
      <div className={styles.postContainer}>
        <PostDesktop post={post} />
        <PostMobile post={post} />
      </div>
    </div>
  );
};

export default Post;
