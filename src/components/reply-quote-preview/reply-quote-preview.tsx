import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Comment, useAccount } from '@plebbit/plebbit-react-hooks';
import { useFloating, offset, shift, size, autoUpdate, Placement } from '@floating-ui/react';
import useAnonModeStore from '../../stores/use-anon-mode-store';
import useIsMobile from '../../hooks/use-is-mobile';
import styles from '../../views/post/post.module.css';
import { Post } from '../../views/post';

interface ReplyQuotePreviewProps {
  isBacklinkReply?: boolean;
  backlinkReply?: Comment;
  isQuotelinkReply?: boolean;
  quotelinkReply?: Comment;
}

const handleQuoteHover = (cid: string, onElementOutOfView: () => void) => {
  const targetElements = document.querySelectorAll(`[data-cid="${cid}"]`);

  const isInViewport = (element: HTMLElement) => {
    const bounding = element.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  let anyInView = false;

  targetElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    if (isInViewport(htmlElement)) {
      const hasHighlight = Array.from(htmlElement.classList).some((className) => className.includes('highlight') && !className.includes('double-highlight'));
      if (hasHighlight) {
        htmlElement.classList.remove('highlight');
        htmlElement.classList.add('double-highlight');
      } else {
        htmlElement.classList.remove('double-highlight');
        htmlElement.classList.add('highlight');
      }
      anyInView = true;
    } else {
      // If not in view, remove both classes
      htmlElement.classList.remove('highlight', 'double-highlight');
    }
  });

  if (!anyInView) {
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

  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent, cid: string | undefined, subplebbitAddress: string | undefined) => {
    e.preventDefault();
    if (cid && subplebbitAddress) {
      navigate(`/p/${subplebbitAddress}/c/${cid}`);
      setTimeout(() => {
        const element = document.querySelector(`[data-cid="${cid}"]`);
        element?.scrollIntoView();
      }, 100);
    }
  };

  const handleMouseOver = (cid: string | undefined) => {
    if (!cid) return;

    handleQuoteHover(cid, () => setOutOfViewCid(cid));
    setHoveredCid(cid);
  };

  const handleMouseLeave = (cid: string | null) => {
    if (cid) {
      const targetElements = document.querySelectorAll(`[data-cid="${cid}"]`);
      targetElements.forEach((element) => {
        element.classList.remove('highlight');
        element.classList.remove('double-highlight');
      });
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
        onClick={(e) => handleClick(e, backlinkReply?.cid, backlinkReply?.subplebbitAddress)}
      >
        {'>>'}
        {backlinkReply?.shortCid}
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

  const account = useAccount();
  const { getThreadSigner } = useAnonModeStore();
  const threadSigner = quotelinkReply?.postCid ? getThreadSigner(quotelinkReply?.postCid) : null;

  const replyQuotelink = (
    <>
      <Link
        to={`/p/${quotelinkReply?.subplebbitAddress}/c/${quotelinkReply?.cid}`}
        ref={refs.setReference}
        className={styles.quoteLink}
        onMouseOver={() => handleMouseOver(quotelinkReply?.cid)}
        onMouseLeave={() => handleMouseLeave(quotelinkReply?.cid)}
        onClick={(e) => handleClick(e, quotelinkReply?.cid, quotelinkReply?.subplebbitAddress)}
      >
        {quotelinkReply?.shortCid && `>>${quotelinkReply?.shortCid}`}
        {(quotelinkReply?.author?.address === account?.author?.address || quotelinkReply?.author?.address === threadSigner?.address) && ' (You)'}
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

  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent, cid: string | undefined, subplebbitAddress: string | undefined) => {
    e.preventDefault();
    if (cid && subplebbitAddress) {
      navigate(`/p/${subplebbitAddress}/c/${cid}`);
      setTimeout(() => {
        const element = document.querySelector(`[data-cid="${cid}"]`);
        element?.scrollIntoView();
      }, 100);
    }
  };

  const handleMouseOver = (cid: string | undefined) => {
    if (!cid) return;

    handleQuoteHover(cid, () => setOutOfViewCid(cid));
    setHoveredCid(cid);
  };

  const handleMouseLeave = (cid: string | null) => {
    if (cid) {
      const targetElements = document.querySelectorAll(`[data-cid="${cid}"]`);
      targetElements.forEach((element) => {
        element.classList.remove('highlight');
        element.classList.remove('double-highlight');
      });
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
        {backlinkReply?.shortCid && `>>${backlinkReply?.shortCid}`}
      </span>
      {backlinkReply?.shortCid && (
        <Link
          to={`/p/${backlinkReply?.subplebbitAddress}/c/${backlinkReply?.cid}`}
          className={styles.backlinkHash}
          onClick={(e) => handleClick(e, backlinkReply?.cid, backlinkReply?.subplebbitAddress)}
        >
          {' '}
          #
        </Link>
      )}
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

  const account = useAccount();
  const { getThreadSigner } = useAnonModeStore();
  const threadSigner = quotelinkReply?.postCid ? getThreadSigner(quotelinkReply?.postCid) : null;

  const replyQuotelink = (
    <>
      <span
        ref={refs.setReference}
        className={styles.quoteLink}
        onMouseOver={() => handleMouseOver(quotelinkReply?.cid)}
        onMouseLeave={() => handleMouseLeave(quotelinkReply?.cid)}
      >
        {quotelinkReply?.shortCid && `>>${quotelinkReply?.shortCid}`}
        {(quotelinkReply?.author?.address === account?.author?.address || quotelinkReply?.author?.address === threadSigner?.address) && ' (You)'}
      </span>
      {quotelinkReply?.shortCid && (
        <Link
          className={styles.quoteLink}
          to={`/p/${quotelinkReply?.subplebbitAddress}/c/${quotelinkReply?.cid}`}
          onClick={(e) => handleClick(e, quotelinkReply?.cid, quotelinkReply?.subplebbitAddress)}
        >
          {' '}
          #
        </Link>
      )}
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
