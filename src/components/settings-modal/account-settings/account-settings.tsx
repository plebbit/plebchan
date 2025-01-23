import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createAccount, deleteAccount, exportAccount, importAccount, setAccount, setActiveAccount, useAccount, useAccounts } from '@plebbit/plebbit-react-hooks';
import stringify from 'json-stringify-pretty-compact';
import styles from './account-settings.module.css';
import useAnonModeStore from '../../../stores/use-anon-mode-store';
import { Capacitor } from '@capacitor/core';

const isAndroid = Capacitor.getPlatform() === 'android';

const AnonMode = () => {
  const { t } = useTranslation();
  const anonMode = useAnonModeStore((state) => state.anonMode);
  const setAnonMode = useAnonModeStore((state) => state.setAnonMode);

  return (
    <div className={styles.anonMode}>
      <label>
        <input type='checkbox' checked={anonMode} onChange={(e) => setAnonMode(e.target.checked)} /> {t('anon_mode')}
      </label>
      <span className={styles.settingTip}>{t('anon_mode_description')}</span>
    </div>
  );
};

const AccountSettings = () => {
  const { t } = useTranslation();
  const account = useAccount();
  const [text, setText] = useState('');

  const accountJson = useMemo(
    () => stringify({ account: { ...account, plebbit: undefined, karma: undefined, plebbitReactOptions: undefined, unreadNotificationCount: undefined } }),
    [account],
  );

  useEffect(() => {
    setText(accountJson);
  }, [accountJson]);

  const { accounts } = useAccounts();
  const switchToNewAccountRef = useRef(false);

  useEffect(() => {
    if (switchToNewAccountRef.current && accounts.length > 0) {
      const lastAccount = accounts[accounts.length - 1];
      setActiveAccount(lastAccount.name);
      switchToNewAccountRef.current = false;
    }
  }, [accounts, setActiveAccount]);

  const handleCreateAccount = async () => {
    try {
      switchToNewAccountRef.current = true;
      await createAccount();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        console.log(error);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  const _deleteAccount = (accountName: string) => {
    if (!accountName) {
      return;
    } else if (window.confirm(t('delete_confirm', { value: accountName, interpolation: { escapeValue: false } }))) {
      if (window.confirm(t('double_confirm'))) {
        deleteAccount(accountName);
      }
    } else {
      return;
    }
  };

  const saveAccount = async () => {
    try {
      const newAccount = JSON.parse(text).account;
      // force keeping the same id, makes it easier to copy paste
      await setAccount({ ...newAccount, id: account?.id });
      alert(`Saved ${newAccount.name}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        console.log(error);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  const handleExportAccount = async () => {
    try {
      const accountString = await exportAccount();
      const accountObject = JSON.parse(accountString);
      const formattedAccountJson = JSON.stringify(accountObject, null, 2);

      // Create a Blob from the JSON string
      const blob = new Blob([formattedAccountJson], { type: 'application/json' });

      // Create a URL for the Blob
      const fileUrl = URL.createObjectURL(blob);

      // Create a temporary download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${account.name}.json`;

      // Append the link, trigger the download, then remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the Blob URL
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        console.log(error);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  const handleImportAccount = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    // Handle file selection
    fileInput.onchange = async (event) => {
      try {
        const files = (event.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
          throw new Error('No file selected.');
        }
        const file = files[0];

        // Read the file content
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const fileContent = e.target!.result;
            if (typeof fileContent !== 'string') {
              throw new Error('File content is not a string.');
            }
            const newAccount = JSON.parse(fileContent);
            await importAccount(fileContent);

            // Store the imported account's address
            if (newAccount.account?.author?.address) {
              localStorage.setItem('importedAccountAddress', newAccount.account.author.address);
            }

            // Set the new account as active before reloading
            if (newAccount.account?.name) {
              await setActiveAccount(newAccount.account.name);
            }

            alert(`Imported ${newAccount.account?.name}`);
            window.location.reload();
          } catch (error) {
            if (error instanceof Error) {
              alert(error.message);
              console.log(error);
            } else {
              console.error('An unknown error occurred:', error);
            }
          }
        };
        reader.readAsText(file);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          console.log(error);
        } else {
          console.error('An unknown error occurred:', error);
        }
      }
    };

    // Trigger file selection dialog
    fileInput.click();
  };

  const accountsOptions = accounts.map((account) => (
    <option key={account?.id} value={account?.name}>
      u/{account?.author?.shortAddress}
    </option>
  ));

  return (
    <div className={styles.setting}>
      <div>
        <select value={account?.name} onChange={(e) => setActiveAccount(e.target.value)}>
          {accountsOptions}
        </select>
        <button className={styles.createAccount} onClick={handleCreateAccount}>
          {t('create')}
        </button>{' '}
        <button onClick={handleImportAccount}>{t('import')}</button> <button onClick={handleExportAccount}>{t('export')}</button>
        <div className={styles.warning}>
          {t('stored_locally', {
            location: window.isElectron ? 'this desktop app' : isAndroid ? 'this mobile app' : window.location.hostname,
            interpolation: { escapeValue: false },
          })}
        </div>
      </div>
      <div></div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} autoCorrect='off' autoComplete='off' spellCheck='false' />
      <div>
        <button onClick={saveAccount}>{t('save_changes')}</button> <button onClick={() => setText(accountJson)}>{t('reset_changes')}</button> <AnonMode />
        <button className={styles.deleteAccount} onClick={() => _deleteAccount(account?.name)}>
          {t('delete_account')}
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
