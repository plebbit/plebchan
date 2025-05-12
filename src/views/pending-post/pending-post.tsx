import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccountComment, useAccountComments } from '@plebbit/plebbit-react-hooks';
import { Post } from '../post';

const PendingPost = () => {
  const { accountComments } = useAccountComments();
  const { accountCommentIndex } = useParams<{ accountCommentIndex?: string }>();
  const commentIndex = accountCommentIndex ? parseInt(accountCommentIndex) : undefined;
  const post = useAccountComment({ commentIndex });
  const navigate = useNavigate();

  useEffect(() => window.scrollTo(0, 0), []);

  const isValidAccountCommentIndex =
    !accountCommentIndex ||
    // Check if it's a valid positive integer
    (!isNaN(parseInt(accountCommentIndex)) &&
      parseInt(accountCommentIndex) >= 0 &&
      Number.isInteger(parseFloat(accountCommentIndex)) &&
      // Allow index to be at most 1 position beyond the current length
      // This handles the case where a new post is being created
      (accountComments?.length === 0 || parseInt(accountCommentIndex) <= accountComments.length));

  useEffect(() => {
    if (!isValidAccountCommentIndex) {
      navigate('/not-found', { replace: true });
    }
  }, [isValidAccountCommentIndex, navigate]);

  useEffect(() => {
    if (post?.cid && post?.subplebbitAddress) {
      navigate(`/p/${post?.subplebbitAddress}/c/${post?.cid}`, { replace: true });
    }
  }, [post, navigate]);

  return <Post post={post} />;
};

export default PendingPost;
