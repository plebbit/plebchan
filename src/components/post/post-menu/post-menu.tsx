import { useState } from 'react';
import { autoUpdate, flip, FloatingFocusManager, offset, shift, useClick, useDismiss, useFloating, useId, useInteractions, useRole } from '@floating-ui/react';
import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './post-menu.module.css';

const PostMenu = ({ post }: Comment) => {
  const { cid, isDescription, isRules, link, subplebbitAddress } = post;
  const [menuBtnRotated, setMenuBtnRotated] = useState(false);
  const [isClientRedirectMenuOpen, setIsClientRedirectMenuOpen] = useState(false);

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

  const viewOnOtherClientLink = `p/${subplebbitAddress}${isDescription || isRules ? '' : `/c/${cid}`}`;

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
            <div
              className={`${styles.postMenuItem} ${styles.dropdown}`}
              onMouseOver={() => setIsClientRedirectMenuOpen(true)}
              onMouseLeave={() => setIsClientRedirectMenuOpen(false)}
            >
              View on »
              {isClientRedirectMenuOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.postMenuItem}>
                    <a href={`https://seedit.app/#/${viewOnOtherClientLink}`} target='_blank' rel='noreferrer'>
                      Seedit
                    </a>
                  </div>
                  <div className={styles.postMenuItem}>
                    <a href={`https://plebones.netlify.app/#/${viewOnOtherClientLink}`} target='_blank' rel='noreferrer'>
                      Plebones
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default PostMenu;
