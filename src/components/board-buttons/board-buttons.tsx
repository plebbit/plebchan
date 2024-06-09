import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAccountComment, useSubscribe } from '@plebbit/plebbit-react-hooks';
import { isAllView, isCatalogView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useFeedResetStore from '../../stores/use-feed-reset-store';
import useSortingStore from '../../stores/use-sorting-store';
import useTimeFilter from '../../hooks/use-time-filter';
import styles from './board-buttons.module.css';

interface BoardButtonsProps {
  isInAllView?: boolean;
  address?: string | undefined;
  isInCatalogView?: boolean;
  isInSubscriptionsView?: boolean;
}

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

const SortOptions = () => {
  const { t } = useTranslation();
  const { sortType, setSortType } = useSortingStore();

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value as 'active' | 'new';
    setSortType(type);
  };
  return (
    <>
      {t('sort_by')}:&nbsp;
      <select value={sortType} onChange={handleSortChange}>
        <option value='active'>{t('bump_order')}</option>
        <option value='new'>{t('creation_date')}</option>
      </select>
      &nbsp;
    </>
  );
};

export const TimeFilter = ({ isInCatalogView, isTopbar = false }: { isInCatalogView: boolean; isTopbar?: boolean }) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const { timeFilterNames } = useTimeFilter();
  const selectedTimeFilterName = params.timeFilterName;

  const changeTimeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const timeFilterName = event.target.value;
    const link = isInCatalogView ? `/p/all/catalog/${timeFilterName}` : `/p/all/${timeFilterName}`;
    navigate(link);
  };

  return (
    <>
      {!isTopbar ? (
        <>
          <span className='capitalize'>{t('time_filter')}</span>:&nbsp;
        </>
      ) : (
        <> </>
      )}
      <select onChange={changeTimeFilter} className={[styles.feedName, styles.menuItem].join(' ')} value={selectedTimeFilterName}>
        {timeFilterNames.map((timeFilterName, i) => (
          <option key={timeFilterName + i} value={timeFilterName}>
            {timeFilterName}
          </option>
        ))}
      </select>
    </>
  );
};

export const MobileBoardButtons = () => {
  const params = useParams();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname);
  const isInCatalogView = isCatalogView(location.pathname, params);
  const isInPendingPostPage = isPendingPostView(location.pathname, params);
  const isInPostView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname);

  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  return (
    <div className={styles.mobileBoardButtons}>
      {isInPostView || isInPendingPostPage ? (
        <>
          <ReturnButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          <SubscribeButton address={subplebbitAddress} />
        </>
      ) : (
        <>
          {isInCatalogView ? (
            <ReturnButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          ) : (
            <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
          )}
          {!(isInAllView || isInSubscriptionsView) && <SubscribeButton address={subplebbitAddress} />}
          <RefreshButton />
          {isInCatalogView && (
            <>
              <hr />
              <div className={styles.options}>
                <TimeFilter isInCatalogView={true} />
                &nbsp;&nbsp;
                <SortOptions />
              </div>
            </>
          )}
          {(isInAllView || isInSubscriptionsView) && !isInCatalogView && (
            <>
              <hr />
              <div className={styles.options}>
                <TimeFilter isInCatalogView={false} />
              </div>
            </>
          )}
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
  const isInCatalogView = isCatalogView(location.pathname, params);
  const isInAllView = isAllView(location.pathname);
  const isInPendingPostPage = isPendingPostView(location.pathname, params);
  const isInPostView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname);

  return (
    <>
      <hr />
      <div className={styles.desktopBoardButtons}>
        {isInPostView || isInPendingPostPage ? (
          <>
            [
            <ReturnButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />
            ] [
            <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />]
            {isInPostView && (
              <span className={styles.rightSideButtons}>
                [
                <SubscribeButton address={subplebbitAddress} />]
              </span>
            )}
          </>
        ) : (
          <>
            {isInCatalogView ? (
              <>
                [
                <ReturnButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />]{' '}
              </>
            ) : (
              <>
                [
                <CatalogButton address={subplebbitAddress} isInAllView={isInAllView} isInSubscriptionsView={isInSubscriptionsView} />]{' '}
              </>
            )}
            [<RefreshButton />]
            <span className={styles.rightSideButtons}>
              {isInCatalogView && <SortOptions />}
              {!(isInAllView || isInSubscriptionsView) && (
                <>
                  [
                  <SubscribeButton address={subplebbitAddress} />]
                </>
              )}
              {(isInAllView || isInSubscriptionsView) && (
                <>
                  <TimeFilter isInCatalogView={isInCatalogView} />
                </>
              )}
            </span>
          </>
        )}
      </div>
    </>
  );
};
