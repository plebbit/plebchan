import { useState } from 'react';
import styles from './post-form.module.css';
import { useTranslation } from 'react-i18next';

export interface PostFormProps {
  address: string | undefined;
}

const PostForm = ({ address }: PostFormProps) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className={styles.postFormButtonDesktop}>
        [
        <button className='button' onClick={() => setShowForm(true)}>
          {t('start_new_thread')}
        </button>
        ]
      </div>
      <div className={styles.postFormButtonMobile}>
        <button className='button' onClick={() => setShowForm(!showForm)}>
          {showForm ? t('close_post_form') : t('start_new_thread')}
        </button>
      </div>
    </>
  );
};

export default PostForm;
