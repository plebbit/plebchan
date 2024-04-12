import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSubscribe } from '@plebbit/plebbit-react-hooks';
import styles from './board-buttons.module.css';
import { isCatalogView, isPostPageView } from '../../lib/utils/view-utils';

interface BoardButtonsProps {
  address: string | undefined;
  isInCatalogView?: boolean;
}

const OptionsButton = () => {
  const { t } = useTranslation();
  return <button className='button'>{t('options')}</button>;
};

const CatalogButton = ({ address, isInCatalogView }: BoardButtonsProps) => {
  const { t } = useTranslation();
  return (
    <button className='button'>
      <Link to={isInCatalogView ? `/p/${address}` : `/p/${address}/catalog`}>{t(isInCatalogView ? 'return' : 'catalog')}</Link>
    </button>
  );
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

const ReturnButton = ({ address }: BoardButtonsProps) => {
  const { t } = useTranslation();
  return (
    <button className='button'>
      <Link to={`/p/${address}`}>{t('return')}</Link>
    </button>
  );
};

const BottomButton = () => {
  const { t } = useTranslation();
  return (
    <button className='button' onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
      {t('bottom')}
    </button>
  );
};

export const MobileBoardButtons = () => {
  const { subplebbitAddress: address } = useParams<{ subplebbitAddress: string }>();
  const isInPostPage = isPostPageView(useLocation().pathname, useParams());
  return (
    <div className={styles.mobileBoardButtons}>
      {isInPostPage ? (
        <div className={styles.mobilePostPageButtons}>
          <ReturnButton address={address} />
          <CatalogButton address={address} />
          <BottomButton />
          <div className={styles.mobilePostPageButtonsSecondRow}>
            <OptionsButton />
            <SubscribeButton address={address} />
          </div>
        </div>
      ) : (
        <>
          <OptionsButton />
          <CatalogButton address={address} />
          <SubscribeButton address={address} />
        </>
      )}
    </div>
  );
};

export const DesktopBoardButtons = () => {
  const { subplebbitAddress: address } = useParams<{ subplebbitAddress: string }>();

  const location = useLocation();
  const params = useParams();
  const isInPostPage = isPostPageView(location.pathname, params);
  const isInCatalogView = isCatalogView(location.pathname, params);

  return (
    <div className={styles.desktopBoardButtons}>
      <hr />
      {isInPostPage ? (
        <>
          [<ReturnButton address={address} />] [<CatalogButton address={address} isInCatalogView={isInCatalogView} />] [<BottomButton />] [<OptionsButton />]
          <span className={styles.subscribeButton}>
            [<SubscribeButton address={address} />]
          </span>
        </>
      ) : (
        <>
          [<OptionsButton />] [<CatalogButton address={address} isInCatalogView={isInCatalogView} />]
          <span className={styles.subscribeButton}>
            [<SubscribeButton address={address} />]
          </span>
        </>
      )}
    </div>
  );
};
