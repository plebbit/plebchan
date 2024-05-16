import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAccount } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { getCommentMediaInfo, getHasThumbnail } from '../../../lib/utils/media-utils';
import { getFormattedDate } from '../../../lib/utils/time-utils';
import useCountLinksInReplies from '../../../hooks/use-count-links-in-replies';
import useReplies from '../../../hooks/use-replies';
import useStateString from '../../../hooks/use-state-string';
import CommentMedia from '../../comment-media';
import LoadingEllipsis from '../../loading-ellipsis';
import Markdown from '../../markdown';
import { PostProps } from '../post';
import styles from '../post.module.css';
import _ from 'lodash';

const PostInfoAndMediaMobile = ({ openReplyModal, post, roles }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, link, linkHeight, linkWidth, locked, parentCid, pinned, shortCid, state, subplebbitAddress, timestamp, title } = post || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const { address, displayName, shortAddress } = author || {};

  const authorRole = roles?.[address]?.role;
  const shortDisplayName = displayName?.trim().length > 20 ? displayName?.trim().slice(0, 20).trim() + '...' : displayName?.trim();
  const displayTitle = title && title.length > 30 ? title?.slice(0, 30) + '(...)' : title;

  const commentMediaInfo = getCommentMediaInfo(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const isReply = parentCid;

  // pending reply by account is not yet published
  const account = useAccount();
  const accountShortAddress = account?.author?.shortAddress;

  const stateString = useStateString(post);

  return (
    <>
      <div className={styles.postInfo}>
        <span className={styles.postMenuBtn} title='Post menu'>
          ...
        </span>
        <span className={styles.nameBlock}>
          <span className={`${styles.name} ${(isDescription || isRules || authorRole) && styles.capcodeMod}`}>
            {shortDisplayName || _.capitalize(t('anonymous'))}
            {authorRole && ` ## Board ${authorRole}`}{' '}
          </span>
          {!(isDescription || isRules) && <span className={styles.address}>(u/{shortAddress || accountShortAddress})</span>}
          {pinned && (
            <span className={styles.stickyIconWrapper}>
              <img src='assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
            </span>
          )}
          {locked && (
            <span className={`${styles.closedIconWrapper} ${pinned && styles.addPaddingInBetween}`}>
              <img src='assets/icons/closed.gif' alt='' className={styles.closedIcon} title={t('closed')} />
            </span>
          )}
          {title && (
            <>
              <br />
              <span className={styles.subject}>{displayTitle}</span>
            </>
          )}
        </span>
        <span className={styles.dateTimePostNum}>
          {getFormattedDate(timestamp)}{' '}
          {!(isDescription || isRules) && (
            <span className={styles.postNumLink}>
              <Link to={`/p/${subplebbitAddress}/c/${cid}`} className={styles.linkToPost} title={t('link_to_post')} onClick={(e) => !cid && e.preventDefault()}>
                c/
              </Link>
              {!cid ? (
                <span className={styles.pendingCid}>{state === 'failed' || stateString === 'Failed' ? 'Failed' : 'Pending'}</span>
              ) : (
                <span className={styles.replyToPost} title={t('reply_to_post')} onClick={() => openReplyModal && openReplyModal(cid)}>
                  {shortCid}
                </span>
              )}
            </span>
          )}
        </span>
      </div>
      {(hasThumbnail || link) && (
        <CommentMedia
          commentMediaInfo={commentMediaInfo}
          isOutOfFeed={isDescription || isRules} // virtuoso wrapper unneeded
          isReply={isReply}
          linkHeight={linkHeight}
          linkWidth={linkWidth}
          showThumbnail={showThumbnail}
          setShowThumbnail={setShowThumbnail}
        />
      )}
    </>
  );
};

const PostMessageMobile = ({ isInPostPage, post }: PostProps) => {
  const { cid, content, parentCid, postCid, state, subplebbitAddress } = post || {};
  const displayContent = content && !isInPostPage && content.length > 1000 ? content?.slice(0, 1000) : content;

  const isReply = parentCid;
  const isReplyingToReply = postCid !== parentCid;

  const stateString = useStateString(post);

  const loadingString = stateString && (
    <div className={`${styles.stateString} ${styles.ellipsis}`}>{stateString !== 'Failed' ? <LoadingEllipsis string={stateString} /> : stateString}</div>
  );

  return (
    content && (
      <blockquote className={`${styles.postMessage} ${!isReply && styles.clampLines}`}>
        {isReply && isReplyingToReply && (
          <>
            <Link to={`/p/${subplebbitAddress}/c/${parentCid}`} className={styles.quoteLink}>
              {`c/${parentCid && Plebbit.getShortCid(parentCid)}`}
            </Link>
            <br />
          </>
        )}
        <Markdown content={displayContent} />
        {!isReply && content.length > 1000 && !isInPostPage && (
          <span className={styles.abbr}>
            <br />
            <Trans i18nKey={'comment_too_long'} shouldUnescape={true} components={{ 1: <Link to={`/p/${subplebbitAddress}/c/${cid}`} /> }} />
          </span>
        )}
        {!cid && state === 'pending' && stateString !== 'Failed' && (
          <>
            <br />
            {loadingString}
          </>
        )}
      </blockquote>
    )
  );
};

const PostMobile = ({ isInPostPage, isPendingPostPage, openReplyModal, post, roles, showAllReplies }: PostProps) => {
  const { t } = useTranslation();
  const { cid, pinned, replyCount, subplebbitAddress } = post || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api

  const linksCount = useCountLinksInReplies(post);

  const replies = useReplies(post);

  return (
    <div className={styles.postMobile}>
      <div className={styles.hrWrapper}>
        <hr />
      </div>
      <div className={styles.thread}>
        <div className={styles.postContainer}>
          <div className={styles.postOp}>
            <PostInfoAndMediaMobile openReplyModal={openReplyModal} post={post} roles={roles} />
            <PostMessageMobile isInPostPage={isInPostPage} post={post} />
          </div>
          {!isInPostPage && !isPendingPostPage && (
            <div className={styles.postLink}>
              <span className={styles.info}>
                {replyCount > 0 && `${replyCount} Replies`}
                {linksCount > 0 && ` / ${linksCount} Links`}
              </span>
              <Link to={`/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${cid}`}`} className='button'>
                {t('view_thread')}
              </Link>
            </div>
          )}
        </div>
        {!(pinned && !isInPostPage) &&
          !isPendingPostPage &&
          !isDescription &&
          !isRules &&
          replies &&
          (showAllReplies ? replies : replies.slice(-5)).map((reply) => (
            <div key={reply.cid} className={styles.replyContainer}>
              <div className={styles.replyMobile}>
                <div className={styles.reply}>
                  <div className={styles.replyContainer}>
                    <PostInfoAndMediaMobile openReplyModal={openReplyModal} post={reply} roles={roles} />
                    <PostMessageMobile isInPostPage={isInPostPage} post={reply} />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostMobile;
