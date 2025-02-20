import { setAccount, useAccount, useSubscribe } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import styles from './subscriptions-setting.module.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const SubscriptionButton = ({ address }: { address: string }) => {
  const { t } = useTranslation();
  const { subscribed, subscribe, unsubscribe } = useSubscribe({ subplebbitAddress: address });
  const [recentlyUnsubscribed, setRecentlyUnsubscribed] = useState(false);

  const handleClick = () => {
    if (recentlyUnsubscribed || !subscribed) {
      subscribe();
      setRecentlyUnsubscribed(false);
    } else {
      unsubscribe();
      setRecentlyUnsubscribed(true);
    }
  };

  return (
    <span className={styles.subscriptionButton}>
      [
      <span className={styles.button} onClick={handleClick}>
        {recentlyUnsubscribed || !subscribed ? t('subscribe') : t('unsubscribe')}
      </span>
      ]
    </span>
  );
};

const SubscriptionsSetting = () => {
  const { t } = useTranslation();
  const { subscriptions } = useAccount() || [];
  const account = useAccount();

  const unsubscribeAll = () => {
    if (window.confirm(t('unsubscribe_all_confirm'))) {
      setAccount({ ...account, subscriptions: [] });
    }
  };

  return (
    <div className={styles.setting}>
      {subscriptions?.length > 0 ? (
        <>
          {subscriptions?.length > 1 && (
            <div className={styles.unsubscribeAll}>
              [
              <span className={styles.button} onClick={unsubscribeAll}>
                {t('unsubscribe_all')}
              </span>
              ]
            </div>
          )}
          <ul className={styles.subscriptions}>
            {subscriptions?.map((address: string) => (
              <li key={address} className={styles.subscription}>
                {address && Plebbit.getShortAddress(address)} <SubscriptionButton address={address} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        t('not_subscribed_to_any_board')
      )}
    </div>
  );
};

export default SubscriptionsSetting;
