import styles from './home.module.css';
import useTheme from '../../hooks/use-theme';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

// TODO: remove theme and languages selectors for debugging
const ThemeSettings = () => {
  const [theme, setTheme] = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value='yotsuba'>yotsuba</option>
      <option value='yotsuba-b'>yotsuba-b</option>
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

const Home = () => {
  const { t } = useTranslation();

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
      <div className={styles.searchBar}>
        <input type='text' placeholder={`"board.eth" ${t('or')} "12D3KooW..."`} />
        <button>{t('go')}</button>
      </div>
      <div className={styles.box}>
        <div className={`${styles.boxBar} ${styles.primaryColorBar}`}>
          <h2>{t('what_is_plebchan')}</h2>
        </div>
        <div className={styles.boxContent}>
          <Trans i18nKey='plebchan_description' shouldUnescape={true} components={{ 1: <Link to='https://plebbit.com' target='_blank' rel='noopener noreferrer' /> }} />
          <br />
          <br />
          {t('no_global_rules_info')}
        </div>
      </div>
      <div className={styles.box}>
        <div className={`${styles.boxBar} ${styles.secondaryColorBar}`}>
          <h2 className={styles.capitalize}>{t('boards')}</h2>
        </div>
        <div className={styles.boxContent}></div>
      </div>
      <div className={styles.box}>
        <div className={`${styles.boxBar} ${styles.secondaryColorBar}`}>
          <h2 className={styles.capitalize}>{t('popular_threads')}</h2>
        </div>
        <div className={styles.boxContent}></div>
      </div>
    </div>
  );
};

export default Home;
