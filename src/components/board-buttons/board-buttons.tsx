import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAccountComment, useSubscribe } from '@plebbit/plebbit-react-hooks';
import styles from './board-buttons.module.css';
import { isAllView, isCatalogView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useBlockedComments from '../../hooks/use-blocked-comments';
import useBlockedCommentsStore from '../../stores/useBlockedCommentsStore';

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

const CatalogButton = ({ address, isInAllView, isInCatalogView }: BoardButtonsProps) => {
  const { t } = useTranslation();

  return (
    <button className='button'>
      {isInCatalogView ? (
        <Link to={isInAllView ? '/p/all' : `/p/${address}`}>{t('return')}</Link>
      ) : (
        <Link to={isInAllView ? `/p/all/catalog` : `/p/${address}/catalog`}>{t('catalog')}</Link>
      )}
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
        <div className={styles.mobilePostPageButtons}>
          <ReturnButton address={subplebbitAddress} />
          <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} />
          <BottomButton />
          <div className={styles.mobilePostPageButtonsSecondRow}>
            <OptionsButton />
            <SubscribeButton address={subplebbitAddress} />
          </div>
        </div>
      ) : (
        <>
          <OptionsButton />
          <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInCatalogView={isInCatalogView} isInSubscriptionsView={isInSubscriptionsView} />
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

  const { showBlockedComments, setShowBlockedComments } = useBlockedCommentsStore();
  const blockedComments = useBlockedComments(params?.subplebbitAddress);

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
          {blockedComments?.length > 0 && (
            <span className={styles.blockedAddresses}>
              {' '}
              — Hidden threads: <strong>{blockedComments.length}</strong> [
              <span className={styles.showBlockedButton} onClick={() => setShowBlockedComments(!showBlockedComments)}>
                {showBlockedComments ? 'Back' : 'Show'}
              </span>
              ]
            </span>
          )}
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
