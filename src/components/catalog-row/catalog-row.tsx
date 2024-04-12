import styles from './catalog-row.module.css';
import { Comment } from '@plebbit/plebbit-react-hooks';

const CatalogPost = ({ post }: { post: Comment }) => {
  const { title, cid } = post || {};

  return <div className={styles.post}>{title || 'this is a post without a title'}</div>;
};

interface CatalogRowProps {
  description: any | undefined;
  index: number;
  rules: any | undefined;
  row: Comment[];
}

const CatalogRow = ({ description, index, row, rules }: CatalogRowProps) => {
  const rowPosts = index === 0 ? [...(rules?.content?.length > 0 ? [rules] : []), ...(description?.content?.length > 0 ? [description] : []), ...row] : row;

  const posts = rowPosts.map((post, index) => <CatalogPost key={index} post={post} />);

  return <div className={styles.row}>{posts}</div>;
};

export default CatalogRow;
