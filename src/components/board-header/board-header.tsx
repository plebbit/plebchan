import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAccountComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import styles from './board-header.module.css';
import { useMultisubMetadata } from '../../hooks/use-default-subplebbits';
import useIsMobile from '../../hooks/use-is-mobile';
import useIsSubplebbitOffline from '../../hooks/use-is-subplebbit-offline';

const totalBanners = 60;

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
  const isInAllView = isAllView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { address, shortAddress } = subplebbit || {};

  const multisubMetadata = useMultisubMetadata();
  const title = isInAllView ? multisubMetadata?.title || 'all' : isInSubscriptionsView ? 'Subscriptions' : subplebbit?.title;
  const subtitle = isInAllView ? 'p/all' : isInSubscriptionsView ? 'p/subscriptions' : `p/${address}`;

  const { isOffline, isDefinitelyOffline, offlineTitle } = useIsSubplebbitOffline(subplebbit);
  const iconClass = `${styles.offlineIcon} ${isDefinitelyOffline ? styles.redOfflineIcon : ''}`;

  return (
    <div className={styles.content}>
      {!useIsMobile() && (
        <div className={styles.bannerCnt}>
          <ImageBanner key={isInAllView ? 'all' : isInSubscriptionsView ? 'subscriptions' : address} />
        </div>
      )}
      <div className={styles.boardTitle}>
        {title || `p/${shortAddress || subplebbitAddress}`}
        {isOffline && <span className={`${styles.offlineIcon} ${iconClass}`} title={offlineTitle} />}
      </div>
      <div className={styles.boardSubtitle}>{subtitle}</div>
      <hr />
    </div>
  );
};

export default BoardHeader;
