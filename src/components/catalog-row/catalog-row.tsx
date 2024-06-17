import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Comment, useComment } from '@plebbit/plebbit-react-hooks';
import { useFloating, offset, shift, size, autoUpdate, Placement } from '@floating-ui/react';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isAllView } from '../../lib/utils/view-utils';
import useCatalogStyleStore from '../../stores/use-catalog-style-store';
import useEditCommentPrivileges from '../../hooks/use-author-privileges';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import useHide from '../../hooks/use-hide';
import PostMenuDesktop from '../post-desktop/post-menu-desktop';
import styles from './catalog-row.module.css';
import Markdown from '../markdown';
import _ from 'lodash';

interface CatalogPostMediaProps {
  commentMediaInfo: any;
  isOutOfFeed?: boolean;
  linkWidth?: number;
  linkHeight?: number;
}

export const CatalogPostMedia = ({ commentMediaInfo, isOutOfFeed, linkWidth, linkHeight }: CatalogPostMediaProps) => {
  const { patternThumbnailUrl, thumbnail, type, url } = commentMediaInfo || {};
  const iframeThumbnail = patternThumbnailUrl || thumbnail;
  const gifFrameUrl = useFetchGifFirstFrame(type === 'gif' ? url : undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);
  const loadingStyle = { display: isLoaded ? 'block' : 'none' };

  let displayWidth, displayHeight;
  const maxThumbnailSize = 150;

  if (linkWidth && linkHeight) {
    let scale = Math.min(1, maxThumbnailSize / Math.max(linkWidth, linkHeight));
    displayWidth = `${linkWidth * scale}px`;
    displayHeight = `${linkHeight * scale}px`;
  } else {
    displayWidth = `${maxThumbnailSize}px`;
    displayHeight = `${maxThumbnailSize}px`;
  }

  if (type === 'audio' || isOutOfFeed) {
    displayWidth = 'unset';
    displayHeight = 'unset';
  }

  const { imageSize } = useCatalogStyleStore();
  const maxWidth = imageSize === 'Large' ? '250px' : '150px';
  const maxHeight = imageSize === 'Large' ? '250px' : '150px';

  const CSSProperties = {
    '--width': displayWidth,
    '--height': displayHeight,
    '--maxWidth': maxWidth,
    '--maxHeight': maxHeight,
  } as React.CSSProperties;

  let thumbnailComponent: React.ReactNode = null;

  if (type === 'image' && !hasError) {
    thumbnailComponent = <img src={url} alt='' onLoad={handleLoad} onError={handleError} style={loadingStyle} />;
  } else if (type === 'video' && !hasError) {
    thumbnailComponent = thumbnail ? (
      <img src={thumbnail} alt='' onLoad={handleLoad} onError={handleError} style={loadingStyle} />
    ) : (
      // show first frame of the video, as a workaround for Safari not loading thumbnails
      <video src={`${url}#t=0.001`} onError={handleError} />
    );
  } else if (type === 'webpage' && !hasError) {
    thumbnailComponent = <img src={thumbnail} alt='' onLoad={handleLoad} onError={handleError} style={loadingStyle} />;
  } else if (type === 'iframe' && iframeThumbnail && !hasError) {
    thumbnailComponent = <img src={iframeThumbnail} alt='' onLoad={handleLoad} onError={handleError} style={loadingStyle} />;
  } else if (type === 'gif' && gifFrameUrl && !hasError) {
    thumbnailComponent = <img src={gifFrameUrl} alt='' onLoad={handleLoad} onError={handleError} style={loadingStyle} />;
  } else if (type === 'audio') {
    thumbnailComponent = <audio src={url} controls />;
  }

  return (
    <div className={hasError ? '' : styles.mediaWrapper} style={CSSProperties}>
      {!isLoaded && !hasError && type !== 'video' && type !== 'audio' && <span className={styles.loadingSkeleton} />}
      {hasError ? <img className={styles.fileDeleted} src='/assets/filedeleted-res.gif' alt='' /> : thumbnailComponent}
    </div>
  );
};

