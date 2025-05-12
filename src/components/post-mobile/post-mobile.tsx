import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Comment, useAuthorAvatar, useEditedComment } from '@plebbit/plebbit-react-hooks';
import useSubplebbitsStore from '@plebbit/plebbit-react-hooks/dist/stores/subplebbits';
import Plebbit from '@plebbit/plebbit-js';
import styles from '../../views/post/post.module.css';
import { shouldShowSnow } from '../../lib/snow';
import { getHasThumbnail } from '../../lib/utils/media-utils';
import { getTextColorForBackground, hashStringToColor } from '../../lib/utils/post-utils';
import { getFormattedDate, getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isAllView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useAvatarVisibilityStore from '../../stores/use-avatar-visibility-store';
import useAuthorAddressClick from '../../hooks/use-author-address-click';
import { useCommentMediaInfo } from '../../hooks/use-comment-media-info';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useHide from '../../hooks/use-hide';
import useReplies from '../../hooks/use-replies';
import useStateString from '../../hooks/use-state-string';
import CommentContent from '../comment-content';
import CommentMedia from '../comment-media';
import LoadingEllipsis from '../loading-ellipsis';
import PostMenuMobile from './post-menu-mobile';
import ReplyQuotePreview from '../reply-quote-preview';
import Tooltip from '../tooltip';
import { PostProps } from '../../views/post/post';
import _ from 'lodash';
import useReplyModalStore from '../../stores/use-reply-modal-store';

const PostInfoAndMedia = ({ post, postReplyCount = 0, roles }: PostProps) => {
  const { t } = useTranslation();
  const {
    author,
    cid,
    deleted,
    link,
    linkHeight,
    linkWidth,
    locked,
    parentCid,
    pinned,
    postCid,
    reason,
    removed,
    shortCid,
    state,
    subplebbitAddress,
    timestamp,
    thumbnailUrl,
  } = post || {};
  const isReply = parentCid;
  const title = post?.title?.trim();
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const { address, shortAddress } = author || {};
  const displayName = author?.displayName?.trim();
  const authorRole = roles?.[address]?.role;
  const { imageUrl: avatarImageUrl } = useAuthorAvatar({ author });
  const { hideAvatars } = useAvatarVisibilityStore();

  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname);
  const isInPostPageView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

  const commentMediaInfo = useCommentMediaInfo(link, thumbnailUrl, linkWidth, linkHeight);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);

  const stateString = useStateString(post);

  const handleUserAddressClick = useAuthorAddressClick();
  const numberOfPostsByAuthor = document.querySelectorAll(`[data-author-address="${shortAddress}"][data-post-cid="${postCid}"]`).length;

  const userID = address && Plebbit.getShortAddress(address);
  const userIDBackgroundColor = hashStringToColor(userID);
  const userIDTextColor = getTextColorForBackground(userIDBackgroundColor);

  const { hidden } = useHide(post);

  const { openReplyModal } = useReplyModalStore();

  const onReplyModalClick = () => {
    deleted
      ? isReply
        ? alert(t('this_reply_was_deleted'))
        : alert(t('this_thread_was_deleted'))
      : removed
      ? isReply
        ? alert(t('this_reply_was_removed'))
        : alert(t('this_thread_was_removed'))
      : openReplyModal && openReplyModal(cid, postCid, subplebbitAddress);
  };

  return (
    <>
      <div className={styles.postInfo}>
        <PostMenuMobile post={post} />
        <span className={(hidden || ((removed || deleted) && !reason)) && parentCid ? styles.postDesktopHidden : ''}>
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
                        onClick={() => handleUserAddressClick(userID, postCid)}
                        style={{ backgroundColor: userIDBackgroundColor, color: userIDTextColor }}
                      >
                        {userID}
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
            {title && (
              <span className={styles.subjectWrapper}>
                {title.length <= 30 ? (
                  <span className={styles.subject}>{title}</span>
                ) : (
                  <Tooltip
                    children={<span className={styles.subject}>{title.slice(0, 30) + '(...)'}</span>}
                    content={title.length < 1000 ? title : title.slice(0, 1000) + `... ${t('title_too_long')}`}
                  />
                )}
              </span>
            )}
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
                  <span className={styles.replyToPost} title={t('reply_to_post')} onMouseDown={onReplyModalClick}>
                    {shortCid.slice(0, -4)}
                  </span>
                </span>
              ) : (
                <>
                  <span>c/</span>
                  <span className={styles.pendingCid}>
                    {state === 'failed' || stateString === 'Failed' ? _.capitalize(t('failed')) : state === 'pending' ? _.capitalize(t('pending')) : ''}
                  </span>
                </>
              ))}
          </span>
        </span>
      </div>
      {(hasThumbnail || link) && !(deleted || removed) && <PostMediaContent key={cid} post={post} link={link} />}
    </>
  );
};

