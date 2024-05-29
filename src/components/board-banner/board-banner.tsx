import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAccountComment, useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { isAllView, isSubscriptionsView } from '../../lib/utils/view-utils';
import styles from './board-banner.module.css';
import { useMultisubMetadata } from '../../hooks/use-default-subplebbits';

const totalBanners = 57;

const ImageBanner = () => {
  const [imagePath] = useState(() => {
    const randomBannerIndex = Math.floor(Math.random() * totalBanners) + 1;
    return `/assets/banners/banner-${randomBannerIndex}.jpg`;
  });

  return <img src={imagePath} alt='' />;
};

const BoardBanner = () => {
  const location = useLocation();
  const params = useParams();

  const isInAllView = isAllView(location.pathname);
  const isInSubscriptionsView = isSubscriptionsView(location.pathname);

  const accountComment = useAccountComment({ commentIndex: params?.accountCommentIndex as any });
  const subplebbitAddress = params?.subplebbitAddress || accountComment?.subplebbitAddress;

  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { address, shortAddress } = subplebbit || {};

  const multisubMetadata = useMultisubMetadata();

  const title = isInAllView ? multisubMetadata?.title : isInSubscriptionsView ? 'Subscriptions' : subplebbit?.title;
  const subtitle = isInAllView ? 'p/all' : isInSubscriptionsView ? 'p/subscriptions' : `p/${address}`;

  return (
    <div className={styles.content}>
      <div className={styles.bannerCnt}>
        <ImageBanner key={isInAllView ? 'all' : isInSubscriptionsView ? 'subscriptions' : address} />
      </div>
      <div className={styles.boardTitle}>{title || `p/${shortAddress}`}</div>
      <div className={styles.boardSubtitle}>{subtitle}</div>
      <hr />
    </div>
  );
};

export default BoardBanner;
