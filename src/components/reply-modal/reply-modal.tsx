import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { useAccount } from '@plebbit/plebbit-react-hooks';
import { isValidURL } from '../../lib/utils/url-utils';
import useReply from '../../hooks/use-reply';
import styles from './reply-modal.module.css';
import _ from 'lodash';

interface ReplyModalProps {
  closeModal: () => void;
  parentCid: string;
}

const ReplyModal = ({ closeModal, parentCid }: ReplyModalProps) => {
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

  // react-draggable requires a ref to the modal node
  const nodeRef = useRef(null);

  return (
    <Draggable handle='.replyModalHandle' nodeRef={nodeRef}>
      <div className={styles.container} ref={nodeRef}>
        <div className={`replyModalHandle ${styles.title}`}>
          Reply to c/{parentCid && Plebbit.getShortCid(parentCid)}
          <button className={styles.closeIcon} onClick={closeModal} title='close' />
        </div>
        <div className={styles.replyForm}>
          <div className={styles.name}>
            <input type='text' defaultValue={displayName} placeholder={displayName ? undefined : _.capitalize(t('anonymous'))} />
          </div>
          <div className={styles.link}>
            <input type='text' ref={urlRef} placeholder={_.capitalize(t('link'))} onChange={(e) => setContent.link(e.target.value)} />
          </div>
          <div className={styles.content}>
            <textarea cols={48} rows={4} wrap='soft' ref={textRef} placeholder={_.capitalize(t('comment'))} onChange={(e) => setContent.content(e.target.value)} />
          </div>
          <div className={styles.footer}>
            <button onClick={onPublishReply}>{t('reply')}</button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default ReplyModal;
