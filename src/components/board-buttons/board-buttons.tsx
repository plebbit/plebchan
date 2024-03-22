import { useSubscribe } from '@plebbit/plebbit-react-hooks';
import styles from './board-buttons.module.css';

interface BoardButtonsProps {
  address: string;
}

const OptionsButton = () => {
  return <button className='button'>options</button>;
};

const CatalogButton = () => {
  return <button className='button'>catalog</button>;
};

const SubscribeButton = ({ address }: BoardButtonsProps) => {
  const { subscribed, subscribe, unsubscribe } = useSubscribe({ subplebbitAddress: address });

  return (
    <button className='button' onClick={subscribed ? unsubscribe : subscribe}>
      {subscribed ? 'Unsubscribe' : 'Subscribe'}
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
      <SubscribeButton address={address} />
    </div>
  );
};
