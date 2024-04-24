import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useAccount, useComment } from '@plebbit/plebbit-react-hooks';
import { getLinkMediaInfo } from '../../lib/utils/media-utils';
import { isValidURL } from '../../lib/utils/url-utils';
import { isDescriptionView, isPostPageView, isRulesView } from '../../lib/utils/view-utils';
import styles from './post-form.module.css';

const LinkTypePreviewer = ({ link }: { link: string }) => {
  const mediaInfo = getLinkMediaInfo(link);
  return isValidURL(link) ? mediaInfo?.type : 'Invalid URL';
};

const PostFormTable = () => {
  const account = useAccount();
  const { displayName } = account || {};

  const [link, setLink] = useState('');

  return (
    <table className={styles.postFormTable}>
      <tbody>
        <tr>
          <td>Name</td>
          <td>
            <input type='text' placeholder={!displayName ? 'Anonymous' : undefined} defaultValue={displayName || undefined} />
          </td>
        </tr>
        <tr>
          <td>Subject</td>
          <td>
            <input type='text' />
            <button>Post</button>
          </td>
        </tr>
        <tr>
          <td>Comment</td>
          <td>
            <textarea cols={48} rows={4} wrap='soft' />
          </td>
        </tr>
        <tr>
          <td>Link</td>
          <td>
            <input type='text' onChange={(e) => setLink(e.target.value)} />
            <span className={styles.linkType}>
              {link && (
                <>
                  (<LinkTypePreviewer link={link} />)
                </>
              )}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

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
      <div className={styles.postFormDesktop}>
        {isThreadClosed ? (
          <div className={styles.closed}>
            {t('thread_closed')}
            <br />
            {t('may_not_reply')}
          </div>
        ) : !showForm ? (
          <div>
            [
            <button className='button' onClick={() => setShowForm(true)}>
              {isInPostPage ? t('post_a_reply') : t('start_new_thread')}
            </button>
            ]
          </div>
        ) : (
          <PostFormTable />
        )}
      </div>
      <div className={styles.postFormMobile}>
        {isThreadClosed ? (
          <div className={styles.closed}>
            {t('thread_closed')}
            <br />
            {t('may_not_reply')}
          </div>
        ) : (
          <>
            <button className={`${styles.showFormButton} button`} onClick={() => setShowForm(showForm ? false : true)}>
              {showForm ? t('close_post_form') : isInPostPage ? t('post_a_reply') : t('start_new_thread')}
            </button>
            {showForm && <PostFormTable />}
          </>
        )}
      </div>
    </>
  );
};

export default PostForm;
