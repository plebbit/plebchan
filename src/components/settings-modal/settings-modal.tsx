import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './settings-modal.module.css';
import useTheme from '../../hooks/use-theme';
import packageJson from '../../../package.json';
import AccountSettings from './account-settings';
import CryptoAddressSetting from './crypto-address-setting';
import CryptoWalletsSetting from './crypto-wallets-setting';

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
    <button className={styles.checkForUpdatesButton} onClick={checkForUpdates} disabled={loading}>
      {t('check')}
    </button>
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

// const PlebbitOptionsSettings = () => {
//   return (
//     <>
//       <div className={styles.setting}></div>
//     </>
//   );
// };

const SettingsModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showCryptoAddressSetting, setShowCryptoAddressSetting] = useState(false);
  const [showCryptoWalletSettings, setShowCryptoWalletSettings] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  const handleExpandAll = () => {
    const newExpandState = !expandAll;
    setExpandAll(newExpandState);
    setShowAccountSettings(newExpandState);
    setShowCryptoAddressSetting(newExpandState);
    setShowCryptoWalletSettings(newExpandState);
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
        <div className={styles.expandAllSettings}>
          [<span onClick={handleExpandAll}>{expandAll ? 'Collapse All Settings' : 'Expand All Settings'}</span>]
        </div>
        <div className={styles.setting}>
          {t('update')}: <CheckForUpdates />
        </div>
        <div className={styles.setting}>
          {t('style')}: <Style />
        </div>
        <div className={styles.setting}>
          {t('interface_language')}: <InterfaceLanguage />
        </div>
        <div className={`${styles.setting} ${styles.category}`}>
          <label onClick={() => setShowAccountSettings(!showAccountSettings)}>
            <span className={showAccountSettings ? styles.hideButton : styles.showButton} />
            {t('account')}
          </label>
        </div>
        {showAccountSettings && <AccountSettings />}
        <div className={`${styles.setting} ${styles.category}`}>
          <label onClick={() => setShowCryptoAddressSetting(!showCryptoAddressSetting)}>
            <span className={showCryptoAddressSetting ? styles.hideButton : styles.showButton} />
            {t('crypto_address')}
          </label>
        </div>
        {showCryptoAddressSetting && <CryptoAddressSetting />}
        <div className={`${styles.setting} ${styles.category}`}>
          <label onClick={() => setShowCryptoWalletSettings(!showCryptoWalletSettings)}>
            <span className={showCryptoWalletSettings ? styles.hideButton : styles.showButton} />
            {t('crypto_wallets')}
          </label>
        </div>
        {showCryptoWalletSettings && <CryptoWalletsSetting />}
        {/* <div className={`${styles.setting} ${styles.category}`}>
          <label onClick={() => setShowPlebbitOptionsSettings(!showPlebbitOptionsSettings)}>
            <span className={showPlebbitOptionsSettings ? styles.hideButton : styles.showButton} />
            {t('plebbit_options')}
          </label>
        </div>
        {showPlebbitOptionsSettings && <PlebbitOptionsSettings />} */}
      </div>
    </>
  );
};

export default SettingsModal;
