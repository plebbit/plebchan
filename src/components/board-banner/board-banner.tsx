import { useParams } from 'react-router-dom';
import { useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { useState } from 'react';
import styles from './board-banner.module.css';

const totalBanners = 46;

const ImageBanner = () => {
  const [imagePath] = useState(() => {
    const randomBannerIndex = Math.floor(Math.random() * totalBanners) + 1;
    return `assets/banners/banner-${randomBannerIndex}.jpg`;
  });

  return <img src={imagePath} alt='banner' />;
};

const BoardBanner = () => {
  const { subplebbitAddress } = useParams<{ subplebbitAddress: string }>();
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { address, title } = subplebbit || {};
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
