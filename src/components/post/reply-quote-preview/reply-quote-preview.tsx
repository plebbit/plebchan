import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Comment } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { useFloating, offset, shift, size, autoUpdate, Placement } from '@floating-ui/react';
import useIsMobile from '../../../hooks/use-is-mobile';
import styles from '../post.module.css';
import Post from '../post';

interface ReplyQuotePreviewProps {
  isBacklinkReply?: boolean;
  backlinkReply?: Comment;
  isQuotelinkReply?: boolean;
  quotelinkReply?: Comment;
}

const handleQuoteHover = (cid: string, onElementOutOfView: () => void) => {
  const targetElement = document.getElementById(cid);

  if (!targetElement) return;

  const isInViewport = (element: HTMLElement) => {
    const bounding = element.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  if (isInViewport(targetElement)) {
    targetElement.classList.add('highlight');
  } else {
    targetElement.classList.remove('highlight');
    onElementOutOfView();
  }
};

const DesktopQuotePreview = ({ backlinkReply, quotelinkReply, isBacklinkReply, isQuotelinkReply }: ReplyQuotePreviewProps) => {
  const [hoveredCid, setHoveredCid] = useState<string | null>(null);
  const [outOfViewCid, setOutOfViewCid] = useState<string | null>(null);
  const placementRef = useRef<Placement>('right');
  const availableWidthRef = useRef<number>(0);

  const { refs, floatingStyles, update } = useFloating({
    placement: placementRef.current,
    middleware: [
      shift({ padding: 10 }),
      offset({ mainAxis: placementRef.current === 'right' ? 8 : 4 }),
      size({
        apply({ availableWidth, elements }) {
          availableWidthRef.current = availableWidth;
          if (availableWidth >= 250) {
            elements.floating.style.maxWidth = `${availableWidth - 12}px`;
          } else if (placementRef.current === 'right') {
            placementRef.current = 'left';
          }
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = availableWidthRef.current;
      if (availableWidth >= 250) {
        placementRef.current = 'right';
      } else {
        placementRef.current = 'left';
      }
      update();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [update]);

  const handleMouseOver = (cid: string | undefined) => {
    if (!cid) return;

    handleQuoteHover(cid, () => setOutOfViewCid(cid));
    setHoveredCid(cid);
  };

  const handleMouseLeave = (cid: string | null) => {
    if (cid) {
      const targetElement = document.getElementById(cid);
      if (targetElement) {
        targetElement.classList.remove('highlight');
      }
    }
    setHoveredCid(null);
    setOutOfViewCid(null);
  };

  const replyBacklink = (
    <>
      <Link
        className={styles.backlink}
        to={`/p/${backlinkReply?.subplebbitAddress}/c/${backlinkReply?.cid}`}
        ref={refs.setReference}
        onMouseOver={() => handleMouseOver(backlinkReply?.cid)}
        onMouseLeave={() => handleMouseLeave(backlinkReply?.cid)}
      >
        c/{backlinkReply?.shortCid}
      </Link>
      {hoveredCid === backlinkReply?.cid &&
        outOfViewCid === backlinkReply?.cid &&
        createPortal(
          <div className={styles.replyQuotePreview} ref={refs.setFloating} style={floatingStyles}>
            <Post post={backlinkReply} showReplies={false} />
          </div>,
          document.body,
        )}
    </>
  );

  const replyQuotelink = (
    <>
      <Link
        to={`/p/${quotelinkReply?.subplebbitAddress}/c/${quotelinkReply?.cid}`}
        ref={refs.setReference}
        className={styles.quoteLink}
        onMouseOver={() => handleMouseOver(quotelinkReply?.cid)}
        onMouseLeave={() => handleMouseLeave(quotelinkReply?.cid)}
      >
        {`c/${quotelinkReply?.cid && Plebbit.getShortCid(quotelinkReply.cid)}`}
      </Link>
      <br />
      {hoveredCid === quotelinkReply?.cid &&
        outOfViewCid === quotelinkReply?.cid &&
        createPortal(
          <div className={styles.replyQuotePreview} ref={refs.setFloating} style={floatingStyles}>
            <Post post={quotelinkReply} showReplies={false} />
          </div>,
          document.body,
        )}
    </>
  );

  return isBacklinkReply ? replyBacklink : isQuotelinkReply && replyQuotelink;
};

const MobileQuotePreview = ({ backlinkReply, quotelinkReply, isBacklinkReply, isQuotelinkReply }: ReplyQuotePreviewProps) => {
  const [hoveredCid, setHoveredCid] = useState<string | null>(null);
  const [outOfViewCid, setOutOfViewCid] = useState<string | null>(null);

  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom',
    middleware: [shift({ padding: isBacklinkReply ? 5 : 10 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    window.addEventListener('resize', () => update());
    return () => {
      window.removeEventListener('resize', () => update());
    };
  }, [update]);

  const handleMouseOver = (cid: string | undefined) => {
    if (!cid) return;

    handleQuoteHover(cid, () => setOutOfViewCid(cid));
    setHoveredCid(cid);
  };

  const handleMouseLeave = (cid: string | null) => {
    if (cid) {
      const targetElement = document.getElementById(cid);
      if (targetElement) {
        targetElement.classList.remove('highlight');
      }
    }
    setHoveredCid(null);
    setOutOfViewCid(null);
  };

  const replyBacklink = (
    <>
      <span
        className={styles.backlink}
        ref={refs.setReference}
        onMouseOver={() => handleMouseOver(backlinkReply?.cid)}
        onMouseLeave={() => handleMouseLeave(backlinkReply?.cid)}
      >
        c/{backlinkReply?.shortCid}{' '}
      </span>
      <Link to={`/p/${backlinkReply?.subplebbitAddress}/c/${backlinkReply?.cid}`} className={styles.backlinkHash}>
        #
      </Link>
      {hoveredCid === backlinkReply?.cid &&
        outOfViewCid === backlinkReply?.cid &&
        createPortal(
          <div className={styles.replyQuotePreview} ref={refs.setFloating} style={floatingStyles}>
            <Post post={backlinkReply} showReplies={false} />
          </div>,
          document.body,
        )}
    </>
  );

  const replyQuotelink = (
    <>
      <span
        ref={refs.setReference}
        className={styles.quoteLink}
        onMouseOver={() => handleMouseOver(quotelinkReply?.cid)}
        onMouseLeave={() => handleMouseLeave(quotelinkReply?.cid)}
      >
        c/{quotelinkReply?.shortCid}{' '}
      </span>
      <Link className={styles.quoteLink} to={`/p/${quotelinkReply?.subplebbitAddress}/c/${quotelinkReply?.cid}`}>
        #
      </Link>
      <br />
      {hoveredCid === quotelinkReply?.cid &&
        outOfViewCid === quotelinkReply?.cid &&
        createPortal(
          <div className={styles.replyQuotePreview} ref={refs.setFloating} style={floatingStyles}>
            <Post post={quotelinkReply} showReplies={false} />
          </div>,
          document.body,
        )}
    </>
  );

  return isBacklinkReply ? replyBacklink : isQuotelinkReply && replyQuotelink;
};

const ReplyQuotePreview = ({ backlinkReply, quotelinkReply, isBacklinkReply, isQuotelinkReply }: ReplyQuotePreviewProps) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileQuotePreview backlinkReply={backlinkReply} quotelinkReply={quotelinkReply} isBacklinkReply={isBacklinkReply} isQuotelinkReply={isQuotelinkReply} />
  ) : (
    <DesktopQuotePreview backlinkReply={backlinkReply} quotelinkReply={quotelinkReply} isBacklinkReply={isBacklinkReply} isQuotelinkReply={isQuotelinkReply} />
  );
};

export default ReplyQuotePreview;
