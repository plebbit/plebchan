import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './post.module.css';
import useReplies from '../../hooks/use-replies';
import { getLinkMediaInfoMemoized } from '../../lib/utils/media-utils';

const Post = ({ post }: Comment) => {
  const { author, content, link, title } = post || {};
  const { displayName, shortAddress } = author || {};
  const replies = useReplies(post);
  const linkMediaInfo = getLinkMediaInfoMemoized(link);
  return (
    <div className={styles.thread}>
      <div className={styles.postContainer}>
        <div className={styles.postDesktop}>
          <hr />
          {linkMediaInfo?.url && (
            <div className={styles.link}>
              Link:{' '}
              <a href={linkMediaInfo?.url} target='_blank' rel='noopener noreferrer'>
                {linkMediaInfo.url.length > 30 ? linkMediaInfo?.url.slice(0, 30) + '...' : linkMediaInfo?.url}
              </a>{' '}
              ({linkMediaInfo?.type})
            </div>
          )}
          <div className={styles.postInfo}>
            {title && <span className={styles.subject}>{title.length > 75 ? title.slice(0, 75) + '...' : title}</span>}{' '}
            <span className={styles.nameBlock}>
              <span className={styles.name}>{displayName || 'Anonymous'} </span>
              <span className={styles.userAddress}>(u/{shortAddress})</span>
            </span>
            <span className={styles.dateTime}></span>
          </div>
          <div className={styles.postMessage}></div>
        </div>
      </div>
    </div>
  );
};

export default Post;
