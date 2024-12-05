import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Comment, useComment } from '@plebbit/plebbit-react-hooks';
import { useFloating, offset, size, autoUpdate, Placement } from '@floating-ui/react';
import { getHasThumbnail } from '../../lib/utils/media-utils';
import { getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import useCatalogStyleStore from '../../stores/use-catalog-style-store';
import useEditCommentPrivileges from '../../hooks/use-author-privileges';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import useHide from '../../hooks/use-hide';
import useWindowWidth from '../../hooks/use-window-width';
import PostMenuDesktop from '../post-desktop/post-menu-desktop';
import styles from './catalog-row.module.css';
import _ from 'lodash';
import { ContentPreview } from '../../views/home/popular-threads-box';
import { useCommentMediaInfo } from '../../hooks/use-comment-media-info';

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

  const { imageSize } = useCatalogStyleStore();

  let displayWidth, displayHeight;
  const maxThumbnailSize = imageSize === 'Large' ? 250 : 150;

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

  const maxWidth = imageSize === 'Large' ? '250px' : '150px';
  const maxHeight = imageSize === 'Large' ? '250px' : '150px';

  const CSSProperties = {
    '--width': displayWidth,
    '--height': displayHeight,
    '--maxWidth': maxWidth,
    '--maxHeight': maxHeight,
  } as React.CSSProperties;

  let thumbnailComponent: React.ReactNode = null;

  if (type === 'gif' && gifFrameUrl && !hasError) {
    thumbnailComponent = <img src={gifFrameUrl} alt='' onLoad={handleLoad} onError={handleError} style={loadingStyle} />;
  } else if (type === 'image' && !hasError) {
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
  } else if (type === 'audio') {
    thumbnailComponent = <audio src={url} controls />;
  }

  return (
    <div className={hasError ? '' : styles.mediaWrapper} style={CSSProperties}>
      {!isLoaded && !hasError && type !== 'video' && type !== 'audio' && <span className={styles.loadingSkeleton} />}
      {hasError ? <img className={styles.fileDeleted} src='assets/filedeleted-res.gif' alt='' /> : thumbnailComponent}
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
  const linkCount = useCountLinksInReplies(post);

  const commentMediaInfo = useCommentMediaInfo(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);

  const { hidden } = useHide({ cid });

  const location = useLocation();
  const params = useParams();
  const isInAllView = isAllView(location.pathname);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

  const postLink = isInAllView && isDescription ? `/p/all/description` : `/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${cid}`}`;

  const threadIcons = (
    <div className={styles.threadIcons}>
      {pinned && <span className={styles.stickyIcon} title={t('sticky')} />}
      {locked && <span className={styles.closedIcon} title={t('closed')} />}
    </div>
  );

  const [hoveredCid, setHoveredCid] = useState<string | null>(null);
  const [showPortal, setShowPortal] = useState<boolean>(false);
  const placementRef = useRef<Placement>('right-start');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const windowWidth = useWindowWidth();

  const { refs, floatingStyles, update } = useFloating({
    open: showPortal,
    placement: placementRef.current,
    middleware: [
      offset({ mainAxis: 5 }),
      size({
        apply({ elements }) {
          const referenceElement = refs.reference.current;
          if (referenceElement) {
            const availableWidthToTheRight = windowWidth - (referenceElement.getBoundingClientRect().left + referenceElement.getBoundingClientRect().width);
            const availableWidthToTheLeft = referenceElement.getBoundingClientRect().left;
            const minWidth = windowWidth * 0.25;

            if (availableWidthToTheRight >= minWidth) {
              placementRef.current = 'right-start';
              elements.floating.style.maxWidth = `${availableWidthToTheRight - 40}px`;
            } else if (availableWidthToTheLeft >= minWidth) {
              placementRef.current = 'left-start';
              elements.floating.style.maxWidth = `${availableWidthToTheLeft - 25}px`;
            } else if (availableWidthToTheRight > availableWidthToTheLeft) {
              placementRef.current = 'right-start';
              elements.floating.style.maxWidth = `${availableWidthToTheRight - 40}px`;
            } else {
              placementRef.current = 'left-start';
              elements.floating.style.maxWidth = `${availableWidthToTheLeft - 25}px`;
            }
          }
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    update();
  }, [update, windowWidth]);

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
      {hidden ? (
        <b>({t('hidden')})</b>
      ) : (
        <>
          {title && (
            <span>
              <b>{title}</b>
              {content ? ': ' : ''}
            </span>
          )}
          {content && <ContentPreview content={content} maxLength={9999} />}
        </>
      )}
    </div>
  );

  const { imageSize, showOPComment } = useCatalogStyleStore();
  const maxWidth = imageSize === 'Large' ? '250px' : '150px';
  const maxHeight = imageSize === 'Large' ? '250px' : '150px';
  const CSSProperties = {
    '--maxWidth': maxWidth,
    '--maxHeight': maxHeight,
  } as React.CSSProperties;

  const isTextOnlyThread = !hasThumbnail || isRules;

  return (
    <>
      <div className={`${styles.post} ${imageSize === 'Large' ? styles.large : ''}`} style={CSSProperties}>
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
                  <img src='assets/spoiler.png' alt='' />
                ) : (
                  <CatalogPostMedia commentMediaInfo={commentMediaInfo} isOutOfFeed={isDescription || isRules} linkWidth={linkWidth} linkHeight={linkHeight} />
                )}
              </div>
            </Link>
          ) : (
            threadIcons
          )}
          <div className={styles.meta} title='(R)eplies / (L)ink Replies'>
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
          {(showOPComment || isTextOnlyThread) && (hasThumbnail ? postContent : <Link to={postLink}>{postContent}</Link>)}
        </div>
      </div>
      {(hoveredCid === cid || isDescription) &&
        showPortal &&
        createPortal(
          <div className={styles.postPreview} ref={refs.setFloating} style={floatingStyles}>
            {title ? (
              <>
                <span className={styles.postSubject}>{title} </span>
                {t('by')}
              </>
            ) : (
              t('posted_by')
            )}{' '}
            <span className={`${styles.postAuthor} ${(isCatalogPostAuthorMod || isRules || isDescription) && styles.capcode}`}>
              {author?.displayName || _.capitalize(t('anonymous'))}
              {isCatalogPostAuthorMod && <span className='capitalize'>{` ## Board ${catalogPostAuthorRole}`}</span>}
            </span>
            {(isInAllView || isInSubscriptionsView) && subplebbitAddress && ` to p/${Plebbit.getShortAddress(subplebbitAddress)}`}
            <span className={styles.postAgo}> {getFormattedTimeAgo(timestamp)}</span>
            {replyCount > 0 && (
              <div className={styles.postLast}>
                {t('last_reply_by')}{' '}
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