const CatalogPost = ({ post }: { post: Comment }) => {
  const { t } = useTranslation();
  const {
    author,
    cid,
    content,
    isDescription,
    isRules,
    lastChildCid,
    link,
    linkHeight,
    linkWidth,
    locked,
    pinned,
    replyCount,
    spoiler,
    subplebbitAddress,
    timestamp,
    title,
  } = post || {};
  const commentMediaInfo = getCommentMediaInfo(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const { hidden } = useHide({ cid });

  const location = useLocation();
  const isInAllView = isAllView(location.pathname, useParams());

  const postLink = isInAllView && isDescription ? `/p/all/description` : `/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${cid}`}`;

  const linkCount = useCountLinksInReplies(post);

  const threadIcons = (
    <div className={styles.threadIcons}>
      {pinned && <span className={styles.stickyIcon} title={t('sticky')} />}
      {locked && <span className={styles.closedIcon} title={t('closed')} />}
    </div>
  );

  const [hoveredCid, setHoveredCid] = useState<string | null>(null);
  const [showPortal, setShowPortal] = useState<boolean>(false);
  const placementRef = useRef<Placement>('right-start');
  const availableWidthRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { refs, floatingStyles, update } = useFloating({
    open: showPortal,
    placement: placementRef.current,
    middleware: [
      shift({ padding: 10 }),
      offset({ mainAxis: 5 }),
      size({
        apply({ availableWidth, elements }) {
          availableWidthRef.current = availableWidth;
          if (availableWidth >= 250) {
            elements.floating.style.maxWidth = `${availableWidth - 12}px`;
          } else if (placementRef.current === 'right-start') {
            placementRef.current = 'left-start';
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
        placementRef.current = 'right-start';
      } else {
        placementRef.current = 'left-start';
      }
      update();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [update]);

  const lastReply = useComment({ commentCid: lastChildCid });

  const { isCommentAuthorMod: isCatalogPostAuthorMod, commentAuthorRole: catalogPostAuthorRole } = useEditCommentPrivileges({
    commentAuthorAddress: author?.address,
    subplebbitAddress,
  });
  const { isCommentAuthorMod: isLastReplyAuthorMod, commentAuthorRole: lastReplyAuthorRole } = useEditCommentPrivileges({
    commentAuthorAddress: lastReply?.author?.address,
    subplebbitAddress,
  });

  const postContent = (
    <div className={`${styles.teaser} ${hidden && styles.hidden}`}>
      {hidden ? <b>({t('hidden')})</b> : <Markdown title={title} content={content} spoiler={spoiler} />}
    </div>
  );

  const { imageSize, showOPComment } = useCatalogStyleStore();

  return (
    <>
      <div className={`${styles.post} ${imageSize === 'Large' ? styles.large : ''}`}>
        <div onMouseOver={() => setHoveredCid(isDescription ? 'd' : isRules ? 'r' : cid)} onMouseLeave={() => setHoveredCid(null)}>
          {hidden ? (
            <Link to={postLink}>
              <span className={styles.hiddenThumbnail} />
            </Link>
          ) : hasThumbnail ? (
            <Link to={postLink}>
              <div
                className={`${styles.mediaPaddingWrapper} ${hidden && styles.hidden}`}
                ref={refs.setReference}
                onMouseOver={() => (timeoutRef.current = setTimeout(() => setShowPortal(true), 250))}
                onMouseLeave={() => {
                  setShowPortal(false);
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                  }
                }}
              >
                {threadIcons}
                {spoiler ? (
                  <span className={styles.spoilerThumbnail}>
                    <span className={styles.spoilerText}>{t('spoiler')}</span>
                  </span>
                ) : (
                  <CatalogPostMedia commentMediaInfo={commentMediaInfo} isOutOfFeed={isDescription || isRules} linkWidth={linkWidth} linkHeight={linkHeight} />
                )}
              </div>
            </Link>
          ) : (
            threadIcons
          )}
          <div className={styles.meta}>
            R: <b>{replyCount || '0'}</b>
            {linkCount > 0 && (
              <span>
                {' '}
                / L: <b>{linkCount}</b>
              </span>
            )}
            <span className={`${styles.postMenu} ${hoveredCid && styles.postMenuVisible}`}>
              <PostMenuDesktop post={post} />
            </span>
          </div>
          {showOPComment && (hasThumbnail ? postContent : <Link to={postLink}>{postContent}</Link>)}
        </div>
      </div>
      {hoveredCid === cid &&
        showPortal &&
        createPortal(
          <div className={styles.postPreview} ref={refs.setFloating} style={floatingStyles}>
            <span className={styles.postSubject}>{title}</span>
            {' by '}
            <span className={`${styles.postAuthor} ${(isCatalogPostAuthorMod || isRules || isDescription) && styles.capcode}`}>
              {author?.displayName || _.capitalize(t('anonymous'))}
              {isCatalogPostAuthorMod && <span className='capitalize'>{` ## Board ${catalogPostAuthorRole}`}</span>}
            </span>
            <span className={styles.postAgo}> {getFormattedTimeAgo(timestamp)}</span>
            {replyCount > 0 && (
              <div className={styles.postLast}>
                Last reply by{' '}
                <span className={`${styles.postAuthor} ${isLastReplyAuthorMod && styles.capcode}`}>
                  {lastReply?.author?.displayName || _.capitalize(t('anonymous'))}
                  {isLastReplyAuthorMod && ` ## Board ${lastReplyAuthorRole}`}
                </span>
                <span className={styles.postAgo}> {getFormattedTimeAgo(lastReply?.timestamp)}</span>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

interface CatalogRowProps {
  index?: number;
  row: Comment[];
}

const CatalogRow = ({ row }: CatalogRowProps) => {
  return (
    <div className={styles.row}>
      {row.map((post, index) => (
        <CatalogPost key={index} post={post} />
      ))}
    </div>
  );
};

export default CatalogRow;
