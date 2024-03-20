import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSubplebbit } from '@plebbit/plebbit-react-hooks';
import styles from './board-banner.module.css';

const totalBanners = 25;

const ImageBanner = () => {
  const [imagePath] = useState(() => {
    const randomBannerIndex = Math.floor(Math.random() * totalBanners) + 1;
    return `assets/banners/banner-${randomBannerIndex}.jpg`;
  });

  return <img src={imagePath} alt='banner' />;
};

const BoardBanner = () => {
  const { subplebbitAddress } = useParams();
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { address, title } = subplebbit || {};

  return (
    <div className={styles.content}>
      <div className={styles.bannerCnt}>
        <ImageBanner key={subplebbitAddress} />
      </div>
      <div className={styles.boardTitle}>{title || `p/${address}`}</div>
      {title && <div className={styles.boardAddress}>p/{address}</div>}
      <hr />
    </div>
  );
};

export default BoardBanner;
