import { Role, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import useWindowWidth from '../../hooks/use-window-width';
import styles from './post.module.css';
import PostDesktop from './post-desktop';
import PostMobile from './post-mobile';

export interface PostProps {
  index?: number;
  post?: any;
  reply?: any;
  roles?: Role[];
  showAllReplies?: boolean;
  openReplyModal?: (cid: string) => void;
}

const Post = ({ post, showAllReplies = false, openReplyModal }: PostProps) => {
  const subplebbit = useSubplebbit({ subplebbitAddress: post?.subplebbitAddress });
  const isMobile = useWindowWidth() < 640;

  return (
    <div className={styles.thread}>
      <div className={styles.postContainer}>
        {isMobile ? (
          <PostMobile post={post} roles={subplebbit?.roles} showAllReplies={showAllReplies} openReplyModal={openReplyModal} />
        ) : (
          <PostDesktop post={post} roles={subplebbit?.roles} showAllReplies={showAllReplies} openReplyModal={openReplyModal} />
        )}
      </div>
    </div>
  );
};

export default Post;
