import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAccountComment, useSubscribe } from '@plebbit/plebbit-react-hooks';
import { isAllView, isCatalogView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useFeedResetStore from '../../stores/use-feed-reset-store';
import styles from './board-buttons.module.css';

interface BoardButtonsProps {
  isInAllView?: boolean;
  address?: string | undefined;
  isInCatalogView?: boolean;
  isInSubscriptionsView?: boolean;
}

const OptionsButton = () => {
  const { t } = useTranslation();
  return <button className='button'>{t('options')}</button>;
};

const CatalogButton = ({ address, isInAllView, isInSubscriptionsView }: BoardButtonsProps) => {
  const { t } = useTranslation();
  const link = isInAllView ? `/p/all/catalog` : isInSubscriptionsView ? `/p/subscriptions/catalog` : `/p/${address}/catalog`;
  return (
    <button className='button'>
      <Link to={link}>{t('catalog')}</Link>
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

const ReturnButton = ({ address, isInAllView, isInSubscriptionsView }: BoardButtonsProps) => {
  const { t } = useTranslation();
  const link = isInAllView ? `/p/all` : isInSubscriptionsView ? `/p/subscriptions` : `/p/${address}`;
  return (
    <button className='button'>
      <Link to={link}>{t('return')}</Link>
    </button>
  );
};

const RefreshButton = () => {
  const { t } = useTranslation();
  const reset = useFeedResetStore((state) => state.reset);
  return (
    <button className='button' onClick={() => reset && reset()}>
      {t('refresh')}
    </button>
  );
};

export const MobileBoardButtons = () => {
  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname);
  const isInCatalogView = isCatalogView(location.pathname);
  const isInPendingPostPage = isPendingPostView(location.pathname, params);
  const isInPostView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname);

  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  return (
    <div className={styles.mobileBoardButtons}>
      {isInPostView || isInPendingPostPage ? (
        <>
          <ReturnButton address={subplebbitAddress} />
          <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          <OptionsButton />
          <SubscribeButton address={subplebbitAddress} />
        </>
      ) : (
        <>
          {isInCatalogView ? (
            <ReturnButton address={subplebbitAddress} />
          ) : (
            <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          )}
          <OptionsButton />
          <SubscribeButton address={subplebbitAddress} />
          <RefreshButton />
        </>
      )}
    </div>
  );
};

export const DesktopBoardButtons = () => {
  const params = useParams();
  const location = useLocation();
  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;
  const isInCatalogView = isCatalogView(location.pathname);
  const isInAllView = isAllView(location.pathname);
  const isInPendingPostPage = isPendingPostView(location.pathname, params);
  const isInPostView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname);

  return (
    <div className={styles.desktopBoardButtons}>
      <hr />
      {isInPostView || isInPendingPostPage ? (
        <>
          [
          <ReturnButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          ] [
          <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          ] [
          <OptionsButton />]{' '}
          {isInPostView && (
            <span className={styles.subscribeButton}>
              [<SubscribeButton address={subplebbitAddress} />]
            </span>
          )}
        </>
      ) : isInCatalogView ? (
        <>
          [
          <ReturnButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          ] [
          <OptionsButton />
          ] [
          <RefreshButton />]{' '}
          {!(isInAllView || isInSubscriptionsView) && (
            <span className={styles.subscribeButton}>
              [<SubscribeButton address={subplebbitAddress} />]
            </span>
          )}
        </>
      ) : (
        <>
          [
          <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          ] [
          <OptionsButton />
          ] [
          <RefreshButton />]{' '}
          {!(isInAllView || isInSubscriptionsView) && (
            <span className={styles.subscribeButton}>
              [
              <SubscribeButton address={subplebbitAddress} />]
            </span>
          )}
        </>
      )}
    </div>
  );
};
