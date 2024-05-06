import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HomeLogo } from '../home';
import styles from './not-found.module.css';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';

const totalNotFoundImages = 2;

const NotFoundImage = () => {
  const [imagePath] = useState(() => {
    const randomBannerIndex = Math.floor(Math.random() * totalNotFoundImages) + 1;
    return `assets/not-found/not-found-${randomBannerIndex}.jpg`;
  });

  return <img src={imagePath} alt='' />;
};

const NotFound = () => {
  const { subplebbitAddress } = useParams();

  return (
    <div className={styles.content}>
      <HomeLogo />
      <div className={styles.boxOuter}>
        <div className={styles.boxInner}>
          <div className={styles.boxBar}>
            <h2>404 Not Found</h2>
          </div>
          <div className={styles.boxContent}>
            <NotFoundImage />
            {subplebbitAddress && (
              <>
                <br />
                <div className={styles.backToBoard}>
                  [<Link to={`/p/${subplebbitAddress}`}>Back to p/{Plebbit.getShortAddress(subplebbitAddress)}</Link>]
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
