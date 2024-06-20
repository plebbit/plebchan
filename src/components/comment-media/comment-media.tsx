import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Comment } from '@plebbit/plebbit-react-hooks';
import styles from './comment-media.module.css';
import { CommentMediaInfo, getDisplayMediaInfoType, getHasThumbnail } from '../../lib/utils/media-utils';
import { getHostname } from '../../lib/utils/url-utils';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import useIsMobile from '../../hooks/use-is-mobile';
import Embed, { canEmbed } from '../embed';

interface MediaProps {
  commentMediaInfo?: CommentMediaInfo;
  post?: Comment;
  isFloatingEmbed?: boolean;
  isReply?: boolean;
  linkHeight?: number;
  linkWidth?: number;
  showThumbnail?: boolean;
  setShowThumbnail: (showThumbnail: boolean) => void;
}

const Thumbnail = ({ commentMediaInfo, isFloatingEmbed, post, setShowThumbnail }: MediaProps) => {
  const { deleted, linkHeight, linkWidth, parentCid, removed, spoiler } = post || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const isOutOfFeed = isDescription || isRules || isFloatingEmbed; // virtuoso wrapper unneeded
  const isReply = parentCid;
  const isDeleted = deleted || removed;

  const { patternThumbnailUrl, thumbnail, type, url } = commentMediaInfo || {};
  const [hasError, setHasError] = useState(false);
  const handleError = () => setHasError(true);

  let displayWidth, displayHeight;
  const isMobile = useIsMobile();
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

  let thumbnailComponent: React.ReactNode = null;
  const iframeThumbnail = patternThumbnailUrl || thumbnail;
  const gifFrameUrl = useFetchGifFirstFrame(type === 'gif' ? url : undefined);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, url);

  if (type === 'image') {
    thumbnailComponent = <img src={url} alt='' onError={handleError} onClick={() => setShowThumbnail(false)} />;
  } else if (type === 'video') {
    thumbnailComponent = thumbnail ? (
      <img src={thumbnail} alt='' />
    ) : (
      // show first frame of the video, as a workaround for Safari not loading thumbnails
      <video src={`${url}#t=0.001`} onClick={() => setShowThumbnail(false)} />
    );
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

  return hasError || isDeleted ? (
    <img className={styles.fileDeleted} src='/assets/filedeleted-res.gif' alt='File deleted' />
  ) : spoiler ? (
    <img className={styles.spoiler} src='/assets/spoiler.png' alt='' onClick={() => setShowThumbnail(false)} />
  ) : isOutOfFeed ? (
    <span className={`${isFloatingEmbed ? styles.floatingEmbed : styles.subplebbitAvatar}`}>{thumbnailComponent}</span>
  ) : isMobile || isReply ? (
    <span className={`${styles.thumbnailSmall} ${thumbnailSmallPadding}`} style={thumbnailDimensions}>
      {thumbnailComponent}
      {isMobile &&
        !hasThumbnail &&
        linkWithoutThumbnail &&
        (canEmbed(linkWithoutThumbnail) ? (
          <span onClick={() => setShowThumbnail(false)}>{getHostname(url)}</span>
        ) : (
          <a href={url} target='_blank' rel='noreferrer'>
            {getHostname(url) || (url.length > 30 ? url.slice(0, 30) + '...' : url)}
          </a>
        ))}
    </span>
  ) : (
    <span className={styles.thumbnailBig} style={thumbnailDimensions}>
      {thumbnailComponent}
    </span>
  );
};

const Media = ({ commentMediaInfo, isReply, setShowThumbnail }: MediaProps) => {
  const { t } = useTranslation();
  const { thumbnail, type, url } = commentMediaInfo || {};
  const isMobile = useIsMobile();
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
          ({getDisplayMediaInfoType(type, t)})
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

const CommentMedia = ({ commentMediaInfo, isFloatingEmbed, post, showThumbnail, setShowThumbnail }: MediaProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { type, url } = commentMediaInfo || {};

  return (
    <span className={styles.content}>
      <span className={`${showThumbnail ? styles.show : styles.hide} ${styles.thumbnail}`}>
        {url && <Thumbnail commentMediaInfo={commentMediaInfo} isFloatingEmbed={isFloatingEmbed} post={post} setShowThumbnail={setShowThumbnail} />}
        {isMobile && type && <div className={styles.fileInfo}>{`${post?.spoiler && `${t('spoiler')} - `} ${getDisplayMediaInfoType(type, t)}`}</div>}
      </span>
      {!showThumbnail && <Media commentMediaInfo={commentMediaInfo} isReply={post?.parentCid} setShowThumbnail={setShowThumbnail} />}
    </span>
  );
};

export default CommentMedia;
