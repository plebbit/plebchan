import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './post-form.module.css';
import { isPostPageView } from '../../lib/utils/view-utils';
import { useLocation, useParams } from 'react-router-dom';

export interface PostFormProps {
  address: string | undefined;
}

const PostForm = ({ address }: PostFormProps) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const isInPostPage = isPostPageView(useLocation().pathname, useParams());

  return (
    <>
      <div className={styles.postFormButtonDesktop}>
        [
        <button className='button' onClick={() => setShowForm(true)}>
          {isInPostPage ? t('post_a_reply') : t('start_new_thread')}
        </button>
        ]
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
