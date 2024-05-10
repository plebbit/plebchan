import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './settings-modal.module.css';
import useTheme from '../../hooks/use-theme';
import packageJson from '../../../package.json';

const commitRef = process.env.REACT_APP_COMMIT_REF;
const isElectron = window.isElectron === true;

const CheckForUpdates = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const checkForUpdates = async () => {
    try {
      setLoading(true);
      const packageRes = await fetch('https://raw.githubusercontent.com/plebbit/plebchan/master/package.json', { cache: 'no-cache' });
      const packageData = await packageRes.json();
      let updateAvailable = false;

      if (packageJson.version !== packageData.version) {
        const newVersionText = t('new_stable_version', { newVersion: packageData.version, oldVersion: packageJson.version });
        const updateActionText = isElectron
          ? t('download_latest_desktop', { link: 'https://github.com/plebbit/plebchan/releases/latest', interpolation: { escapeValue: false } })
          : t('refresh_to_update');
        alert(newVersionText + ' ' + updateActionText);
        updateAvailable = true;
      }

      if (commitRef && commitRef.length > 0) {
        const commitRes = await fetch('https://api.github.com/repos/plebbit/plebchan/commits?per_page=1&sha=development', { cache: 'no-cache' });
        const commitData = await commitRes.json();

        const latestCommitHash = commitData[0].sha;

        if (latestCommitHash.trim() !== commitRef.trim()) {
          const newVersionText =
            t('new_development_version', { newCommit: latestCommitHash.slice(0, 7), oldCommit: commitRef.slice(0, 7) }) + ' ' + t('refresh_to_update');
          alert(newVersionText);
          updateAvailable = true;
        }
      }

      if (!updateAvailable) {
        alert(
          commitRef
            ? `${t('latest_development_version', { commit: commitRef.slice(0, 7), link: 'https://plebchan.eth.limo/#/', interpolation: { escapeValue: false } })}`
            : `${t('latest_stable_version', { version: packageJson.version })}`,
        );
      }
    } catch (error) {
      alert('Failed to fetch latest version info: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkForUpdates}>
      {/* <Trans i18nKey='check_for_updates' components={{ 1: <button className={styles.checkForUpdatesButton} onClick={checkForUpdates} disabled={loading} /> }} /> */}
      <button className={styles.checkForUpdatesButton} onClick={checkForUpdates} disabled={loading}>
        {t('check_for_updates')}
      </button>
    </div>
  );
};

const Style = () => {
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

const InterfaceLanguage = () => {
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
        <div className={styles.setting}>
          <CheckForUpdates />
        </div>
        <div className={styles.setting}>
          Style: <Style />
        </div>
        <div className={styles.setting}>
          Interface Language: <InterfaceLanguage />
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
