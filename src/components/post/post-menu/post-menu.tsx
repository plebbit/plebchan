import { useState } from 'react';
import { autoUpdate, flip, FloatingFocusManager, offset, shift, useClick, useDismiss, useFloating, useId, useInteractions, useRole } from '@floating-ui/react';
import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './post-menu.module.css';
import { getCommentMediaInfo } from '../../../lib/utils/media-utils';
import { copyShareLinkToClipboard, isValidURL } from '../../../lib/utils/url-utils';

interface PostMenuProps {
  cid: string;
  isDescription?: boolean;
  isRules?: boolean;
  subplebbitAddress: string;
  onClose: () => void;
}

const CopyLinkButton = ({ cid, subplebbitAddress, onClose }: PostMenuProps) => {
  return (
    <div
      onClick={() => {
        copyShareLinkToClipboard(subplebbitAddress, cid);
        onClose();
      }}
    >
      <div className={styles.postMenuItem}>Copy link</div>
    </div>
  );
};

const ImageSearchButton = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const [isImageSearchMenuOpen, setIsImageSearchMenuOpen] = useState(false);
  return (
    <div
      className={`${styles.postMenuItem} ${styles.dropdown}`}
      onMouseOver={() => setIsImageSearchMenuOpen(true)}
      onMouseLeave={() => setIsImageSearchMenuOpen(false)}
      onClick={onClose}
    >
      Image search »
      {isImageSearchMenuOpen && (
        <div className={styles.dropdownMenu}>
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

const ViewOnButton = ({ cid, isDescription, isRules, subplebbitAddress, onClose }: PostMenuProps) => {
  const [isClientRedirectMenuOpen, setIsClientRedirectMenuOpen] = useState(false);
  const viewOnOtherClientLink = `p/${subplebbitAddress}${isDescription || isRules ? '' : `/c/${cid}`}`;
  return (
    <div
      className={`${styles.postMenuItem} ${styles.dropdown}`}
      onMouseOver={() => setIsClientRedirectMenuOpen(true)}
      onMouseLeave={() => setIsClientRedirectMenuOpen(false)}
      onClick={onClose}
    >
      View on »
      {isClientRedirectMenuOpen && (
        <div className={styles.dropdownMenu}>
          <a href={`https://seedit.app/#/${viewOnOtherClientLink}`} target='_blank' rel='noreferrer'>
            <div className={styles.postMenuItem}>Seedit</div>
          </a>
          <a href={`https://plebones.netlify.app/#/${viewOnOtherClientLink}`} target='_blank' rel='noreferrer'>
            <div className={styles.postMenuItem}>Plebones</div>
          </a>
        </div>
      )}
    </div>
  );
};

const PostMenu = ({ post }: { post: Comment }) => {
  const { cid, isDescription, isRules, link, subplebbitAddress } = post;
  const commentMediaInfo = getCommentMediaInfo(post);
  const { thumbnail, type, url } = commentMediaInfo || {};
  const [menuBtnRotated, setMenuBtnRotated] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: menuBtnRotated,
    onOpenChange: setMenuBtnRotated,
    middleware: [offset({ mainAxis: 10, crossAxis: 5 }), flip({ fallbackAxisSideDirection: 'end' }), shift({ padding: 10 })],
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
      <span className={styles.postMenuBtnWrapper} ref={refs.setReference} {...getReferenceProps()}>
        <span
          className={styles.postMenuBtn}
          title='Post menu'
          onClick={() => setMenuBtnRotated((prev) => !prev)}
          style={{ transform: menuBtnRotated ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
      </span>
      {menuBtnRotated && (
        <FloatingFocusManager context={context} modal={false}>
          <div className={styles.postMenu} ref={refs.setFloating} style={floatingStyles} aria-labelledby={headingId} {...getFloatingProps()}>
            {cid && subplebbitAddress && <CopyLinkButton cid={cid} subplebbitAddress={subplebbitAddress} onClose={handleClose} />}
            {link && isValidURL(link) && (type === 'image' || type === 'gif' || thumbnail) && url && <ImageSearchButton url={url} onClose={handleClose} />}
            <ViewOnButton cid={cid} isDescription={isDescription} isRules={isRules} subplebbitAddress={subplebbitAddress} onClose={handleClose} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default PostMenu;
