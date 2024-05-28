import { useState } from 'react';
import { createPortal } from 'react-dom';
import { autoUpdate, flip, FloatingFocusManager, offset, shift, useClick, useDismiss, useFloating, useId, useInteractions, useRole } from '@floating-ui/react';
import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './post-menu-mobile.module.css';
import { getCommentMediaInfo } from '../../../../lib/utils/media-utils';
import { copyShareLinkToClipboard, isValidURL } from '../../../../lib/utils/url-utils';

interface PostMenuMobileProps {
  cid: string;
  isDescription?: boolean;
  isRules?: boolean;
  subplebbitAddress: string;
  onClose: () => void;
}

const CopyLinkButton = ({ cid, subplebbitAddress, onClose }: PostMenuMobileProps) => {
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

const ImageSearchButtons = ({ url, onClose }: { url: string; onClose: () => void }) => {
  return (
    <div onClick={onClose}>
      <a href={`https://lens.google.com/uploadbyurl?url=${url}`} target='_blank' rel='noreferrer'>
        <div className={styles.postMenuItem}>Search image on Google</div>
      </a>
      <a href={`https://www.yandex.com/images/search?img_url=${url}&rpt=imageview`} target='_blank' rel='noreferrer'>
        <div className={styles.postMenuItem}>Search image on Yandex</div>
      </a>
      <a href={`https://saucenao.com/search.php?url=${url}`} target='_blank' rel='noreferrer'>
        <div className={styles.postMenuItem}>Search image on SauceNAO</div>
      </a>
    </div>
  );
};

const ViewOnButtons = ({ cid, isDescription, isRules, subplebbitAddress, onClose }: PostMenuMobileProps) => {
  const viewOnOtherClientLink = `p/${subplebbitAddress}${isDescription || isRules ? '' : `/c/${cid}`}`;

  return (
    <div onClick={onClose}>
      <a href={`https://seedit.app/#/${viewOnOtherClientLink}`} target='_blank' rel='noreferrer'>
        <div className={styles.postMenuItem}>View on Seedit</div>
      </a>
      <a href={`https://plebones.netlify.app/#/${viewOnOtherClientLink}`} target='_blank' rel='noreferrer'>
        <div className={styles.postMenuItem}>View on Plebones</div>
      </a>
    </div>
  );
};

const PostMenuMobile = ({ post }: { post: Comment }) => {
  const { cid, isDescription, isRules, link, subplebbitAddress } = post;
  const commentMediaInfo = getCommentMediaInfo(post);
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

  const handleClose = () => setIsMenuOpen(false);

  return (
    <>
      <span className={styles.postMenuBtn} title='Post menu' onClick={() => setIsMenuOpen((prev) => !prev)} ref={refs.setReference} {...getReferenceProps()}>
        ...
      </span>
      {isMenuOpen &&
        createPortal(
          <FloatingFocusManager context={context} modal={false}>
            <div className={styles.postMenu} ref={refs.setFloating} style={floatingStyles} aria-labelledby={headingId} {...getFloatingProps()}>
              {cid && subplebbitAddress && <CopyLinkButton cid={cid} subplebbitAddress={subplebbitAddress} onClose={handleClose} />}
              {link && isValidURL(link) && (type === 'image' || type === 'gif' || thumbnail) && url && <ImageSearchButtons url={url} onClose={handleClose} />}
              <ViewOnButtons cid={cid} isDescription={isDescription} isRules={isRules} subplebbitAddress={subplebbitAddress} onClose={handleClose} />
            </div>
          </FloatingFocusManager>,
          document.body,
        )}
    </>
  );
};

export default PostMenuMobile;
