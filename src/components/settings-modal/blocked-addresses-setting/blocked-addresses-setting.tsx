import { setAccount, useAccount, useBlock } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import styles from './blocked-addresses-setting.module.css';
import { useTranslation } from 'react-i18next';

const UnblockButton = ({ address }: { address: string }) => {
  const { t } = useTranslation();
  const { unblock } = useBlock({ address });

  return (
    <span className={styles.button} onClick={unblock}>
      {t('unblock')}
    </span>
  );
};

const BlockedAddressesSetting = () => {
  const { t } = useTranslation();
  const { blockedAddresses } = useAccount() || {};
  const addressList = blockedAddresses ? Object.keys(blockedAddresses) : [];
  const account = useAccount();

  const unblockAll = () => {
    window.confirm(t('unblock_all_confirm')) && setAccount({ ...account, blockedAddresses: {} });
  };

  return (
    <div className={styles.setting}>
      {addressList.length > 0 ? (
        <>
          [
          <span className={styles.button} onClick={unblockAll}>
            {t('unblock_all')}
          </span>
          ]
          <ul className={styles.blockedAddresses}>
            {addressList.map((address: string) => (
              <li key={address} className={styles.blockedAddress}>
                {address && Plebbit.getShortAddress(address)} [<UnblockButton address={address} />]
              </li>
            ))}
          </ul>
        </>
      ) : (
        'You have not blocked any board address or user address.'
      )}
    </div>
  );
};

export default BlockedAddressesSetting;
