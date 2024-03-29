import styles from './media.module.css';
import { CommentMediaInfo } from '../../lib/utils/media-utils';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';

interface ThumbnailProps {
  commentMediaInfo?: CommentMediaInfo;
  isMobile: boolean;
  isReply: boolean;
  linkHeight?: number;
  linkWidth?: number;
  toggleExpanded?: () => void;
}

export const Thumbnail = ({ commentMediaInfo, isMobile, isReply, linkHeight, linkWidth }: ThumbnailProps) => {
  const iframeThumbnail = commentMediaInfo?.patternThumbnailUrl || commentMediaInfo?.thumbnail;
  let displayWidth, displayHeight, hasLinkDimensions;
  const maxThumbnailSize = isMobile || isReply ? 125 : 250;

  if (linkWidth && linkHeight) {
    hasLinkDimensions = true;
    let scale = Math.min(1, maxThumbnailSize / Math.max(linkWidth, linkHeight));
    displayWidth = `${linkWidth * scale}px`;
    displayHeight = `${linkHeight * scale}px`;
  } else {
    hasLinkDimensions = false;
    displayWidth = `${maxThumbnailSize}px`;
    displayHeight = `${maxThumbnailSize}px`;
  }

  const thumbnailStyle = hasLinkDimensions ? ({ '--width': displayWidth, '--height': displayHeight } as React.CSSProperties) : {};
  const thumbnailWrapperClass = hasLinkDimensions ? styles.transparentThumbnailWrapper : isMobile ? styles.thumbnailWrapperSmall : styles.thumbnailWrapperBig;

  let mediaComponent = null;
  const gifFrameUrl = useFetchGifFirstFrame(commentMediaInfo?.type === 'gif' ? commentMediaInfo.url : undefined);

  if (commentMediaInfo?.type === 'image') {
    mediaComponent = <img src={commentMediaInfo.url} alt='' />;
  } else if (commentMediaInfo?.type === 'video') {
    mediaComponent = commentMediaInfo.thumbnail ? <img src={commentMediaInfo.thumbnail} alt='' /> : <video src={`${commentMediaInfo.url}#t=0.001`} />;
  } else if (commentMediaInfo?.type === 'webpage') {
    mediaComponent = <img src={commentMediaInfo.thumbnail} alt='' />;
  } else if (commentMediaInfo?.type === 'iframe') {
    mediaComponent = iframeThumbnail ? <img src={iframeThumbnail} alt='' /> : null;
  } else if (commentMediaInfo?.type === 'gif' && gifFrameUrl) {
    mediaComponent = <img src={gifFrameUrl} alt='' />;
  }

  return (
    <span className={styles.thumbnail} style={thumbnailStyle}>
      <span className={isMobile || isReply ? styles.thumbnailSmall : styles.thumbnailBig}>
        <span className={thumbnailWrapperClass}>{mediaComponent}</span>
      </span>
    </span>
  );
};

export const Media = () => {
  return <></>;
};
