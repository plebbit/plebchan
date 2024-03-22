import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './post.module.css';

const Post = ({ post }: Comment) => {
  const { content, link, title } = post;
  return (
    <div>
      <hr />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export default Post;
