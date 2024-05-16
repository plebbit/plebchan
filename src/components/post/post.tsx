import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Role, useAccount, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { getFormattedDate } from '../../lib/utils/time-utils';
import { isPendingPostView, isPostPageView } from '../../lib/utils/view-utils';
import useCountLinksInReplies from '../../hooks/use-count-links-in-replies';
import useReplies from '../../hooks/use-replies';
import useStateString from '../../hooks/use-state-string';
import useWindowWidth from '../../hooks/use-window-width';
import styles from './post.module.css';
import CommentMedia from '../comment-media';
import { canEmbed } from '../embed';
import LoadingEllipsis from '../loading-ellipsis';
import Markdown from '../markdown';
import _ from 'lodash';
import { getDisplayMediaInfoType } from '../../lib/utils/media-utils';

interface PostProps {
  index?: number;
  isInPostPage?: boolean;
  isPendingPostPage?: boolean;
  post?: any;
  reply?: any;
  roles?: Role[];
  showAllReplies?: boolean;
  stateString?: string;
  openReplyModal?: (cid: string) => void;
}

const PostInfoDesktop = ({ isInPostPage, openReplyModal, post, roles, stateString }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, locked, pinned, postCid, shortCid, state, subplebbitAddress, timestamp, title } = post || {};
  const { address, displayName, shortAddress } = author || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api

  const isReply = post?.parentCid;

  const shortDisplayName = displayName?.trim().length > 20 ? displayName?.trim().slice(0, 20).trim() + '...' : displayName?.trim();
  const authorRole = roles?.[address]?.role;
  const displayTitle = title && title.length > 75 ? title?.slice(0, 75) + '...' : title;

  // pending reply by account is not yet published
  const account = useAccount();
  const accountShortAddress = account?.author?.shortAddress;

  const [menuBtnRotated, setMenuBtnRotated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuButtonClick = () => {
    setMenuBtnRotated((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuBtnRotated(false);
    }
  };

  useEffect(() => {
    if (menuBtnRotated) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuBtnRotated]);

  return (
    <div className={styles.postInfo}>
      <span className={styles.checkbox}>
        <input type='checkbox' />
      </span>
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
            <img src='assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
          </span>
        )}
        {locked && (
          <span className={`${styles.closedIconWrapper} ${styles.addPaddingBeforeReply} ${pinned && styles.addPaddingInBetween}`}>
            <img src='assets/icons/closed.gif' alt='' className={styles.closedIcon} title={t('closed')} />
          </span>
        )}
        {!isInPostPage && !isReply && (
          <span className={styles.replyButton}>
            [<Link to={`/p/${subplebbitAddress}/${isDescription ? 'description' : isRules ? 'rules' : `c/${postCid}`}`}>{t('reply')}</Link>]
          </span>
        )}
      </span>
      <span className={styles.postMenuBtnWrapper} ref={menuRef}>
        <span className={styles.postMenuBtn} title='Post menu' onClick={handleMenuButtonClick} style={{ transform: menuBtnRotated ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          ▶
        </span>
      </span>
    </div>
  );
};

const PostDesktop = ({ isInPostPage, isPendingPostPage, openReplyModal, post, roles, showAllReplies, stateString }: PostProps) => {
  const { t } = useTranslation();
  const { cid, content, link, linkHeight, linkWidth, pinned, replyCount, state, subplebbitAddress } = post || {};
  const { isDescription, isRules } = post || {}; // custom properties, not from api

  const displayContent = content && !isInPostPage && content.length > 1000 ? content?.slice(0, 1000) + '(...)' : content;

  const loadingString = stateString && (
    <div className={`${styles.stateString} ${styles.ellipsis}`}>{stateString !== 'Failed' ? <LoadingEllipsis string={stateString} /> : stateString}</div>
  );

  const commentMediaInfo = getCommentMediaInfo(post);
  const { type, url } = commentMediaInfo || {};
  const embedUrl = url && new URL(url);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

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
      <PostInfoDesktop
        isInPostPage={isInPostPage}
        isPendingPostPage={isPendingPostPage}
        openReplyModal={openReplyModal}
        post={post}
        roles={roles}
        stateString={stateString}
      />
      {!content && <div className={styles.spacer} />}
      {content && (
        <blockquote className={styles.postMessage}>
          <Markdown content={displayContent} />
          {content.length > 1000 && !isInPostPage && (
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
      )}
      {!isDescription && !isRules && !isPendingPostPage && (replies.length > 5 || (pinned && replies.length > 0)) && !isInPostPage && (
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
      {!(pinned && !isInPostPage) &&
        !isPendingPostPage &&
        !isDescription &&
        !isRules &&
        replies &&
        (showAllReplies ? replies : replies.slice(-5)).map((reply, index) => (
          <div key={index} className={styles.replyContainer}>
            <ReplyDesktop index={index} reply={reply} roles={roles} openReplyModal={openReplyModal} />
          </div>
        ))}
    </div>
  );
};

const ReplyDesktop = ({ isInPostPage, isPendingPostPage, reply, roles, openReplyModal }: PostProps) => {
  const { t } = useTranslation();
  const { cid, content, link, linkHeight, linkWidth, parentCid, postCid, state, subplebbitAddress } = reply || {};

  const commentMediaInfo = getCommentMediaInfo(reply);
  const { type, url } = commentMediaInfo || {};
  const embedUrl = url && new URL(url);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const isReplyingToReply = postCid !== parentCid;

  const stateString = useStateString(reply);
  const loadingString = stateString && (
    <div className={`${styles.stateString} ${styles.ellipsis}`}>{stateString !== 'Failed' ? <LoadingEllipsis string={stateString} /> : stateString}</div>
  );

  return (
    <div className={styles.replyDesktop}>
      <div className={styles.sideArrows}>{'>>'}</div>
      <div className={styles.reply}>
        <PostInfoDesktop
          isInPostPage={isInPostPage}
          isPendingPostPage={isPendingPostPage}
          openReplyModal={openReplyModal}
          post={reply}
          roles={roles}
          stateString={stateString}
        />
        {url && (
          <div className={styles.file}>
            <div className={styles.fileText}>
              {t('link')}:{' '}
              <a href={link} target='_blank' rel='noopener noreferrer'>
                {link.length > 30 ? link?.slice(0, 30) + '...' : link}
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
                  {`c/${parentCid && Plebbit.getShortCid(parentCid)}`}
                </Link>
                <br />
              </>
            )}
            <Markdown content={content} />
            {!cid && state === 'pending' && stateString !== 'Failed' && (
              <>
                <br />
                {loadingString}
              </>
            )}
          </blockquote>
        )}
      </div>
    </div>
  );
};

const PostMobile = ({ isInPostPage, isPendingPostPage, openReplyModal, post, roles, showAllReplies, stateString }: PostProps) => {
  const { t } = useTranslation();
  const { author, cid, content, link, linkHeight, linkWidth, locked, pinned, replyCount, shortCid, state, subplebbitAddress, timestamp, title } = post || {};
  const { address, displayName, shortAddress } = author || {};
  const shortDisplayName = displayName?.trim().length > 20 ? displayName?.trim().slice(0, 20).trim() + '...' : displayName?.trim();
  const authorRole = roles?.[address]?.role;

  const { isDescription, isRules } = post || {}; // custom properties, not from api

  const linksCount = useCountLinksInReplies(post);
  const displayTitle = title && title.length > 30 ? title?.slice(0, 30) + '(...)' : title;
  const displayContent = content && !isInPostPage && content.length > 1000 ? content?.slice(0, 1000) : content;

  const commentMediaInfo = getCommentMediaInfo(post);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const replies = useReplies(post);

  // pending reply by account is not yet published
  const account = useAccount();
  const accountShortAddress = account?.author?.shortAddress;

  const loadingString = stateString && (
    <div className={`${styles.stateString} ${styles.ellipsis}`}>{stateString !== 'Failed' ? <LoadingEllipsis string={stateString} /> : stateString}</div>
  );

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
            )}
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
          (showAllReplies ? replies : replies.slice(-5)).map((reply, index) => (
            <div key={reply.cid} className={styles.replyContainer}>
              <ReplyMobile index={index} reply={reply} roles={roles} openReplyModal={openReplyModal} />
            </div>
          ))}
      </div>
    </div>
  );
};

