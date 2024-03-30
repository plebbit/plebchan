import React from 'react';
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

const ThumbnailBig = ({ style, children }: { style: React.CSSProperties; children: React.ReactNode }) => (
  <span className={styles.thumbnailBig} style={style}>
    {children}
  </span>
);

const ThumbnailSmall = ({ style, children }: { style: React.CSSProperties; children: React.ReactNode }) => (
  <span className={styles.thumbnailSmall} style={style}>
    {children}
  </span>
);

export const Thumbnail = ({ commentMediaInfo, isMobile, isReply, linkHeight, linkWidth }: ThumbnailProps) => {
  let displayWidth, displayHeight;
  const maxThumbnailSize = isMobile || isReply ? 125 : 250;
  if (linkWidth && linkHeight) {
    let scale = Math.min(1, maxThumbnailSize / Math.max(linkWidth, linkHeight));
    displayWidth = `${linkWidth * scale}px`;
    displayHeight = `${linkHeight * scale}px`;
  } else {
    displayWidth = `${maxThumbnailSize}px`;
    displayHeight = `${maxThumbnailSize}px`;
  }

  let mediaComponent: React.ReactNode = null;
  const iframeThumbnail = commentMediaInfo?.patternThumbnailUrl || commentMediaInfo?.thumbnail;
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

  const thumbnailStyle = { '--width': displayWidth, '--height': displayHeight } as React.CSSProperties;

  return isMobile || isReply ? (
    <ThumbnailSmall style={thumbnailStyle}>{mediaComponent}</ThumbnailSmall>
  ) : (
    <ThumbnailBig style={thumbnailStyle}>{mediaComponent}</ThumbnailBig>
  );
};

export const Media = () => {
  return <></>;
};
