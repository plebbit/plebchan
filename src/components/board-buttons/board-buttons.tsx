import { useSubscribe } from '@plebbit/plebbit-react-hooks';
import styles from './board-buttons.module.css';
import { useTranslation } from 'react-i18next';

interface BoardButtonsProps {
  address: string;
}

const OptionsButton = () => {
  const { t } = useTranslation();
  return <button className='button'>{t('options')}</button>;
};

const CatalogButton = () => {
  const { t } = useTranslation();
  return <button className='button'>{t('catalog')}</button>;
};

const SubscribeButton = ({ address }: BoardButtonsProps) => {
  const { t } = useTranslation();
  const { subscribed, subscribe, unsubscribe } = useSubscribe({ subplebbitAddress: address });

  return (
    <button className='button' onClick={subscribed ? unsubscribe : subscribe}>
      {subscribed ? t('unsubscribe') : t('subscribe')}
    </button>
  );
};

export const MobileBoardButtons = ({ address }: BoardButtonsProps) => {
  return (
    <div className={styles.mobileBoardButtons}>
      <OptionsButton />
      <CatalogButton />
      <SubscribeButton address={address} />
    </div>
  );
};

export const DesktopBoardButtons = ({ address }: BoardButtonsProps) => {
  return (
    <div className={styles.desktopBoardButtons}>
      <hr />
      [
      <OptionsButton />
      ] [
      <CatalogButton />]
      <span className={styles.subscribeButton}>
        [
        <SubscribeButton address={address} />]
      </span>
    </div>
  );
};
