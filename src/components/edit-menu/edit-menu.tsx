import { useEffect, useState, useMemo, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { autoUpdate, FloatingFocusManager, offset, shift, useClick, useDismiss, useFloating, useId, useInteractions, useRole } from '@floating-ui/react';
import { Comment, PublishCommentEditOptions, useAccount, usePublishCommentEdit } from '@plebbit/plebbit-react-hooks';
import styles from './edit-menu.module.css';
import { alertChallengeVerificationFailed } from '../../lib/utils/challenge-utils';
import useChallengesStore from '../../stores/use-challenges-store';
import _ from 'lodash';
import useIsMobile from '../../hooks/use-is-mobile';
import useAnonMode from '../../hooks/use-anon-mode';

const { addChallenge } = useChallengesStore.getState();

type EditMenuProps = {
  isAccountMod?: boolean;
  isAccountCommentAuthor?: boolean;
  isCommentAuthorMod?: boolean;
  post: Comment;
};

const daysToTimestampInSeconds = (days: number) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return Math.floor(now.getTime() / 1000);
};

const timestampToDays = (timestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  return Math.max(1, Math.floor((timestamp - now) / (24 * 60 * 60)));
};

const EditMenu = ({ isAccountMod, isAccountCommentAuthor, isCommentAuthorMod, post }: EditMenuProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { author, cid, commentAuthor, content, deleted, locked, parentCid, pinned, reason, removed, spoiler, subplebbitAddress } = post || {};
  const isReply = parentCid;
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);

  const { getExistingSigner } = useAnonMode(post?.postCid);

  const account = useAccount();
  const [signer, setSigner] = useState<any>(account?.signer);

  const checkSigner = useCallback(async () => {
    if (isAccountCommentAuthor && post?.author?.address !== account?.author?.address) {
      const existingSigner = getExistingSigner(post?.author?.address);
      if (existingSigner) {
        setSigner(existingSigner);
      }
    } else {
      setSigner(null);
    }
  }, [isAccountCommentAuthor, post?.author?.address, getExistingSigner, account?.author?.address]);

  useEffect(() => {
    checkSigner();
  }, [checkSigner]);

  const defaultPublishEditOptions = useMemo(() => {
    return {
      commentAuthor: isAccountMod && !isAccountCommentAuthor ? commentAuthor : undefined,
      commentCid: cid,
      content: isAccountCommentAuthor ? content : undefined,
      deleted: isAccountCommentAuthor ? deleted ?? false : undefined,
      locked: isAccountMod ? locked ?? false : undefined,
      pinned: isAccountMod ? pinned ?? false : undefined,
      reason,
      removed: isAccountMod ? removed ?? false : undefined,
      spoiler: spoiler ?? false,
      subplebbitAddress,
      signer: signer,
      author: signer
        ? {
            address: signer.address,
            displayName: post?.author?.displayName,
          }
        : author,
      onChallenge: (...args: any) => addChallenge([...args, post]),
      onChallengeVerification: alertChallengeVerificationFailed,
      onError: (error: Error) => {
        console.warn(error);
        alert('Comment edit failed. ' + error.message);
      },
    };
  }, [isAccountMod, isAccountCommentAuthor, commentAuthor, cid, content, deleted, locked, pinned, reason, removed, spoiler, subplebbitAddress, signer, post]);

  const [publishCommentEditOptions, setPublishCommentEditOptions] = useState<PublishCommentEditOptions>(defaultPublishEditOptions);
  const { publishCommentEdit } = usePublishCommentEdit(publishCommentEditOptions);

  useEffect(() => {
    setPublishCommentEditOptions(defaultPublishEditOptions);
  }, [defaultPublishEditOptions]);

  const [banDuration, setBanDuration] = useState(() =>
    publishCommentEditOptions.commentAuthor?.banExpiresAt ? timestampToDays(publishCommentEditOptions.commentAuthor.banExpiresAt) : 1,
  );

  const onCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    if (id === 'banUser') {
      setPublishCommentEditOptions((state) => ({
        ...state,
        commentAuthor: { ...state.commentAuthor, banExpiresAt: checked ? daysToTimestampInSeconds(banDuration) : undefined },
      }));
    } else {
      setPublishCommentEditOptions((state) => ({ ...state, [id]: checked }));
    }
  };

  const onBanDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value, 10) || 1;
    setBanDuration(days);
    setPublishCommentEditOptions((state) => ({
      ...state,
      commentAuthor: { ...state.commentAuthor, banExpiresAt: daysToTimestampInSeconds(days) },
    }));
  };

  const onReason = (e: React.ChangeEvent<HTMLInputElement>) => setPublishCommentEditOptions((state) => ({ ...state, reason: e.target.value }));

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isEditMenuOpen,
    onOpenChange: setIsEditMenuOpen,
    middleware: [offset(2), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const headingId = useId();

  const _publishCommentEdit = async () => {
    try {
      await publishCommentEdit();
    } catch (error) {
      if (error instanceof Error) {
        console.warn(error);
        alert(error.message);
      }
    }
    setIsEditMenuOpen(false);
  };

  return (
    <>
      <span className={`${styles.checkbox} ${isReply && styles.replyCheckbox}`} ref={refs.setReference} {...(cid && getReferenceProps())}>
        <input type='checkbox' onChange={() => setIsEditMenuOpen(cid && (isAccountCommentAuthor || isAccountMod) ? !isEditMenuOpen : false)} checked={isEditMenuOpen} />
      </span>
      {isEditMenuOpen && (isAccountCommentAuthor || isAccountMod) && (
        <FloatingFocusManager context={context} modal={false}>
          <div className={styles.modal} ref={refs.setFloating} style={floatingStyles} aria-labelledby={headingId} {...getFloatingProps()}>
            <div className={styles.editMenu}>
              {isAccountCommentAuthor && (
                <>
                  <div className={styles.menuItem}>
                    <label>
                      [
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.deleted ?? false} type='checkbox' id='deleted' />
                      {_.capitalize(t('delete'))}?]
                    </label>
                  </div>
                  <div className={styles.menuItem}>
                    <label>
                      [
                      <input type='checkbox' onChange={() => setIsContentEditorOpen(!isContentEditorOpen)} checked={isContentEditorOpen} />
                      {_.capitalize(t('edit'))}?]
                    </label>
                  </div>
                  {isContentEditorOpen && (
                    <div>
                      <textarea
                        className={styles.editTextarea}
                        defaultValue={publishCommentEditOptions.content ?? ''}
                        onChange={(e) => setPublishCommentEditOptions((state) => ({ ...state, content: e.target.value }))}
                      />
                    </div>
                  )}
                </>
              )}
              {isAccountMod && (
                <>
                  <div className={styles.menuItem}>
                    <label>
                      [
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.removed ?? false} type='checkbox' id='removed' />
                      {_.capitalize(t('remove'))}?]
                    </label>
                  </div>
                  {!isReply && (
                    <div className={styles.menuItem}>
                      [
                      <label>
                        <input onChange={onCheckbox} checked={publishCommentEditOptions.locked ?? false} type='checkbox' id='locked' />
                        {_.capitalize(t('close_thread'))}?
                      </label>
                      ]
                    </div>
                  )}
                  <div className={styles.menuItem}>
                    [
                    <label>
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.spoiler ?? false} type='checkbox' id='spoiler' />
                      {_.capitalize(t('spoiler'))}?
                    </label>
                    ]
                  </div>
                  <div className={styles.menuItem}>
                    [
                    <label>
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.pinned ?? false} type='checkbox' id='pinned' />
                      {_.capitalize(t('sticky'))}?
                    </label>
                    ]
                  </div>
                  {!isCommentAuthorMod && (
                    <div className={styles.menuItem}>
                      [
                      <label>
                        <input onChange={onCheckbox} checked={publishCommentEditOptions.commentAuthor?.banExpiresAt !== undefined} type='checkbox' id='banUser' />
                        <Trans
                          i18nKey='ban_user_for'
                          shouldUnescape={true}
                          components={{
                            1: <input className={styles.banInput} onChange={onBanDurationChange} type='number' min={1} max={100} value={banDuration} />,
                          }}
                        />
                        ?
                      </label>
                      ]
                    </div>
                  )}
                </>
              )}
              <div className={`${styles.menuItem} ${styles.menuReason}`}>
                {_.capitalize(t('reason'))}? ({t('optional')})
                <input type='text' onChange={onReason} value={publishCommentEditOptions.reason} size={14} />
              </div>
              <div className={styles.bottom}>
                <button className={isMobile ? 'button' : ''} onClick={_publishCommentEdit}>
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default EditMenu;
