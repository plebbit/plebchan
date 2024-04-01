import React, { useState } from 'react';
import styles from './media.module.css';
import { CommentMediaInfo } from '../../lib/utils/media-utils';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import Embed from '../embed';
import { useTranslation } from 'react-i18next';

interface MediaProps {
  commentMediaInfo?: CommentMediaInfo;
  isMobile: boolean;
  isReply: boolean;
  linkHeight?: number;
  linkWidth?: number;
  showThumbnail: boolean;
  setShowThumbnail: (showThumbnail: boolean) => void;
  toggleExpanded?: () => void;
}

interface ThumbnailProps {
  style: React.CSSProperties;
  children: React.ReactNode;
  thumbnailSmallPadding?: string;
}

const ThumbnailBig = ({ style, children }: ThumbnailProps) => (
  <span className={styles.thumbnailBig} style={style}>
    {children}
  </span>
);

const ThumbnailSmall = ({ style, children, thumbnailSmallPadding }: ThumbnailProps) => (
  <span className={`${styles.thumbnailSmall} ${thumbnailSmallPadding}`} style={style}>
    {children}
  </span>
);

const Thumbnail = ({ commentMediaInfo, isMobile, isReply, linkHeight, linkWidth }: MediaProps) => {
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

  const thumbnailSmallPadding = isMobile ? styles.thumbnailMobile : styles.thumbnailReplyDesktop;
  const thumbnailDimensions = { '--width': displayWidth, '--height': displayHeight } as React.CSSProperties;

  return isMobile || isReply ? (
    <ThumbnailSmall style={thumbnailDimensions} thumbnailSmallPadding={thumbnailSmallPadding}>
      {mediaComponent}
    </ThumbnailSmall>
  ) : (
    <ThumbnailBig style={thumbnailDimensions}>{mediaComponent}</ThumbnailBig>
  );
};

const Media = ({ commentMediaInfo, isMobile, isReply, linkHeight, linkWidth, showThumbnail, setShowThumbnail }: MediaProps) => {
  const { t } = useTranslation();
  const mediaClass = isMobile ? styles.mediaMobile : styles.mediaDesktop;

  return (
    <span className={styles.content}>
      <span className={`${showThumbnail ? styles.show : styles.hide} ${styles.thumbnail}`} onClick={() => setShowThumbnail(false)}>
        <Thumbnail
          commentMediaInfo={commentMediaInfo}
          isMobile={isMobile}
          isReply={isReply}
          linkHeight={linkHeight}
          linkWidth={linkWidth}
          showThumbnail={showThumbnail}
          setShowThumbnail={setShowThumbnail}
        />
        {isMobile && commentMediaInfo?.type && <div className={styles.fileInfo}>{commentMediaInfo.type}</div>}
      </span>
      <span className={`${showThumbnail ? styles.hide : styles.show} ${mediaClass}`}>
        {commentMediaInfo?.type === 'iframe' ? (
          <Embed url={commentMediaInfo.url} />
        ) : commentMediaInfo?.type === 'gif' ? (
          <img src={commentMediaInfo.url} alt='' onClick={() => setShowThumbnail(true)} />
        ) : commentMediaInfo?.type === 'video' ? (
          <video src={commentMediaInfo.url} controls autoPlay loop muted />
        ) : commentMediaInfo?.type === 'image' ? (
          <img src={commentMediaInfo.url} alt='' onClick={() => setShowThumbnail(true)} />
        ) : commentMediaInfo?.type === 'webpage' ? (
          <img src={commentMediaInfo.thumbnail} alt='' onClick={() => setShowThumbnail(true)} />
        ) : null}
        {isMobile && commentMediaInfo?.type && (
          <div className={styles.fileInfo}>
            <a href={commentMediaInfo.url} target='_blank' rel='noopener noreferrer'>
              {commentMediaInfo.url.length > 30 ? commentMediaInfo?.url.slice(0, 30) + '...' : commentMediaInfo?.url}
            </a>{' '}
            ({commentMediaInfo?.type})
          </div>
        )}
        {isMobile && (commentMediaInfo?.type === 'iframe' || commentMediaInfo?.type === 'video') && (
          <div className={styles.closeButton}>
            <span className='button' onClick={() => setShowThumbnail(true)}>
              {t('close')}
            </span>
          </div>
        )}
      </span>
    </span>
  );
};

export default Media;
