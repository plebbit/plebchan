import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Comment, Role, useComment, useEditedComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { useLocation, useParams } from 'react-router-dom';
import { isDescriptionView, isRulesView, isSettingsView } from '../../lib/utils/view-utils';
import useIsMobile from '../../hooks/use-is-mobile';
import useReplyModal from '../../hooks/use-reply-modal';
import PostDesktop from '../../components/post-desktop';
import PostMobile from '../../components/post-mobile';
import ReplyModal from '../../components/reply-modal';
import SettingsModal from '../../components/settings-modal';
import SubplebbitDescription from '../../components/subplebbit-description';
import SubplebbitRules from '../../components/subplebbit-rules';
import styles from './post.module.css';

export interface PostProps {
  index?: number;
  isHidden?: boolean;
  post?: any;
  postReplyCount?: number;
  reply?: any;
  roles?: Role[];
  showAllReplies?: boolean;
  showReplies?: boolean;
  openReplyModal?: (cid: string) => void;
}

export const Post = ({ post, showAllReplies = false, showReplies = true, openReplyModal }: PostProps) => {
  const subplebbit = useSubplebbit({ subplebbitAddress: post?.subplebbitAddress });
  const isMobile = useIsMobile();

  let comment = post;

  // handle pending mod or author edit
  const { editedComment } = useEditedComment({ comment });
  if (editedComment) {
    comment = editedComment;
  }

  return (
    <div className={styles.thread}>
      <div className={styles.postContainer}>
        {isMobile ? (
          <PostMobile post={comment} roles={subplebbit?.roles} showAllReplies={showAllReplies} showReplies={showReplies} openReplyModal={openReplyModal} />
        ) : (
          <PostDesktop post={comment} roles={subplebbit?.roles} showAllReplies={showAllReplies} showReplies={showReplies} openReplyModal={openReplyModal} />
        )}
      </div>
    </div>
  );
};

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

  const comment = useComment({ commentCid });

  // if the comment is a reply, return the post comment instead, then the reply will be highlighted in the thread
  const postComment = useComment({ commentCid: comment?.postCid });
  let post: Comment;
  if (comment.parentCid) {
    post = postComment;
  } else {
    post = comment;
  }

  const { deleted, locked, removed } = post || {};
  const isThreadClosed = deleted || locked || removed;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const boardTitle = title ? title : shortAddress || subplebbitAddress;
    const postTitle = post?.title?.slice(0, 30) || post?.content?.slice(0, 30);
    document.title = (postTitle ? postTitle.trim() + '... - ' : '') + boardTitle + ' - plebchan';
  }, [title, shortAddress, subplebbitAddress, post?.title, post?.content]);

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
