import { useEffect, useRef, useState } from 'react';
import styles from './home.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Comment, Subplebbit, useSubplebbits } from '@plebbit/plebbit-react-hooks';
import packageJson from '../../../package.json';
import useDefaultSubplebbits, { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { CatalogPostMedia } from '../../components/catalog-row';
import LoadingEllipsis from '../../components/loading-ellipsis';

const isValidAddress = (address: string): boolean => {
  if (address.includes('/') || address.includes('\\') || address.includes(' ')) {
    return false;
  }
  return true;
};

const SearchBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearchSubmit = () => {
    const inputValue = searchInputRef.current?.value;
    if (inputValue && isValidAddress(inputValue)) {
      navigate(`/p/${inputValue}`);
    } else {
      alert('invalid address');
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        autoCorrect='off'
        autoComplete='off'
        spellCheck='false'
        autoCapitalize='off'
        type='text'
        placeholder={`"board.eth/.sol" ${t('or')} "12D3KooW..."`}
        ref={searchInputRef}
        onSubmit={handleSearchSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearchSubmit();
          }
        }}
      />
      <button onClick={handleSearchSubmit}>{t('go')}</button>
    </div>
  );
};

const InfoBox = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.box}>
      <div className={styles.infoboxBar}>
        <h2>{t('what_is_plebchan')}</h2>
      </div>
      <div className={styles.boxContent}>
        <Trans i18nKey='plebchan_description' shouldUnescape={true} components={{ 1: <Link to='https://plebbit.com' target='_blank' rel='noopener noreferrer' /> }} />
        <br />
        <br />
        {t('no_global_rules_info')}
      </div>
    </div>
  );
};