const ReplyMobile = ({ openReplyModal, reply, roles, stateString }: PostProps) => {
  const { t } = useTranslation();
  const { author, content, cid, link, linkHeight, linkWidth, parentCid, pinned, postCid, shortCid, state, subplebbitAddress, timestamp } = reply || {};
  const { address, displayName, shortAddress } = author || {};
  const shortDisplayName = displayName?.trim().length > 20 ? displayName?.trim().slice(0, 20).trim() + '...' : displayName?.trim();
  const authorRole = roles?.[address]?.role;

  const commentMediaInfo = getCommentMediaInfo(reply);
  const hasThumbnail = getHasThumbnail(commentMediaInfo, link);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const isReplyingToReply = postCid !== parentCid;

  // pending reply by account is not yet published
  const account = useAccount();
  const accountShortAddress = account?.author?.shortAddress;

  const loadingString = stateString && (
    <div className={`${styles.stateString} ${styles.ellipsis}`}>{stateString !== 'Failed' ? <LoadingEllipsis string={stateString} /> : stateString}</div>
  );

  return (
    <div className={styles.replyMobile}>
      <div className={styles.reply}>
        <div className={styles.replyContainer}>
          <div className={styles.postInfo}>
            <span className={styles.postMenuBtn}>...</span>
            <span className={styles.nameBlock}>
              <span className={`${styles.name} ${authorRole && styles.capcodeMod}`}>
                {shortDisplayName || _.capitalize(t('anonymous'))}
                {authorRole && ` ## Board ${authorRole}`}{' '}
              </span>
              <span className={styles.address}>(u/{shortAddress || accountShortAddress})</span>
              {pinned && (
                <span className={styles.stickyIconWrapper}>
                  <img src='assets/icons/sticky.gif' alt='' className={styles.stickyIcon} title={t('sticky')} />
                </span>
              )}
            </span>
            <span className={styles.dateTimePostNum}>
              {getFormattedDate(timestamp)}{' '}
              <span className={styles.postNumLink}>
                <Link to={`/p/${subplebbitAddress}/c/${cid}`} title={t('link_to_post')} onClick={(e) => !cid && e.preventDefault()}>
                  c/
                </Link>
              </span>
              {!cid ? (
                <span className={styles.pendingCid}>{state === 'failed' || stateString === 'Failed' ? 'Failed' : 'Pending'}</span>
              ) : (
                <span className={styles.replyToPost} title={t('reply_to_post')} onClick={() => openReplyModal && openReplyModal(cid)}>
                  {shortCid}
                </span>
              )}
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
                    {`c/${parentCid && Plebbit.getShortCid(parentCid)}`}
                  </Link>
                  <br />
                </>
              )}
              <Markdown content={content} />
              {!cid && state === 'pending' && stateString !== 'Failed' && (
                <>
                  <br />
                  {loadingString}
                </>
              )}
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
};

const Post = ({ post, showAllReplies = false, openReplyModal }: PostProps) => {
  const subplebbit = useSubplebbit({ subplebbitAddress: post?.subplebbitAddress });
  const isMobile = useWindowWidth() < 640;

  const params = useParams();
  const location = useLocation();
  const isInPostPage = isPostPageView(location.pathname, params);
  const isPendingPostPage = isPendingPostView(location.pathname, params);

  const stateString = useStateString(post);

  return (
    <div className={styles.thread}>
      <div className={styles.postContainer}>
        {isMobile ? (
          <PostMobile
            isInPostPage={isInPostPage}
            isPendingPostPage={isPendingPostPage}
            post={post}
            roles={subplebbit?.roles}
            showAllReplies={showAllReplies}
            stateString={stateString}
            openReplyModal={openReplyModal}
          />
        ) : (
          <PostDesktop
            isInPostPage={isInPostPage}
            isPendingPostPage={isPendingPostPage}
            post={post}
            roles={subplebbit?.roles}
            showAllReplies={showAllReplies}
            stateString={stateString}
            openReplyModal={openReplyModal}
          />
        )}
      </div>
    </div>
  );
};

export default Post;
