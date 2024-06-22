import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeLogo } from '../home';
import styles from './not-found.module.css';
import { useSubplebbit } from '@plebbit/plebbit-react-hooks';

const totalNotFoundImages = 2;

const NotFoundImage = () => {
  const [imagePath] = useState(() => {
    const randomBannerIndex = Math.floor(Math.random() * totalNotFoundImages) + 1;
    return `assets/not-found/not-found-${randomBannerIndex}.jpg`;
  });

  return <img src={imagePath} alt='' />;
};

const NotFound = () => {
  const location = useLocation();
  const subplebbitAddress = location.pathname.startsWith('/p/') ? location.pathname.split('/')[2] : '';
  const subplebbit = useSubplebbit({ subplebbitAddress });
  const { address, shortAddress } = subplebbit || {};

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <HomeLogo />
        <div className={styles.boxOuter}>
          <div className={styles.boxInner}>
            <div className={styles.boxBar}>
              <h2>404 Not Found</h2>
            </div>
            <div className={styles.boxContent}>
              <NotFoundImage />
              {address && (
                <>
                  <br />
                  <div className={styles.backToBoard}>
                    [<Link to={`/p/${subplebbitAddress}`}>Back to p/{shortAddress}</Link>]
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
