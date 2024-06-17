import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Comment, useAccount, useComment } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import styles from '../../views/post/post.module.css';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { isAllView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useHide from '../../hooks/use-hide';
import useReplies from '../../hooks/use-replies';
import useStateString from '../../hooks/use-state-string';
import CommentMedia from '../comment-media';
import LoadingEllipsis from '../loading-ellipsis';
import Markdown from '../markdown';
import ReplyQuotePreview from '../reply-quote-preview';
import PostMenuMobile from './post-menu-mobile';
import { PostProps } from '../../views/post/post';
import Timestamp from '../timestamp';
import _ from 'lodash';

const PostInfoAndMedia = ({ openReplyModal, post, roles }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, link, locked, parentCid, pinned, shortCid, state, subplebbitAddress, timestamp, title } = post || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const { address, displayName, shortAddress } = author || {};

  const location = useLocation();
  const isInAllView = isAllView(location.pathname, useParams());
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

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
        <PostMenuMobile post={post} />
        <span className={styles.nameBlock}>
          <span className={`${styles.name} ${(isDescription || isRules || authorRole) && styles.capcodeMod}`}>
            {shortDisplayName || _.capitalize(t('anonymous'))}
            {authorRole && ` ## Board ${authorRole}`}{' '}
          </span>
          {!(isDescription || isRules) && <span className={styles.address}>(u/{shortAddress || accountShortAddress})</span>}
          {pinned && (
            <span className={styles.stickyIconWrapper}>
              <img src='/assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
            </span>
          )}
          {locked && (
            <span className={`${styles.closedIconWrapper} ${pinned && styles.addPaddingInBetween}`}>
              <img src='/assets/icons/closed.gif' alt='' className={styles.closedIcon} title={t('closed')} />
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
          {subplebbitAddress && (isInAllView || isInSubscriptionsView) && !isReply && (
            <div className={styles.postNumLink}>
              {' '}
              <Link to={`/p/${subplebbitAddress}`}>p/{subplebbitAddress && Plebbit.getShortAddress(subplebbitAddress)}</Link>
            </div>
          )}
          <Timestamp timestamp={timestamp} />{' '}
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
      {(hasThumbnail || link) && <CommentMedia commentMediaInfo={commentMediaInfo} post={post} showThumbnail={showThumbnail} setShowThumbnail={setShowThumbnail} />}
    </>
  );
};

const ReplyBacklinks = ({ post }: PostProps) => {
  const { cid, parentCid, replyCount } = post || {};
  const replies = useReplies(post);

  return (
    replyCount > 0 &&
    parentCid &&
    replies && (
      <div className={styles.mobileReplyBacklinks}>
        {replies.map((reply: Comment, index: number) => reply?.parentCid === cid && <ReplyQuotePreview key={index} isBacklinkReply={true} backlinkReply={reply} />)}
      </div>
    )
  );
};

const PostMessageMobile = ({ post }: PostProps) => {
  const { t } = useTranslation();
  const { cid, content, deleted, parentCid, postCid, reason, removed, spoiler, state, subplebbitAddress } = post || {};

  const params = useParams();
  const location = useLocation();
  const isInPostView = isPostPageView(location.pathname, params);

  const displayContent = content && !isInPostView && content.length > 1000 ? content?.slice(0, 1000) : content;

  const isReply = parentCid;
  const isReplyingToReply = postCid !== parentCid;

  const stateString = useStateString(post);

  const loadingString = stateString && (
    <div className={`${styles.stateString} ${styles.ellipsis}`}>{stateString !== 'Failed' ? <LoadingEllipsis string={stateString} /> : stateString}</div>
  );

  const quotelinkReply = useComment({ commentCid: parentCid });

  return (
    content && (
      <blockquote className={`${styles.postMessage} ${!isReply && styles.clampLines}`}>
        {isReply && isReplyingToReply && <ReplyQuotePreview isQuotelinkReply={true} quotelinkReply={quotelinkReply} />}
        {removed ? (
          <span className={styles.removedContent}>({t('this_post_was_removed')})</span>
        ) : deleted ? (
          <span className={styles.removedContent}>{t('user_deleted_this_post')}</span>
        ) : (
          <Markdown content={displayContent} spoiler={spoiler} />
        )}
        {(removed || deleted) && reason && (
          <span>
            <br />
            <br />
            reason: {reason}
          </span>
        )}
        {!isReply && content.length > 1000 && !isInPostView && (
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

const Reply = ({ openReplyModal, reply, roles }: PostProps) => {
  const { subplebbitAddress, cid } = reply || {};
  const isRouteLinkToReply = useLocation().pathname.startsWith(`/p/${subplebbitAddress}/c/${cid}`);
  const { hidden } = useHide({ cid });

  return (
    <div className={styles.replyMobile}>
      <div className={styles.reply}>
        <div className={`${styles.replyContainer} ${isRouteLinkToReply && styles.highlight}`} id={reply?.cid}>
          <PostInfoAndMedia openReplyModal={openReplyModal} post={reply} roles={roles} />
          {reply.content && !hidden && <PostMessageMobile post={reply} />}
          <ReplyBacklinks post={reply} />
        </div>
      </div>
    </div>
  );
};

const PostMobile = ({ openReplyModal, post, roles, showAllReplies, showReplies = true }: PostProps) => {
  const { t } = useTranslation();
  const { cid, content, pinned, replyCount, subplebbitAddress } = post || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname, params);
  const isInPendingPostView = isPendingPostView(location.pathname, params);
  const isInPostView = isPostPageView(location.pathname, params);
  const linksCount = useCountLinksInReplies(post);
  const replies = useReplies(post);

  const isInPostPageView = isPostPageView(location.pathname, params);
  const { hidden, unhide } = useHide({ cid });

  // scroll to reply if pathname is reply permalink (backlink)
  const replyRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const replyIndex = replies.findIndex((reply) => location.pathname === `/p/${subplebbitAddress}/c/${reply?.cid}`);
    if (replyIndex !== -1 && replyRefs.current[replyIndex]) {
      replyRefs.current[replyIndex]?.scrollIntoView();
    }
  }, [location.pathname, replies, subplebbitAddress]);

  return (
    <>
      {hidden && !isInPostPageView ? (
        <>
          <hr className={styles.unhideButtonHr} />
          <span className={styles.mobileUnhideButton}>
            <span className='button' onClick={unhide}>
              Show Hidden Thread
            </span>
          </span>
        </>
      ) : (
        <div className={styles.postMobile}>
          {showReplies && (
            <div className={styles.hrWrapper}>
              <hr />
            </div>
          )}
          <div className={showReplies ? styles.thread : styles.quotePreview}>
            <div className={styles.postContainer}>
              <div className={styles.postOp}>
                <PostInfoAndMedia openReplyModal={openReplyModal} post={post} roles={roles} />
                {content && <PostMessageMobile post={post} />}
              </div>
              {!isInPostView && !isInPendingPostView && showReplies && (
                <div className={styles.postLink}>
                  <span className={styles.info}>
                    {replyCount > 0 && `${replyCount} Replies`}
                    {linksCount > 0 && ` / ${linksCount} Links`}
                  </span>
                  <Link
                    to={isInAllView && isDescription ? '/p/all/description' : `/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${cid}`}`}
                    className='button'
                  >
                    {t('view_thread')}
                  </Link>
                </div>
              )}
            </div>
            {!(pinned && !isInPostView) &&
              !isInPendingPostView &&
              !isDescription &&
              !isRules &&
              replies &&
              showReplies &&
              (showAllReplies ? replies : replies.slice(-5)).map((reply, index) => (
                <div key={index} className={styles.replyContainer} ref={(el) => (replyRefs.current[index] = el)}>
                  <Reply openReplyModal={openReplyModal} reply={reply} roles={roles} />
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PostMobile;
