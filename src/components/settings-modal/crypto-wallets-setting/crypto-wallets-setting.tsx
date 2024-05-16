import { useState } from 'react';
import { Account, setAccount, useAccount } from '@plebbit/plebbit-react-hooks';
import styles from './crypto-wallets-setting.module.css';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

interface Wallet {
  chainTicker: string;
  address: string;
  timestamp: number;
  signature: string;
}

const getWalletMessageToSign = (authorAddress: string, timestamp: number): string => {
  const messageToSign = {
    domainSeparator: 'plebbit-author-wallet',
    authorAddress,
    timestamp,
  };
  return JSON.stringify(messageToSign);
};

const CryptoWalletsForm = ({ account }: { account: Account | undefined }) => {
  const { t } = useTranslation();

  if (!account) {
    throw Error('CryptoWalletsForm account prop must be defined');
  }
  const authorAddress = account?.author?.address;
  const defaultWalletObject: Wallet = { chainTicker: '', address: '', timestamp: 0, signature: '' };

  const walletsFromAccount = Object.keys(account?.author?.wallets || {}).map(
    (chainTicker): Wallet => ({
      chainTicker,
      address: account.author.wallets[chainTicker].address,
      timestamp: account.author.wallets[chainTicker].timestamp,
      signature: account.author.wallets[chainTicker].signature.signature,
    }),
  );

  const defaultWalletsArray: Wallet[] = walletsFromAccount.length ? walletsFromAccount : [];

  const [walletsArray, setWalletsArray] = useState<Wallet[]>(defaultWalletsArray);
  const [selectedWallet, setSelectedWallet] = useState(0);
  const setWalletsArrayProperty = (index: number, property: keyof Wallet, value: string | number) => {
    const newArray = [...walletsArray];
    newArray[index] = { ...newArray[index], [property]: value };
    setWalletsArray(newArray);
  };

  const [hasCopied, setHasCopied] = useState(false);

  const copyMessageToSign = (wallet: any, index: number) => {
    if (!wallet.chainTicker) {
      return alert('missing chain ticker');
    }
    if (!wallet.address) {
      return alert('missing address');
    }
    const timestamp = wallet.timestamp || Math.floor(Date.now() / 1000);
    const messageToSign = getWalletMessageToSign(authorAddress, timestamp);
    if (timestamp !== wallet.timestamp) {
      setWalletsArrayProperty(index, 'timestamp', timestamp);
    }
    navigator.clipboard.writeText(messageToSign);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  const save = () => {
    const wallets: { [key: string]: { address: string; timestamp: number; signature: { signature: string; type: string } } } = {};
    walletsArray.forEach((wallet) => {
      if (wallet.chainTicker && wallet.address && wallet.signature && wallet.timestamp) {
        wallets[wallet.chainTicker] = {
          address: wallet.address,
          timestamp: wallet.timestamp,
          signature: {
            signature: wallet.signature,
            type: 'eip191',
          },
        };
      }
    });
    setAccount({ ...account, author: { ...account.author, wallets } });
    alert(t('saved'));
  };

  const _removeWallet = (index: number) => {
    const wallet = walletsArray[index];
    if (window.confirm(t('delete_confirm', { value: wallet.chainTicker, interpolation: { escapeValue: false } }))) {
      if (window.confirm(t('double_confirm'))) {
        const newArray = [...walletsArray.slice(0, index), ...walletsArray.slice(index + 1)];
        setWalletsArray(newArray);
        setSelectedWallet(0);
      }
    } else {
      return;
    }
  };

  const walletsInputs =
    walletsArray.length > 0 ? (
      <div key={selectedWallet} className={styles.walletBox}>
        <div className={styles.walletField}>
          <span className={styles.walletFieldTitle}>{_.capitalize(t('chain_ticker'))}: </span>
          <input
            type='text'
            onChange={(e) => setWalletsArrayProperty(selectedWallet, 'chainTicker', e.target.value)}
            value={walletsArray[selectedWallet].chainTicker}
            placeholder='eth/sol/avax'
          />
        </div>
        <div className={styles.walletField}>
          <span className={styles.walletFieldTitle}>{_.capitalize(t('wallet_address'))}: </span>
          <input
            type='text'
            onChange={(e) => setWalletsArrayProperty(selectedWallet, 'address', e.target.value)}
            value={walletsArray[selectedWallet].address}
            placeholder='0x...'
          />
        </div>
        <div className={styles.walletField}>
          <span className={styles.walletFieldTitle}>
            Copy message to sign on{' '}
            <a href='https://etherscan.io/verifiedSignatures' target='_blank' rel='noopener noreferrer'>
              etherscan
            </a>
            :{' '}
          </span>
          <button onClick={() => copyMessageToSign(walletsArray[selectedWallet], selectedWallet)}>{hasCopied ? t('copied') : t('copy')}</button>
        </div>
        <div className={styles.walletField}>
          <span className={styles.walletFieldTitle}>{_.capitalize(t('paste_signature'))}: </span>
          <input
            type='text'
            onChange={(e) => setWalletsArrayProperty(selectedWallet, 'signature', e.target.value)}
            value={walletsArray[selectedWallet].signature}
            placeholder='0x...'
          />
          <button className={styles.save} onClick={save}>
            {t('save')}
          </button>
          <button className={styles.removeWallet} onClick={() => _removeWallet(selectedWallet)}>
            {t('remove')}
          </button>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div className={styles.addWallet}>
        <select onChange={(e) => setSelectedWallet(Number(e.target.value))} value={selectedWallet}>
          {walletsArray.length === 0 && <option>{t('none')}</option>}
          {walletsArray.map((_, index) => (
            <option key={index} value={index}>
              {t('wallet')} #{index + 1}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            const newIndex = walletsArray.length;
            setWalletsArray([...walletsArray, defaultWalletObject]);
            setSelectedWallet(newIndex);
          }}
        >
          +
        </button>
      </div>
      {walletsInputs}
    </>
  );
};

const CryptoWalletsSetting = () => {
  const account = useAccount();
  return (
    account && (
      <div className={styles.setting}>
        <CryptoWalletsForm account={account} />
      </div>
    )
  );
};

export default CryptoWalletsSetting;
