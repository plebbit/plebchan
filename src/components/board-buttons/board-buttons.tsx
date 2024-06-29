import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAccountComment, useSubscribe } from '@plebbit/plebbit-react-hooks';
import { isAllView, isCatalogView, isPendingPostView, isPostPageView, isSubscriptionsView } from '../../lib/utils/view-utils';
import useCatalogStyleStore from '../../stores/use-catalog-style-store';
import useFeedResetStore from '../../stores/use-feed-reset-store';
import useSortingStore from '../../stores/use-sorting-store';
import useTimeFilter from '../../hooks/use-time-filter';
import CatalogFilters from '../../views/catalog/catalog-filters/';
import styles from './board-buttons.module.css';

interface BoardButtonsProps {
  address?: string | undefined;
  isInAllView?: boolean;
  isInCatalogView?: boolean;
  isInSubscriptionsView?: boolean;
  isTopbar?: boolean;
}

const CatalogButton = ({ address, isInAllView, isInSubscriptionsView }: BoardButtonsProps) => {
  const { t } = useTranslation();
  const params = useParams();

  const createCatalogLink = () => {
    if (isInAllView) {
      if (params?.timeFilterName) return `/p/all/catalog/${params.timeFilterName}`;
      return `/p/all/catalog`;
    } else if (isInSubscriptionsView) {
      if (params?.timeFilterName) return `/p/subscriptions/catalog/${params.timeFilterName}`;
      return `/p/subscriptions/catalog`;
    }
    return `/p/${address}/catalog`;
  };

  return (
    <button className='button'>
      <Link to={createCatalogLink()}>{t('catalog')}</Link>
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
  const params = useParams();

  const createReturnLink = () => {
    if (isInAllView) {
      if (params?.timeFilterName) return `/p/all/${params.timeFilterName}`;
      return `/p/all`;
    } else if (isInSubscriptionsView) {
      if (params?.timeFilterName) return `/p/subscriptions/${params.timeFilterName}`;
      return `/p/subscriptions`;
    }
    return `/p/${address}`;
  };

  return (
    <button className='button'>
      <Link to={createReturnLink()}>{t('return')}</Link>
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
      <span className='capitalize'>{t('sort_by')}</span>:&nbsp;
      <select className='capitalize' value={sortType} onChange={handleSortChange}>
        <option value='active'>{t('bump_order')}</option>
        <option value='new'>{t('creation_date')}</option>
      </select>
    </>
  );
};

const ImageSizeOptions = () => {
  const { t } = useTranslation();
  const { imageSize, setImageSize } = useCatalogStyleStore();

  return (
    <>
      <span className='capitalize'>{t('image_size')}:</span>&nbsp;
      <select className='capitalize' value={imageSize} onChange={(e) => setImageSize(e.target.value as 'Small' | 'Large')}>
        <option value='Small'>{t('small')}</option>
        <option value='Large'>{t('large')}</option>
      </select>
    </>
  );
};

const ShowOPCommentOption = () => {
  const { t } = useTranslation();
  const { showOPComment, setShowOPComment } = useCatalogStyleStore();

  return (
    <>
      <span className='capitalize'>{t('show_op_comment')}:</span>&nbsp;
      <select className='capitalize' value={showOPComment ? 'On' : 'Off'} onChange={(e) => setShowOPComment(e.target.value === 'On')}>
        <option value='Off'>{t('off')}</option>
        <option value='On'>{t('on')}</option>
      </select>
    </>
  );
};

export const TimeFilter = ({ isInAllView, isInCatalogView, isInSubscriptionsView, isTopbar = false }: BoardButtonsProps) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const { timeFilterNames } = useTimeFilter();
  const selectedTimeFilterName = params.timeFilterName;

  const changeTimeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const timeFilterName = event.target.value;
    const link = isInAllView
      ? isInCatalogView
        ? `/p/all/catalog/${timeFilterName}`
        : `/p/all/${timeFilterName}`
      : isInSubscriptionsView
      ? isInCatalogView
        ? `/p/subscriptions/catalog/${timeFilterName}`
        : `/p/subscriptions/${timeFilterName}`
      : null;
    link && navigate(link);
  };

  return (
    <>
      {!isTopbar ? (
        <>
          <span className='capitalize'>{t('newer_than')}</span>:&nbsp;
        </>
      ) : (
        <> </>
      )}
      <select onChange={changeTimeFilter} className={[styles.feedName, styles.menuItem, 'capitalize'].join(' ')} value={selectedTimeFilterName}>
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
  const isInAllView = isAllView(location.pathname, params);
  const isInCatalogView = isCatalogView(location.pathname, params);
  const isInPendingPostPage = isPendingPostView(location.pathname, params);
  const isInPostView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  return (
    <div className={styles.mobileBoardButtons}>
      <div className={styles.adButton}>
        [
        <Link
          to='/boards'
          onClick={(e) => {
            e.preventDefault();
            alert('work in progress');
          }}
        >
          Vote for Boards
        </Link>
        ]
      </div>
      <hr />
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
                <div>
                  <SortOptions /> <ImageSizeOptions />
                </div>
                <div className={styles.mobileCatalogOptionsPadding}>
                  <ShowOPCommentOption /> <CatalogFilters />
                </div>
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
  const isInAllView = isAllView(location.pathname, params);
  const isInPendingPostPage = isPendingPostView(location.pathname, params);
  const isInPostView = isPostPageView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  return (
    <>
      <hr />
      <div className={styles.adButton}>
        [
        <Link
          to='/boards'
          onClick={(e) => {
            e.preventDefault();
            alert('work in progress');
          }}
        >
          Vote for Boards
        </Link>
        ]
      </div>
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
              {isInCatalogView && (
                <>
                  <SortOptions />
                  <ImageSizeOptions />
                  <ShowOPCommentOption />
                </>
              )}
              {(isInAllView || isInSubscriptionsView) && (
                <TimeFilter isInAllView={isInAllView} isInCatalogView={isInCatalogView} isInSubscriptionsView={isInSubscriptionsView} />
              )}
              {(isInCatalogView || isInAllView || isInSubscriptionsView) && (
                <>
                  [
                  <CatalogFilters />]
                </>
              )}{' '}
              {!(isInAllView || isInSubscriptionsView) && (
                <>
                  [
                  <SubscribeButton address={subplebbitAddress} />]
                </>
              )}
            </span>
          </>
        )}
      </div>
    </>
  );
};
