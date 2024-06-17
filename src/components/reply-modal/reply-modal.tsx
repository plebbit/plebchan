import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';
import { setAccount, useAccount, useAuthorAddress, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isValidURL } from '../../lib/utils/url-utils';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useReply from '../../hooks/use-reply';
import useIsMobile from '../../hooks/use-is-mobile';
import styles from './reply-modal.module.css';
import { LinkTypePreviewer } from '../post-form';
import _ from 'lodash';

interface ReplyModalProps {
  closeModal: () => void;
  parentCid: string;
  scrollY: number;
}

const ReplyModal = ({ closeModal, parentCid, scrollY }: ReplyModalProps) => {
  const { t } = useTranslation();
  const { subplebbitAddress } = useParams() as { subplebbitAddress: string };
  const { setContent, resetContent, replyIndex, publishReply } = useReply({ cid: parentCid, subplebbitAddress });

  const account = useAccount();
  const { displayName } = account?.author || {};

  const [url, setUrl] = useState('');

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
      closeModal();
      resetContent();
    }
  }, [replyIndex, resetContent, closeModal]);

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
            onChange={(e) => setAccount({ ...account, author: { ...account?.author, displayName: e.target.value } })}
          />
        </div>
        <div className={styles.link}>
          <input
            type='text'
            ref={urlRef}
            placeholder={_.capitalize(t('link'))}
            onChange={(e) => {
              setUrl(e.target.value);
              setContent.link(e.target.value);
            }}
          />
        </div>
        <div className={styles.content}>
          <span className={styles.parentCid} ref={parentCidRef}>
            {`c/${parentCid && Plebbit.getShortCid(parentCid)}`}
          </span>
          <textarea
            cols={48}
            rows={3}
            wrap='soft'
            ref={textRef}
            onChange={(e) => {
              const content = e.target.value.replace(/\n/g, '\n\n');
              setContent.content(content);
            }}
            autoFocus={!isMobile} // autofocus causes auto scroll to top on mobile
          />
        </div>
        {!(isInAllView || isInSubscriptionsView) && offlineAlert}
        <div className={styles.offlineAlert}></div>
        <div className={styles.footer}>
          {url && (
            <>
              {t('file_type')}: <LinkTypePreviewer link={url} />{' '}
            </>
          )}
          <span className={styles.spoilerButton}>
            [
            <label>
              <input type='checkbox' onChange={(e) => setContent.spoiler(e.target.checked)} />
              {_.capitalize(t('spoiler'))}?
            </label>
            ]
          </span>
          <button onClick={onPublishReply}>{t('reply')}</button>
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
