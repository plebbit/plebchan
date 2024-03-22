import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './post.module.css';
import useReplies from '../../hooks/use-replies';
import { getLinkMediaInfoMemoized } from '../../lib/utils/media-utils';

const Post = ({ post }: Comment) => {
  const { content, link, title } = post;
  const replies = useReplies(post);
  const linkMediaInfo = getLinkMediaInfoMemoized(link);
  return (
    <div className={styles.thread}>
      <hr />
      <div className={styles.postContainer}>
        <div className={styles.postDesktop}>
          {linkMediaInfo?.url && (
            <div className={styles.link}>
              Link:{' '}
              <a href={linkMediaInfo?.url} target='_blank' rel='noopener noreferrer'>
                {linkMediaInfo.url.length > 30 ? linkMediaInfo?.url.slice(0, 30) + '...' : linkMediaInfo?.url}
              </a>{' '}
              ({linkMediaInfo?.type})
            </div>
          )}
          <div className={styles.postInfo}></div>
          <div className={styles.postMessage}></div>
        </div>
      </div>
    </div>
  );
};

export default Post;
