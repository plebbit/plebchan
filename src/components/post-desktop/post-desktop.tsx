import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Comment, useAccount, useAccountComments, useAuthorAvatar, useComment, useEditedComment } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import styles from '../../views/post/post.module.css';
import { getCommentMediaInfo, getDisplayMediaInfoType, getHasThumbnail } from '../../lib/utils/media-utils';
import { getFormattedDate, getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isValidURL } from '../../lib/utils/url-utils';
import { isAllView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useAuthorAddressClick from '../../hooks/use-author-address-click';
import useEditCommentPrivileges from '../../hooks/use-author-privileges';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useHide from '../../hooks/use-hide';
import useReplies from '../../hooks/use-replies';
import useStateString from '../../hooks/use-state-string';
import CommentMedia from '../comment-media';
import EditMenu from '../edit-menu/edit-menu';
import { canEmbed } from '../embed';
import LoadingEllipsis from '../loading-ellipsis';
import Markdown from '../markdown';
import PostMenuDesktop from './post-menu-desktop';
import ReplyQuotePreview from '../reply-quote-preview';
import Tooltip from '../tooltip';
import { PostProps } from '../../views/post/post';
import { create } from 'zustand';
import _ from 'lodash';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';

interface ShowOmittedRepliesState {
  showOmittedReplies: Record<string, boolean>;
  setShowOmittedReplies: (cid: string, showOmittedReplies: boolean) => void;
}

const useShowOmittedReplies = create<ShowOmittedRepliesState>((set) => ({
  showOmittedReplies: {},
  setShowOmittedReplies: (cid, showOmittedReplies) =>
    set((state) => ({
      showOmittedReplies: {
        ...state.showOmittedReplies,
        [cid]: showOmittedReplies,
      },
    })),
}));

const PostInfo = ({ openReplyModal, post, postReplyCount = 0, roles, isHidden }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, locked, pinned, parentCid, postCid, replyCount, shortCid, state, subplebbitAddress, timestamp } = post || {};
  const title = post?.title?.trim();
  const replies = useReplies(post);
  const { address, shortAddress } = author || {};
  const displayName = author?.displayName?.trim();
  const authorRole = roles?.[address]?.role;
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const stateString = useStateString(post);
  const isReply = parentCid;
  const { showOmittedReplies } = useShowOmittedReplies();
  const { imageUrl: avatarImageUrl } = useAuthorAvatar({ author });

  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname, params);
  const isInPostPageView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

  const account = useAccount();
  const accountShortAddress = account?.author?.shortAddress; // if reply by account is pending, it doesn't have an author yet

  const { isCommentAuthorMod, isAccountMod, isAccountCommentAuthor } = useEditCommentPrivileges({ commentAuthorAddress: address, subplebbitAddress });

  const handleUserAddressClick = useAuthorAddressClick();
  const numberOfPostsByAuthor = document.querySelectorAll(`[data-author-address="${shortAddress}"][data-post-cid="${postCid}"]`).length;

  return (
    <div className={styles.postInfo}>
      {!isHidden && <EditMenu isAccountCommentAuthor={isAccountCommentAuthor} isAccountMod={isAccountMod} isCommentAuthorMod={isCommentAuthorMod} post={post} />}
      {title &&
        (title.length <= 75 ? (
          <span className={styles.subject}>{title} </span>
        ) : (
          <Tooltip
            children={<span className={styles.subject}>{title.slice(0, 75) + '(...)'} </span>}
            content={title.length < 1000 ? title : title.slice(0, 1000) + `... ${t('title_too_long')}`}
          />
        ))}
      <span className={styles.nameBlock}>
        <span className={`${styles.name} ${(isDescription || isRules || authorRole) && styles.capcodeMod}`}>
          {displayName ? (
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
          {authorRole && ` ## Board ${authorRole}`}{' '}
        </span>
        {!(isDescription || isRules) && (
          <>
            {author?.avatar && (
              <span className={styles.authorAvatar}>
                <img src={avatarImageUrl} alt='' />
              </span>
            )}
            (u/
            <Tooltip
              children={
                <span title={t('highlight_posts')} className={styles.userAddress} onClick={() => handleUserAddressClick(shortAddress || accountShortAddress, postCid)}>
                  {shortAddress || accountShortAddress}
                </span>
              }
              content={`${numberOfPostsByAuthor === 1 ? t('1_post_by_this_id') : t('x_posts_by_this_id', { number: numberOfPostsByAuthor })}`}
              showTooltip={isInPostPageView || showOmittedReplies[postCid] || (postReplyCount < 6 && !pinned)}
            />
            ){' '}
          </>
        )}
      </span>
      <span className={styles.dateTime}>
        <Tooltip children={<span>{getFormattedDate(timestamp)}</span>} content={getFormattedTimeAgo(timestamp)} />
        {isDescription || isRules ? '' : ' '}
      </span>
      <span className={styles.postNum}>
        {subplebbitAddress && (isInAllView || isInSubscriptionsView) && !isReply && (
          <span className={styles.postNumLink}>
            {' '}
            <Link to={`/p/${subplebbitAddress}`}>p/{subplebbitAddress && Plebbit.getShortAddress(subplebbitAddress)}</Link>{' '}
          </span>
        )}
        {!(isDescription || isRules) && (
          <span className={styles.postNumLink}>
            {cid ? (
              <>
                <Link to={`/p/${subplebbitAddress}/c/${cid}`} className={styles.linkToPost} title={t('link_to_post')} onClick={(e) => !cid && e.preventDefault()}>
                  c/
                </Link>
                <span className={styles.replyToPost} title={t('reply_to_post')} onMouseDown={() => openReplyModal && openReplyModal(cid, postCid)}>
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
        {pinned && (
          <span className={`${styles.stickyIconWrapper} ${!locked && styles.addPaddingBeforeReply}`}>
            <img src='assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
          </span>
        )}
        {locked && (
          <span className={`${styles.closedIconWrapper} ${styles.addPaddingBeforeReply} ${pinned && styles.addPaddingInBetween}`}>
            <img src='assets/icons/closed.gif' alt='' className={styles.closedIcon} title={t('closed')} />
          </span>
        )}
        {!isInPostPageView && !isReply && !isHidden && (
          <span className={styles.replyButton}>
            [
            <Link
              to={isInAllView && isDescription ? '/p/all/description' : `/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${postCid}`}`}
            >
              {_.capitalize(t('reply'))}
            </Link>
            ]
          </span>
        )}
      </span>
      <PostMenuDesktop post={post} />
      {replyCount > 0 &&
        parentCid &&
        replies &&
        replies.map((reply: Comment, index: number) => reply?.parentCid === cid && <ReplyQuotePreview key={index} isBacklinkReply={true} backlinkReply={reply} />)}
    </div>
  );
};

const PostMedia = ({ post }: PostProps) => {
  const { t } = useTranslation();
  const { link, spoiler } = post || {};
  const commentMediaInfo = getCommentMediaInfo(post);

  const { url } = commentMediaInfo || {};
  let type = commentMediaInfo?.type;
  const gifFrameUrl = useFetchGifFirstFrame(url);

  if (type === 'gif' && gifFrameUrl !== null) {
    type = 'animated gif';
  } else if (type === 'gif' && gifFrameUrl === null) {
    type = 'static gif';
  }

  const embedUrl = url && new URL(url);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  return (
    <div className={styles.file}>
      <div className={styles.fileText}>
        {t('link')}:{' '}
        <a href={url} target='_blank' rel='noopener noreferrer'>
          {spoiler ? _.capitalize(t('spoiler')) : url && url.length > 30 ? url.slice(0, 30) + '...' : url}
        </a>{' '}
        ({type && _.lowerCase(getDisplayMediaInfoType(type, t))})
        {!showThumbnail && (type === 'iframe' || type === 'video' || type === 'audio') && (
          <span>
            {' '}
            [
            <span className={styles.closeMedia} onClick={() => setShowThumbnail(true)}>
              {t('close')}
            </span>
            ]
          </span>
        )}
        {showThumbnail && !hasThumbnail && embedUrl && canEmbed(embedUrl) && (
          <span>
            {' '}
            [
            <span className={styles.closeMedia} onClick={() => setShowThumbnail(false)}>
              {t('open')}
            </span>
            ]
          </span>
        )}
      </div>
      {(hasThumbnail || (!hasThumbnail && !showThumbnail) || spoiler) && (
        <div className={styles.fileThumbnail}>
          <CommentMedia commentMediaInfo={commentMediaInfo} post={post} showThumbnail={showThumbnail} setShowThumbnail={setShowThumbnail} />
        </div>
      )}
    </div>
  );
};

const PostMessage = ({ post }: PostProps) => {
  const { cid, content, deleted, edit, original, parentCid, postCid, reason, removed, state } = post || {};
  // TODO: commentAuthor is not available outside of editedComment, update when available
  // const banned = !!post?.commentAuthor?.banExpiresAt;
  const { t } = useTranslation();
  const params = useParams();
  const location = useLocation();
  const isInPostView = isPostPageView(location.pathname, params);
  const [showOriginal, setShowOriginal] = useState(false);

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
    <blockquote className={styles.postMessage}>
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

  const { author, cid, link, postCid, subplebbitAddress } = post || {};
  const isRouteLinkToReply = useLocation().pathname.startsWith(`/p/${subplebbitAddress}/c/${cid}`);
  const { hidden } = useHide({ cid });

  return (
    <div className={styles.replyDesktop}>
      <div className={styles.sideArrows}>{'>>'}</div>
      <div
        className={`${styles.reply} ${isRouteLinkToReply && styles.highlight} ${hidden && styles.postDesktopHidden}`}
        data-cid={cid}
        data-author-address={author?.shortAddress}
        data-post-cid={postCid}
      >
        <PostInfo openReplyModal={openReplyModal} post={post} postReplyCount={postReplyCount} roles={roles} />
        {link && !hidden && isValidURL(link) && <PostMedia post={post} />}
        {!hidden && <PostMessage post={post} />}
      </div>
    </div>
  );
};

const PostDesktop = ({ openReplyModal, post, roles, showAllReplies, showReplies = true }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, content, link, pinned, postCid, state, subplebbitAddress } = post || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const params = useParams();
  const location = useLocation();
  const isInPendingPostView = isPendingPostView(location.pathname, params);
  const isInPostPageView = isPostPageView(location.pathname, params);

  const { hidden, unhide, hide } = useHide({ cid });
  const isHidden = hidden && !isInPostPageView;

  const replies = useReplies(post);
  const visiblelinksCount = useCountLinksInReplies(post, 5);
  const totalLinksCount = useCountLinksInReplies(post);
  const replyCount = replies?.length;
  const { accountComments } = useAccountComments();
  const isPostInAccountComments = accountComments?.find((comment) => comment.cid === cid);

  const repliesCount = pinned ? replyCount : replyCount - 5;
  const linksCount = pinned ? totalLinksCount : totalLinksCount - visiblelinksCount;
  const { showOmittedReplies, setShowOmittedReplies } = useShowOmittedReplies();

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
    <div className={styles.postDesktop}>
      {showReplies ? (
        <div className={styles.hrWrapper}>
          <hr />
        </div>
      ) : (
        <div className={styles.replyQuotePreviewSpacer} />
      )}
      <div className={isHidden ? styles.postDesktopHidden : ''}>
        {!isInPostPageView && !isDescription && !isRules && showReplies && (
          <span className={styles.hideButtonWrapper}>
            <span className={`${styles.hideButton} ${hidden ? styles.unhideThread : styles.hideThread}`} onClick={hidden ? unhide : hide} />
          </span>
        )}
        <div data-cid={cid} data-author-address={author?.shortAddress} data-post-cid={postCid}>
          {link && !isHidden && isValidURL(link) && <PostMedia post={post} />}
          <PostInfo isHidden={isHidden} openReplyModal={openReplyModal} post={post} postReplyCount={replyCount} roles={roles} />
          {!isHidden && !content && <div className={styles.spacer} />}
          {!isHidden && content && <PostMessage post={post} />}
        </div>
        {!isHidden && !isDescription && !isRules && !isInPendingPostView && (replyCount > 5 || (pinned && repliesCount > 0)) && !isInPostPageView && (
          <span className={styles.summary}>
            <span
              className={`${showOmittedReplies[cid] ? styles.hideOmittedReplies : styles.showOmittedReplies} ${styles.omittedRepliesButtonWrapper}`}
              onClick={() => setShowOmittedReplies(cid, !showOmittedReplies[cid])}
            />
            {showOmittedReplies[cid] ? (
              t('showing_all_replies')
            ) : linksCount > 0 ? (
              <Trans
                i18nKey={'replies_and_links_omitted'}
                shouldUnescape={true}
                components={{ 1: <Link to={`/p/${subplebbitAddress}/c/${cid}`} /> }}
                values={{ repliesCount, linksCount }}
              />
            ) : (
              <Trans i18nKey={'replies_omitted'} shouldUnescape={true} components={{ 1: <Link to={`/p/${subplebbitAddress}/c/${cid}`} /> }} values={{ repliesCount }} />
            )}
          </span>
        )}
        {post?.replyCount === undefined && !isPostInAccountComments && !isInPendingPostView && (
          <span className={styles.loadingString}>
            <LoadingEllipsis string={t('loading_comments')} />
          </span>
        )}
        {!isHidden &&
          !(pinned && !isInPostPageView && !showOmittedReplies[cid]) &&
          !isInPendingPostView &&
          !isDescription &&
          !isRules &&
          replies &&
          showReplies &&
          (showAllReplies || showOmittedReplies[cid] ? replies : replies.slice(-5)).map((reply, index) => (
            <div key={index} className={styles.replyContainer} ref={(el) => (replyRefs.current[index] = el)}>
              <Reply openReplyModal={openReplyModal} reply={reply} roles={roles} postReplyCount={replyCount} />
            </div>
          ))}
      </div>
      {!isInPendingPostView &&
        (stateString && stateString !== 'Failed' ? (
          <div className={styles.stateString}>
            <br />
            <LoadingEllipsis string={stateString} />
          </div>
        ) : (
          state === 'failed' && <span className={styles.error}>{t('failed')}</span>
        ))}
    </div>
  );
};

export default PostDesktop;
