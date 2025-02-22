import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAccountComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import styles from './board-header.module.css';
import { useMultisubMetadata } from '../../hooks/use-default-subplebbits';
import useIsMobile from '../../hooks/use-is-mobile';
import useIsSubplebbitOffline from '../../hooks/use-is-subplebbit-offline';
import { shouldShowSnow } from '../../lib/snow';
import Tooltip from '../tooltip';

const totalBanners = 61;

const ImageBanner = () => {
  const [imagePath] = useState(() => {
    const randomBannerIndex = Math.floor(Math.random() * totalBanners) + 1;
    return `assets/banners/banner-${randomBannerIndex}.jpg`;
  });

  return <img src={imagePath} alt='' />;
};

const BoardHeader = () => {
  const location = useLocation();
  const params = useParams();
  const isInAllView = isAllView(location.pathname);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { address, shortAddress } = subplebbit || {};

  const multisubMetadata = useMultisubMetadata();
  const title = isInAllView ? multisubMetadata?.title || 'all' : isInSubscriptionsView ? 'Subscriptions' : subplebbit?.title;
  const subtitle = isInAllView ? 'p/all' : isInSubscriptionsView ? 'p/subscriptions' : `p/${address}`;

  const { isOffline, isOnlineStatusLoading, offlineIconClass, offlineTitle } = useIsSubplebbitOffline(subplebbit);

  return (
    <div className={`${styles.content} ${shouldShowSnow() ? styles.garland : ''}`}>
      {!useIsMobile() && (
        <div className={styles.bannerCnt}>
          <ImageBanner key={isInAllView ? 'all' : isInSubscriptionsView ? 'subscriptions' : address} />
        </div>
      )}
      <div className={styles.boardTitle}>
        {title || (shortAddress ? (shortAddress.endsWith('.eth') || shortAddress.endsWith('.sol') ? shortAddress.slice(0, -4) : shortAddress) : subplebbitAddress)}
        {(isOffline || isOnlineStatusLoading) && !isInAllView && !isInSubscriptionsView && (
          <span className={styles.offlineIconWrapper}>
            <Tooltip content={offlineTitle}>
              <span className={`${styles.offlineIcon} ${offlineIconClass}`} />
            </Tooltip>
          </span>
        )}
      </div>
      <div className={styles.boardSubtitle}>{subtitle}</div>
      <hr />
    </div>
  );
};

export default BoardHeader;
