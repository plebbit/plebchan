import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Comment,
  PublishCommentOptions,
  setAccount,
  useAccount,
  useAccountComment,
  useComment,
  useEditedComment,
  usePublishComment,
  useSubplebbit,
} from '@plebbit/plebbit-react-hooks';
import { create } from 'zustand';
import { alertChallengeVerificationFailed } from '../../lib/utils/challenge-utils';
import { getLinkMediaInfo } from '../../lib/utils/media-utils';
import { formatMarkdown } from '../../lib/utils/post-utils';
import { isValidURL } from '../../lib/utils/url-utils';
import { isAllView, isDescriptionView, isPostPageView, isRulesView, isSubscriptionsView } from '../../lib/utils/view-utils';
import { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import usePublishReply from '../../hooks/use-publish-reply';
import useChallengesStore from '../../stores/use-challenges-store';
import styles from './post-form.module.css';
import _ from 'lodash';
import useIsSubplebbitOffline from '../../hooks/use-is-subplebbit-offline';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import useAnonMode from '../../hooks/use-anon-mode';

type SubmitState = {
  author?: any | undefined;
  displayName?: string | undefined;
  signer?: any | undefined;
  subplebbitAddress: string | undefined;
  title: string | undefined;
  content: string | undefined;
  link: string | undefined;
  spoiler: boolean | undefined;
  publishCommentOptions: PublishCommentOptions;
  setSubmitStore: (data: Partial<SubmitState>) => void;
  resetSubmitStore: () => void;
};

const { addChallenge } = useChallengesStore.getState();

const useSubmitStore = create<SubmitState>((set) => ({
  author: undefined,
  displayName: undefined,
  signer: undefined,
  subplebbitAddress: undefined,
  title: undefined,
  content: undefined,
  link: undefined,
  spoiler: undefined,
  publishCommentOptions: {},
  setSubmitStore: ({ author, displayName, signer, subplebbitAddress, title, content, link, spoiler }) =>
    set((state) => {
      const nextState = { ...state };
      if (author !== undefined) nextState.author = author;
      if (displayName !== undefined) nextState.displayName = displayName;
      if (signer !== undefined) nextState.signer = signer;
      if (subplebbitAddress !== undefined) nextState.subplebbitAddress = subplebbitAddress;
      if (title !== undefined) nextState.title = title || undefined;
      if (content !== undefined) nextState.content = content || undefined;
      if (link !== undefined) nextState.link = link || undefined;
      if (spoiler !== undefined) nextState.spoiler = spoiler || undefined;

      const publishCommentOptions: PublishCommentOptions = {
        subplebbitAddress: nextState.subplebbitAddress,
        title: nextState.title,
        content: nextState.content,
        link: nextState.link,
        spoiler: nextState.spoiler,
        onChallenge: (...args: any) => addChallenge(args),
        onChallengeVerification: alertChallengeVerificationFailed,
        onError: (error: Error) => {
          console.error(error);
          alert(error.message);
        },
      };

      if (nextState.signer) {
        publishCommentOptions.signer = nextState.signer;
      }

      if (nextState.author || nextState.displayName) {
        publishCommentOptions.author = {
          ...nextState.author,
          displayName: nextState.displayName,
        };
      }

      nextState.publishCommentOptions = publishCommentOptions;
      return nextState;
    }),
  resetSubmitStore: () =>
    set({
      author: undefined,
      displayName: undefined,
      signer: undefined,
      subplebbitAddress: undefined,
      title: undefined,
      content: undefined,
      link: undefined,
      spoiler: undefined,
      publishCommentOptions: {},
    }),
}));

export const LinkTypePreviewer = ({ link }: { link: string }) => {
  const { t } = useTranslation();
  const mediaInfo = getLinkMediaInfo(link);
  let type = mediaInfo?.type;
  const gifFrameUrl = useFetchGifFirstFrame(mediaInfo?.url);

  if (type === 'gif' && gifFrameUrl !== null) {
    type = t('animated_gif');
  } else if (type === 'gif' && gifFrameUrl === null) {
    type = t('gif');
  }

  return isValidURL(link) ? type : t('invalid_url');
};

const PostFormTable = ({ closeForm, postCid }: { closeForm: () => void; postCid: string }) => {
  const { t } = useTranslation();
  const account = useAccount();
  const author = account?.author || {};
  const { displayName } = author || {};
  const [url, setUrl] = useState('');
  const { link, publishCommentOptions, setSubmitStore, resetSubmitStore } = useSubmitStore();
  const { index, publishComment } = usePublishComment(publishCommentOptions);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const isInAllView = isAllView(location.pathname, useParams());
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());
  const subscriptions = account?.subscriptions || [];
  const defaultSubplebbitAddresses = useDefaultSubplebbitAddresses();

  const { anonMode, getNewSigner, getExistingSigner } = useAnonMode(postCid);
  const comment = useComment({ commentCid: postCid });
  const address = comment?.author?.address;

  const resetFields = () => {
    if (textRef.current) {
      textRef.current.value = '';
    }
    if (urlRef.current) {
      urlRef.current.value = '';
    }
    if (subjectRef.current) {
      subjectRef.current.value = '';
    }
  };

  const hasCalledAnonAddressRef = useRef(false);

  const getAnonAddressForPost = useCallback(async () => {
    if (anonMode) {
      if (!hasCalledAnonAddressRef.current) {
        hasCalledAnonAddressRef.current = true;
        const newSigner = (await getNewSigner()) || {};
        setSubmitStore({
          signer: newSigner,
          author: {
            address: newSigner.address,
            displayName: displayName || undefined,
          },
        });
      }
    } else {
      setSubmitStore({
        signer: undefined,
        author: {
          address: account?.author?.address,
          displayName: displayName || undefined,
        },
      });
    }
  }, [anonMode, getNewSigner, account, setSubmitStore, displayName]);

  const onPublishPost = () => {
    const currentTitle = subjectRef.current?.value.trim() || '';
    const currentContent = textRef.current?.value.trim() || '';
    const currentUrl = urlRef.current?.value.trim() || '';

    if (!currentTitle && !currentContent && !currentUrl) {
      alert(`Cannot post empty comment`);
      return;
    }
    if (link && !isValidURL(link)) {
      alert('The provided link is not a valid URL.');
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
      resetFields();
      navigate(`/profile/${index}`);
    }
  }, [index, resetSubmitStore, navigate]);

  // in post page, publish a reply to the post
  const isInPostView = isPostPageView(location.pathname, params);
  const cid = params?.commentCid as string;
  const { setPublishReplyOptions, resetPublishReplyOptions, replyIndex, publishReply } = usePublishReply({ cid, subplebbitAddress });

  const getAnonAddressForReply = useCallback(async () => {
    if (anonMode && !hasCalledAnonAddressRef.current) {
      hasCalledAnonAddressRef.current = true;
      const existingSigner = getExistingSigner(address);
      if (existingSigner) {
        setPublishReplyOptions({
          signer: existingSigner,
          author: {
            address: existingSigner.address,
            displayName: displayName || undefined,
          },
        });
      } else {
        const newSigner = await getNewSigner();
        setPublishReplyOptions({
          signer: newSigner,
          author: {
            address: newSigner.address,
            displayName: displayName || undefined,
          },
        });
      }
    }
  }, [address, getExistingSigner, getNewSigner, setPublishReplyOptions, anonMode, displayName]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const formattedContent = formatMarkdown(e.target.value);
    isInPostView ? setPublishReplyOptions({ content: formattedContent }) : setSubmitStore({ content: formattedContent });
  };

  const onPublishReply = () => {
    const currentContent = textRef.current?.value.trim() || '';
    const currentUrl = urlRef.current?.value.trim() || '';

    if (!currentContent && !currentUrl) {
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
      resetPublishReplyOptions();
      resetFields();
      closeForm();
    }
  }, [replyIndex, resetPublishReplyOptions, closeForm]);

  useEffect(() => {
    if (anonMode) {
      if (isInPostView) {
        getAnonAddressForReply();
      } else {
        getAnonAddressForPost();
      }
    }
  }, [anonMode, getAnonAddressForPost, getAnonAddressForReply, isInPostView]);

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
              onChange={(e) => {
                setAccount({ ...account, author: { ...account?.author, displayName: e.target.value } });
                if (isInPostView) {
                  setPublishReplyOptions({ displayName: e.target.value || undefined });
                } else {
                  setSubmitStore({ displayName: e.target.value || undefined });
                }
              }}
            />
            {isInPostView && <button onClick={onPublishReply}>{t('post')}</button>}
          </td>
        </tr>
        {!isInPostView && (
          <tr>
            <td>{t('subject')}</td>
            <td>
              <input
                type='text'
                ref={subjectRef}
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
            <textarea cols={48} rows={4} wrap='soft' ref={textRef} onChange={handleContentChange} />
          </td>
        </tr>
        <tr>
          <td>{t('link')}</td>
          <td className={styles.linkField}>
            <input
              type='text'
              autoCorrect='off'
              autoComplete='off'
              spellCheck='false'
              ref={urlRef}
              onChange={(e) => {
                setUrl(e.target.value);
                isInPostView ? setPublishReplyOptions({ link: e.target.value }) : setSubmitStore({ link: e.target.value });
              }}
            />
            <span className={styles.linkType}> {url && <LinkTypePreviewer link={url} />}</span>
          </td>
        </tr>
        <tr className={styles.spoilerButton}>
          <td>{t('options')}</td>
          <td>
            [
            <label>
              <input
                type='checkbox'
                onChange={(e) => (isInPostView ? setPublishReplyOptions({ spoiler: e.target.checked }) : setSubmitStore({ spoiler: e.target.checked }))}
              />
              {_.capitalize(t('spoiler'))}?
            </label>
            ]
          </td>
        </tr>
        {(isInAllView || isInSubscriptionsView) && (
          <tr>
            <td>{t('board')}</td>
            <td>
              <select onChange={(e) => setSubmitStore({ subplebbitAddress: e.target.value })} value={subplebbitAddress}>
                <option value=''>--{t('no_board_selected')}--</option>
                {isInAllView &&
                  defaultSubplebbitAddresses.map((address: string) => (
                    <option key={address} value={address}>
                      {address}
                    </option>
                  ))}
                {isInSubscriptionsView &&
                  subscriptions.map((sub: string) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const PostForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const isInDescriptionView = isDescriptionView(location.pathname, params);
  const isInPostView = isPostPageView(location.pathname, params);
  const isInRulesView = isRulesView(location.pathname, params);
  const isInAllView = isAllView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const post = useComment({ commentCid: useParams().commentCid });
  let comment: Comment = post;
  // handle pending mod or author edit
  const { editedComment } = useEditedComment({ comment });
  if (editedComment) {
    comment = editedComment;
  }

  const { deleted, locked, removed, postCid } = comment || {};
  const isThreadClosed = deleted || locked || removed || isInDescriptionView || isInRulesView;

  const [showForm, setShowForm] = useState(false);

  const subplebbit = useSubplebbit({ subplebbitAddress: params?.subplebbitAddress });
  const { isOffline, offlineTitle } = useIsSubplebbitOffline(subplebbit);

  return (
    <>
      <div className={styles.postFormDesktop}>
        {!(isInAllView || isInSubscriptionsView) && showForm && (isOffline || isOffline) && <div className={styles.offlineBoard}>{offlineTitle}</div>}
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
              {isInPostView ? t('post_a_reply') : t('start_new_thread')}
            </button>
            ]
          </div>
        ) : (
          <PostFormTable closeForm={() => setShowForm(false)} postCid={postCid} />
        )}
      </div>
      <div className={styles.postFormMobile}>
        {!(isInAllView || isInSubscriptionsView) && showForm && (isOffline || isOffline) && <div className={styles.offlineBoard}>{offlineTitle}</div>}
        {isThreadClosed ? (
          <div className={styles.closed}>
            {t('thread_closed')}
            <br />
            {t('may_not_reply')}
          </div>
        ) : (
          <>
            <button className={`${styles.showFormButton} button`} onClick={() => setShowForm(showForm ? false : true)}>
              {showForm ? t('close_post_form') : isInPostView ? t('post_a_reply') : t('start_new_thread')}
            </button>
            {showForm && <PostFormTable closeForm={() => setShowForm(false)} postCid={postCid} />}
          </>
        )}
      </div>
    </>
  );
};

export default PostForm;
