import styles from './home.module.css';
import useTheme from '../../hooks/use-theme';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useDefaultSubplebbitAddresses } from '../../hooks/use-default-subplebbits';
import { useEffect } from 'react';

// TODO: remove theme and languages selectors for debugging
const ThemeSettings = () => {
  const [theme, setTheme] = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value='yotsuba'>yotsuba</option>
      <option value='yotsuba-b'>yotsuba-b</option>
      <option value='tomorrow'>tomorrow</option>
    </select>
  );
};

// prettier-ignore
const availableLanguages = ['ar', 'bn', 'cs', 'da', 'de', 'el', 'en', 'es', 'fa', 'fi', 'fil', 'fr', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'mr', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sq', 'sv', 'te', 'th', 'tr', 'uk', 'ur', 'vi', 'zh'];

const LanguageSettings = () => {
  const { i18n } = useTranslation();
  const { changeLanguage, language } = i18n;

  const onSelectLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
    window.location.reload();
  };

  return (
    <div className={styles.languageSettings}>
      <select value={language} onChange={onSelectLanguage}>
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

const SearchBar = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.searchBar}>
      <input type='text' placeholder={`"board.eth" ${t('or')} "12D3KooW..."`} />
      <button>{t('go')}</button>
    </div>
  );
};

const InfoBox = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color1ColorBar}`}>
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

const Boards = () => {
  const { t } = useTranslation();
  const defaultSubplebbitAddresses = useDefaultSubplebbitAddresses();

  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>{t('boards')}</h2>
        <span>{t('options')} ▼</span>
      </div>
      <div className={styles.boardsBoxContent}>
        <div className={styles.column}>
          <h3>Default SFW</h3>
          <div className={styles.list}>
            {defaultSubplebbitAddresses.map((address) => (
              <div className={styles.subplebbit} key={address}>
                <Link to={`/b/${address}`}>{address}</Link>
              </div>
            ))}
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

const PopularThreads = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.box}>
      <div className={`${styles.boxBar} ${styles.color2ColorBar}`}>
        <h2 className={styles.capitalize}>{t('popular_threads')}</h2>
        <span>{t('options')} ▼</span>
      </div>
      <div className={styles.boxContent}></div>
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

const Footer = () => {
  const { t } = useTranslation();

  return (
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
      <li>
        <a href='https://github.com/plebbit/plebchan' target='_blank' rel='noopener noreferrer'>
          {t('download_app')}
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
  );
};

const Home = () => {
  const [, setTheme] = useTheme();

  useEffect(() => {
    setTheme('yotsuba');
  }, [setTheme]);

  return (
    <div className={styles.content}>
      <div className={styles.debug}>
        <LanguageSettings />
        <ThemeSettings />
      </div>
      <Link to='/'>
        <div className={styles.logo}>
          <img alt='plebchan' src='/assets/logo/logo-transparent.png' />
        </div>
      </Link>
      <SearchBar />
      <InfoBox />
      <Boards />
      <PopularThreads />
      <Stats />
      <Footer />
    </div>
  );
};

export default Home;
