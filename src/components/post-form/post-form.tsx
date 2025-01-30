import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Comment, setAccount, useAccount, useAccountComment, useComment, useEditedComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { getHasThumbnail, getLinkMediaInfo } from '../../lib/utils/media-utils';
import { formatMarkdown } from '../../lib/utils/post-utils';
import { isValidURL } from '../../lib/utils/url-utils';
import { isAllView, isDescriptionView, isPostPageView, isRulesView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useAnonMode from '../../hooks/use-anon-mode';
import { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import useIsSubplebbitOffline from '../../hooks/use-is-subplebbit-offline';
import usePublishPost from '../../hooks/use-publish-post';
import usePublishReply from '../../hooks/use-publish-reply';
import FileUploader from '../../plugins/file-uploader';
import styles from './post-form.module.css';
import { Capacitor } from '@capacitor/core';
import _ from 'lodash';

const isAndroid = Capacitor.getPlatform() === 'android';

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
  const params = useParams();
  const account = useAccount();
  const [url, setUrl] = useState('');
  const author = account?.author || {};
  const { displayName } = author || {};
  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;
  const { setPublishPostOptions, postIndex, publishPost, publishPostOptions, resetPublishPostOptions } = usePublishPost({ subplebbitAddress });

  const textRef = useRef<HTMLTextAreaElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const isInAllView = isAllView(location.pathname);
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

  const getAnonAddressForPost = useCallback(async () => {
    if (anonMode) {
      const newSigner = (await getNewSigner()) || {};
      setPublishPostOptions({
        signer: newSigner,
        author: {
          address: newSigner.address,
          displayName: displayName || undefined,
        },
      });
    } else {
      setPublishPostOptions({
        signer: undefined,
        author: {
          address: account?.author?.address,
          displayName: displayName || undefined,
        },
      });
    }
  }, [anonMode, getNewSigner, account, setPublishPostOptions, displayName]);

  const onPublishPost = () => {
    const currentTitle = subjectRef.current?.value.trim() || '';
    const currentContent = textRef.current?.value.trim() || '';
    const currentUrl = urlRef.current?.value.trim() || '';

    if (!currentTitle && !currentContent && !currentUrl) {
      alert(t('empty_comment_alert'));
      return;
    }
    if (currentUrl && !isValidURL(currentUrl)) {
      alert(t('invalid_url_alert'));
      return;
    }

    if ((isInAllView || isInSubscriptionsView) && !publishPostOptions.subplebbitAddress) {
      alert(t('no_board_selected_warning'));
      return;
    }

    if (!isInPostView) {
      const linkMediaInfo = getLinkMediaInfo(currentUrl);
      const hasThumbnail = getHasThumbnail(linkMediaInfo, currentUrl);

      if (!hasThumbnail) {
        const confirmMessage = t('missing_link_confirm');
        if (!window.confirm(confirmMessage)) {
          return;
        }
      }
    }

    publishPost();
  };

  // redirect to pending page when pending comment is created
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof postIndex === 'number') {
      resetPublishPostOptions();
      resetFields();
      navigate(`/profile/${postIndex}`);
    }
  }, [postIndex, resetPublishPostOptions, navigate]);

  useEffect(() => {
    if (anonMode) {
      setPublishPostOptions({
        signer: undefined,
        author: {
          address: undefined,
          displayName: displayName || undefined,
        },
      });
      getAnonAddressForPost();
    } else {
      setPublishPostOptions({
        signer: undefined,
        author: {
          ...account?.author,
          displayName: displayName || account?.author?.displayName,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anonMode]);

  // in post page, publish a reply to the post
  const isInPostView = isPostPageView(location.pathname, params);
  const cid = params?.commentCid as string;
  const { setPublishReplyOptions, resetPublishReplyOptions, replyIndex, publishReply } = usePublishReply({ cid, subplebbitAddress });

  const getAnonAddressForReply = useCallback(async () => {
    const existingSigner = await getExistingSigner(address);
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
      if (newSigner) {
        setPublishReplyOptions({
          signer: newSigner,
          author: {
            address: newSigner.address,
            displayName: displayName || undefined,
          },
        });
      }
    }
  }, [address, getExistingSigner, getNewSigner, setPublishReplyOptions, displayName]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const formattedContent = formatMarkdown(e.target.value);
    isInPostView ? setPublishReplyOptions({ content: formattedContent }) : setPublishPostOptions({ content: formattedContent });
  };

  const onPublishReply = () => {
    const currentContent = textRef.current?.value.trim() || '';
    const currentUrl = urlRef.current?.value.trim() || '';

    if (!currentContent && !currentUrl) {
      alert(t('empty_comment_alert'));
      return;
    }

    if (currentUrl && !isValidURL(currentUrl)) {
      alert(t('invalid_url_alert'));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anonMode, isInPostView]);

  // on android, auto upload file to image hosting sites with open api
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const result = await FileUploader.pickAndUploadMedia();
      console.log('Upload result:', result);
      if (result.url) {
        setUrl(result.url);
        if (urlRef.current) {
          urlRef.current.value = result.url;
        }
        isInPostView ? setPublishReplyOptions({ link: result.url || undefined }) : setPublishPostOptions({ link: result.url || undefined });
        if (result.fileName) {
          setUploadedFileName(result.fileName);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      if (error instanceof Error && error.message !== 'File selection cancelled') {
        alert(`${t('upload_failed')}: ${error.message}`);
      } else if (typeof error === 'string' && error !== 'File selection cancelled') {
        alert(`${t('upload_failed')}: ${error}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const hasInitializedDisplayName = useRef(false);
  useEffect(() => {
    if (displayName && !hasInitializedDisplayName.current) {
      hasInitializedDisplayName.current = true;
      if (isInPostView) {
        setPublishReplyOptions({ displayName });
      } else {
        setPublishPostOptions({ displayName });
      }
    }
  }, [displayName, isInPostView, setPublishReplyOptions, setPublishPostOptions]);

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
                const newDisplayName = e.target.value.trim() || undefined;
                setAccount({ ...account, author: { ...account?.author, displayName: newDisplayName } });
                if (isInPostView) {
                  setPublishReplyOptions({ displayName: newDisplayName });
                } else {
                  setPublishPostOptions({ displayName: newDisplayName });
                }
              }}
            />
            {isInPostView && (
              <button onClick={onPublishReply} disabled={isUploading}>
                {t('post')}
              </button>
            )}
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
                  setPublishPostOptions({ title: e.target.value });
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
              disabled={isUploading}
              onChange={(e) => {
                setUrl(e.target.value);
                isInPostView ? setPublishReplyOptions({ link: e.target.value }) : setPublishPostOptions({ link: e.target.value });
              }}
            />
            <span className={styles.linkType}> {url && <LinkTypePreviewer link={url} />}</span>
          </td>
        </tr>
        {isAndroid && (
          <tr className={styles.uploadButton}>
            <td>{t('file')}</td>
            <td>
              <button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? t('uploading') : t('choose_file')}
              </button>
              <span>{uploadedFileName ? uploadedFileName : t('no_file_chosen')}</span>
            </td>
          </tr>
        )}
        <tr className={styles.spoilerButton}>
          <td>{t('options')}</td>
          <td>
            [
            <label>
              <input
                type='checkbox'
                onChange={(e) => (isInPostView ? setPublishReplyOptions({ spoiler: e.target.checked }) : setPublishPostOptions({ spoiler: e.target.checked }))}
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
              <select onChange={(e) => setPublishPostOptions({ subplebbitAddress: e.target.value })} value={subplebbitAddress}>
                <option value=''>{t('choose_one')}</option>
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
  const isInAllView = isAllView(location.pathname);
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

  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { isOffline, isOnlineStatusLoading, offlineTitle } = useIsSubplebbitOffline(subplebbit);

  return (
    <>
      <div className={styles.postFormDesktop}>
        {!(isInAllView || isInSubscriptionsView) && showForm && (isOffline || isOnlineStatusLoading) && <div className={styles.offlineBoard}>{offlineTitle}</div>}
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
        {!(isInAllView || isInSubscriptionsView) && showForm && (isOffline || isOnlineStatusLoading) && <div className={styles.offlineBoard}>{offlineTitle}</div>}
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
