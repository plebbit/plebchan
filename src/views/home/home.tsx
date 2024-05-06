import { useEffect, useRef, useState } from 'react';
import styles from './home.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Comment, Subplebbit, useAccount, useAccountSubplebbits, useSubplebbits } from '@plebbit/plebbit-react-hooks';
import packageJson from '../../../package.json';
import useDefaultSubplebbits, { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import { getCommentMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { CatalogPostMedia } from '../../components/catalog-row';
import LoadingEllipsis from '../../components/loading-ellipsis';

// for temporary hook to fetch subplebbit stats
import { useMemo } from 'react';
import { create } from 'zustand';

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

const Board = ({ isOffline, subplebbit }: { isOffline: boolean; subplebbit: Subplebbit }) => {
  const { t } = useTranslation();
  const { address, title, tags } = subplebbit;
  const nsfwTags = ['adult', 'gore'];
  const nsfwTag = tags.find((tag: string) => nsfwTags.includes(tag));

  return (
    <div className={styles.subplebbit} key={address}>
      <Link to={`/p/${address}`}>{title || address}</Link>
      {nsfwTag && <span className={styles.nsfw}> ({t(nsfwTag)})</span>}
      {isOffline && <span className={styles.offlineIcon} />}
    </div>
  );
};

const Boards = ({ multisub, subplebbits }: { multisub: Subplebbit[]; subplebbits: any }) => {
  const { t } = useTranslation();
  const account = useAccount();
  const subscriptions = account?.subscriptions || [];
  const { accountSubplebbits } = useAccountSubplebbits();
  const accountSubplebbitAddresses = Object.keys(accountSubplebbits);

  const plebbitSubs = multisub.filter((sub) => sub.tags.includes('plebbit'));
  const interestsSubs = multisub.filter(
    (sub) => sub.tags.includes('topic') && !sub.tags.includes('plebbit') && !sub.tags.includes('country') && !sub.tags.includes('international'),
  );
  const randomSubs = multisub.filter((sub) => sub.tags.includes('random') && !sub.tags.includes('plebbit'));
  const internationalSubs = multisub.filter((sub) => sub.tags.includes('international') || sub.tags.includes('country'));
  const projectsSubs = multisub.filter((sub) => sub.tags.includes('project') && !sub.tags.includes('plebbit') && !sub.tags.includes('topic'));

  const isSubOffline = (address: string) => {
    const subplebbit = subplebbits && subplebbits.find((sub: Subplebbit) => sub?.address === address);
    const isOffline = subplebbit?.updatedAt && subplebbit.updatedAt < Date.now() / 1000 - 60 * 60;
    return isOffline;
  };

  return (
    <div className={`${styles.box} ${styles.boardsBox}`}>
      <div className={styles.boxBar}>
        <h2 className={styles.capitalize}>{t('boards')}</h2>
        <span>{t('options')} ▼</span>
      </div>
      <div className={styles.boardsBoxContent}>
        <div className={styles.column}>
          <h3>Plebbit</h3>
          <div className={styles.list}>
            {plebbitSubs.map((sub) => (
              <Board key={sub.address} subplebbit={sub} isOffline={sub.address && isSubOffline(sub.address)} />
            ))}
          </div>
          <h3>{t('projects')}</h3>
          <div className={styles.list}>
            {projectsSubs.map((sub) => (
              <Board key={sub.address} subplebbit={sub} isOffline={sub.address && isSubOffline(sub.address)} />
            ))}
          </div>
        </div>
        <div className={styles.column}>
          <h3>{t('interests')}</h3>
          <div className={styles.list}>
            {interestsSubs.map((sub) => (
              <Board key={sub.address} subplebbit={sub} isOffline={sub.address && isSubOffline(sub.address)} />
            ))}
          </div>
        </div>
        <div className={styles.column}>
          <h3>{t('random')}</h3>
          <div className={styles.list}>
            {randomSubs.map((sub) => (
              <Board key={sub.address} subplebbit={sub} isOffline={sub.address && isSubOffline(sub.address)} />
            ))}
          </div>
          <h3>{t('international')}</h3>
          <div className={styles.list}>
            {internationalSubs.map((sub) => (
              <Board key={sub.address} subplebbit={sub} isOffline={sub.address && isSubOffline(sub.address)} />
            ))}
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.list}>
            <h3>{t('subscriptions')}</h3>
            {subscriptions.length > 0
              ? subscriptions.map((address: string, index: number) => (
                  <div className={styles.subplebbit} key={index}>
                    <Link to={`/p/${address}`}>{address}</Link>
                  </div>
                ))
              : t('not_subscribed')}
          </div>
          <div className={styles.list}>
            <h3>{t('moderating')}</h3>
            {accountSubplebbitAddresses.length > 0
              ? accountSubplebbitAddresses.map((address: string, index: number) => (
                  <div className={styles.subplebbit} key={index}>
                    <Link to={`/p/${address}`}>p/{address}</Link>
                  </div>
                ))
              : t('not_moderating')}
          </div>
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
  const [popularPosts, setPopularPosts] = useState<any[]>([]);

  useEffect(() => {
    const subplebbitToPost: { [key: string]: any } = {};
    const uniqueLinks: Set<string> = new Set();

    subplebbits.forEach((subplebbit: any) => {
      let maxTimestamp = -Infinity;
      let mostRecentPost = null;

      if (subplebbit?.posts?.pages?.hot?.comments) {
        for (const post of Object.values(subplebbit.posts.pages.hot.comments as Comment)) {
          const { deleted, link, locked, pinned, removed, replyCount, timestamp } = post;
          const commentMediaInfo = getCommentMediaInfo(post);
          const isMediaShowed = getHasThumbnail(commentMediaInfo, link);

          if (
            isMediaShowed &&
            replyCount > 0 &&
            !deleted &&
            !removed &&
            !locked &&
            !pinned &&
            timestamp > Date.now() / 1000 - 60 * 60 * 24 * 30 &&
            timestamp > maxTimestamp &&
            !uniqueLinks.has(link)
          ) {
            maxTimestamp = post.timestamp;
            mostRecentPost = post;
            uniqueLinks.add(link);
          }
        }

        if (mostRecentPost) {
          subplebbitToPost[subplebbit.address] = { post: mostRecentPost, timestamp: maxTimestamp };
        }
      }
    });

    const sortedPosts = Object.values(subplebbitToPost)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((item) => item.post);

    setPopularPosts((prevPosts) => {
      const updatedPosts = [...prevPosts];
      sortedPosts.forEach((post) => {
        if (!updatedPosts.find((p) => p.cid === post.cid)) {
          if (updatedPosts.length < 8) {
            updatedPosts.push(post);
          }
        }
      });
      return updatedPosts;
    });
  }, [subplebbits]);

  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>{t('popular_threads')}</h2>
        <span>{t('options')} ▼</span>
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

// temporary hook to fetch subplebbit stats
function useSubplebbitsStats(options: any) {
  const { subplebbitAddresses, accountName } = options || {};
  const account = useAccount({ accountName });
  const { subplebbits } = useSubplebbits({ subplebbitAddresses });

  const { setSubplebbitStats, subplebbitsStats } = useSubplebbitsStatsStore();

  useEffect(() => {
    if (!subplebbitAddresses || subplebbitAddresses.length === 0 || !account) {
      return;
    }

    subplebbits.forEach((subplebbit) => {
      if (subplebbit && subplebbit.statsCid && !subplebbitsStats[subplebbit.address]) {
        account.plebbit
          .fetchCid(subplebbit.statsCid)
          .then((fetchedStats: any) => {
            setSubplebbitStats(subplebbit.address, JSON.parse(fetchedStats));
          })
          .catch((error: any) => {
            console.error('Fetching subplebbit stats failed', { subplebbitAddress: subplebbit.address, error });
          });
      }
    });
  }, [account, subplebbits, setSubplebbitStats, subplebbitsStats, subplebbitAddresses]);

  return useMemo(() => {
    return subplebbitAddresses.reduce((acc: any, address: any) => {
      acc[address] = subplebbitsStats[address] || { loading: true };
      return acc;
    }, {});
  }, [subplebbitsStats, subplebbitAddresses]);
}

export type SubplebbitsStatsState = {
  subplebbitsStats: { [subplebbitAddress: string]: any };
  setSubplebbitStats: Function;
};

const useSubplebbitsStatsStore = create<SubplebbitsStatsState>((set) => ({
  subplebbitsStats: {},
  setSubplebbitStats: (subplebbitAddress: string, subplebbitStats: any) =>
    set((state) => ({
      subplebbitsStats: { ...state.subplebbitsStats, [subplebbitAddress]: subplebbitStats },
    })),
}));

const Stats = ({ multisub, subplebbitAddresses }: { multisub: any; subplebbitAddresses: string[] }) => {
  const { t } = useTranslation();
  const stats = useSubplebbitsStats({ subplebbitAddresses });

  const allStatsLoaded = useMemo(() => {
    return subplebbitAddresses.every((address) => stats[address]);
  }, [stats, subplebbitAddresses]);

  const { totalPosts, currentUsers } = useMemo(() => {
    let totalPosts = 0;
    let currentUsers = 0;

    if (allStatsLoaded) {
      Object.values(stats).forEach((stat: any) => {
        totalPosts += stat.allPostCount || 0;
        currentUsers += stat.weekActiveUserCount || 0;
      });
    }

    return { totalPosts, currentUsers };
  }, [stats, allStatsLoaded]);

  const boardsTracked = Object.values(stats).filter((stat: any) => stat && !stat.loading).length;
  const enoughStats = boardsTracked >= multisub.length / 2;

  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>{t('stats')}</h2>
      </div>
      <div className={`${styles.boxContent} ${enoughStats ? styles.stats : ''}`}>
        {/* <div className={styles.statsInfo}>
          <p>{t('stats_info')}</p>
        </div> */}
        {enoughStats ? (
          <>
            <div className={styles.stat}>
              <b>{t('total_posts')}</b> {totalPosts}
            </div>
            <div className={styles.stat}>
              <b>{t('current_users')}</b> {currentUsers}
            </div>
            <div className={styles.stat}>
              <b>{t('boards_tracked')}</b> {boardsTracked}
            </div>
          </>
        ) : (
          <LoadingEllipsis string={t('loading')} />
        )}
      </div>
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

export const HomeLogo = () => {
  return (
    <Link to='/'>
      <div className={styles.logo}>
        <img alt='' src='/assets/logo/logo-transparent.png' />
      </div>
    </Link>
  );
};

const Home = () => {
  const defaultSubplebbits = useDefaultSubplebbits();
  const subplebbitAddresses = useDefaultSubplebbitAddresses();
  const { subplebbits } = useSubplebbits({ subplebbitAddresses });

  return (
    <div className={styles.content}>
      <HomeLogo />
      <SearchBar />
      <InfoBox />
      <Boards multisub={defaultSubplebbits} subplebbits={subplebbits} />
      <PopularThreads subplebbits={subplebbits} />
      <Stats multisub={defaultSubplebbits} subplebbitAddresses={subplebbitAddresses} />
      <Footer />
    </div>
  );
};

export default Home;
