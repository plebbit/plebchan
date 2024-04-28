import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PublishCommentOptions, setAccount, useAccount, useAccountComment, useComment, usePublishComment } from '@plebbit/plebbit-react-hooks';
import { create } from 'zustand';
import styles from './post-form.module.css';
import { alertChallengeVerificationFailed } from '../../lib/utils/challenge-utils';
import { getLinkMediaInfo } from '../../lib/utils/media-utils';
import { isValidURL } from '../../lib/utils/url-utils';
import { isDescriptionView, isPostPageView, isRulesView } from '../../lib/utils/view-utils';
import challengesStore from '../../hooks/use-challenges';
import useReply from '../../hooks/use-reply';
import _ from 'lodash';

type SubmitState = {
  subplebbitAddress: string | undefined;
  title: string | undefined;
  content: string | undefined;
  link: string | undefined;
  publishCommentOptions: PublishCommentOptions;
  setSubmitStore: (data: Partial<SubmitState>) => void;
  resetSubmitStore: () => void;
};

const { addChallenge } = challengesStore.getState();

const useSubmitStore = create<SubmitState>((set) => ({
  subplebbitAddress: undefined,
  title: undefined,
  content: undefined,
  link: undefined,
  publishCommentOptions: {},
  setSubmitStore: ({ subplebbitAddress, title, content, link }) =>
    set((state) => {
      const nextState = { ...state };
      if (subplebbitAddress !== undefined) nextState.subplebbitAddress = subplebbitAddress;
      if (title !== undefined) nextState.title = title || undefined;
      if (content !== undefined) nextState.content = content || undefined;
      if (link !== undefined) nextState.link = link || undefined;

      nextState.publishCommentOptions = {
        ...nextState,
        onChallenge: (...args: any) => addChallenge(args),
        onChallengeVerification: alertChallengeVerificationFailed,
        onError: (error: Error) => {
          console.error(error);
          let errorMessage = error.message;
          alert(errorMessage);
        },
      };
      return nextState;
    }),
  resetSubmitStore: () => set({ subplebbitAddress: undefined, title: undefined, content: undefined, link: undefined, publishCommentOptions: {} }),
}));

const LinkTypePreviewer = ({ link }: { link: string }) => {
  const mediaInfo = getLinkMediaInfo(link);
  return isValidURL(link) ? mediaInfo?.type : 'Invalid URL';
};

const PostFormTable = () => {
  const { t } = useTranslation();
  const account = useAccount();
  const { displayName } = account?.author || {};

  const [url, setUrl] = useState('');

  const { title, content, link, publishCommentOptions, setSubmitStore, resetSubmitStore } = useSubmitStore();

  const { index, publishComment } = usePublishComment(publishCommentOptions);

  const onPublishPost = () => {
    if (!title && !content && !link) {
      alert(`Cannot post empty comment`);
      return;
    }
    if (link && !isValidURL(link)) {
      alert(`Invalid link`);
      return;
    }

    publishComment();
  };

  const params = useParams();
  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;
  useEffect(() => {
    if (subplebbitAddress) {
      setSubmitStore({ subplebbitAddress });
    }
  }, [subplebbitAddress, setSubmitStore]);

  // redirect to pending page when pending comment is created
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof index === 'number') {
      resetSubmitStore();
      navigate(`/profile/${index}`);
    }
  }, [index, resetSubmitStore, navigate]);

  // in post page, publish a reply to the post
  const location = useLocation();
  const isInPostPage = isPostPageView(location.pathname, params);
  const cid = params?.commentCid as string;
  const { setContent, resetContent, replyIndex, publishReply } = useReply({ cid, subplebbitAddress });

  const textRef = useRef<HTMLTextAreaElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const onPublishReply = () => {
    const currentContent = textRef.current?.value || '';
    const currentUrl = urlRef.current?.value || '';

    if (!currentContent.trim() && !currentUrl) {
      alert(`Cannot post empty comment`);
      return;
    }

    if (currentUrl && !isValidURL(currentUrl)) {
      alert('The provided link is not a valid URL.');
      return;
    }
    publishReply();
  };

  useEffect(() => {
    if (typeof replyIndex === 'number') {
      resetContent();
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [replyIndex, resetContent]);

  return (
    <table className={styles.postFormTable}>
      <tbody>
        <tr>
          <td>{t('name')}</td>
          <td>
            <input
              type='text'
              placeholder={!displayName ? _.capitalize(t('anonymous')) : undefined}
              defaultValue={displayName || undefined}
              onChange={(e) => setAccount({ ...account, author: { ...account?.author, displayName: e.target.value } })}
            />
            {isInPostPage && <button onClick={onPublishReply}>{t('post')}</button>}
          </td>
        </tr>
        {!isInPostPage && (
          <tr>
            <td>{t('subject')}</td>
            <td>
              <input
                type='text'
                onChange={(e) => {
                  setSubmitStore({ title: e.target.value });
                }}
              />
              <button onClick={onPublishPost}>{t('post')}</button>
            </td>
          </tr>
        )}
        <tr>
          <td>{t('comment')}</td>
          <td>
            <textarea
              cols={48}
              rows={4}
              wrap='soft'
              ref={textRef}
              onChange={(e) => {
                isInPostPage ? setContent.content(e.target.value) : setSubmitStore({ content: e.target.value });
              }}
            />
          </td>
        </tr>
        <tr>
          <td>{t('link')}</td>
          <td>
            <input
              type='text'
              autoCorrect='off'
              autoComplete='off'
              spellCheck='false'
              ref={urlRef}
              onChange={(e) => {
                setUrl(e.target.value);
                isInPostPage ? setContent.link(e.target.value) : setSubmitStore({ link: e.target.value });
              }}
            />
            <span className={styles.linkType}>
              {url && (
                <>
                  (<LinkTypePreviewer link={url} />)
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

  const comment = useComment({ commentCid: useParams().commentCid });
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
