import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './catalog-row.module.css';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { isAllView } from '../../lib/utils/view-utils';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import PostMenuDesktop from '../post/post-desktop/post-menu-desktop/';

export const CatalogPostMedia = ({ commentMediaInfo }: { commentMediaInfo: any }) => {
  const { patternThumbnailUrl, thumbnail, type, url } = commentMediaInfo || {};
  const iframeThumbnail = patternThumbnailUrl || thumbnail;
  const gifFrameUrl = useFetchGifFirstFrame(type === 'gif' ? url : undefined);
  let thumbnailComponent: React.ReactNode = null;

  if (type === 'image') {
    thumbnailComponent = <img src={url} alt='' />;
  } else if (type === 'video') {
    thumbnailComponent = thumbnail ? <img src={thumbnail} alt='' /> : <video src={`${url}#t=0.001`} />;
  } else if (type === 'webpage') {
    thumbnailComponent = <img src={thumbnail} alt='' />;
  } else if (type === 'iframe') {
    thumbnailComponent = iframeThumbnail ? <img src={iframeThumbnail} alt='' /> : null;
  } else if (type === 'gif' && gifFrameUrl) {
    thumbnailComponent = <img src={gifFrameUrl} alt='' />;
  } else if (type === 'audio') {
    thumbnailComponent = <audio src={url} controls />;
  }
  return thumbnailComponent;
};

const CatalogPost = ({ post }: { post: Comment }) => {
  const { t } = useTranslation();
  const { cid, content, isDescription, isRules, link, linkHeight, linkWidth, locked, pinned, replyCount, subplebbitAddress, title } = post || {};
  const commentMediaInfo = getCommentMediaInfo(post);
  const { type } = commentMediaInfo || {};
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);

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

  if (type === 'audio' || isDescription || isRules) {
    displayWidth = 'unset';
    displayHeight = 'unset';
  }

  const thumbnailDimensions = { '--width': displayWidth, '--height': displayHeight } as React.CSSProperties;

  const location = useLocation();
  const isInAllView = isAllView(location.pathname);

  const postLink = isInAllView && isDescription ? `/p/all/description` : `/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${cid}`}`;

  const linkCount = useCountLinksInReplies(post);

  const threadIcons = (
    <div className={styles.threadIcons}>
      {pinned && <span className={styles.stickyIcon} title={t('sticky')} />}
      {locked && <span className={styles.closedIcon} title={t('closed')} />}
    </div>
  );

  return (
    <div className={styles.post}>
      {hasThumbnail ? (
        <Link to={postLink}>
          <div className={styles.mediaPaddingWrapper}>
            {threadIcons}
            <div className={styles.mediaWrapper} style={thumbnailDimensions}>
              <CatalogPostMedia commentMediaInfo={commentMediaInfo} />
            </div>
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
        <span className={styles.postMenu}>
          <PostMenuDesktop post={post} />
        </span>
      </div>
      <Link to={postLink}>
        <div className={styles.teaser}>
          <b>{title && `${title}${content ? ': ' : ''}`}</b>
          {content}
        </div>
      </Link>
    </div>
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
