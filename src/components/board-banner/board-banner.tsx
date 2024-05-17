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
    const cacheBuster = new Date().getTime();
    return `assets/banners/banner-${randomBannerIndex}.jpg?cacheBuster=${cacheBuster}`;
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
  const displayAddress =
    subplebbit?.address && subplebbit?.address.length > 10 && !subplebbit?.address.includes('.') ? subplebbit?.address.slice(0, 13).concat('...') : subplebbit?.address;

  const multisubMetadata = useMultisubMetadata();

  const title = isInAllView ? multisubMetadata?.title : isInSubscriptionsView ? 'Subscriptions' : subplebbit?.title;
  const subtitle = isInAllView ? 'p/all' : isInSubscriptionsView ? 'p/subscriptions' : `p/${subplebbit?.address}`;

  return (
    <div className={styles.content}>
      <div className={styles.bannerCnt}>
        <ImageBanner key={isInAllView ? 'all' : isInSubscriptionsView ? 'subscriptions' : subplebbit?.address} />
      </div>
      <div className={styles.boardTitle}>{title || `p/${displayAddress}`}</div>
      <div className={styles.boardSubtitle}>{subtitle}</div>
      <hr />
    </div>
  );
};

export default BoardBanner;
