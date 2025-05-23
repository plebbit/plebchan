import { useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useSubplebbits } from '@plebbit/plebbit-react-hooks';
import styles from './home.module.css';
import { useDefaultSubplebbits, useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import useSubplebbitsStats from '../../hooks/use-subplebbits-stats';
import PopularThreadsBox from './popular-threads-box';
import BoardsList from './boards-list';
import Version from '../../components/version';
import _ from 'lodash';

// https://github.com/plebbit/temporary-default-subplebbits/blob/master/README.md

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
          placeholder={_.lowerCase(t('enter_board_address'))}
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
    <div className={`${styles.box} ${styles.infoBox}`}>
      <div className={styles.infoboxBar}>
        <h2>{t('what_is_plebchan')}</h2>
      </div>
      <div className={styles.boxContent}>
        <Trans
          i18nKey='plebchan_description'
          shouldUnescape={true}
          components={{
            1: <Link key='plebbit-link' to='https://plebbit.com' target='_blank' rel='noopener noreferrer' />,
          }}
        />
        <br />
        <br />
        {t('no_global_rules_info')}
      </div>
    </div>
  );
};

const Stats = ({ subplebbitAddresses }: { subplebbitAddresses: string[] }) => {
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

  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className='capitalize'>{t('stats')}</h2>
      </div>
      <div className={`${styles.boxContent} ${styles.stats}`}>
        <div className={styles.stat}>
          <b>{t('total_posts')}</b> {totalPosts}
        </div>
        <div className={styles.stat}>
          <b>{t('current_users')}</b> {currentUsers}
        </div>
        <div className={styles.stat}>
          <b>{t('boards_tracked')}</b> {boardsTracked}
        </div>
      </div>
    </div>
  );
};

export const Footer = () => {
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
          <a href='https://blog.plebbit.eth.limo' target='_blank' rel='noopener noreferrer'>
            Blog
          </a>
        </li>
        <li>
          <Link to='/faq'>FAQ</Link>
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
        <Version />
      </div>
    </>
  );
};

export const HomeLogo = () => {
  return (
    <Link to='/'>
      <div className={styles.logo}>
        <img alt='' src='assets/logo/logo-transparent.png' />
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
      <BoardsList multisub={defaultSubplebbits} />
      <PopularThreadsBox multisub={defaultSubplebbits} subplebbits={subplebbits} />
      <Stats subplebbitAddresses={subplebbitAddresses} />
      <Footer />
    </div>
  );
};

export default Home;
