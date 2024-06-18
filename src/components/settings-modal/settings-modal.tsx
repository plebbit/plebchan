import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './settings-modal.module.css';
import AccountSettings from './account-settings';
import BlockedAddressesSetting from './blocked-addresses-setting';
import CryptoAddressSetting from './crypto-address-setting';
import CryptoWalletsSetting from './crypto-wallets-setting';
import InterfaceSettings from './interface-settings';
import PlebbitOptions from './plebbit-options';

const SettingsModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  const [showInterfaceSettings, setShowInterfaceSettings] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showCryptoAddressSetting, setShowCryptoAddressSetting] = useState(false);
  const [showCryptoWalletSettings, setShowCryptoWalletSettings] = useState(false);
  const [showBlockedAddressesSetting, setShowBlockedAddressesSetting] = useState(false);
  const [showPlebbitOptionsSettings, setShowPlebbitOptionsSettings] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  const handleExpandAll = () => {
    const newExpandState = !expandAll;
    setExpandAll(newExpandState);
    setShowInterfaceSettings(newExpandState);
    setShowAccountSettings(newExpandState);
    setShowCryptoAddressSetting(newExpandState);
    setShowCryptoWalletSettings(newExpandState);
    setShowBlockedAddressesSetting(newExpandState);
    setShowPlebbitOptionsSettings(newExpandState);
  };

  return (
    <>
      <div className={styles.overlay} onClick={closeModal} />
      <div className={styles.settingsModal}>
        <div className={styles.header}>
          <span className={styles.title}>{t('settings')}</span>
          <span className={styles.closeButton} title='close' onClick={closeModal} />
        </div>
        <div className={styles.expandAllSettings}>
          [<span onClick={handleExpandAll}>{expandAll ? t('collapse_all_settings') : t('expand_all_settings')}</span>]
        </div>
        <div className={`${styles.setting} ${styles.category}`}>
          <label onClick={() => setShowInterfaceSettings(!showInterfaceSettings)}>
            <span className={showInterfaceSettings ? styles.hideButton : styles.showButton} />
            {t('interface')}
          </label>
        </div>
        {showInterfaceSettings && <InterfaceSettings />}
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
        <div className={`${styles.setting} ${styles.category}`}>
          <label onClick={() => setShowBlockedAddressesSetting(!showBlockedAddressesSetting)}>
            <span className={showBlockedAddressesSetting ? styles.hideButton : styles.showButton} />
            {t('blocked_addresses')}
          </label>
        </div>
        {showBlockedAddressesSetting && <BlockedAddressesSetting />}
        <div className={`${styles.setting} ${styles.category}`}>
          <label onClick={() => setShowPlebbitOptionsSettings(!showPlebbitOptionsSettings)}>
            <span className={showPlebbitOptionsSettings ? styles.hideButton : styles.showButton} />
            {t('plebbit_options')}
          </label>
        </div>
        {showPlebbitOptionsSettings && <PlebbitOptions />}
      </div>
    </>
  );
};

export default SettingsModal;
