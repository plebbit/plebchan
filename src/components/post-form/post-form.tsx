import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useComment } from '@plebbit/plebbit-react-hooks';
import { isPostPageView } from '../../lib/utils/view-utils';
import styles from './post-form.module.css';

const PostForm = () => {
  const { t } = useTranslation();
  const { subplebbitAddress, commentCid } = useParams<{ subplebbitAddress: string; commentCid: string }>();

  const comment = useComment({ commentCid });
  const { deleted, locked, removed } = comment || {};
  const isThreadClosed = deleted || locked || removed;

  const [showForm, setShowForm] = useState(false);
  const isInPostPage = isPostPageView(useLocation().pathname, useParams());

  return (
    <>
      <div className={styles.postFormButtonDesktop}>
        {isThreadClosed ? (
          <div className={styles.closed}>
            Thread closed.
            <br />
            You may not reply at this time.
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
        <button className='button' onClick={() => setShowForm(!showForm)}>
          {showForm ? t('close_post_form') : isInPostPage ? t('post_a_reply') : t('start_new_thread')}
        </button>
      </div>
    </>
  );
};

export default PostForm;
