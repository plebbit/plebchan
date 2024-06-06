import { useCallback, useEffect, useRef, useState } from 'react';
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

const DesktopQuotePreview = ({ backlinkReply, quotelinkReply, isBacklinkReply, isQuotelinkReply }: ReplyQuotePreviewProps) => {
  const [hoveredCid, setHoveredCid] = useState<string | null>(null);
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

  const replyBacklink = (
    <>
      <Link
        className={styles.backlink}
        to={`/p/${backlinkReply?.subplebbitAddress}/c/${backlinkReply?.cid}`}
        ref={refs.setReference}
        onMouseOver={() => setHoveredCid(backlinkReply?.cid)}
        onMouseLeave={() => setHoveredCid(null)}
      >
        c/{backlinkReply?.shortCid}
      </Link>
      {hoveredCid === backlinkReply?.cid &&
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
        onMouseOver={() => setHoveredCid(quotelinkReply?.cid)}
        onMouseLeave={() => setHoveredCid(null)}
      >
        {`c/${quotelinkReply?.cid && Plebbit.getShortCid(quotelinkReply.cid)}`}
      </Link>
      <br />
      {hoveredCid === quotelinkReply?.cid &&
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
  const placementRef = useRef<Placement>('bottom');
  const quotelinkRef = useRef<HTMLSpanElement>(null);

  const { refs, floatingStyles, update } = useFloating({
    placement: placementRef.current,
    middleware: [shift({ padding: 10 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    window.addEventListener('resize', () => update());
    return () => {
      window.removeEventListener('resize', () => update());
    };
  }, [update]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (quotelinkRef.current && !quotelinkRef.current.contains(event.target as Node)) {
        setHoveredCid(null);
      }
    },
    [quotelinkRef, setHoveredCid],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const replyBacklink = (
    <span ref={quotelinkRef}>
      <span className={styles.backlink} ref={refs.setReference} onClick={() => setHoveredCid(backlinkReply?.cid)}>
        c/{backlinkReply?.shortCid}{' '}
      </span>
      <Link to={`/p/${backlinkReply?.subplebbitAddress}/c/${backlinkReply?.cid}`} className={styles.backlinkHash}>
        #
      </Link>
      {hoveredCid === backlinkReply?.cid &&
        createPortal(
          <div className={styles.replyQuotePreview} ref={refs.setFloating} style={floatingStyles}>
            <Post post={backlinkReply} showReplies={false} />
          </div>,
          document.body,
        )}
    </span>
  );

  const replyQuotelink = (
    <span ref={quotelinkRef}>
      <span ref={refs.setReference} className={styles.quoteLink} onClick={() => setHoveredCid(quotelinkReply?.cid)}>
        {quotelinkReply?.shortCid}{' '}
      </span>
      <Link className={styles.quoteLink} to={`/p/${quotelinkReply?.subplebbitAddress}/c/${quotelinkReply?.cid}`}>
        #
      </Link>
      <br />
      {hoveredCid === quotelinkReply?.cid &&
        createPortal(
          <div className={styles.replyQuotePreview} ref={refs.setFloating} style={floatingStyles}>
            <Post post={quotelinkReply} showReplies={false} />
          </div>,
          document.body,
        )}
    </span>
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
