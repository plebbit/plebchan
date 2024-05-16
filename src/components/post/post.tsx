import { useLocation, useParams } from 'react-router-dom';
import { Role, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { isPendingPostView, isPostPageView } from '../../lib/utils/view-utils';
import useWindowWidth from '../../hooks/use-window-width';
import styles from './post.module.css';
import PostDesktop from './post-desktop';
import PostMobile from './post-mobile';

export interface PostProps {
  index?: number;
  isInPostPage?: boolean;
  isPendingPostPage?: boolean;
  post?: any;
  reply?: any;
  roles?: Role[];
  showAllReplies?: boolean;
  openReplyModal?: (cid: string) => void;
}

const Post = ({ post, showAllReplies = false, openReplyModal }: PostProps) => {
  const subplebbit = useSubplebbit({ subplebbitAddress: post?.subplebbitAddress });
  const isMobile = useWindowWidth() < 640;

  const params = useParams();
  const location = useLocation();
  const isInPostPage = isPostPageView(location.pathname, params);
  const isPendingPostPage = isPendingPostView(location.pathname, params);

  return (
    <div className={styles.thread}>
      <div className={styles.postContainer}>
        {isMobile ? (
          <PostMobile
            isInPostPage={isInPostPage}
            isPendingPostPage={isPendingPostPage}
            post={post}
            roles={subplebbit?.roles}
            showAllReplies={showAllReplies}
            openReplyModal={openReplyModal}
          />
        ) : (
          <PostDesktop
            isInPostPage={isInPostPage}
            isPendingPostPage={isPendingPostPage}
            post={post}
            roles={subplebbit?.roles}
            showAllReplies={showAllReplies}
            openReplyModal={openReplyModal}
          />
        )}
      </div>
    </div>
  );
};

export default Post;
