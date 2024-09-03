import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Comment, useAccount, useAuthorAvatar, useComment, useEditedComment } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import styles from '../../views/post/post.module.css';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { getTextColorForBackground, hashStringToColor } from '../../lib/utils/post-utils';
import { getFormattedDate, getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isAllView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useAnonModeStore from '../../stores/use-anon-mode-store';
import useAvatarVisibilityStore from '../../stores/use-avatar-visibility-store';
import useAnonMode from '../../hooks/use-anon-mode';
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
  const { author, cid, deleted, link, locked, parentCid, pinned, postCid, removed, shortCid, state, subplebbitAddress, timestamp } = post || {};
  const title = post?.title?.trim();
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const { address, shortAddress } = author || {};
  const displayName = author?.displayName?.trim();
  const authorRole = roles?.[address]?.role;
  const { imageUrl: avatarImageUrl } = useAuthorAvatar({ author });
  const { hideAvatars } = useAvatarVisibilityStore();

  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname, params);
  const isInPostPageView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

  const commentMediaInfo = getCommentMediaInfo(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const isReply = parentCid;

  // comment.author.shortAddress is undefined while the comment publishing state is pending, use account instead
  // in anon mode, use the newly generated signer.address instead, which will be comment.author.address
  const { anonMode } = useAnonMode();
  const { currentAnonSignerAddress } = useAnonModeStore();
  const account = useAccount();
  const pendingShortAddress = anonMode ? currentAnonSignerAddress && Plebbit.getShortAddress(currentAnonSignerAddress) : account?.author?.shortAddress;

  const stateString = useStateString(post);

  const handleUserAddressClick = useAuthorAddressClick();
  const numberOfPostsByAuthor = document.querySelectorAll(`[data-author-address="${shortAddress}"][data-post-cid="${postCid}"]`).length;

  const userIDBackgroundColor = hashStringToColor(shortAddress || pendingShortAddress);
  const userIDTextColor = getTextColorForBackground(userIDBackgroundColor);

  return (
    <>
      <div className={styles.postInfo}>
        <PostMenuMobile post={post} />
        <span className={styles.nameBlock}>
          <span className={`${styles.name} ${(isDescription || isRules || authorRole) && !(deleted || removed) && styles.capcodeMod}`}>
            {removed ? (
              _.capitalize(t('removed'))
            ) : deleted ? (
              _.capitalize(t('deleted'))
            ) : displayName ? (
              displayName.length <= 20 ? (
                displayName
              ) : (
                <Tooltip
                  children={displayName.slice(0, 20) + '(...)'}
                  content={displayName.length < 1000 ? displayName : displayName.slice(0, 1000) + `... ${t('display_name_too_long')}`}
                />
              )
            ) : (
              _.capitalize(t('anonymous'))
            )}
            {!(deleted || removed) && <span className='capitalize'>{authorRole && ` ## Board ${authorRole}`} </span>}
          </span>
          {!(isDescription || isRules) && (
            <>
              {author?.avatar && !(deleted || removed) && !hideAvatars ? (
                <span className={styles.authorAvatar}>
                  <img src={avatarImageUrl} alt='' />
                </span>
              ) : (
                ' '
              )}
              (ID: {''}
              {removed ? (
                _.lowerCase(t('removed'))
              ) : deleted ? (
                _.lowerCase(t('deleted'))
              ) : (
                <Tooltip
                  children={
                    <span
                      title={t('highlight_posts')}
                      className={styles.userAddress}
                      onClick={() => handleUserAddressClick(shortAddress || pendingShortAddress, postCid)}
                      style={{ backgroundColor: userIDBackgroundColor, color: userIDTextColor }}
                    >
                      {shortAddress || pendingShortAddress}
                    </span>
                  }
                  content={`${numberOfPostsByAuthor === 1 ? t('1_post_by_this_id') : t('x_posts_by_this_id', { number: numberOfPostsByAuthor })}`}
                  showTooltip={isInPostPageView || postReplyCount < 6}
                />
              )}
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
          {!(isDescription || isRules) &&
            (cid ? (
              <span className={styles.postNumLink}>
                <Link to={`/p/${subplebbitAddress}/c/${cid}`} className={styles.linkToPost} title={t('link_to_post')} onClick={(e) => !cid && e.preventDefault()}>
                  c/
                </Link>
                <span className={styles.replyToPost} title={t('reply_to_post')} onMouseDown={() => openReplyModal && openReplyModal(cid, postCid, subplebbitAddress)}>
                  {shortCid.slice(0, -4)}
                </span>
              </span>
            ) : (
              <>
                <span>c/</span>
                <span className={styles.pendingCid}>{state === 'failed' || stateString === 'Failed' ? 'Failed' : state === 'pending' ? 'Pending' : ''}</span>
              </>
            ))}
        </span>
      </div>
      {(hasThumbnail || link) && !(deleted || removed) && (
        <CommentMedia commentMediaInfo={commentMediaInfo} post={post} showThumbnail={showThumbnail} setShowThumbnail={setShowThumbnail} />
      )}
    </>
  );
};

const ReplyBacklinks = ({ post }: PostProps) => {
  const { cid, parentCid } = post || {};
  const replies = useReplies(post);

  return (
    cid &&
    parentCid &&
    replies.length > 0 && (
      <div className={styles.mobileReplyBacklinks}>
        {replies.map(
          (reply: Comment, index: number) => reply?.parentCid === cid && reply?.cid && <ReplyQuotePreview key={index} isBacklinkReply={true} backlinkReply={reply} />,
        )}
      </div>
    )
  );
};

const PostMessageMobile = ({ post }: PostProps) => {
  const { t } = useTranslation();
  const { cid, content, deleted, edit, original, parentCid, postCid, reason, removed, state } = post || {};
  // TODO: commentAuthor is not available outside of editedComment, update when available
  // const banned = !!post?.commentAuthor?.banExpiresAt;
  const [showOriginal, setShowOriginal] = useState(false);

  const params = useParams();
  const location = useLocation();
  const isInPostView = isPostPageView(location.pathname, params);

  const [showFullComment, setShowFullComment] = useState(false);
  const displayContent = content && !isInPostView && content.length > 1000 && !showFullComment ? content.slice(0, 1000) : content;

  const quotelinkReply = useComment({ commentCid: parentCid });
  const isReply = parentCid;
  const isReplyingToReply = (postCid && postCid !== parentCid) || quotelinkReply?.postCid !== parentCid;

  const stateString = useStateString(post);

  const loadingString = (
    <div className={`${styles.stateString} ${styles.ellipsis}`}>{stateString !== 'Failed' ? <LoadingEllipsis string={stateString || t('loading')} /> : stateString}</div>
  );

  return (
    <blockquote className={`${styles.postMessage} ${!isReply && styles.clampLines}`}>
      {isReply && !(removed || deleted) && state !== 'failed' && isReplyingToReply && <ReplyQuotePreview isQuotelinkReply={true} quotelinkReply={quotelinkReply} />}
      {removed ? (
        reason ? (
          <>
            <span className={styles.redEditMessage}>({t('this_post_was_removed')})</span>
            <br />
            <br />
            <span className={styles.grayEditMessage}>{`${_.capitalize(t('reason'))}: "${reason}"`}</span>
          </>
        ) : (
          <span className={styles.grayEditMessage}>{_.capitalize(t('this_post_was_removed'))}.</span>
        )
      ) : deleted ? (
        reason ? (
          <>
            <span className={styles.grayEditMessage}>{t('user_deleted_this_post')}</span>{' '}
            <span className={styles.grayEditMessage}>{`${_.capitalize(t('reason'))}: "${reason}"`}</span>
          </>
        ) : (
          <span className={styles.grayEditMessage}>{t('user_deleted_this_post')}</span>
        )
      ) : (
        <>
          {!showOriginal && <Markdown content={displayContent} />}
          {edit && original?.content !== post?.content && (
            <span className={styles.editedInfo}>
              {showOriginal && <Markdown content={original?.content} />}
              <br />
              <Trans
                i18nKey={'comment_edited_at_timestamp'}
                values={{ timestamp: getFormattedDate(edit?.timestamp) }}
                shouldUnescape={true}
                components={{ 1: <Tooltip content={getFormattedTimeAgo(edit?.timestamp)} children={<></>} /> }}
              />{' '}
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
      {content?.length > 1000 && !isInPostView && !showFullComment && (
        <span className={styles.abbr}>
          <br />
          <Trans i18nKey={'comment_too_long'} shouldUnescape={true} components={{ 1: <span onClick={() => setShowFullComment(true)} /> }} />
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
            {!(pinned && !isInPostView) &&
              !isInPendingPostView &&
              !isDescription &&
              !isRules &&
              replies &&
              showReplies &&
              (showAllReplies ? replies : replies.slice(-5)).map((reply, index) => (
                <div key={index} className={styles.replyContainer}>
                  <Reply openReplyModal={openReplyModal} postReplyCount={replyCount} reply={reply} roles={roles} />
                </div>
              ))}
          </div>
          {!isInPendingPostView &&
            (stateString && stateString !== 'Failed' && state !== 'succeeded' ? (
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
