import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { setAccount, useAccount } from '@plebbit/plebbit-react-hooks';
import { isValidURL } from '../../lib/utils/url-utils';
import useReply from '../../hooks/use-reply';
import useWindowWidth from '../../hooks/use-window-width';
import styles from './reply-modal.module.css';
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
  const isMobile = useWindowWidth() < 640;

  // on mobile, the position is absolute instead of fixed, so we need to calculate the top position
  useEffect(() => {
    if (nodeRef.current && isMobile) {
      const viewportHeight = window.innerHeight;
      const modalHeight = 150;
      const centeredPosition = scrollY + viewportHeight / 2 - modalHeight / 2;
      nodeRef.current.style.top = `${centeredPosition}px`;
    }
  }, [isMobile, scrollY]);

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
            placeholder={displayName ? undefined : _.capitalize(t('anonymous'))}
            onChange={(e) => setAccount({ ...account, author: { ...account?.author, displayName: e.target.value } })}
          />
        </div>
        <div className={styles.link}>
          <input type='text' ref={urlRef} placeholder={_.capitalize(t('link'))} onChange={(e) => setContent.link(e.target.value)} />
        </div>
        <div className={styles.parentCid}>
          <input type='text' readOnly value={`c/${parentCid && Plebbit.getShortCid(parentCid)}`} />
        </div>
        <div className={styles.content}>
          <textarea
            cols={48}
            rows={4}
            wrap='soft'
            ref={textRef}
            placeholder={_.capitalize(t('comment'))}
            onChange={(e) => {
              const content = e.target.value.replace(/\n/g, '\n\n');
              setContent.content(content);
            }}
            autoFocus={!isMobile} // autofocus causes auto scroll to top on mobile
          />
        </div>
        <div className={styles.footer}>
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
