import { useState } from 'react';
import styles from './board-banner.module.css';

const totalBanners = 38;

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

const BoardBanner = ({ address, title }: BoardBannerProps) => {
  const displayAddress = address && address.length > 10 && !address.includes('.') ? address.slice(0, 13).concat('...') : address;
  return (
    <div className={styles.content}>
      <div className={styles.bannerCnt}>
        <ImageBanner key={address} />
      </div>
      <div className={styles.boardTitle}>{title || `p/${displayAddress}`}</div>
      <div className={styles.boardAddress}>p/{address}</div>
      <hr />
    </div>
  );
};

export default BoardBanner;
