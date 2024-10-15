import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, setAccount, useResolvedAuthorAddress } from '@plebbit/plebbit-react-hooks';
import styles from './crypto-address-setting.module.css';

const CryptoAddressSetting = () => {
  const { t } = useTranslation();
  const account = useAccount();

  const [cryptoState, setCryptoState] = useState({
    cryptoAddress: '',
    checkingCryptoAddress: false,
    showResolvingMessage: true,
    resolveString: t('crypto_address_verification'),
    resolveClass: '',
  });

  const [savedCryptoAddress, setSavedCryptoAddress] = useState(false);

  const author = { ...account?.author, address: cryptoState.cryptoAddress };
  const { resolvedAddress, state, error, chainProvider } = useResolvedAuthorAddress({ author, cache: false });

  const [inputValue, setInputValue] = useState(account?.author?.shortAddress.includes('.') ? account.author.shortAddress : '');

  const checkCryptoAddress = () => {
    const addressToCheck = inputValue || cryptoState.cryptoAddress;
    if (!addressToCheck || !addressToCheck.includes('.')) {
      alert(t('enter_crypto_address'));
      return;
    }

    let resolveString = '';
    let resolveClass = '';

    if (state === 'failed') {
      resolveString = error instanceof Error ? `failed to resolve crypto address, error: ${error.message}` : 'cannot resolve crypto address, unknown error';
      resolveClass = styles.red;
    } else if (state === 'resolving') {
      resolveString = `resolving from ${chainProvider?.urls}`;
      resolveClass = styles.yellow;
    } else if (resolvedAddress && resolvedAddress === account?.signer?.address) {
      resolveString = t('crypto_address_yours');
      resolveClass = styles.green;
    } else if (resolvedAddress && resolvedAddress !== account?.signer?.address) {
      resolveString = t('crypto_address_not_yours');
      resolveClass = styles.red;
    } else {
      resolveString = t('crypto_address_verification');
      resolveClass = '';
    }

    setCryptoState((prevState) => ({
      ...prevState,
      cryptoAddress: addressToCheck,
      showResolvingMessage: true,
      resolveString,
      resolveClass,
    }));
  };

  const saveCryptoAddress = async () => {
    if (!cryptoState.cryptoAddress || !cryptoState.cryptoAddress.includes('.')) {
      alert(t('enter_crypto_address'));
      return;
    } else if (resolvedAddress && resolvedAddress !== account?.signer?.address) {
      alert(t('crypto_address_not_yours'));
      return;
    } else if (cryptoState.cryptoAddress && !resolvedAddress) {
      alert(t('crypto_address_not_resolved'));
      return;
    } else if (resolvedAddress && resolvedAddress === account?.signer?.address) {
      try {
        await setAccount({ ...account, author: { ...account?.author, address: cryptoState.cryptoAddress } });
        setSavedCryptoAddress(true);

        setTimeout(() => {
          setSavedCryptoAddress(false);
        }, 2000);

        setCryptoState((prevState) => ({
          ...prevState,
          savedCryptoAddress: true,
          cryptoAddress: '',
          checkingCryptoAddress: false,
        }));
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          console.log(error);
        } else {
          console.error('An unknown error occurred:', error);
        }
      }
      setSavedCryptoAddress(true);
      setCryptoState((prevState) => ({
        ...prevState,
        checkingCryptoAddress: false,
        showResolvingMessage: false,
        resolveString: t('crypto_address_verification'),
        resolveClass: '',
      }));
    }
  };

  const [showCryptoAddressInfo, setShowCryptoAddressInfo] = useState(false);

  return (
    <div className={styles.setting}>
      <div className={styles.cryptoAddressInput}>
        <input
          type='text'
          placeholder='address.eth/.sol'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setCryptoState((prevState) => ({ ...prevState, cryptoAddress: e.target.value }));
          }}
        />
        <button className={styles.saveButton} onClick={saveCryptoAddress}>
          {t('save')}
        </button>
        <button className={styles.infoButton} onClick={() => setShowCryptoAddressInfo(!showCryptoAddressInfo)}>
          {showCryptoAddressInfo ? 'x' : '?'}
        </button>
        {showCryptoAddressInfo && (
          <div className={styles.cryptoAddressInfo}>
            steps to set a .eth address as your ID:
            <br />
            <ol>
              <li>
                go to{' '}
                <a href='https://app.ens.domains/' target='_blank' rel='noopener noreferrer'>
                  app.ens.domains
                </a>{' '}
                and search the address
              </li>
              <li>once you own the address, go to its page, click on "records", then "edit records"</li>
              <li>add a new text record with name "plebbit-author-address" and value: {account?.signer?.address}</li>
            </ol>
            steps to set a .sol address as your ID:
            <br />
            <ol>
              <li>
                go to{' '}
                <a href='https://www.sns.id/' target='_blank' rel='noopener noreferrer'>
                  sns.id
                </a>{' '}
                and search the address
              </li>
              <li>once you own the address, go to your profile, click the address menu "...", then "create subdomain"</li>
              <li>enter subdomain "plebbit-author-address" and create</li>
              <li>go to subdomain, "content", change content to: {account?.signer?.address}</li>
            </ol>
          </div>
        )}
        {savedCryptoAddress && <span className={styles.saved}>{t('saved')}</span>}
      </div>
      <div className={styles.checkCryptoAddress}>
        <button className={styles.button} onClick={checkCryptoAddress}>
          {t('check')}
        </button>{' '}
        <span className={cryptoState.resolveClass}>{cryptoState.resolveString}</span>
      </div>
    </div>
  );
};

export default CryptoAddressSetting;
