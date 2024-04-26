import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Role, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { getFormattedDate } from '../../lib/utils/time-utils';
import { isPostPageView, isPendingPostView } from '../../lib/utils/view-utils';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useReplies from '../../hooks/use-replies';
import useWindowWidth from '../../hooks/use-window-width';
import styles from './post.module.css';
import Markdown from '../markdown';
import CommentMedia from '../comment-media';
import { canEmbed } from '../embed';

interface PostProps {
  index?: number;
  post?: any;
  reply?: any;
  roles?: Role[];
  showAllReplies?: boolean;
}

const PostDesktop = ({ post, roles, showAllReplies }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, content, link, linkHeight, linkWidth, locked, pinned, postCid, replyCount, shortCid, state, subplebbitAddress, timestamp, title } = post || {};
  const { address, displayName, shortAddress } = author || {};
  const authorRole = roles?.[address]?.role;

  const { isDescription, isRules } = post || {}; // custom properties, not from api

  const params = useParams();
  const location = useLocation();
  const isInPostPage = isPostPageView(location.pathname, params);
  const isInPendingPostPage = isPendingPostView(location.pathname, params);

  const displayTitle = title && title.length > 75 ? title?.slice(0, 75) + '...' : title;
  const displayContent = content && !isInPostPage && content.length > 1000 ? content?.slice(0, 1000) + '(...)' : content;

  const commentMediaInfo = getCommentMediaInfo(post);
  const { type, url } = commentMediaInfo || {};
  const embedUrl = url && new URL(url);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const replies = useReplies(post);
  const visibleLinkCount = useCountLinksInReplies(post, 5);
  const totalLinkCount = useCountLinksInReplies(post);
  const repliesCount = pinned ? replyCount : replyCount - 5;
  const linkCount = pinned ? totalLinkCount : totalLinkCount - visibleLinkCount;

  const [menuBtnRotated, setMenuBtnRotated] = useState(false);

  return (
    <div className={styles.postDesktop}>
      <div className={styles.hrWrapper}>
        <hr />
      </div>
      {!isInPostPage && (
        <span className={styles.hideButtonWrapper}>
          <span className={`${styles.hideButton} ${styles.hideThread}`} />
        </span>
      )}
      {url && (
        <div className={styles.file}>
          <div className={styles.fileText}>
            {t('link')}:{' '}
            <a href={url} target='_blank' rel='noopener noreferrer'>
              {url.length > 30 ? url.slice(0, 30) + '...' : url}
            </a>{' '}
            ({type})
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
            <CommentMedia
              commentMediaInfo={commentMediaInfo}
              isOutOfFeed={isDescription || isRules} // virtuoso wrapper unneeded
              isReply={false}
              linkHeight={linkHeight}
              linkWidth={linkWidth}
              showThumbnail={showThumbnail}
              setShowThumbnail={setShowThumbnail}
            />
          )}
        </div>
      )}
      <div className={styles.postInfo}>
        <span className={styles.checkbox}>
          <input type='checkbox' />
        </span>
        {title && <span className={styles.subject}>{displayTitle} </span>}
        <span className={styles.nameBlock}>
          <span className={`${styles.name} ${(isDescription || isRules || authorRole) && styles.capcodeMod}`}>
            {displayName || 'Anonymous'}
            {authorRole && ` ## Board ${authorRole}`}{' '}
          </span>
          {!(isDescription || isRules) && <span className={styles.userAddress}>(u/{shortAddress}) </span>}
        </span>
        <span className={styles.dateTime}>
          {getFormattedDate(timestamp)}
          {isDescription || isRules ? '' : ' '}
        </span>
        <span className={styles.postNum}>
          {!(isDescription || isRules) && (
            <span className={styles.postNumLink}>
              <Link
                to={`/p/${subplebbitAddress}/${cid}`}
                className={styles.linkToPost}
                title={t('link_to_post')}
                onClick={(e) => isInPendingPostPage && e.preventDefault()}
              >
                c/
              </Link>
              {isInPendingPostPage ? (
                <span className={styles.pendingCid}>{state === 'failed' ? 'Failed' : 'Pending'}</span>
              ) : (
                <span className={styles.replyToPost} title={t('reply_to_post')}>
                  {shortCid}
                </span>
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
          <span className={styles.replyButton}>
            [<Link to={`/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${postCid}`}`}>{t('reply')}</Link>]
          </span>
        </span>
        <span className={styles.postMenuBtnWrapper}>
          <span
            className={styles.postMenuBtn}
            title='Post menu'
            onClick={() => setMenuBtnRotated(!menuBtnRotated)}
            style={{ transform: menuBtnRotated ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ▶
          </span>
        </span>
      </div>
      {!content && <div className={styles.spacer} />}
      {content && (
        <blockquote className={styles.postMessage}>
          <Markdown content={displayContent} />
          {content.length > 1000 && !isInPostPage && (
            <span className={styles.abbr}>
              <br />
              Comment too long. <Link to={`/p/${subplebbitAddress}/c/${cid}`}>Click here</Link> to view the full text.
            </span>
          )}
        </blockquote>
      )}
      {(replies.length > 5 || (pinned && replies.length > 0)) && !isInPostPage && (
        <span className={styles.summary}>
          <span className={styles.expandButtonWrapper}>
            <span className={styles.expandButton} />
          </span>
          <span>
            {repliesCount} replies {linkCount > 0 && `and ${linkCount} links`} omitted.{' '}
          </span>
          <Link to={`/p/${subplebbitAddress}/c/${cid}`}>Click here</Link> to view.
        </span>
      )}
      {!(pinned && !isInPostPage) &&
        replies &&
        (showAllReplies ? replies : replies.slice(-5)).map((reply, index) => (
          <div key={reply.cid} className={styles.replyContainer}>
            <ReplyDesktop index={index} reply={reply} roles={roles} />
          </div>
        ))}
    </div>
  );
};

const ReplyDesktop = ({ reply, roles }: PostProps) => {
  const { t } = useTranslation();
  const { author, content, link, linkHeight, linkWidth, parentCid, pinned, postCid, shortCid, subplebbitAddress, timestamp } = reply || {};
  const { address, displayName, shortAddress } = author || {};
  const authorRole = roles?.[address]?.role;

  const commentMediaInfo = getCommentMediaInfo(reply);
  const { type, url } = commentMediaInfo || {};
  const embedUrl = url && new URL(url);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const isReplyingToReply = postCid !== parentCid;

  const [menuBtnRotated, setMenuBtnRotated] = useState(false);

  return (
    <div className={styles.replyDesktop}>
      <div className={styles.sideArrows}>{'>>'}</div>
      <div className={styles.reply}>
        <div className={styles.postInfo}>
          <span className={styles.checkbox}>
            <input type='checkbox' />
          </span>
          <span className={styles.nameBlock}>
            <span className={`${styles.name} ${authorRole && styles.capcodeMod}`}>
              {displayName || 'Anonymous'}
              {authorRole && ` ## Board ${authorRole}`}{' '}
            </span>
            <span className={styles.userAddress}>(u/{shortAddress}) </span>
          </span>
          <span className={styles.dateTime}>{getFormattedDate(timestamp)} </span>
          <span className={styles.postNum}>
            <span className={styles.postNumLink}>
              <Link to={`/p/${subplebbitAddress}/c/${reply.cid}`} className={styles.linkToPost} title='Link to post'>
                c/
              </Link>
              <span className={styles.replyToPost} title='Reply to post'>
                {shortCid}
              </span>
            </span>
            {pinned && (
              <span className={styles.stickyIconWrapper}>
                <img src='assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
              </span>
            )}
          </span>
          <span className={styles.postMenuBtnWrapper}>
            <span
              className={styles.postMenuBtn}
              title='Post menu'
              onClick={() => setMenuBtnRotated(!menuBtnRotated)}
              style={{ transform: menuBtnRotated ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              ▶
            </span>
          </span>
        </div>
        {url && (
          <div className={styles.file}>
            <div className={styles.fileText}>
              {t('link')}:{' '}
              <a href={link} target='_blank' rel='noopener noreferrer'>
                {link.length > 30 ? link?.slice(0, 30) + '...' : link}
              </a>
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
              <CommentMedia
                commentMediaInfo={commentMediaInfo}
                isReply={true}
                linkHeight={linkHeight}
                linkWidth={linkWidth}
                showThumbnail={showThumbnail}
                setShowThumbnail={setShowThumbnail}
              />
            )}
          </div>
        )}
        {content && (
          <blockquote className={styles.postMessage}>
            {isReplyingToReply && (
              <>
                <Link to={`/p/${subplebbitAddress}/c/${parentCid}`} className={styles.quoteLink}>
                  {`c/${Plebbit.getShortCid(parentCid)}`}
                </Link>
                <br />
              </>
            )}
            <Markdown content={content} />
          </blockquote>
        )}
      </div>
    </div>
  );
};

const PostMobile = ({ post, roles, showAllReplies }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, content, link, linkHeight, linkWidth, locked, pinned, replyCount, shortCid, state, subplebbitAddress, timestamp, title } = post || {};
  const { address, displayName, shortAddress } = author || {};
  const authorRole = roles?.[address]?.role;

  const { isDescription, isRules } = post || {}; // custom properties, not from api

  const params = useParams();
  const location = useLocation();
  const isInPostPage = isPostPageView(location.pathname, params);
  const isInPendingPostPage = isPendingPostView(location.pathname, params);

  const linkCount = useCountLinksInReplies(post);
  const displayTitle = title && title.length > 30 ? title?.slice(0, 30) + '(...)' : title;
  const displayContent = content && !isInPostPage && content.length > 1000 ? content?.slice(0, 1000) : content;

  const commentMediaInfo = getCommentMediaInfo(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const replies = useReplies(post);

  return (
    <div className={styles.postMobile}>
      <div className={styles.hrWrapper}>
        <hr />
      </div>
      <div className={styles.thread}>
        <div className={styles.postContainer}>
          <div className={styles.postOp}>
            <div className={styles.postInfo}>
              <span className={styles.postMenuBtn} title='Post menu'>
                ...
              </span>
              <span className={styles.nameBlock}>
                <span className={`${styles.name} ${authorRole && styles.capcodeMod}`}>
                  {displayName || 'Anonymous'}
                  {authorRole && ` ## Board ${authorRole}`}{' '}
                </span>
                {!(isDescription || isRules) && <span className={styles.address}>(u/{shortAddress || address?.slice(0, 12) + '...'})</span>}
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
                    <Link
                      to={`/p/${subplebbitAddress}/${cid}`}
                      className={styles.linkToPost}
                      title={t('link_to_post')}
                      onClick={(e) => isInPendingPostPage && e.preventDefault()}
                    >
                      c/
                    </Link>
                    {isInPendingPostPage ? (
                      <span className={styles.pendingCid}>{state === 'failed' ? 'Failed' : 'Pending'}</span>
                    ) : (
                      <span className={styles.replyToPost} title={t('reply_to_post')}>
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
                isReply={false}
                linkHeight={linkHeight}
                linkWidth={linkWidth}
                showThumbnail={showThumbnail}
                setShowThumbnail={setShowThumbnail}
              />
            )}
            {content && (
              <blockquote className={`${styles.postMessage} ${styles.clampLines}`}>
                <Markdown content={displayContent} />
                {content.length > 1000 && !isInPostPage && (
                  <span className={styles.abbr}>
                    <br />
                    Comment too long. <Link to={`/p/${subplebbitAddress}/c/${cid}`}>Click here</Link> to view the full text.
                  </span>
                )}
              </blockquote>
            )}
          </div>
          {!isInPostPage && (
            <div className={styles.postLink}>
              <span className={styles.info}>
                {replyCount > 0 && `${replyCount} Replies`}
                {linkCount > 0 && ` / ${linkCount} Links`}
              </span>
              <Link to={`/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${cid}`}`} className='button'>
                {t('view_thread')}
              </Link>
            </div>
          )}
        </div>
        {!(pinned && !isInPostPage) &&
          replies &&
          (showAllReplies ? replies : replies.slice(-5)).map((reply, index) => (
            <div key={reply.cid} className={styles.replyContainer}>
              <ReplyMobile index={index} reply={reply} roles={roles} />
            </div>
          ))}
      </div>
    </div>
  );
};

const ReplyMobile = ({ reply, roles }: PostProps) => {
  const { t } = useTranslation();
  const { author, content, link, linkHeight, linkWidth, parentCid, pinned, postCid, shortCid, subplebbitAddress, timestamp } = reply || {};
  const { address, displayName, shortAddress } = author || {};
  const authorRole = roles?.[address]?.role;

  const commentMediaInfo = getCommentMediaInfo(reply);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const isReplyingToReply = postCid !== parentCid;

  return (
    <div className={styles.replyMobile}>
      <div className={styles.reply}>
        <div className={styles.replyContainer}>
          <div className={styles.postInfo}>
            <span className={styles.postMenuBtn}>...</span>
            <span className={styles.nameBlock}>
              <span className={`${styles.name} ${authorRole && styles.capcodeMod}`}>
                {displayName || 'Anonymous'}
                {authorRole && ` ## Board ${authorRole}`}{' '}
              </span>
              <span className={styles.address}>(u/{shortAddress})</span>
              {pinned && (
                <span className={styles.stickyIconWrapper}>
                  <img src='assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
                </span>
              )}
            </span>
            <span className={styles.dateTimePostNum}>
              {getFormattedDate(timestamp)} <span className={styles.linkToPost}>c/</span>
              <span className={styles.replyToPost}>{shortCid}</span>
            </span>
          </div>
          {(hasThumbnail || link) && (
            <CommentMedia
              commentMediaInfo={commentMediaInfo}
              isReply={false}
              linkHeight={linkHeight}
              linkWidth={linkWidth}
              showThumbnail={showThumbnail}
              setShowThumbnail={setShowThumbnail}
            />
          )}
          {content && (
            <blockquote className={styles.postMessage}>
              {isReplyingToReply && (
                <>
                  <Link to={`/p/${subplebbitAddress}/c/${parentCid}`} className={styles.quoteLink}>
                    {`c/${Plebbit.getShortCid(parentCid)}`}
                  </Link>
                  <br />
                </>
              )}
              <Markdown content={content} />
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
};

const Post = ({ post, showAllReplies = false }: PostProps) => {
  const subplebbit = useSubplebbit({ subplebbitAddress: post?.subplebbitAddress });
  const isMobile = useWindowWidth() < 640;
  return (
    <div className={styles.thread}>
      <div className={styles.postContainer}>
        {isMobile ? (
          <PostMobile post={post} roles={subplebbit?.roles} showAllReplies={showAllReplies} />
        ) : (
          <PostDesktop post={post} roles={subplebbit?.roles} showAllReplies={showAllReplies} />
        )}
      </div>
    </div>
  );
};

export default Post;
