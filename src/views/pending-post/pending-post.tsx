import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAccountComment } from '@plebbit/plebbit-react-hooks';
import { isSettingsView } from '../../lib/utils/view-utils';
import { Post } from '../post';
import SettingsModal from '../../components/settings-modal';

const PendingPost = () => {
  const { accountCommentIndex } = useParams<{ accountCommentIndex?: string }>();
  const commentIndex = accountCommentIndex ? parseInt(accountCommentIndex) : undefined;
  const post = useAccountComment({ commentIndex });
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const isInSettingsView = isSettingsView(location.pathname, params);

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    if (post?.cid && post?.subplebbitAddress) {
      navigate(`/p/${post?.subplebbitAddress}/c/${post?.cid}`, { replace: true });
    }
  }, [post, navigate]);

  return (
    <>
      {isInSettingsView && <SettingsModal />}
      <Post post={post} showReplies={false} />;
    </>
  );
};

export default PendingPost;
