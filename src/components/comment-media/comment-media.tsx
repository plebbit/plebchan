import React from 'react';
import styles from './comment-media.module.css';
import { CommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import Embed, { canEmbed } from '../embed';
import { useTranslation } from 'react-i18next';
import useWindowWidth from '../../hooks/use-window-width';
import { getHostname } from '../../lib/utils/url-utils';

interface MediaProps {
  commentMediaInfo?: CommentMediaInfo;
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

const Thumbnail = ({ commentMediaInfo, isOutOfFeed, isReply, linkHeight, linkWidth, setShowThumbnail }: MediaProps) => {
  const { patternThumbnailUrl, thumbnail, type, url } = commentMediaInfo || {};

  let displayWidth, displayHeight;
  const isMobile = useWindowWidth() < 640;
  const maxThumbnailSize = isMobile || isReply ? 125 : 250;

  if (linkWidth && linkHeight) {
    let scale = Math.min(1, maxThumbnailSize / Math.max(linkWidth, linkHeight));
    displayWidth = `${linkWidth * scale}px`;
    displayHeight = `${linkHeight * scale}px`;
  } else {
    displayWidth = `${maxThumbnailSize}px`;
    displayHeight = `${maxThumbnailSize}px`;
  }

  if (type === 'audio') {
    displayWidth = '100%';
    displayHeight = '100%';
  }

  if (isOutOfFeed) {
    displayWidth = 'unset';
    displayHeight = 'unset';
  }

  let thumbnailComponent: React.ReactNode = null;
  const iframeThumbnail = patternThumbnailUrl || thumbnail;
  const gifFrameUrl = useFetchGifFirstFrame(type === 'gif' ? url : undefined);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, url);

  if (type === 'image') {
    thumbnailComponent = <img src={url} alt='' onClick={() => setShowThumbnail(false)} />;
  } else if (type === 'video') {
    thumbnailComponent = thumbnail ? <img src={thumbnail} alt='' /> : <video src={`${url}#t=0.001`} onClick={() => setShowThumbnail(false)} />;
  } else if (type === 'webpage') {
    thumbnailComponent = <img src={thumbnail} alt='' onClick={() => setShowThumbnail(false)} />;
  } else if (type === 'iframe') {
    thumbnailComponent = iframeThumbnail ? <img src={iframeThumbnail} alt='' onClick={() => setShowThumbnail(false)} /> : null;
  } else if (type === 'gif' && gifFrameUrl) {
    thumbnailComponent = <img src={gifFrameUrl} alt='' onClick={() => setShowThumbnail(false)} />;
  } else if (type === 'audio') {
    thumbnailComponent = <audio src={url} controls />;
  }

  const thumbnailSmallPadding = isMobile ? styles.thumbnailMobile : styles.thumbnailReplyDesktop;
  const thumbnailDimensions = { '--width': displayWidth, '--height': displayHeight } as React.CSSProperties;

  const linkWithoutThumbnail = url && new URL(url);

  return isMobile || isReply ? (
    <ThumbnailSmall style={thumbnailDimensions} thumbnailSmallPadding={thumbnailSmallPadding}>
      {thumbnailComponent}
      {isMobile && !hasThumbnail && linkWithoutThumbnail ? (
        canEmbed(linkWithoutThumbnail) ? (
          <span onClick={() => setShowThumbnail(false)}>{getHostname(url)}</span>
        ) : (
          <a href={url} target='_blank' rel='noreferrer'>
            {getHostname(url)}
          </a>
        )
      ) : null}
    </ThumbnailSmall>
  ) : (
    <ThumbnailBig style={thumbnailDimensions}>{thumbnailComponent}</ThumbnailBig>
  );
};

const Media = ({ commentMediaInfo, isReply, setShowThumbnail }: MediaProps) => {
  const { t } = useTranslation();
  const { thumbnail, type, url } = commentMediaInfo || {};
  const isMobile = useWindowWidth() < 640;
  const mediaClass = isMobile ? styles.mediaMobile : isReply ? styles.mediaDesktopReply : styles.mediaDesktopOp;

  return (
    <span className={mediaClass}>
      {type === 'iframe' && url ? (
        <Embed url={url} />
      ) : type === 'gif' ? (
        <img src={url} alt='' onClick={() => setShowThumbnail(true)} />
      ) : type === 'video' ? (
        <video src={url} controls autoPlay loop muted />
      ) : type === 'image' ? (
        <img src={url} alt='' onClick={() => setShowThumbnail(true)} />
      ) : type === 'webpage' ? (
        <img src={thumbnail} alt='' onClick={() => setShowThumbnail(true)} />
      ) : null}
      {isMobile && type && (
        <div className={styles.fileInfo}>
          <a href={url} target='_blank' rel='noopener noreferrer'>
            {url && url.length > 30 ? url.slice(0, 30) + '...' : url}
          </a>{' '}
          ({type})
        </div>
      )}
      {isMobile && (type === 'iframe' || type === 'video' || type === 'audio') && (
        <div className={styles.closeButton}>
          <span className='button' onClick={() => setShowThumbnail(true)}>
            {t('close')}
          </span>
        </div>
      )}
    </span>
  );
};

const CommentMedia = ({ commentMediaInfo, isOutOfFeed, isReply, linkHeight, linkWidth, showThumbnail, setShowThumbnail }: MediaProps) => {
  const isMobile = useWindowWidth() < 640;
  return (
    <span className={styles.content}>
      <span className={`${showThumbnail ? styles.show : styles.hide} ${styles.thumbnail}`}>
        <Thumbnail
          commentMediaInfo={commentMediaInfo}
          isOutOfFeed={isOutOfFeed}
          isReply={isReply}
          linkHeight={linkHeight}
          linkWidth={linkWidth}
          showThumbnail={showThumbnail}
          setShowThumbnail={setShowThumbnail}
        />
        {isMobile && commentMediaInfo?.type && <div className={styles.fileInfo}>{commentMediaInfo.type}</div>}
      </span>
      {!showThumbnail && <Media commentMediaInfo={commentMediaInfo} isReply={isReply} setShowThumbnail={setShowThumbnail} />}
    </span>
  );
};

export default CommentMedia;
