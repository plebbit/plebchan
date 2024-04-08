import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useComment } from '@plebbit/plebbit-react-hooks';
import { isDescriptionView, isPostPageView, isRulesView } from '../../lib/utils/view-utils';
import styles from './post-form.module.css';

const PostForm = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const params = useParams();
  const isInPostPage = isPostPageView(location.pathname, params);
  const isInDescriptionView = isDescriptionView(location.pathname, params);
  const isInRulesView = isRulesView(location.pathname, params);

  const { subplebbitAddress, commentCid } = params || {};

  const comment = useComment({ commentCid });
  const { deleted, locked, removed } = comment || {};
  const isThreadClosed = deleted || locked || removed || isInDescriptionView || isInRulesView;

  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className={styles.postFormButtonDesktop}>
        {isThreadClosed ? (
          <div className={styles.closed}>
            {t('thread_closed')}
            <br />
            {t('may_not_reply')}
          </div>
        ) : (
          <div>
            [
            <button className='button' onClick={() => setShowForm(true)}>
              {isInPostPage ? t('post_a_reply') : t('start_new_thread')}
            </button>
            ]
          </div>
        )}
      </div>
      <div className={styles.postFormButtonMobile}>
        {isThreadClosed ? (
          <div className={styles.closed}>
            Thread closed.
            <br />
            You may not reply at this time.
          </div>
        ) : (
          <button className='button' onClick={() => setShowForm(true)}>
            {isInPostPage ? t('post_a_reply') : t('start_new_thread')}
          </button>
        )}
      </div>
    </>
  );
};

export default PostForm;
