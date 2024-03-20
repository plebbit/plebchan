import { useState } from 'react';
import styles from './board-banner.module.css';

const totalBanners = 25;

const ImageBanner = () => {
  const [imagePath] = useState(() => {
    const randomBannerIndex = Math.floor(Math.random() * totalBanners) + 1;
    return `assets/banners/banner-${randomBannerIndex}.jpg`;
  });

  return <img src={imagePath} alt='banner' />;
};

interface BoardBannerProps {
  title: string | undefined;
  address: string | undefined;
}

const BoardBanner = ({ title, address }: BoardBannerProps) => {
  return (
    <div className={styles.content}>
      <div className={styles.bannerCnt}>
        <ImageBanner key={address} />
      </div>
      <div className={styles.boardTitle}>{title || `p/${address}`}</div>
      {title && <div className={styles.boardAddress}>p/{address}</div>}
      <hr />
    </div>
  );
};

export default BoardBanner;
