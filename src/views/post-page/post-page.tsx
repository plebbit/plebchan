import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { useLocation, useParams } from 'react-router-dom';
import styles from './post-page.module.css';
import { isDescriptionView, isRulesView } from '../../lib/utils/view-utils';
import useReplyModal from '../../hooks/use-reply-modal';
import Post from '../../components/post';
import ReplyModal from '../../components/reply-modal';
import SubplebbitDescription from '../../components/subplebbit-description';
import SubplebbitRules from '../../components/subplebbit-rules';

const PostPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const { commentCid, subplebbitAddress } = params;

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { createdAt, description, rules, shortAddress, suggested, title } = subplebbit;

  const location = useLocation();
  const isInDescriptionView = isDescriptionView(location.pathname, params);
  const isInRulesView = isRulesView(location.pathname, params);

  const { showReplyModal, activeCid, openReplyModal, closeModal } = useReplyModal();

  const post = useComment({ commentCid });
  const { deleted, locked, removed } = post || {};
  const isThreadClosed = deleted || locked || removed;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.content}>
      {showReplyModal && activeCid && <ReplyModal closeModal={closeModal} parentCid={activeCid} />}
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