const Boards = ({ defaultSubplebbits }: { defaultSubplebbits: any }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.box} ${styles.boardsBox}`}>
      <div className={styles.boxBar}>
        <h2 className={styles.capitalize}>{t('boards')}</h2>
        <span>{t('options')} ▼</span>
      </div>
      <div className={styles.boardsBoxContent}>
        <div className={styles.column}>
          <h3>Default SFW</h3>
          <div className={styles.list}>
            {defaultSubplebbits
              .filter((subplebbit: Subplebbit | undefined): subplebbit is Subplebbit => subplebbit !== undefined)
              .map((subplebbit: Subplebbit) => {
                const address = subplebbit.address;
                return (
                  <div className={styles.subplebbit} key={address}>
                    <Link to={`/p/${address}`}>{address}</Link>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={styles.column}>
          <h3>Default NSFW</h3>
        </div>
        <div className={styles.column}>
          <h3>Subscriptions</h3>
        </div>
        <div className={styles.column}>
          <h3>Moderating</h3>
        </div>
      </div>
    </div>
  );
};

interface PopularThreadProps {
  post: Comment;
  boardTitle: string | undefined;
  boardShortAddress: string;
}

const PopularThreadCard = ({ post, boardTitle, boardShortAddress }: PopularThreadProps) => {
  const { cid, content, subplebbitAddress, title } = post || {};
  const commentMediaInfo = getCommentMediaInfo(post);

  return (
    <div className={styles.popularThread} key={cid}>
      <div className={styles.title}>{boardTitle || boardShortAddress}</div>
      <div className={styles.mediaContainer}>
        <Link to={`/p/${subplebbitAddress}/c/${cid}`}>
          <CatalogPostMedia commentMediaInfo={commentMediaInfo} />
        </Link>
      </div>
      <div className={styles.threadContent}>
        {title && <b>{title}</b>}
        {content && (content.length > 99 ? `: ${content.substring(0, 99)}...` : `: ${content}`)}
      </div>
    </div>
  );
};

const PopularThreads = ({ subplebbits }: { subplebbits: any }) => {
  const { t } = useTranslation();
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    let subplebbitToPost: any = {};

    subplebbits.forEach((subplebbit: any) => {
      let mostRecentPost = null;

      if (subplebbit?.posts?.pages?.hot?.comments) {
        for (const comment of Object.values(subplebbit.posts.pages.hot.comments) as Comment[]) {
          const { deleted, locked, pinned, removed, replyCount, timestamp } = comment;

          const commentMediaInfo = getCommentMediaInfo(comment);
          const isMediaShowed = getHasThumbnail(commentMediaInfo, comment.link);

          if (
            isMediaShowed &&
            replyCount >= 2 &&
            !removed &&
            !deleted &&
            !locked &&
            !pinned && // criteria
            timestamp > Date.now() / 1000 - 60 * 60 * 24 * 30 // 30 days
          ) {
            if (!mostRecentPost || comment.timestamp > mostRecentPost.timestamp) {
              mostRecentPost = comment;
            }
          }

          if (mostRecentPost) {
            subplebbitToPost[subplebbit.address] = mostRecentPost;
          }
        }
      }
    });

    const newPopularPosts: any = Object.values(subplebbitToPost)
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .slice(0, 8);

    setPopularPosts(newPopularPosts);
  }, [subplebbits]);

  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>{t('popular_threads')}</h2>
        <span>{t('options')} ▼</span>
      </div>
      <div className={`${styles.boxContent} ${popularPosts.length === 8 ? styles.popularThreads : ''}`}>
        {popularPosts.length < 8 ? (
          <span className={styles.loading}>
            <LoadingEllipsis string={t('loading')} />
          </span>
        ) : (
          popularPosts.map((post: any) => (
            <PopularThreadCard key={post.cid} post={post} boardTitle={post.subplebbitTitle || post.subplebbitAddress} boardShortAddress={post.subplebbitAddress} />
          ))
        )}
      </div>
    </div>
  );
};

const Stats = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>{t('stats')}</h2>
      </div>
      <div className={styles.boxContent}></div>
    </div>
  );
};

const { version } = packageJson;
const downloadAppLink = (() => {
  const platform = navigator.platform;
  if (platform === 'Linux' || platform === 'Linux x86_64' || platform === 'Linux i686' || platform === 'Linux aarch64') {
    return `https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan-${version}.AppImage`;
  } else if (platform === 'Win32' || platform === 'Win64' || platform === 'Windows') {
    return `https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan.Portable.${version}.exe`;
  } else if (platform === 'MacIntel' || platform === 'Macintosh') {
    return `https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan-${version}.dmg`;
  } else if (platform === 'Android') {
    return undefined;
  } else if (platform === 'iPhone' || platform === 'iPad') {
    return undefined;
  } else {
    return undefined;
  }
})();

const isElectron = window.isElectron === true;
const commitRef = process.env.REACT_APP_COMMIT_REF;

const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <ul className={styles.footer}>
        <li>
          <a href='https://plebbit.com' target='_blank' rel='noopener noreferrer'>
            {t('about')}
          </a>
        </li>
        <li>
          <a href='https://twitter.com/plebchan_eth' target='_blank' rel='noopener noreferrer'>
            Twitter
          </a>
        </li>
        <li>
          <a href='https://t.me/plebbit' target='_blank' rel='noopener noreferrer'>
            Telegram
          </a>
        </li>
        <li>
          <a href='https://discord.gg/E7ejphwzGW' target='_blank' rel='noopener noreferrer'>
            Discord
          </a>
        </li>
        <li>
          <a href='https://github.com/plebbit/plebchan' target='_blank' rel='noopener noreferrer'>
            GitHub
          </a>
        </li>
        {downloadAppLink && (
          <li>
            <a href={downloadAppLink} target='_blank' rel='noopener noreferrer'>
              {t('download_app')}
            </a>
          </li>
        )}
        <li>
          <a href='https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f' target='_blank' rel='noopener noreferrer'>
            {t('token')}
          </a>
        </li>
        <li>
          <a href='https://github.com/plebbit/whitepaper/discussions/2' target='_blank' rel='noopener noreferrer'>
            {t('whitepaper')}
          </a>
        </li>
      </ul>
      <div className={styles.version}>
        <a href={`https://github.com/plebbit/plebchan/releases/tag/v${packageJson.version}`} target='_blank' rel='noopener noreferrer'>
          v{packageJson.version}
        </a>
        {isElectron && (
          <a className={styles.fullNodeStats} href='http://localhost:5001/webui/' target='_blank' rel='noreferrer'>
            node stats
          </a>
        )}
        {commitRef && (
          <a href={`https://github.com/plebbit/plebchan/commit/${commitRef}`} target='_blank' rel='noopener noreferrer'>
            #{commitRef.slice(0, 7)}
          </a>
        )}
      </div>
    </>
  );
};

const Home = () => {
  const defaultSubplebbits = useDefaultSubplebbits();
  const subplebbitAddresses = useDefaultSubplebbitAddresses();
  const { subplebbits } = useSubplebbits({ subplebbitAddresses });

  return (
    <div className={styles.content}>
      <Link to='/'>
        <div className={styles.logo}>
          <img alt='' src='/assets/logo/logo-transparent.png' />
        </div>
      </Link>
      <SearchBar />
      <InfoBox />
      <Boards defaultSubplebbits={defaultSubplebbits} />
      <PopularThreads subplebbits={subplebbits} />
      <Stats />
      <Footer />
    </div>
  );
};

export default Home;
