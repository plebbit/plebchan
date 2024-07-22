import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Comment, useAccount, useAuthorAvatar, useComment, useEditedComment } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import styles from '../../views/post/post.module.css';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { getFormattedDate, getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isAllView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useAuthorAddressClick from '../../hooks/use-author-address-click';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useHide from '../../hooks/use-hide';
import useReplies from '../../hooks/use-replies';
import useStateString from '../../hooks/use-state-string';
import CommentMedia from '../comment-media';
import LoadingEllipsis from '../loading-ellipsis';
import Markdown from '../markdown';
import PostMenuMobile from './post-menu-mobile';
import ReplyQuotePreview from '../reply-quote-preview';
import Tooltip from '../tooltip';
import { PostProps } from '../../views/post/post';
import _ from 'lodash';

const PostInfoAndMedia = ({ openReplyModal, post, postReplyCount = 0, roles }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, link, locked, parentCid, pinned, postCid, shortCid, state, subplebbitAddress, timestamp } = post || {};
  const title = post?.title?.trim();
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const { address, shortAddress } = author || {};
  const displayName = author?.displayName?.trim();
  const authorRole = roles?.[address]?.role;
  const { imageUrl: avatarImageUrl } = useAuthorAvatar({ author });

  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname, params);
  const isInPostPageView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

  const commentMediaInfo = getCommentMediaInfo(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const isReply = parentCid;

  // pending reply by account is not yet published
  const account = useAccount();
  const accountShortAddress = account?.author?.shortAddress;

  const stateString = useStateString(post);

  const handleUserAddressClick = useAuthorAddressClick();
  const numberOfPostsByAuthor = document.querySelectorAll(`[data-author-address="${shortAddress}"][data-post-cid="${postCid}"]`).length;

  return (
    <>
      <div className={styles.postInfo}>
        <PostMenuMobile post={post} />
        <span className={styles.nameBlock}>
          <span className={`${styles.name} ${(isDescription || isRules || authorRole) && styles.capcodeMod}`}>
            {displayName ? (
              displayName.length <= 20 ? (
                <span className={styles.name}>{displayName}</span>
              ) : (
                <Tooltip
                  children={<span className={styles.name}>{displayName.slice(0, 20) + '(...)'}</span>}
                  content={displayName.length < 1000 ? displayName : displayName.slice(0, 1000) + `... ${t('display_name_too_long')}`}
                />
              )
            ) : (
              _.capitalize(t('anonymous'))
            )}
            {authorRole && ` ## Board ${authorRole}`}{' '}
          </span>
          {!(isDescription || isRules) && (
            <>
              {isReply && author?.avatar && (
                <>
                  <span className={styles.authorAvatar} style={{ backgroundImage: `url(${avatarImageUrl})` }} />{' '}
                </>
              )}
              (u/
              <Tooltip
                children={
                  <span title={t('highlight_posts')} className={styles.userAddress} onClick={() => handleUserAddressClick(shortAddress || accountShortAddress, postCid)}>
                    {shortAddress || accountShortAddress}
                  </span>
                }
                content={`${numberOfPostsByAuthor === 1 ? t('1_post_by_this_id') : t('x_posts_by_this_id', { number: numberOfPostsByAuthor })}`}
                showTooltip={isInPostPageView || postReplyCount < 6}
              />
              ){' '}
            </>
          )}
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
          {title &&
            (title.length <= 30 ? (
              <span className={styles.subject}>{title}</span>
            ) : (
              <Tooltip
                children={<span className={styles.subject}>{title.slice(0, 30) + '(...)'}</span>}
                content={title.length < 1000 ? title : title.slice(0, 1000) + `... ${t('title_too_long')}`}
              />
            ))}
        </span>
        <span className={styles.dateTimePostNum}>
          {subplebbitAddress && (isInAllView || isInSubscriptionsView) && !isReply && (
            <div className={styles.postNumLink}>
              {' '}
              <Link to={`/p/${subplebbitAddress}`}>p/{subplebbitAddress && Plebbit.getShortAddress(subplebbitAddress)}</Link>
            </div>
          )}
          <Tooltip children={<span>{getFormattedDate(timestamp)}</span>} content={getFormattedTimeAgo(timestamp)} />{' '}
          {!(isDescription || isRules) && (
            <span className={styles.postNumLink}>
              {cid ? (
                <>
                  <Link to={`/p/${subplebbitAddress}/c/${cid}`} className={styles.linkToPost} title={t('link_to_post')} onClick={(e) => !cid && e.preventDefault()}>
                    c/
                  </Link>
                  <span className={styles.replyToPost} title={t('reply_to_post')} onMouseDown={() => openReplyModal && openReplyModal(cid)}>
                    {shortCid}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ cursor: 'pointer' }}>c/</span>
                  <span className={styles.pendingCid}>{state === 'failed' || stateString === 'Failed' ? 'Failed' : 'Pending'}</span>
                </>
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
  const { cid, content, deleted, edit, original, parentCid, postCid, reason, removed, state, subplebbitAddress } = post || {};
  // TODO: commentAuthor is not available outside of editedComment, update when available
  // const banned = !!post?.commentAuthor?.banExpiresAt;
  const [showOriginal, setShowOriginal] = useState(false);

  const params = useParams();
  const location = useLocation();
  const isInPostView = isPostPageView(location.pathname, params);

  const displayContent = content && !isInPostView && content.length > 1000 ? content?.slice(0, 1000) : content;

  const quotelinkReply = useComment({ commentCid: parentCid });
  const isReply = parentCid;
  const isReplyingToReply = (postCid && postCid !== parentCid) || quotelinkReply?.postCid !== parentCid;

  const stateString = useStateString(post);

  const loadingString = stateString && (
    <div className={`${styles.stateString} ${styles.ellipsis}`}>{stateString !== 'Failed' ? <LoadingEllipsis string={stateString} /> : stateString}</div>
  );

  return (
    <blockquote className={`${styles.postMessage} ${!isReply && styles.clampLines}`}>
      {isReply && !(removed || deleted) && state !== 'failed' && isReplyingToReply && <ReplyQuotePreview isQuotelinkReply={true} quotelinkReply={quotelinkReply} />}
      {removed ? (
        <Tooltip
          children={<span className={styles.removedContent}>({t('this_post_was_removed')})</span>}
          content={`${_.capitalize(t('reason'))}: "${reason}"`}
          showTooltip={!!reason}
        />
      ) : deleted ? (
        <Tooltip children={<span className={styles.deletedContent}>{t('user_deleted_this_post')}</span>} content={reason && `${t('reason')}: ${reason}`} />
      ) : (
        <>
          {!showOriginal && <Markdown content={displayContent} />}
          {edit && original?.content !== post?.content && (
            <span className={styles.editedInfo}>
              {showOriginal && <Markdown content={original?.content} />}
              <br />
              {t('comment_edited_at_timestamp', { timestamp: getFormattedDate(edit?.timestamp), interpolation: { escapeValue: false } })}{' '}
              {reason && <>{t('reason_reason', { reason: reason, interpolation: { escapeValue: false } })} </>}
              {showOriginal ? (
                <Trans
                  i18nKey={'click_here_to_hide_original'}
                  shouldUnescape={true}
                  components={{ 1: <span className={styles.showOriginal} onClick={() => setShowOriginal(!showOriginal)} /> }}
                />
              ) : (
                <Trans
                  i18nKey={'click_here_to_show_original'}
                  shouldUnescape={true}
                  components={{ 1: <span className={styles.showOriginal} onClick={() => setShowOriginal(!showOriginal)} /> }}
                />
              )}
            </span>
          )}
        </>
      )}
      {/* TODO: commentAuthor is not available outside of editedComment, update when available */}
      {/* {banned && (
        <span className={styles.removedContent}>
          <br />
          <br />
          <Tooltip
            children={`(${t('user_banned')})`}
            content={`${t('ban_expires_at', {
              address: subplebbitAddress && Plebbit.getShortAddress(subplebbitAddress),
              timestamp: getFormattedDate(commentAuthor?.banExpiresAt),
              interpolation: { escapeValue: false },
            })}${reason ? `. ${_.capitalize(t('reason'))}: "${reason}"` : ''}`}
          />
        </span>
      )} */}
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
  );
};

const Reply = ({ openReplyModal, postReplyCount, reply, roles }: PostProps) => {
  let post = reply;
  // handle pending mod or author edit
  const { editedComment } = useEditedComment({ comment: reply });
  if (editedComment) {
    post = editedComment;
  }
  const { author, cid, postCid, subplebbitAddress } = post || {};
  const isRouteLinkToReply = useLocation().pathname.startsWith(`/p/${subplebbitAddress}/c/${cid}`);
  const { hidden } = useHide({ cid });

  return (
    <div className={styles.replyMobile}>
      <div className={styles.reply}>
        <div
          className={`${styles.replyContainer} ${isRouteLinkToReply && styles.highlight} ${hidden && styles.postDesktopHidden}`}
          data-cid={cid}
          data-author-address={author?.shortAddress}
          data-post-cid={postCid}
        >
          <PostInfoAndMedia openReplyModal={openReplyModal} post={post} postReplyCount={postReplyCount} roles={roles} />
          {!hidden && <PostMessageMobile post={post} />}
          <ReplyBacklinks post={reply} />
        </div>
      </div>
    </div>
  );
};

const PostMobile = ({ openReplyModal, post, roles, showAllReplies, showReplies = true }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, content, pinned, postCid, replyCount, state, subplebbitAddress } = post || {};
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

  const stateString = useStateString(post);

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
              <div className={styles.postOp} data-cid={cid} data-author-address={author?.shortAddress} data-post-cid={postCid}>
                <PostInfoAndMedia openReplyModal={openReplyModal} post={post} postReplyCount={replyCount} roles={roles} />
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
            {post?.replyCount === undefined && !isInPendingPostView && (
              <span className={styles.loadingString}>
                <LoadingEllipsis string={t('loading_comments')} />
              </span>
            )}
            {!(pinned && !isInPostView) &&
              !isInPendingPostView &&
              !isDescription &&
              !isRules &&
              replies &&
              showReplies &&
              (showAllReplies ? replies : replies.slice(-5)).map((reply, index) => (
                <div key={index} className={styles.replyContainer} ref={(el) => (replyRefs.current[index] = el)}>
                  <Reply openReplyModal={openReplyModal} postReplyCount={replyCount} reply={reply} roles={roles} />
                </div>
              ))}
          </div>
          {!isInPendingPostView &&
            (stateString && stateString !== 'Failed' ? (
              <div className={styles.stateString}>
                <LoadingEllipsis string={stateString} />
              </div>
            ) : (
              state === 'failed' && <span className={styles.error}>{t('failed')}</span>
            ))}
        </div>
      )}
    </>
  );
};

export default PostMobile;
