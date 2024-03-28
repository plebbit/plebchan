import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './post.module.css';
import useReplies from '../../hooks/use-replies';
import { getLinkMediaInfoMemoized } from '../../lib/utils/media-utils';
import { getFormattedDate } from '../../lib/utils/time-utils';
import Markdown from '../markdown';
import { countLinksInCommentReplies } from '../../lib/utils/comment-utils';

const PostDesktop = ({ post }: Comment) => {
  const { t } = useTranslation();
  const { author, cid, content, link, locked, pinned, postCid, shortCid, subplebbitAddress, timestamp, title } = post || {};
  const { displayName, shortAddress } = author || {};
  const replies = useReplies(post);
  const linkMediaInfo = getLinkMediaInfoMemoized(link);
  const displayTitle = title && title.length > 75 ? title.slice(0, 75) + '...' : title;

  return (
    <div className={styles.postDesktop}>
      <div className={styles.hrWrapper}>
        <hr />
      </div>
      {linkMediaInfo?.url && (
        <div className={styles.link}>
          {t('link')}:{' '}
          <a href={linkMediaInfo?.url} target='_blank' rel='noopener noreferrer'>
            {linkMediaInfo.url.length > 30 ? linkMediaInfo?.url.slice(0, 30) + '...' : linkMediaInfo?.url}
          </a>{' '}
          ({linkMediaInfo?.type})
        </div>
      )}
      <div className={styles.postInfo}>
        {title && <span className={styles.subject}>{displayTitle}</span>}{' '}
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
        <div className={styles.postMessage}>
          <blockquote>
            <Markdown content={content} />
          </blockquote>
        </div>
      )}
    </div>
  );
};

const PostMobile = ({ post }: Comment) => {
  const { author, cid, content, replyCount, shortCid, subplebbitAddress, timestamp, title } = post || {};
  const { address, displayName, shortAddress } = author || {};
  const linkCount = countLinksInCommentReplies(post);
  const displayTitle = title && title.length > 30 ? title.slice(0, 30) + '(...)' : title;

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
            <blockquote className={styles.postMessage}>
              <Markdown content={content} />
            </blockquote>
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
