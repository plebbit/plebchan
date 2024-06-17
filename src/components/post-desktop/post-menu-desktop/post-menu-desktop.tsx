import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { autoUpdate, flip, FloatingFocusManager, offset, shift, useClick, useDismiss, useFloating, useId, useInteractions, useRole } from '@floating-ui/react';
import { Comment, useBlock } from '@plebbit/plebbit-react-hooks';
import styles from './post-menu-desktop.module.css';
import { getCommentMediaInfo } from '../../../lib/utils/media-utils';
import { copyShareLinkToClipboard, isValidURL } from '../../../lib/utils/url-utils';
import { isAllView, isCatalogView, isPostPageView, isSubscriptionsView } from '../../../lib/utils/view-utils';
import useHide from '../../../hooks/use-hide';
import _ from 'lodash';

interface PostMenuDesktopProps {
  cid: string;
  isDescription?: boolean;
  isInAllView?: boolean;
  isInSubscriptionsView?: boolean;
  isRules?: boolean;
  subplebbitAddress: string;
  onClose: () => void;
}

const CopyLinkButton = ({ cid, subplebbitAddress, onClose }: PostMenuDesktopProps) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={() => {
        copyShareLinkToClipboard(subplebbitAddress, cid);
        onClose();
      }}
    >
      <div className={styles.postMenuItem}>{t('copy_link')}</div>
    </div>
  );
};

const ImageSearchButton = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const { t } = useTranslation();
  const [isImageSearchMenuOpen, setIsImageSearchMenuOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: 'right-start',
    middleware: [flip(), shift({ padding: 10 })],
  });

  return (
    <div
      className={`${styles.postMenuItem} ${styles.dropdown}`}
      onMouseOver={() => setIsImageSearchMenuOpen(true)}
      onMouseLeave={() => setIsImageSearchMenuOpen(false)}
      ref={refs.setReference}
      onClick={onClose}
    >
      {_.capitalize(t('image_search'))} »
      {isImageSearchMenuOpen && (
        <div ref={refs.setFloating} style={floatingStyles} className={styles.dropdownMenu}>
          <a href={`https://lens.google.com/uploadbyurl?url=${url}`} target='_blank' rel='noreferrer'>
            <div className={styles.postMenuItem}>Google</div>
          </a>
          <a href={`https://www.yandex.com/images/search?img_url=${url}&rpt=imageview`} target='_blank' rel='noreferrer'>
            <div className={styles.postMenuItem}>Yandex</div>
          </a>
          <a href={`https://saucenao.com/search.php?url=${url}`} target='_blank' rel='noreferrer'>
            <div className={styles.postMenuItem}>SauceNAO</div>
          </a>
        </div>
      )}
    </div>
  );
};

const ViewOnButton = ({ cid, isDescription, isInAllView, isInSubscriptionsView, isRules, subplebbitAddress, onClose }: PostMenuDesktopProps) => {
  const { t } = useTranslation();
  const [isClientRedirectMenuOpen, setIsClientRedirectMenuOpen] = useState(false);
  const viewOnOtherClientLink = `p/${isInAllView ? 'all' : isInSubscriptionsView ? 'subscriptions' : subplebbitAddress}${isDescription || isRules ? '' : `/c/${cid}`}`;

  const { refs, floatingStyles } = useFloating({
    placement: 'right-start',
    middleware: [flip(), shift({ padding: 10 })],
  });

  return (
    <div
      className={`${styles.postMenuItem} ${styles.dropdown}`}
      onMouseOver={() => setIsClientRedirectMenuOpen(true)}
      onMouseLeave={() => setIsClientRedirectMenuOpen(false)}
      ref={refs.setReference}
      onClick={onClose}
    >
      {_.capitalize(t('view_on'))} »
      {isClientRedirectMenuOpen && (
        <div ref={refs.setFloating} style={floatingStyles} className={styles.dropdownMenu}>
          <a href={`https://seedit.eth.limo/#/${viewOnOtherClientLink}`} target='_blank' rel='noreferrer'>
            <div className={styles.postMenuItem}>Seedit</div>
          </a>
          <a href={`https://plebones.eth.limo/#/${viewOnOtherClientLink}`} target='_blank' rel='noreferrer'>
            <div className={styles.postMenuItem}>Plebones</div>
          </a>
        </div>
      )}
    </div>
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

const PostMenuDesktop = ({ post }: { post: Comment }) => {
  const { t } = useTranslation();
  const { author, cid, isDescription, isRules, link, postCid, subplebbitAddress } = post || {};
  const commentMediaInfo = getCommentMediaInfo(post);
  const { thumbnail, type, url } = commentMediaInfo || {};
  const [menuBtnRotated, setMenuBtnRotated] = useState(false);

  const { hidden, unhide, hide } = useHide({ cid });

  const location = useLocation();
  const params = useParams();
  const isInAllView = isAllView(location.pathname, params);
  const isInCatalogView = isCatalogView(location.pathname, params);
  const isInPostPageView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: menuBtnRotated,
    onOpenChange: setMenuBtnRotated,
    middleware: [offset({ mainAxis: isInCatalogView ? -2 : 6, crossAxis: isInCatalogView ? -1 : 5 }), flip({ fallbackAxisSideDirection: 'end' }), shift({ padding: 10 })],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  const headingId = useId();

  const handleClose = () => setMenuBtnRotated(false);

  return (
    <>
      <span className={isInCatalogView ? styles.postMenuBtnCatalogWrapper : styles.postMenuBtnWrapper} ref={refs.setReference} {...getReferenceProps()}>
        <span
          className={isInCatalogView ? styles.postMenuBtnCatalog : styles.postMenuBtn}
          title='Post menu'
          onClick={() => setMenuBtnRotated((prev) => !prev)}
          style={{ transform: menuBtnRotated ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
      </span>
      {menuBtnRotated &&
        createPortal(
          <FloatingFocusManager context={context} modal={false}>
            <div className={styles.postMenu} ref={refs.setFloating} style={floatingStyles} aria-labelledby={headingId} {...getFloatingProps()}>
              {cid && subplebbitAddress && <CopyLinkButton cid={cid} subplebbitAddress={subplebbitAddress} onClose={handleClose} />}
              {!isInPostPageView && !isDescription && !isRules && (
                <div
                  className={styles.postMenuItem}
                  onClick={() => {
                    hidden ? unhide() : hide();
                    handleClose();
                  }}
                >
                  {hidden ? (postCid === cid ? t('unhide_thread') : t('unhide_post')) : postCid === cid ? t('hide_thread') : t('hide_post')}
                </div>
              )}
              {link && isValidURL(link) && (type === 'image' || type === 'gif' || thumbnail) && url && <ImageSearchButton url={url} onClose={handleClose} />}
              <ViewOnButton
                cid={cid}
                isDescription={isDescription}
                isInAllView={isInAllView}
                isInSubscriptionsView={isInSubscriptionsView}
                isRules={isRules}
                subplebbitAddress={subplebbitAddress}
                onClose={handleClose}
              />
              <BlockUserButton address={author?.address} />
              {(isInAllView || isInSubscriptionsView) && <BlockBoardButton address={subplebbitAddress} />}
            </div>
          </FloatingFocusManager>,
          document.body,
        )}
    </>
  );
};

export default PostMenuDesktop;
