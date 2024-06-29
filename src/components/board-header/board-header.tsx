import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccountComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { getFormattedTimeAgo } from '../../lib/utils/time-utils';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import styles from './board-header.module.css';
import { useMultisubMetadata } from '../../hooks/use-default-subplebbits';

const totalBanners = 59;

const ImageBanner = () => {
  const [imagePath] = useState(() => {
    const randomBannerIndex = Math.floor(Math.random() * totalBanners) + 1;
    return `assets/banners/banner-${randomBannerIndex}.jpg`;
  });

  return <img src={imagePath} alt='' />;
};

const BoardHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();

  const isInAllView = isAllView(location.pathname, params);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname, useParams());

  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { address, shortAddress, updatedAt } = subplebbit || {};

  const multisubMetadata = useMultisubMetadata();

  const title = isInAllView ? multisubMetadata?.title || 'all' : isInSubscriptionsView ? 'Subscriptions' : subplebbit?.title;
  const subtitle = isInAllView ? 'p/all' : isInSubscriptionsView ? 'p/subscriptions' : `p/${address}`;

  const isBoardOffline = updatedAt && updatedAt < Date.now() / 1000 - 60 * 60;

  const offlineMessage = updatedAt
    ? isBoardOffline && t('posts_last_synced_info', { time: getFormattedTimeAgo(updatedAt), interpolation: { escapeValue: false } })
    : t('subplebbit_offline_info');

  return (
    <div className={styles.content}>
      <div className={styles.bannerCnt}>
        <ImageBanner key={isInAllView ? 'all' : isInSubscriptionsView ? 'subscriptions' : address} />
      </div>
      <div className={styles.boardTitle}>
        {title || `p/${shortAddress || subplebbitAddress}`}
        {isBoardOffline && <span className={styles.offlineIcon} title={offlineMessage} />}
      </div>
      <div className={styles.boardSubtitle}>{subtitle}</div>
      <hr />
    </div>
  );
};

export default BoardHeader;
