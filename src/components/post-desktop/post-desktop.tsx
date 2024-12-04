import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Comment, useAuthorAvatar, useComment, useEditedComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import styles from '../../views/post/post.module.css';
import {
  CommentMediaInfo,
  fetchWebpageThumbnailIfNeeded,
  getCommentMediaInfo,
  getDisplayMediaInfoType,
  getHasThumbnail,
  getMediaDimensions,
} from '../../lib/utils/media-utils';
import { hashStringToColor, getTextColorForBackground } from '../../lib/utils/post-utils';
import { getFormattedDate, getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isValidURL } from '../../lib/utils/url-utils';
import { isAllView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useAvatarVisibilityStore from '../../stores/use-avatar-visibility-store';
import useAuthorAddressClick from '../../hooks/use-author-address-click';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useFetchGifFirstFrame from '../../hooks/use-fetch-gif-first-frame';
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
  const { author, cid, deleted, locked, pinned, parentCid, postCid, reason, removed, shortCid, state, subplebbitAddress, timestamp } = post || {};
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
  const { hideAvatars } = useAvatarVisibilityStore();

  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname);
  const isInPostPageView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, params);

  const userID = address && Plebbit.getShortAddress(address);
  const userIDBackgroundColor = hashStringToColor(userID);
  const userIDTextColor = getTextColorForBackground(userIDBackgroundColor);

  const handleUserAddressClick = useAuthorAddressClick();
  const numberOfPostsByAuthor = document.querySelectorAll(`[data-author-address="${shortAddress}"][data-post-cid="${postCid}"]`).length;

  const { hidden } = useHide(post);

  return (
    <div className={styles.postInfo}>
      {isHidden ? parentCid && <span className={styles.hiddenReplyEditMenuSpacer} /> : <EditMenu post={post} />}
      <span className={(hidden || ((removed || deleted) && !reason)) && parentCid ? styles.postDesktopHidden : ''}>
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
          <span className={`${styles.name} ${(isDescription || isRules || authorRole) && !(deleted || removed) && styles.capcodeMod}`}>
            {deleted ? (
              _.capitalize(t('deleted'))
            ) : removed ? (
              _.capitalize(t('removed'))
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
              (ID:{' '}
              {deleted ? (
                t('deleted')
              ) : removed ? (
                t('removed')
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
                  showTooltip={isInPostPageView || showOmittedReplies[postCid] || (postReplyCount < 6 && !pinned)}
                />
              )}
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
          {!(isDescription || isRules) &&
            (cid ? (
              <span className={styles.postNumLink}>
                <Link to={`/p/${subplebbitAddress}/c/${cid}`} className={styles.linkToPost} title={t('link_to_post')} onClick={(e) => !cid && e.preventDefault()}>
                  c/
                </Link>
                <span
                  className={styles.replyToPost}
                  title={t('reply_to_post')}
                  onMouseDown={() => openReplyModal && !(deleted || removed) && openReplyModal(cid, postCid, subplebbitAddress)}
                >
                  {shortCid}
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
                onClick={(e) => !cid && !isDescription && !isRules && e.preventDefault()}
              >
                {_.capitalize(t('reply'))}
              </Link>
              ]
            </span>
          )}
        </span>
        {!(removed || deleted) && <PostMenuDesktop post={post} />}
        {cid &&
          parentCid &&
          replies &&
          replies.map(
            (reply: Comment, index: number) =>
              reply?.parentCid === cid &&
              reply?.cid &&
              !(reply?.deleted || reply?.removed) && <ReplyQuotePreview key={index} isBacklinkReply={true} backlinkReply={reply} />,
          )}
      </span>
    </div>
  );
};

const PostMedia = ({ post }: PostProps) => {
  const { t } = useTranslation();
  const { link, spoiler, cid } = post || {};

  // Reset state by remounting component when post changes
  return <PostMediaContent key={cid} post={post} link={link} spoiler={spoiler} t={t} />;
};

const PostMediaContent = ({ post, link, spoiler, t }: { post: any; link: string; spoiler: boolean; t: any }) => {
  const initialInfo = getCommentMediaInfo(post);
  const [webpageThumbnail, setWebpageThumbnail] = useState<CommentMediaInfo | undefined>();
  const { isDescription, isRules } = post || {}; // custom properties, not from api

  useEffect(() => {
    // some sites have CORS access, so the thumbnail can be fetched client-side, which is helpful if subplebbit.settings.fetchThumbnailUrls is false
    const loadThumbnail = async () => {
      if (initialInfo?.type === 'webpage' && !initialInfo.thumbnail) {
        const newMediaInfo = await fetchWebpageThumbnailIfNeeded(initialInfo);
        setWebpageThumbnail(newMediaInfo);
      }
    };
    loadThumbnail();
  }, [initialInfo]);

  const commentMediaInfo = webpageThumbnail || initialInfo;

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

  const mediaDimensions = getMediaDimensions(commentMediaInfo);

  return (
    <div className={styles.file}>
      <div className={styles.fileText}>
        {t('link')}:{' '}
        <a href={url} target='_blank' rel='noopener noreferrer'>
          {spoiler ? _.capitalize(t('spoiler')) : url && url.length > 30 ? url.slice(0, 30) + '...' : url}
        </a>{' '}
        ({type && _.lowerCase(getDisplayMediaInfoType(type, t))}
        {mediaDimensions && `, ${mediaDimensions}`})
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
          <CommentMedia
            commentMediaInfo={commentMediaInfo}
            post={post}
            showThumbnail={showThumbnail}
            setShowThumbnail={setShowThumbnail}
            isOutOfFeed={isDescription || isRules}
          />
        </div>
      )}
    </div>
  );
};

