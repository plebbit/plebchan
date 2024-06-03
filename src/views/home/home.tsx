import { useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useSubplebbits } from '@plebbit/plebbit-react-hooks';
import styles from './home.module.css';
import packageJson from '../../../package.json';
import useDefaultSubplebbits, { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import useSubplebbitsStats from '../../hooks/use-subplebbits-stats';
import LoadingEllipsis from '../../components/loading-ellipsis';
import PopularThreadsBox from './popular-threads-box';
import BoardsBox from './boards-box';

// https://github.com/plebbit/temporary-default-subplebbits/blob/master/README.md
export const nsfwTags = ['adult', 'anti', 'gore'];

const SearchBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearchSubmit = () => {
    const searchInput = searchInputRef.current?.value;
    if (searchInput) {
      navigate(`/p/${searchInput}`);
    }
  };

  return (
    <div className={styles.searchBar}>
      <form onSubmit={handleSearchSubmit}>
        <input
          autoCorrect='off'
          autoComplete='off'
          spellCheck='false'
          autoCapitalize='off'
          type='text'
          placeholder={`"board.eth/.sol" ${t('or')} "12D3KooW..."`}
          ref={searchInputRef}
        />
        <button className={styles.searchButton}>{t('go')}</button>
      </form>
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

  useEffect(() => {
    document.title = 'plebchan';
  }, []);

  return (
    <div className={styles.content}>
      <HomeLogo />
      <SearchBar />
      <InfoBox />
      <BoardsBox multisub={defaultSubplebbits} subplebbits={subplebbits} />
      <PopularThreadsBox multisub={defaultSubplebbits} subplebbits={subplebbits} />
      <Stats multisub={defaultSubplebbits} subplebbitAddresses={subplebbitAddresses} />
      <Footer />
    </div>
  );
};

export default Home;
