import styles from './post-form.module.css';
import { useTranslation } from 'react-i18next';

export interface PostFormProps {
  address: string | undefined;
}

const PostForm = ({ address }: PostFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.postFormButtonDesktop}>
        [<button className='button'>{t('start_new_thread')}</button>]
      </div>
      <div className={styles.postFormButtonMobile}>
        <button className='button'>{t('start_new_thread')}</button>
      </div>
    </>
  );
};

export default PostForm;
