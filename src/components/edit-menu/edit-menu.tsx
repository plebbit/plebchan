import { useEffect, useState, useMemo, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { autoUpdate, FloatingFocusManager, offset, shift, useClick, useDismiss, useFloating, useId, useInteractions, useRole } from '@floating-ui/react';
import {
  Comment,
  PublishCommentEditOptions,
  useAccount,
  usePublishCommentEdit,
  usePublishCommentModeration,
  PublishCommentModerationOptions,
} from '@plebbit/plebbit-react-hooks';
import styles from './edit-menu.module.css';
import { alertChallengeVerificationFailed } from '../../lib/utils/challenge-utils';
import useChallengesStore from '../../stores/use-challenges-store';
import _ from 'lodash';
import useIsMobile from '../../hooks/use-is-mobile';
import useAnonMode from '../../hooks/use-anon-mode';
import useAuthorPrivileges from '../../hooks/use-author-privileges';
import useAnonModeStore from '../../stores/use-anon-mode-store';

const { addChallenge } = useChallengesStore.getState();

const daysToTimestampInSeconds = (days: number) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return Math.floor(now.getTime() / 1000);
};

const timestampToDays = (timestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  return Math.max(1, Math.floor((timestamp - now) / (24 * 60 * 60)));
};

const EditMenu = ({ post }: { post: Comment }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { author, cid, content, deleted, isRules, locked, parentCid, pinned, postCid, reason, removed, spoiler, subplebbitAddress } = post || {};
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);

  const account = useAccount();
  const { getNewSigner, getExistingSigner } = useAnonMode(post?.postCid);
  const { getThreadSigner } = useAnonModeStore();

  const [signer, setSigner] = useState<any>(account?.signer);

  const { isCommentAuthorMod, isAccountMod, isAccountCommentAuthor } = useAuthorPrivileges({
    commentAuthorAddress: author?.address,
    subplebbitAddress,
    postCid,
  });

  const checkSigner = useCallback(async () => {
    if (isAccountCommentAuthor) {
      if (author?.address !== account?.author?.address) {
        // Check for existing thread signer first
        const threadSigner = getThreadSigner(postCid);
        if (threadSigner && threadSigner?.address === author?.address) {
          setSigner(threadSigner);
          return;
        }

        // If no thread signer, check for existing address signer
        const existingSigner = getExistingSigner(author?.address);
        if (existingSigner) {
          setSigner(existingSigner);
          return;
        }

        // If no existing signer, create a new one
        const newSigner = await getNewSigner();
        if (newSigner) {
          setSigner(newSigner);
        }
      } else {
        setSigner(account?.signer);
      }
    } else {
      setSigner(null);
    }
  }, [isAccountCommentAuthor, author?.address, postCid, account?.author?.address, account?.signer, getThreadSigner, getExistingSigner, getNewSigner]);

  useEffect(() => {
    checkSigner();
  }, [checkSigner]);

  const defaultPublishEditOptions = useMemo(() => {
    return {
      commentCid: cid,
      subplebbitAddress,
      // Author edit properties
      content: isAccountCommentAuthor ? content : undefined,
      deleted: isAccountCommentAuthor ? deleted ?? false : undefined,
      spoiler: isAccountCommentAuthor ? spoiler ?? false : undefined,
      // Mod edit properties
      commentModeration: isAccountMod
        ? {
            locked: locked ?? false,
            pinned: pinned ?? false,
            removed: removed ?? false,
            spoiler: spoiler ?? false,
            reason,
            banExpiresAt: post?.commentModeration?.banExpiresAt,
          }
        : undefined,
      onChallenge: (...args: any) => addChallenge([...args, post]),
      onChallengeVerification: alertChallengeVerificationFailed,
      onError: (error: Error) => {
        console.warn(error);
        alert('Comment edit failed. ' + error.message);
      },
    };
  }, [isAccountMod, isAccountCommentAuthor, cid, content, deleted, locked, pinned, reason, removed, spoiler, subplebbitAddress, post]);

  const [publishCommentEditOptions, setPublishCommentEditOptions] = useState<PublishCommentEditOptions>(defaultPublishEditOptions);

  const authorEditOptions = useMemo<PublishCommentEditOptions>(
    () => ({
      commentCid: cid,
      subplebbitAddress,
      signer,
      author: signer?.address === author?.address ? { address: signer?.address, displayName: post?.author?.displayName } : account?.author,
      content: publishCommentEditOptions.content,
      deleted: publishCommentEditOptions.deleted,
      reason: publishCommentEditOptions.reason,
      spoiler: publishCommentEditOptions.spoiler,
      onChallenge: (...args: any) => addChallenge([...args, post]),
      onChallengeVerification: alertChallengeVerificationFailed,
      onError: (error: Error) => {
        console.warn(error);
        alert('Comment edit failed. ' + error.message);
      },
    }),
    [publishCommentEditOptions, cid, subplebbitAddress, signer, post, account?.author, author?.address],
  );

  const modEditOptions = useMemo<PublishCommentModerationOptions>(
    () => ({
      commentCid: cid,
      subplebbitAddress,
      commentModeration: {
        locked: parentCid === undefined ? publishCommentEditOptions.commentModeration?.locked : undefined,
        pinned: publishCommentEditOptions.commentModeration?.pinned,
        removed: publishCommentEditOptions.commentModeration?.removed,
        spoiler: publishCommentEditOptions.commentModeration?.spoiler,
        reason: publishCommentEditOptions.reason,
        banExpiresAt: publishCommentEditOptions.commentModeration?.banExpiresAt,
      },
      author: account?.author,
      onChallenge: (...args: any) => addChallenge([...args, post]),
      onChallengeVerification: alertChallengeVerificationFailed,
      onError: (error: Error) => {
        console.warn(error);
        alert('Comment moderation failed. ' + error.message);
      },
    }),
    [publishCommentEditOptions, cid, subplebbitAddress, post, account?.author, parentCid],
  );

  const { publishCommentEdit: publishAuthorEdit } = usePublishCommentEdit(authorEditOptions);
  const { publishCommentModeration } = usePublishCommentModeration(modEditOptions);

  useEffect(() => {
    setPublishCommentEditOptions(defaultPublishEditOptions);
  }, [defaultPublishEditOptions]);

  const [banDuration, setBanDuration] = useState(() =>
    publishCommentEditOptions.commentModeration?.banExpiresAt ? timestampToDays(publishCommentEditOptions.commentModeration.banExpiresAt) : 1,
  );

  const onCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;

    setPublishCommentEditOptions((state) => {
      const newState = { ...state };

      if (isAccountMod) {
        newState.commentModeration = {
          ...newState.commentModeration,
          [id === 'banUser' ? 'banExpiresAt' : id]: id === 'banUser' ? (checked ? daysToTimestampInSeconds(banDuration) : undefined) : checked,
        };
      }

      if (isAccountCommentAuthor) {
        newState[id] = checked;
      }

      return newState;
    });
  };

  const onBanDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value, 10) || 1;
    setBanDuration(days);
    setPublishCommentEditOptions((state) => ({
      ...state,
      commentAuthor: { ...state.commentAuthor, banExpiresAt: daysToTimestampInSeconds(days) },
    }));
  };

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
      if (isAccountCommentAuthor && isAccountMod) {
        await publishAuthorEdit();
        await publishCommentModeration();
      } else if (isAccountCommentAuthor) {
        await publishAuthorEdit();
      } else if (isAccountMod) {
        await publishCommentModeration();
      }
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
      <span className={`${styles.checkbox} ${parentCid && styles.replyCheckbox}`} ref={refs.setReference} {...(cid && getReferenceProps())}>
        <input
          type='checkbox'
          onChange={() => {
            if (cid && (isAccountCommentAuthor || isAccountMod)) {
              setIsEditMenuOpen(!isEditMenuOpen);
            } else {
              setIsEditMenuOpen(false);
              alert(parentCid || isRules ? t('cannot_edit_reply') : t('cannot_edit_thread'));
            }
          }}
          checked={isEditMenuOpen}
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
                        value={publishCommentEditOptions.content || ''}
                        onChange={(e) => {
                          const newContent = e.target.value;
                          setPublishCommentEditOptions((state) => ({ ...state, content: newContent }));
                        }}
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
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.commentModeration?.removed ?? false} type='checkbox' id='removed' />
                      {_.capitalize(t('remove'))}?]
                    </label>
                  </div>
                  {!parentCid && (
                    <div className={styles.menuItem}>
                      [
                      <label>
                        <input onChange={onCheckbox} checked={publishCommentEditOptions.commentModeration?.locked ?? false} type='checkbox' id='locked' />
                        {_.capitalize(t('close_thread'))}?
                      </label>
                      ]
                    </div>
                  )}
                  <div className={styles.menuItem}>
                    [
                    <label>
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.commentModeration?.spoiler ?? false} type='checkbox' id='spoiler' />
                      {_.capitalize(t('spoiler'))}?
                    </label>
                    ]
                  </div>
                  <div className={styles.menuItem}>
                    [
                    <label>
                      <input onChange={onCheckbox} checked={publishCommentEditOptions.commentModeration?.pinned ?? false} type='checkbox' id='pinned' />
                      {_.capitalize(t('sticky'))}?
                    </label>
                    ]
                  </div>
                  {!isCommentAuthorMod && isAccountMod && !isAccountCommentAuthor && (
                    <div className={styles.menuItem}>
                      [
                      <label>
                        <input onChange={onCheckbox} checked={publishCommentEditOptions.commentModeration?.banExpiresAt !== undefined} type='checkbox' id='banUser' />
                        <Trans
                          i18nKey='ban_user_for'
                          shouldUnescape={true}
                          components={{
                            1: <input className={styles.banInput} onChange={onBanDurationChange} type='number' min={1} max={100} value={banDuration || ''} />,
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
                <input
                  type='text'
                  value={publishCommentEditOptions.reason || ''}
                  onChange={(e) => {
                    const newReason = e.target.value;
                    setPublishCommentEditOptions((state) => ({ ...state, reason: newReason }));
                  }}
                  size={14}
                />
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
