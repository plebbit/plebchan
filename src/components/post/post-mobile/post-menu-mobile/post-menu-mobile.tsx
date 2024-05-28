import { useState } from 'react';
import { createPortal } from 'react-dom';
import { autoUpdate, flip, FloatingFocusManager, offset, shift, useClick, useDismiss, useFloating, useId, useInteractions, useRole } from '@floating-ui/react';
import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './post-menu-mobile.module.css';

const PostMenuMobile = ({ post }: { post: Comment }) => {
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

  return (
    <>
      <span className={styles.postMenuBtn} title='Post menu' onClick={() => setIsMenuOpen((prev) => !prev)} ref={refs.setReference} {...getReferenceProps()}>
        ...
      </span>
      {isMenuOpen &&
        createPortal(
          <FloatingFocusManager context={context} modal={false}>
            <div className={styles.postMenu} ref={refs.setFloating} style={floatingStyles} aria-labelledby={headingId} {...getFloatingProps()}>
              <div className={styles.postMenuItem}>Copy link</div>
              <div className={styles.postMenuItem}>Search image on Google</div>
              <div className={styles.postMenuItem}>Search image on Yandex</div>
              <div className={styles.postMenuItem}>Search image on SauceNAO</div>
              <div className={styles.postMenuItem}>View on Seedit</div>
              <div className={styles.postMenuItem}>View on Plebones</div>
            </div>
          </FloatingFocusManager>,
          document.body,
        )}
    </>
  );
};

export default PostMenuMobile;
