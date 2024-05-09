import styles from './settings-modal.module.css';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../hooks/use-theme';
import { useTranslation } from 'react-i18next';
import packageJson from '../../../package.json';
const commitRef = process.env.REACT_APP_COMMIT_REF;

// TODO: remove theme and languages selectors for debugging
const ThemeSettings = () => {
  const [theme, setTheme] = useTheme();

  return (
    <select className={styles.themeSettings} value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value='yotsuba'>Yotsuba</option>
      <option value='yotsuba-b'>Yotsuba B</option>
      <option value='futaba'>Futaba</option>
      <option value='burichan'>Burichan</option>
      <option value='tomorrow'>Tomorrow</option>
      <option value='photon'>Photon</option>
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

const SettingsModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <>
      <div className={styles.overlay} onClick={closeModal}></div>
      <div className={styles.settingsModal}>
        <div className={styles.header}>
          <span className={styles.version}>
            <a href={`https://github.com/plebbit/plebchan/releases/tag/v${packageJson.version}`} target='_blank' rel='noopener noreferrer'>
              v{packageJson.version}
            </a>
            {commitRef && (
              <a href={`https://github.com/plebbit/plebchan/commit/${commitRef}`} target='_blank' rel='noopener noreferrer'>
                #{commitRef.slice(0, 7)}
              </a>
            )}
          </span>
          <span className={styles.title}>{t('settings')}</span>
          <span className={styles.closeButton} title='close' onClick={closeModal} />
        </div>
        <ThemeSettings />
        <LanguageSettings />
      </div>
    </>
  );
};

export default SettingsModal;
