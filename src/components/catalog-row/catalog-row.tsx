import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Comment } from '@plebbit/plebbit-react-hooks';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import styles from './catalog-row.module.css';

const CatalogPostMedia = ({ commentMediaInfo, link }: { commentMediaInfo: any; link: string }) => {
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

  if (type === 'audio') {
    displayWidth = '150px';
    displayHeight = '75px';
  }

  if (isDescription || isRules) {
    displayWidth = 'unset';
    displayHeight = 'unset';
  }

  const thumbnailDimensions = { '--width': displayWidth, '--height': displayHeight } as React.CSSProperties;
  const postLink = `/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${cid}`}`;

  const linkCount = useCountLinksInReplies(post);

  const threadIcons = (
    <div className={styles.threadIcons}>
      {pinned && <span className={styles.stickyIcon} title={t('sticky')} />}
      {locked && <span className={styles.closedIcon} title={t('closed')} />}
    </div>
  );

  const [menuBtnRotated, setMenuBtnRotated] = useState(false);

  return (
    <div className={styles.post}>
      {hasThumbnail ? (
        <Link to={postLink}>
          <div className={styles.mediaPaddingWrapper}>
            {threadIcons}
            <div className={styles.mediaWrapper} style={thumbnailDimensions}>
              <CatalogPostMedia commentMediaInfo={commentMediaInfo} link={link} />
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
        <span className={styles.postMenuBtnPadding}>
          <span
            className={styles.postMenuBtn}
            title='Thread Menu'
            onClick={() => setMenuBtnRotated(!menuBtnRotated)}
            style={{ transform: menuBtnRotated ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ▶
          </span>
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
  description: any | undefined;
  index: number;
  rules: any | undefined;
  row: Comment[];
}

const CatalogRow = ({ description, index, row, rules }: CatalogRowProps) => {
  const rowPosts = index === 0 ? [...(rules?.content?.length > 0 ? [rules] : []), ...(description?.content?.length > 0 ? [description] : []), ...row] : row;
  const posts = rowPosts.map((post, index) => <CatalogPost key={index} post={post} />);
  return <div className={styles.row}>{posts}</div>;
};

export default CatalogRow;
