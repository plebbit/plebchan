import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Comment, Role, useComment, useEditedComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { useLocation, useParams } from 'react-router-dom';
import { isAllView, isDescriptionView, isRulesView, isSettingsView } from '../../lib/utils/view-utils';
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
  openReplyModal?: (parentCid: string, postCid: string, subplebbitAddress: string) => void;
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
  const isInAllView = isAllView(location.pathname);
  const isInSettigsView = isSettingsView(location.pathname, params);
  const isInDescriptionView = isDescriptionView(location.pathname, params);
  const isInRulesView = isRulesView(location.pathname, params);

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { createdAt, description, rules, shortAddress, suggested, title } = subplebbit;

  const { activeCid, threadCid, closeModal, openReplyModal, showReplyModal, scrollY, subplebbitAddress: postSubplebbitAddress } = useReplyModal();

  const comment = useComment({ commentCid });

  // if the comment is a reply, return the post comment instead, then the reply will be highlighted in the thread
  const postComment = useComment({ commentCid: comment?.postCid });
  let post: Comment;
  if (comment.parentCid) {
    post = postComment;
  } else {
    post = comment;
  }

  const { error, deleted, locked, removed, replyCount } = post || {};
  const isThreadClosed = deleted || locked || removed;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const boardTitle = title ? title : shortAddress || subplebbitAddress;
    const postTitle = post?.title?.slice(0, 30) || post?.content?.slice(0, 30);
    const postDucumentTitle = (postTitle ? postTitle.trim() + '... - ' : '') + boardTitle + ' - plebchan';
    document.title = isInAllView ? `${t('all')} - plebchan` : postDucumentTitle;
  }, [title, shortAddress, subplebbitAddress, post?.title, post?.content, isInAllView, t]);

  return (
    <div className={styles.content}>
      {isInSettigsView && <SettingsModal />}
      {activeCid && threadCid && postSubplebbitAddress && (
        <ReplyModal
          closeModal={closeModal}
          parentCid={activeCid}
          postCid={threadCid}
          scrollY={scrollY}
          showReplyModal={showReplyModal}
          subplebbitAddress={postSubplebbitAddress}
        />
      )}
      {/* TODO: remove this replyCount error once api supports scrolling replies pages */}
      {replyCount > 60 && <span className={styles.error}>Error: this thread has too many replies, some of them cannot be displayed right now.</span>}
      {error && <span className={styles.error}>Error: {error?.message || error?.toString?.()}</span>}
      {isInDescriptionView ? (
        <SubplebbitDescription
          avatarUrl={suggested?.avatarUrl}
          createdAt={createdAt}
          description={description}
          replyCount={location.pathname.startsWith('/p/all/') ? 0 : rules?.length > 0 ? 1 : 0}
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
