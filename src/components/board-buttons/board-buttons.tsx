import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAccountComment, useSubscribe } from '@plebbit/plebbit-react-hooks';
import styles from './board-buttons.module.css';
import { isAllView, isCatalogView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';

interface BoardButtonsProps {
  isInAllView?: boolean;
  address: string | undefined;
  isInCatalogView?: boolean;
  isInSubscriptionsView?: boolean;
}

const OptionsButton = () => {
  const { t } = useTranslation();
  return <button className='button'>{t('options')}</button>;
};

const CatalogButton = ({ address, isInAllView, isInCatalogView, isInSubscriptionsView }: BoardButtonsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const link = isInAllView ? `/p/all/catalog` : isInSubscriptionsView ? `/p/subscriptions/catalog` : isInCatalogView ? `/p/${address}` : `/p/${address}/catalog`;

  return <button className='button'>{isInCatalogView ? <span onClick={() => navigate(-1)}>{t('return')}</span> : <Link to={link}>{t('catalog')}</Link>}</button>;
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
  const params = useParams();
  const location = useLocation();
  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;
  const isInPostView = isPostPageView(location.pathname, params);
  const isInCatalogView = isCatalogView(location.pathname);
  const isInPendingPostPage = isPendingPostView(location.pathname, params);

  return (
    <div className={styles.mobileBoardButtons}>
      {isInPostView || isInPendingPostPage ? (
        <div className={styles.mobilePostPageButtons}>
          <ReturnButton address={subplebbitAddress} />
          <CatalogButton address={subplebbitAddress} />
          <BottomButton />
          <div className={styles.mobilePostPageButtonsSecondRow}>
            <OptionsButton />
            <SubscribeButton address={subplebbitAddress} />
          </div>
        </div>
      ) : (
        <>
          <OptionsButton />
          <CatalogButton address={subplebbitAddress} isInCatalogView={isInCatalogView} />
          <SubscribeButton address={subplebbitAddress} />
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
          [<ReturnButton address={subplebbitAddress} />] [<CatalogButton address={subplebbitAddress} />] [<BottomButton />] [
          <OptionsButton />]
          <span className={styles.subscribeButton}>
            [<SubscribeButton address={subplebbitAddress} />]
          </span>
        </>
      ) : (
        <>
          [<OptionsButton />] [
          <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInCatalogView={isInCatalogView} isInSubscriptionsView={isInSubscriptionsView} />]
          {!(isInAllView || isInSubscriptionsView) && (
            <span className={styles.subscribeButton}>
              [<SubscribeButton address={subplebbitAddress} />]
            </span>
          )}
        </>
      )}
    </div>
  );
};
