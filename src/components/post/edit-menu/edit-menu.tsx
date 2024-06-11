import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { autoUpdate, flip, FloatingFocusManager, offset, shift, useClick, useDismiss, useFloating, useId, useInteractions, useRole } from '@floating-ui/react';
import { PublishCommentEditOptions, useComment, useEditedComment, usePublishCommentEdit } from '@plebbit/plebbit-react-hooks';
import styles from './edit-menu.module.css';
import { alertChallengeVerificationFailed } from '../../../lib/utils/challenge-utils';
import useChallengesStore from '../../../stores/use-challenges-store';
import _ from 'lodash';
import useIsMobile from '../../../hooks/use-is-mobile';

const { addChallenge } = useChallengesStore.getState();

type EditMenuProps = {
  commentCid: string;
  isAccountMod?: boolean;
  isAccountCommentAuthor?: boolean;
  isCommentAuthorMod?: boolean;
};

const EditMenu = ({ commentCid, isAccountMod, isAccountCommentAuthor, isCommentAuthorMod }: EditMenuProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  let post: any;
  const comment = useComment({ commentCid });
  const { editedComment } = useEditedComment({ comment });
  if (editedComment) {
    post = editedComment;
  } else if (comment) {
    post = comment;
  }

  const { banExpiresAt, content, deleted, locked, parentCid, pinned, removed, spoiler, subplebbitAddress } = post || {};
  const isReply = parentCid;

  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);

  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
  const contentEditorRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (contentEditorRef.current) {
      contentEditorRef.current.focus();
    }
  }, []);

  const defaultPublishOptions: PublishCommentEditOptions = {
    commentAuthor: { banExpiresAt },
    commentCid,
    content,
    deleted,
    locked,
    pinned,
    removed,
    spoiler,
    subplebbitAddress,
    onChallenge: (...args: any) => addChallenge([...args, post]),
    onChallengeVerification: alertChallengeVerificationFailed,
    onError: (error: Error) => {
      console.warn(error);
      alert(error.message);
    },
  };

  const [publishCommentEditOptions, setPublishCommentEditOptions] = useState(defaultPublishOptions);
  const { publishCommentEdit } = usePublishCommentEdit(publishCommentEditOptions);

  const [banDuration, setBanDuration] = useState(1);

  const daysToTimestampInSeconds = (days: number) => {
    const now = new Date();
    now.setDate(now.getDate() + days);
    return Math.floor(now.getTime() / 1000);
  };

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

  const onReason = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPublishCommentEditOptions((state) => ({ ...state, reason: e.target.value ? e.target.value : undefined }));

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isEditMenuOpen,
    onOpenChange: setIsEditMenuOpen,
    middleware: [offset(2), flip({ fallbackAxisSideDirection: 'end' }), shift()],
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
      <span className={`${styles.checkbox} ${isReply && styles.replyCheckbox}`} ref={refs.setReference} {...(commentCid && getReferenceProps())}>
        <input
          type='checkbox'
          onChange={() => commentCid && setIsEditMenuOpen(!isEditMenuOpen)}
          checked={isEditMenuOpen}
          disabled={!isAccountCommentAuthor && !isAccountMod}
        />
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
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.deleted} type='checkbox' id='deleted' />
                      {_.capitalize(t('delete'))}? ]
                    </label>
                  </div>
                  <div className={styles.menuItem}>
                    <label>
                      [
                      <input type='checkbox' onChange={() => setIsContentEditorOpen(!isContentEditorOpen)} checked={isContentEditorOpen} />
                      {_.capitalize(t('edit'))}? ]
                    </label>
                  </div>
                  {isContentEditorOpen && (
                    <div>
                      <textarea
                        className={styles.editTextarea}
                        value={publishCommentEditOptions.content}
                        ref={contentEditorRef}
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
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.removed} type='checkbox' id='removed' />
                      {_.capitalize(t('remove'))}?]
                    </label>
                  </div>
                  {!isReply && (
                    <div className={styles.menuItem}>
                      [
                      <label>
                        <input onChange={onCheckbox} checked={publishCommentEditOptions.locked} type='checkbox' id='locked' />
                        {_.capitalize(t('close_thread'))}?
                      </label>
                      ]
                    </div>
                  )}
                  <div className={styles.menuItem}>
                    [
                    <label>
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.spoiler} type='checkbox' id='spoiler' />
                      {_.capitalize(t('spoiler'))}?
                    </label>
                    ]
                  </div>
                  <div className={styles.menuItem}>
                    [
                    <label>
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.pinned} type='checkbox' id='pinned' />
                      {_.capitalize(t('sticky'))}?
                    </label>
                    ]
                  </div>
                  {!isCommentAuthorMod && (
                    <div className={styles.menuItem}>
                      [
                      <label>
                        <input onChange={onCheckbox} checked={!!publishCommentEditOptions.commentAuthor?.banExpiresAt} type='checkbox' id='banUser' />
                        <Trans
                          i18nKey='ban_user_for'
                          shouldUnescape={true}
                          components={{
                            1: <input className={styles.banInput} onChange={onBanDurationChange} type='number' min={1} max={100} defaultValue={banDuration} />,
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
                <input type='text' onChange={onReason} defaultValue={post?.reason} size={14} />
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