const PostMediaContent = ({ post, link }: { post: any; link: string }) => {
  const [showThumbnail, setShowThumbnail] = useState(true);
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const { thumbnailUrl, linkWidth, linkHeight, spoiler, deleted, removed, parentCid } = post || {};
  const commentMediaInfo = useCommentMediaInfo(link, thumbnailUrl, linkWidth, linkHeight);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);

  return (
    hasThumbnail && (
      <CommentMedia
        commentMediaInfo={commentMediaInfo}
        deleted={deleted}
        isDescription={isDescription}
        isRules={isRules}
        removed={removed}
        linkHeight={linkHeight}
        linkWidth={linkWidth}
        showThumbnail={showThumbnail}
        setShowThumbnail={setShowThumbnail}
        isOutOfFeed={isDescription || isRules}
        parentCid={parentCid}
        spoiler={spoiler}
      />
    )
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
          (reply: Comment, index: number) =>
            reply?.parentCid === cid &&
            reply?.cid &&
            !(reply?.deleted || reply?.removed) && <ReplyQuotePreview key={index} isBacklinkReply={true} backlinkReply={reply} />,
        )}
      </div>
    )
  );
};

const Reply = ({ postReplyCount, reply, roles }: PostProps) => {
  let post = reply;
  // handle pending mod or author edit
  const { editedComment } = useEditedComment({ comment: reply });
  if (editedComment) {
    post = editedComment;
  }
  const { author, cid, deleted, postCid, reason, removed, subplebbitAddress } = post || {};
  const isRouteLinkToReply = useLocation().pathname.startsWith(`/p/${subplebbitAddress}/c/${cid}`);
  const { hidden } = useHide({ cid });

  return (
    <div className={styles.replyMobile}>
      <div className={styles.reply}>
        <div
          className={`${styles.replyContainer} ${isRouteLinkToReply && styles.highlight}`}
          data-cid={cid}
          data-author-address={author?.shortAddress}
          data-post-cid={postCid}
        >
          <PostInfoAndMedia post={post} postReplyCount={postReplyCount} roles={roles} />
          {!hidden && (!(removed || deleted) || ((removed || deleted) && reason)) && <CommentContent comment={post} />}
          <ReplyBacklinks post={reply} />
        </div>
      </div>
    </div>
  );
};

const PostMobile = ({ post, roles, showAllReplies, showReplies = true }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, pinned, postCid, replyCount, state, subplebbitAddress } = post || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname);
  const isInPendingPostView = isPendingPostView(location.pathname, params);
  const isInPostView = isPostPageView(location.pathname, params);
  const linksCount = useCountLinksInReplies(post);
  const replies = useReplies(post);

  const isInPostPageView = isPostPageView(location.pathname, params);
  const { hidden, unhide } = useHide({ cid });

  const stateString = useStateString(post) || t('loading_post');

  const subplebbit = useSubplebbitsStore((state) => state.subplebbits[subplebbitAddress]);
  const showRules = isDescription && subplebbit?.rules && subplebbit?.rules.length > 0;
  const subplebbitRulesReply = {
    isRules: true,
    subplebbitAddress,
    timestamp: subplebbit?.createdAt,
    author: { displayName: `## ${t('board_mods')}` },
    content: `${subplebbit?.rules?.map((rule: string, index: number) => `${index + 1}. ${rule}`).join('\n')}`,
    replyCount: 0,
  };

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
              <div
                className={`${styles.postOp} ${shouldShowSnow() ? styles.xmasHatWrapper : ''}`}
                data-cid={cid}
                data-author-address={author?.shortAddress}
                data-post-cid={postCid}
              >
                {shouldShowSnow() && <img src={`${process.env.PUBLIC_URL}/assets/xmashat.gif`} className={styles.xmasHat} alt='' />}
                <PostInfoAndMedia post={post} postReplyCount={replyCount} roles={roles} />
                <CommentContent comment={post} />
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
              replies &&
              showReplies &&
              (showAllReplies ? replies : replies.slice(-5)).map((reply, index) => (
                <div key={index} className={styles.replyContainer}>
                  <Reply postReplyCount={replyCount} reply={reply} roles={roles} />
                </div>
              ))}
            {showRules && (
              <div className={styles.replyContainer}>
                <Reply reply={subplebbitRulesReply} />
              </div>
            )}
          </div>
          {!isInPendingPostView &&
          (!isDescription || (isDescription && !subplebbit?.updatedAt)) &&
          !isRules &&
          stateString &&
          stateString !== 'Failed' &&
          state !== 'succeeded' &&
          isInPostPageView &&
          !(!showReplies && !showAllReplies) ? (
            <div className={styles.stateString}>
              <LoadingEllipsis string={stateString} />
            </div>
          ) : (
            state === 'failed' && <span className={styles.error}>{t('failed')}</span>
          )}
        </div>
      )}
    </>
  );
};

export default PostMobile;
