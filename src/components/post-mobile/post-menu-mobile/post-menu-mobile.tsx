import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Comment, useBlock } from '@plebbit/plebbit-react-hooks';
import { autoUpdate, flip, FloatingFocusManager, offset, shift, useClick, useDismiss, useFloating, useId, useInteractions, useRole } from '@floating-ui/react';
import styles from './post-menu-mobile.module.css';
import { getCommentMediaInfo } from '../../../lib/utils/media-utils';
import { copyShareLinkToClipboard, isValidURL } from '../../../lib/utils/url-utils';
import useEditCommentPrivileges from '../../../hooks/use-author-privileges';
import useHide from '../../../hooks/use-hide';
import EditMenu from '../../edit-menu/edit-menu';
import { isBoardView, isPostPageView } from '../../../lib/utils/view-utils';
import { useLocation, useParams } from 'react-router-dom';

interface PostMenuMobileProps {
  cid: string;
  isDescription?: boolean;
  isReply?: boolean;
  isRules?: boolean;
  postCid?: string;
  subplebbitAddress?: string;
  onClose?: () => void;
}

const CopyLinkButton = ({ cid, subplebbitAddress, onClose }: PostMenuMobileProps) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={() => {
        if (subplebbitAddress) {
          copyShareLinkToClipboard(subplebbitAddress, cid);
        }
        onClose && onClose();
      }}
    >
      <div className={styles.postMenuItem}>{t('copy_link')}</div>
    </div>
  );
};

const ImageSearchButtons = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <div onClick={onClose}>
      <a href={`https://lens.google.com/uploadbyurl?url=${url}`} target='_blank' rel='noreferrer'>
        <div className={styles.postMenuItem}>{t('search_image_on_google')}</div>
      </a>
      <a href={`https://www.yandex.com/images/search?img_url=${url}&rpt=imageview`} target='_blank' rel='noreferrer'>
        <div className={styles.postMenuItem}>{t('search_image_on_yandex')}</div>
      </a>
      <a href={`https://saucenao.com/search.php?url=${url}`} target='_blank' rel='noreferrer'>
        <div className={styles.postMenuItem}>{t('search_image_on_saucenao')}</div>
      </a>
    </div>
  );
};

const HidePostButton = ({ cid, isReply, onClose, postCid }: PostMenuMobileProps) => {
  const { t } = useTranslation();
  const { hide, hidden, unhide } = useHide({ cid });
  const isInPostView = isPostPageView(useLocation().pathname, useParams());

  return (
    (!isInPostView || isReply) && (
      <div
        onClick={() => {
          hidden ? unhide() : hide();
          onClose && onClose();
        }}
      >
        <div className={styles.postMenuItem}>
          {hidden ? (postCid === cid ? t('unhide_thread') : t('unhide_post')) : postCid === cid ? t('hide_thread') : t('hide_post')}
        </div>
      </div>
    )
  );
};

const BlockUserButton = ({ address }: { address: string }) => {
  const { t } = useTranslation();
  const { blocked, unblock, block } = useBlock({ address });
  return (
    <div className={styles.postMenuItem} onClick={blocked ? unblock : block}>
      {blocked ? t('unblock_user') : t('block_user')}
    </div>
  );
};

const BlockBoardButton = ({ address }: { address: string }) => {
  const { t } = useTranslation();
  const { blocked, unblock, block } = useBlock({ address });
  return (
    <div className={styles.postMenuItem} onClick={blocked ? unblock : block}>
      {blocked ? t('unblock_board') : t('block_board')}
    </div>
  );
};

const PostMenuMobile = ({ post }: { post: Comment }) => {
  const { author, cid, deleted, isDescription, isRules, link, linkHeight, linkWidth, parentCid, postCid, removed, subplebbitAddress, thumbnailUrl } = post || {};
  const { isAccountMod, isAccountCommentAuthor } = useEditCommentPrivileges({ commentAuthorAddress: author?.address, subplebbitAddress });
  const commentMediaInfo = getCommentMediaInfo(link, thumbnailUrl, linkWidth, linkHeight);
  const { thumbnail, type, url } = commentMediaInfo || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isMenuOpen,
    onOpenChange: setIsMenuOpen,
    middleware: [offset({ mainAxis: 3, crossAxis: 8 }), flip(), shift({ padding: 10 })],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  const headingId = useId();

  const handleMenuClick = () => {
    if (cid) {
      setIsMenuOpen((prev) => !prev);
    }
  };

  const handleClose = () => setIsMenuOpen(false);

  const isInBoardView = isBoardView(useLocation().pathname, useParams());

  return (
    <>
      {!(deleted || removed) && (
        <>
          <span className={styles.postMenuBtn} title='Post menu' onClick={handleMenuClick} ref={refs.setReference} {...getReferenceProps()}>
            ...
          </span>
          {isMenuOpen &&
            (cid || isDescription || isRules) &&
            createPortal(
              <FloatingFocusManager context={context} modal={false}>
                <div className={styles.postMenu} ref={refs.setFloating} style={floatingStyles} aria-labelledby={headingId} {...getFloatingProps()}>
                  {cid && subplebbitAddress && <CopyLinkButton cid={cid} subplebbitAddress={subplebbitAddress} onClose={handleClose} />}
                  {cid && subplebbitAddress && <HidePostButton cid={cid} isReply={parentCid} postCid={postCid} onClose={handleClose} />}
                  {cid && subplebbitAddress && !isDescription && !isRules && <BlockUserButton address={author?.address} />}
                  {cid && subplebbitAddress && !isInBoardView && !isDescription && !isRules && <BlockBoardButton address={subplebbitAddress} />}
                  {link && isValidURL(link) && (type === 'image' || type === 'gif' || thumbnail) && url && <ImageSearchButtons url={url} onClose={handleClose} />}
                </div>
              </FloatingFocusManager>,
              document.body,
            )}
        </>
      )}
      {(isAccountMod || isAccountCommentAuthor) && cid && (
        <span className={styles.checkbox}>
          <EditMenu post={post} />
        </span>
      )}
    </>
  );
};

export default PostMenuMobile;
