import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';
import { setAccount, useAccount, useComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isValidURL } from '../../lib/utils/url-utils';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useSelectedTextStore from '../../stores/use-selected-text-store';
import usePublishReply from '../../hooks/use-publish-reply';
import useIsMobile from '../../hooks/use-is-mobile';
import styles from './reply-modal.module.css';
import { LinkTypePreviewer } from '../post-form';
import _ from 'lodash';
import useAnonMode from '../../hooks/use-anon-mode';

interface ReplyModalProps {
  closeModal: () => void;
  parentCid: string;
  postCid: string;
  scrollY: number;
}

const ReplyModal = ({ closeModal, parentCid, postCid, scrollY }: ReplyModalProps) => {
  const { t } = useTranslation();
  const { subplebbitAddress } = useParams() as { subplebbitAddress: string };
  const { setPublishReplyOptions, publishReply } = usePublishReply({ cid: parentCid, subplebbitAddress });
  const account = useAccount();
  const { displayName } = account?.author || {};
  const [url, setUrl] = useState('');
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const { selectedText } = useSelectedTextStore();

  const { anonMode, getNewSigner, getExistingSigner } = useAnonMode(postCid);
  const comment = useComment({ commentCid: postCid });
  const address = comment?.author?.address;

  const hasCalledAnonAddressRef = useRef(false);

  const getAnonAddressForReply = useCallback(async () => {
    if (anonMode && !hasCalledAnonAddressRef.current) {
      hasCalledAnonAddressRef.current = true;
      const existingSigner = getExistingSigner(address);
      if (existingSigner) {
        setPublishReplyOptions({
          signer: existingSigner,
          author: {
            displayName,
            address: existingSigner.address,
          },
        });
      } else {
        const newSigner = await getNewSigner();
        setPublishReplyOptions({
          signer: newSigner,
          author: {
            displayName,
            address: newSigner.address,
          },
        });
      }
    }
  }, [anonMode, address, getExistingSigner, getNewSigner, displayName, setPublishReplyOptions]);

  useEffect(() => {
    if (anonMode) {
      getAnonAddressForReply();
    }
  }, [anonMode, getAnonAddressForReply]);

  const onPublishReply = async () => {
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
    closeModal();
  };

  const nodeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // on mobile, the position is absolute instead of fixed, so we need to calculate the top position
  useEffect(() => {
    if (nodeRef.current && isMobile) {
      const viewportHeight = window.innerHeight;
      const modalHeight = 150;
      const centeredPosition = scrollY + viewportHeight / 2 - modalHeight / 2;
      nodeRef.current.style.top = `${centeredPosition}px`;
    }
  }, [isMobile, scrollY]);

  const parentCidRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (parentCidRef.current && parentCidRef.current) {
      const cidWidth = parentCidRef.current.offsetWidth;
      parentCidRef.current.style.width = `${cidWidth}px`;
    }
  }, [parentCid]);

  const location = useLocation();
  const isInAllView = isAllView(location.pathname, useParams());
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { updatedAt } = subplebbit || {};
  const isBoardOffline = subplebbit?.updatedAt && subplebbit.updatedAt < Date.now() / 1000 - 60 * 60;
  const offlineAlert = updatedAt
    ? isBoardOffline && (
        <div className={styles.offlineBoard}>{`Posts last synced ${getFormattedTimeAgo(updatedAt)}, the subplebbit might be offline and publishing might fail.`}</div>
      )
    : `The subplebbit might be offline and publishing might fail.`;

  const setTextRef = (ref: HTMLTextAreaElement | null) => {
    if (ref) {
      textRef.current = ref;
      // if (!isMobile && !urlRef.current?.value) {
      //   ref.focus();
      // }
    }
  };

  useEffect(() => {
    if (textRef.current) {
      const len = textRef.current.value.length;
      textRef.current.setSelectionRange(len, len);
    }
  }, []);

  const contentPrefix = `c/${parentCid && Plebbit.getShortCid(parentCid)}\n`;

  const handleContentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (!value.startsWith(contentPrefix)) {
      e.target.value = contentPrefix + value.slice(contentPrefix.length);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // remove the prefix from the content to publish, and also add newlines for markdown
    const contentWithoutPrefix = e.target.value.slice(contentPrefix.length).replace(/\n/g, '\n\n');
    if (textRef.current && textRef.current.value !== contentWithoutPrefix) {
      setPublishReplyOptions({ content: contentWithoutPrefix });
    }
  };

  const modalContent = (
    <div className={styles.container} ref={nodeRef}>
      <div className={`replyModalHandle ${styles.title}`}>
        {t('reply_to_cid', { cid: `c/${parentCid && Plebbit.getShortCid(parentCid)}`, interpolation: { escapeValue: false } })}
        <button
          className={styles.closeIcon}
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
          title='close'
        />
      </div>
      <div className={styles.replyForm}>
        <div className={styles.name}>
          <input
            type='text'
            defaultValue={displayName}
            placeholder={displayName ? undefined : _.capitalize(t('name'))}
            onChange={(e) => {
              setAccount({ ...account, author: { ...account?.author, displayName: e.target.value } });
              setPublishReplyOptions({ displayName: e.target.value || undefined });
            }}
          />
        </div>
        <div className={styles.link}>
          <input
            type='text'
            ref={urlRef}
            placeholder={_.capitalize(t('link'))}
            onChange={(e) => {
              setUrl(e.target.value);
              setPublishReplyOptions({ link: e.target.value || undefined });
            }}
          />
        </div>
        <div className={styles.content}>
          <textarea
            cols={48}
            rows={4}
            wrap='soft'
            ref={setTextRef}
            spellCheck={false}
            defaultValue={contentPrefix + selectedText}
            onInput={handleContentInput}
            onChange={handleContentChange}
          />
        </div>
        {!(isInAllView || isInSubscriptionsView) && offlineAlert}
        <div className={styles.offlineAlert}></div>
        <div className={styles.footer}>
          {url && (
            <>
              {t('link_type')}: <LinkTypePreviewer link={url} />{' '}
            </>
          )}
          <span className={styles.spoilerButton}>
            [
            <label>
              <input type='checkbox' onChange={(e) => setPublishReplyOptions({ spoiler: e.target.checked })} />
              {_.capitalize(t('spoiler'))}?
            </label>
            ]
          </span>
          <button className={styles.publishButton} onClick={onPublishReply}>
            {t('post')}
          </button>
        </div>
      </div>
    </div>
  );

  return isMobile ? (
    modalContent
  ) : (
    <Draggable handle='.replyModalHandle' nodeRef={nodeRef}>
      {modalContent}
    </Draggable>
  );
};

export default ReplyModal;
