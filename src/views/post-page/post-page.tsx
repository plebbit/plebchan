import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Comment, useComment, useEditedComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { useLocation, useParams } from 'react-router-dom';
import styles from './post-page.module.css';
import { isDescriptionView, isRulesView, isSettingsView } from '../../lib/utils/view-utils';
import useReplyModal from '../../hooks/use-reply-modal';
import Post from '../../components/post';
import ReplyModal from '../../components/reply-modal';
import SettingsModal from '../../components/settings-modal';
import SubplebbitDescription from '../../components/subplebbit-description';
import SubplebbitRules from '../../components/subplebbit-rules';

const PostPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const location = useLocation();
  const { commentCid, subplebbitAddress } = params;
  const isInSettigsView = isSettingsView(location.pathname, params);
  const isInDescriptionView = isDescriptionView(location.pathname, params);
  const isInRulesView = isRulesView(location.pathname, params);

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { createdAt, description, rules, shortAddress, suggested, title } = subplebbit;

  const { activeCid, closeModal, openReplyModal, showReplyModal, scrollY } = useReplyModal();

  const comment: Comment = useComment({ commentCid });
  // if the comment is a reply, get the parent comment
  const postComment = useComment({ commentCid: comment?.postCid });
  let post;
  if (comment.parentCid) {
    post = postComment;
  } else {
    post = comment;
  }
  // handle pending mod or author edit
  const { editedComment } = useEditedComment({ comment: post });
  if (editedComment) {
    post = editedComment;
  }

  const { deleted, locked, removed } = post || {};
  const isThreadClosed = deleted || locked || removed;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.content}>
      {isInSettigsView && <SettingsModal />}
      {showReplyModal && activeCid && <ReplyModal closeModal={closeModal} parentCid={activeCid} scrollY={scrollY} />}
      {isInDescriptionView ? (
        <SubplebbitDescription
          avatarUrl={suggested?.avatarUrl}
          createdAt={createdAt}
          description={description}
          subplebbitAddress={subplebbitAddress}
          shortAddress={shortAddress}
          title={title}
        />
      ) : isInRulesView ? (
        <SubplebbitRules createdAt={createdAt} rules={rules} subplebbitAddress={subplebbitAddress} />
      ) : (
        <Post post={post} showAllReplies={true} openReplyModal={isThreadClosed ? () => alert(t('thread_closed_alert')) : openReplyModal} />
      )}
    </div>
  );
};

export default PostPage;
