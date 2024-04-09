import React from 'react';
import styles from './comment-media.module.css';
import { CommentMediaInfo } from '../../lib/utils/media-utils';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import Embed from '../embed';
import { useTranslation } from 'react-i18next';

interface MediaProps {
  commentMediaInfo?: CommentMediaInfo;
  isMobile: boolean;
  isOutOfFeed?: boolean; // virtuoso wrapper unneeded
  isReply: boolean;
  linkHeight?: number;
  linkWidth?: number;
  showThumbnail?: boolean;
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

const Thumbnail = ({ commentMediaInfo, isMobile, isOutOfFeed, isReply, linkHeight, linkWidth, setShowThumbnail }: MediaProps) => {
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

  if (commentMediaInfo?.type === 'audio') {
    displayWidth = '250px';
    displayHeight = '75px';
  }

  if (isOutOfFeed) {
    displayWidth = 'unset';
    displayHeight = 'unset';
  }

  let thumbnailComponent: React.ReactNode = null;
  const iframeThumbnail = commentMediaInfo?.patternThumbnailUrl || commentMediaInfo?.thumbnail;
  const gifFrameUrl = useFetchGifFirstFrame(commentMediaInfo?.type === 'gif' ? commentMediaInfo.url : undefined);
  if (commentMediaInfo?.type === 'image') {
    thumbnailComponent = <img src={commentMediaInfo.url} alt='' onClick={() => setShowThumbnail(false)} />;
  } else if (commentMediaInfo?.type === 'video') {
    thumbnailComponent = commentMediaInfo.thumbnail ? (
      <img src={commentMediaInfo.thumbnail} alt='' />
    ) : (
      <video src={`${commentMediaInfo.url}#t=0.001`} onClick={() => setShowThumbnail(false)} />
    );
  } else if (commentMediaInfo?.type === 'webpage') {
    thumbnailComponent = <img src={commentMediaInfo.thumbnail} alt='' onClick={() => setShowThumbnail(false)} />;
  } else if (commentMediaInfo?.type === 'iframe') {
    thumbnailComponent = iframeThumbnail ? <img src={iframeThumbnail} alt='' onClick={() => setShowThumbnail(false)} /> : null;
  } else if (commentMediaInfo?.type === 'gif' && gifFrameUrl) {
    thumbnailComponent = <img src={gifFrameUrl} alt='' onClick={() => setShowThumbnail(false)} />;
  } else if (commentMediaInfo?.type === 'audio') {
    thumbnailComponent = <audio src={commentMediaInfo.url} controls />;
  }

  const thumbnailSmallPadding = isMobile ? styles.thumbnailMobile : styles.thumbnailReplyDesktop;
  const thumbnailDimensions = { '--width': displayWidth, '--height': displayHeight } as React.CSSProperties;

  return isMobile || isReply ? (
    <ThumbnailSmall style={thumbnailDimensions} thumbnailSmallPadding={thumbnailSmallPadding}>
      {thumbnailComponent}
    </ThumbnailSmall>
  ) : (
    <ThumbnailBig style={thumbnailDimensions}>{thumbnailComponent}</ThumbnailBig>
  );
};

const Media = ({ commentMediaInfo, isMobile, isReply, setShowThumbnail }: MediaProps) => {
  const { t } = useTranslation();
  const mediaClass = isMobile ? styles.mediaMobile : isReply ? styles.mediaDesktopReply : styles.mediaDesktopOp;

  return (
    <span className={mediaClass}>
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
      {isMobile && (commentMediaInfo?.type === 'iframe' || commentMediaInfo?.type === 'video' || commentMediaInfo?.type === 'audio') && (
        <div className={styles.closeButton}>
          <span className='button' onClick={() => setShowThumbnail(true)}>
            {t('close')}
          </span>
        </div>
      )}
    </span>
  );
};

const CommentMedia = ({ commentMediaInfo, isMobile, isOutOfFeed, isReply, linkHeight, linkWidth, showThumbnail, setShowThumbnail }: MediaProps) => {
  return (
    <span className={styles.content}>
      <span className={`${showThumbnail ? styles.show : styles.hide} ${styles.thumbnail}`}>
        <Thumbnail
          commentMediaInfo={commentMediaInfo}
          isMobile={isMobile}
          isOutOfFeed={isOutOfFeed}
          isReply={isReply}
          linkHeight={linkHeight}
          linkWidth={linkWidth}
          showThumbnail={showThumbnail}
          setShowThumbnail={setShowThumbnail}
        />
        {isMobile && commentMediaInfo?.type && <div className={styles.fileInfo}>{commentMediaInfo.type}</div>}
      </span>
      {!showThumbnail && <Media commentMediaInfo={commentMediaInfo} isMobile={isMobile} isReply={isReply} setShowThumbnail={setShowThumbnail} />}
    </span>
  );
};

export default CommentMedia;
