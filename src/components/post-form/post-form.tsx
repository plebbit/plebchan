import styles from './post-form.module.css';
import { useTranslation } from 'react-i18next';

export interface PostFormProps {
  address: string | undefined;
}

const PostForm = ({ address }: PostFormProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.togglePostForm}>
      [<span>{t('start_new_thread')}</span>]
    </div>
  );
};

export default PostForm;
