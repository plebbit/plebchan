import styles from './post-form.module.css';
import { useTranslation } from 'react-i18next';

const PostForm = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.togglePostForm}>
      [<span>{t('start_new_thread')}</span>]
    </div>
  );
};

export default PostForm;
