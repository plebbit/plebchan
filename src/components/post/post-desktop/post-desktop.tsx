import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAccount, useBlock, useEditedComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import styles from '../post.module.css';
import { getCommentMediaInfo, getDisplayMediaInfoType, getHasThumbnail } from '../../../lib/utils/media-utils';
import { getFormattedDate } from '../../../lib/utils/time-utils';
import { isValidURL } from '../../../lib/utils/url-utils';
import { isAllView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../../lib/utils/view-utils';
import useCountLinksInReplies from '../../../hooks/use-count-links-in-replies';
import useReplies from '../../../hooks/use-replies';
import useStateString from '../../../hooks/use-state-string';
import CommentMedia from '../../comment-media';
import { canEmbed } from '../../embed';
import LoadingEllipsis from '../../loading-ellipsis';
import Markdown from '../../markdown';
import PostMenuDesktop from './post-menu-desktop/';
import EditMenu from '../edit-menu/edit-menu';
import { PostProps } from '../post';
import _ from 'lodash';

const PostInfo = ({ openReplyModal, post, roles, isHidden }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, locked, pinned, parentCid, postCid, shortCid, state, subplebbitAddress, timestamp, title } = post || {};
  const { address, displayName, shortAddress } = author || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api
  const stateString = useStateString(post);
  const isReply = parentCid;

  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname);
  const isInPostView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname);

  const shortDisplayName = displayName?.trim().length > 20 ? displayName?.trim().slice(0, 20).trim() + '...' : displayName?.trim();
  const authorRole = roles?.[address]?.role;
  const displayTitle = title && title.length > 75 ? title?.slice(0, 75) + '...' : title;

  const account = useAccount();
  const accountShortAddress = account?.author?.shortAddress; // if reply by account is pending, it doesn't have an author yet
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const commentAuthorRole = subplebbit?.roles?.[author?.address]?.role;
  const isCommentAuthorMod = commentAuthorRole === 'admin' || commentAuthorRole === 'owner' || commentAuthorRole === 'moderator';
  const accountAuthorRole = subplebbit?.roles?.[account?.author?.address]?.role;
  const isAccountMod = accountAuthorRole === 'admin' || accountAuthorRole === 'owner' || accountAuthorRole === 'moderator';
  const isAccountCommentAuthor = account?.author?.address === author?.address;

  return (
    <div className={styles.postInfo}>
      {!isHidden && <EditMenu cid={cid} isAccountCommentAuthor={isAccountCommentAuthor} isAccountMod={isAccountMod} isCommentAuthorMod={isCommentAuthorMod} />}
      {title && <span className={styles.subject}>{displayTitle} </span>}
      <span className={styles.nameBlock}>
        <span className={`${styles.name} ${(isDescription || isRules || authorRole) && styles.capcodeMod}`}>
          {shortDisplayName || _.capitalize(t('anonymous'))}
          {authorRole && ` ## Board ${authorRole}`}{' '}
        </span>
        {!(isDescription || isRules) && <span className={styles.userAddress}>(u/{shortAddress || accountShortAddress}) </span>}
      </span>
      <span className={styles.dateTime}>
        {getFormattedDate(timestamp)}
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
        {pinned && (
          <span className={`${styles.stickyIconWrapper} ${!locked && styles.addPaddingBeforeReply}`}>
            <img src='/assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
          </span>
        )}
        {locked && (
          <span className={`${styles.closedIconWrapper} ${styles.addPaddingBeforeReply} ${pinned && styles.addPaddingInBetween}`}>
            <img src='/assets/icons/closed.gif' alt='' className={styles.closedIcon} title={t('closed')} />
          </span>
        )}
        {!isInPostView && !isReply && !isHidden && (
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
    </div>
  );
};

const PostMedia = ({ post }: PostProps) => {
  const { t } = useTranslation();
  const commentMediaInfo = getCommentMediaInfo(post);
  const { type, url } = commentMediaInfo || {};
  const embedUrl = url && new URL(url);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, post?.link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  return (
    <div className={styles.file}>
      <div className={styles.fileText}>
        {t('link')}:{' '}
        <a href={url} target='_blank' rel='noopener noreferrer'>
          {url && url.length > 30 ? url.slice(0, 30) + '...' : url}
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
      {(hasThumbnail || (!hasThumbnail && !showThumbnail)) && (
        <div className={styles.fileThumbnail}>
          <CommentMedia commentMediaInfo={commentMediaInfo} post={post} showThumbnail={showThumbnail} setShowThumbnail={setShowThumbnail} />
        </div>
      )}
    </div>
  );
};

const PostMessage = ({ post }: PostProps) => {
  const { cid, content, deleted, parentCid, postCid, reason, removed, spoiler, state, subplebbitAddress } = post || {};
  const { t } = useTranslation();
  const params = useParams();
  const location = useLocation();
  const isInPostView = isPostPageView(location.pathname, params);

  const displayContent = content && !isInPostView && content.length > 1000 ? content?.slice(0, 1000) + '(...)' : content;

  const isReply = parentCid;
  const isReplyingToReply = postCid !== parentCid;

  const stateString = useStateString(post);

  const loadingString = stateString && (
    <div className={`${styles.stateString} ${styles.ellipsis}`}>{stateString !== 'Failed' ? <LoadingEllipsis string={stateString} /> : stateString}</div>
  );

  return (
    <blockquote className={styles.postMessage}>
      {isReply && isReplyingToReply && (
        <>
          <Link to={`/p/${subplebbitAddress}/c/${parentCid}`} className={styles.quoteLink}>
            {`c/${parentCid && Plebbit.getShortCid(parentCid)}`}
          </Link>
          <br />
        </>
      )}
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
          {t('reason')}: {reason}
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
  );
};

const PostDesktop = ({ openReplyModal, post, roles, showAllReplies }: PostProps) => {
  // handle pending mod or author edit
  const { editedComment } = useEditedComment({ comment: post });
  if (editedComment) {
    post = editedComment;
  }
  const { cid, content, link, pinned, replyCount, subplebbitAddress } = post || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api

  const params = useParams();
  const location = useLocation();
  const isInPendingPostView = isPendingPostView(location.pathname, params);
  const isInPostPageView = isPostPageView(location.pathname, params);

  const { blocked, unblock, block } = useBlock({ cid });
  const isHidden = blocked && !isInPostPageView;

  const replies = useReplies(post);
  const visiblelinksCount = useCountLinksInReplies(post, 5);
  const totallinksCount = useCountLinksInReplies(post);
  const repliesCount = pinned ? replyCount : replyCount - 5;
  const linksCount = pinned ? totallinksCount : totallinksCount - visiblelinksCount;

  return (
    <div className={styles.postDesktop}>
      <div className={styles.hrWrapper}>
        <hr />
      </div>
      <div className={isHidden ? styles.postDesktopBlocked : ''}>
        {!isInPostPageView && !isDescription && !isRules && (
          <span className={styles.hideButtonWrapper}>
            <span className={`${styles.hideButton} ${blocked ? styles.unhideThread : styles.hideThread}`} onClick={blocked ? unblock : block} />
          </span>
        )}
        {link && !isHidden && isValidURL(link) && <PostMedia post={post} />}
        <PostInfo isHidden={isHidden} openReplyModal={openReplyModal} post={post} roles={roles} />
        {!isHidden && !content && <div className={styles.spacer} />}
        {!isHidden && content && <PostMessage post={post} />}
        {!isHidden && !isDescription && !isRules && !isInPendingPostView && (replies.length > 5 || (pinned && replies.length > 0)) && !isInPostPageView && (
          <span className={styles.summary}>
            <span className={styles.expandButtonWrapper}>
              <span className={styles.expandButton} />
            </span>
            {linksCount > 0 ? (
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
        {!isHidden &&
          !(pinned && !isInPostPageView) &&
          !isInPendingPostView &&
          !isDescription &&
          !isRules &&
          replies &&
          (showAllReplies ? replies : replies.slice(-5)).map((reply, index) => (
            <div key={index} className={styles.replyContainer}>
              <div className={styles.replyDesktop}>
                <div className={styles.sideArrows}>{'>>'}</div>
                <div className={styles.reply}>
                  <PostInfo openReplyModal={openReplyModal} post={reply} roles={roles} />
                  {reply.link && isValidURL(reply.link) && <PostMedia post={reply} />}
                  {reply.content && <PostMessage post={reply} />}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostDesktop;