const PostMessage = ({ post }: PostProps) => {
  const { cid, content, deleted, edit, isRules, original, parentCid, postCid, reason, removed, state } = post || {};
  // TODO: commentAuthor is not yet available outside of editedComment, wait for API to be updated
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
    <blockquote className={`${styles.postMessage} ${isRules && styles.rulesMessage}`}>
      {isReply && state !== 'failed' && isReplyingToReply && !(deleted || removed) && <ReplyQuotePreview isQuotelinkReply={true} quotelinkReply={quotelinkReply} />}
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
      {/* TODO: commentAuthor is not yet available outside of editedComment, wait for API to be updated */}
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

  const { author, cid, deleted, link, postCid, reason, removed, subplebbitAddress } = post || {};
  const isRouteLinkToReply = useLocation().pathname.startsWith(`/p/${subplebbitAddress}/c/${cid}`);
  const { hidden } = useHide({ cid });

  return (
    <div className={styles.replyDesktop}>
      <div className={styles.sideArrows}>{'>>'}</div>
      <div className={`${styles.reply} ${isRouteLinkToReply && styles.highlight}`} data-cid={cid} data-author-address={author?.shortAddress} data-post-cid={postCid}>
        <PostInfo openReplyModal={openReplyModal} post={post} postReplyCount={postReplyCount} roles={roles} isHidden={hidden} />
        {link && !hidden && !(deleted || removed) && isValidURL(link) && <PostMedia post={post} />}
        {!hidden && (!(removed || deleted) || ((removed || deleted) && reason)) && <PostMessage post={post} />}
      </div>
    </div>
  );
};

const PostDesktop = ({ openReplyModal, post, roles, showAllReplies, showReplies = true }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, content, deleted, link, pinned, postCid, removed, state, subplebbitAddress } = post || {};
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

  const repliesCount = pinned ? replyCount : replyCount - 5;
  const linksCount = pinned ? totalLinksCount : totalLinksCount - visiblelinksCount;
  const { showOmittedReplies, setShowOmittedReplies } = useShowOmittedReplies();

  const stateString = useStateString(post);

  const subplebbit = useSubplebbit({ subplebbitAddress });

  const subplebbitRulesReply = {
    isRules: true,
    subplebbitAddress,
    timestamp: subplebbit?.createdAt,
    author: { displayName: `## ${t('board_mods')}` },
    content: `${subplebbit?.rules?.map((rule: string, index: number) => `${index + 1}. ${rule}`).join('\n')}`,
    replyCount: 0,
  };

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
          {link && !isHidden && !(deleted || removed) && isValidURL(link) && <PostMedia post={post} />}
          <PostInfo isHidden={hidden} openReplyModal={openReplyModal} post={post} postReplyCount={replyCount} roles={roles} />
          {!isHidden && !content && !(deleted || removed) && <div className={styles.spacer} />}
          {!isHidden && <PostMessage post={post} />}
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
        {!isHidden &&
          !(pinned && !isInPostPageView && !showOmittedReplies[cid]) &&
          !isInPendingPostView &&
          replies &&
          showReplies &&
          (showAllReplies || showOmittedReplies[cid] ? replies : replies.slice(-5)).map((reply, index) => (
            <div key={index} className={styles.replyContainer}>
              <Reply openReplyModal={openReplyModal} reply={reply} roles={roles} postReplyCount={replyCount} />
            </div>
          ))}
        {isDescription && subplebbit?.rules && subplebbit?.rules.length > 0 && (
          <div className={styles.replyContainer}>
            <Reply reply={subplebbitRulesReply} />
          </div>
        )}
      </div>
      {!isInPendingPostView &&
        (stateString && stateString !== 'Failed' && state !== 'succeeded' ? (
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
