import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Comment, Subplebbit } from '@plebbit/plebbit-react-hooks';
import styles from '../home.module.css';
import usePopularPosts from '../../../hooks/use-popular-posts';
import useHomeFiltersStore from '../../../stores/use-home-filters-store';
import { getCommentMediaInfo } from '../../../lib/utils/media-utils';
import { CatalogPostMedia } from '../../../components/catalog-row';
import LoadingEllipsis from '../../../components/loading-ellipsis';
import BoxModal from '../box-modal';
import { nsfwTags } from '../home';
import removeMarkdown from 'remove-markdown';

interface PopularThreadProps {
  post: Comment;
  boardTitle: string | undefined;
  boardShortAddress: string;
}

const ContentPreview = ({ content, maxLength = 99 }: { content: string; maxLength?: number }) => {
  const plainText = removeMarkdown(content).trim().replaceAll('&nbsp;', '').replace(/\n\n/g, '\n').replaceAll('\n\n', '');
  const truncatedText = plainText.length > maxLength ? `${plainText.substring(0, maxLength).trim()}...` : plainText;

  return truncatedText;
};

const PopularThreadCard = ({ post, boardTitle, boardShortAddress }: PopularThreadProps) => {
  const { cid, content, subplebbitAddress, title } = post || {};
  const commentMediaInfo = getCommentMediaInfo(post);

  return (
    <div className={styles.popularThread} key={cid}>
      <div className={styles.title}>{boardTitle || boardShortAddress}</div>
      <div className={styles.mediaContainer}>
        <Link to={`/p/${subplebbitAddress}/c/${cid}`}>
          <CatalogPostMedia commentMediaInfo={commentMediaInfo} isOutOfFeed={true} />
        </Link>
      </div>
      <div className={styles.threadContent}>
        {title && (
          <>
            <b>{title.trim()}</b>
            {content && ': '}
          </>
        )}
        {content && <ContentPreview content={content} maxLength={99} />}
      </div>
    </div>
  );
};

const PopularThreadsBox = ({ multisub, subplebbits }: { multisub: Subplebbit[]; subplebbits: any }) => {
  const { t } = useTranslation();
  const { showWorksafeContentOnly, showNsfwContentOnly } = useHomeFiltersStore();

  const getFilteredSubplebbits = () => {
    if (showWorksafeContentOnly) {
      return subplebbits.filter((sub: Subplebbit) => {
        const multisubEntry = multisub.find((ms) => ms?.address === sub?.address);
        return multisubEntry ? !multisubEntry.tags.some((tag: string) => nsfwTags.includes(tag)) : true;
      });
    }
    if (showNsfwContentOnly) {
      return subplebbits.filter((sub: Subplebbit) => {
        const multisubEntry = multisub.find((ms) => ms?.address === sub?.address);
        return multisubEntry ? multisubEntry.tags.some((tag: string) => nsfwTags.includes(tag)) : false;
      });
    }
    return subplebbits;
  };

  const filteredSubplebbits = useMemo(getFilteredSubplebbits, [subplebbits, showWorksafeContentOnly, showNsfwContentOnly, multisub]);
  const popularPosts = usePopularPosts(filteredSubplebbits);

  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className='capitalize'>{t('popular_threads')}</h2>
        <BoxModal isBoardsBoxModal={false} />
      </div>
      <div className={`${styles.boxContent} ${popularPosts.length === 8 ? styles.popularThreads : ''}`}>
        {popularPosts.length < 8 ? (
          <LoadingEllipsis string={t('loading')} />
        ) : (
          popularPosts.map((post: any) => (
            <PopularThreadCard key={post.cid} post={post} boardTitle={post.subplebbitTitle || post.subplebbitAddress} boardShortAddress={post.subplebbitAddress} />
          ))
        )}
      </div>
    </div>
  );
};

export default PopularThreadsBox;
