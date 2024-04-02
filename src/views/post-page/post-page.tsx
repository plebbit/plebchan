import { useComment } from '@plebbit/plebbit-react-hooks';
import { useParams } from 'react-router-dom';
import Post from '../../components/post/post';
import styles from './post-page.module.css';

const PostPage = () => {
  const params = useParams();
  const { commentCid } = params;

  const post = useComment({ commentCid });

  return (
    <div className={styles.content}>
      <Post post={post} showAllReplies={true} />
    </div>
  );
};

export default PostPage;
