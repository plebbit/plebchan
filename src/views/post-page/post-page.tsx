import { useEffect } from 'react';
import { useComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { useLocation, useParams } from 'react-router-dom';
import { isDescriptionView, isRulesView } from '../../lib/utils/view-utils';
import styles from './post-page.module.css';
import Post from '../../components/post';
import SubplebbitDescription from '../../components/subplebbit-description';
import SubplebbitRules from '../../components/subplebbit-rules';

const PostPage = () => {
  const params = useParams();
  const { commentCid, subplebbitAddress } = params;

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { createdAt, description, rules, suggested, title } = subplebbit;

  const location = useLocation();
  const isInDescriptionView = isDescriptionView(location.pathname, params);
  const isInRulesView = isRulesView(location.pathname, params);

  const post = useComment({ commentCid });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.content}>
      {isInDescriptionView ? (
        <SubplebbitDescription avatarUrl={suggested?.avatarUrl} createdAt={createdAt} description={description} subplebbitAddress={subplebbitAddress} title={title} />
      ) : isInRulesView ? (
        <SubplebbitRules createdAt={createdAt} rules={rules} subplebbitAddress={subplebbitAddress} />
      ) : (
        <Post post={post} showAllReplies={true} />
      )}
    </div>
  );
};

export default PostPage;
