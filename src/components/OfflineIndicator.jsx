import React from 'react';
import { useSubplebbit } from '@plebbit/plebbit-react-hooks';

const OfflineIndicator = ({ address, className, tooltipPlace }) => {
  const subplebbit = useSubplebbit({ subplebbitAddress: address });
  const isOnline = subplebbit.updatedAt > Date.now() / 1000 - 60 * 30;

  return (
    <>
      {!isOnline && (
        <>
          {' '}
          <img
            className={className}
            alt='offline'
            src='assets/offline.png'
            data-tooltip-id='tooltip'
            data-tooltip-content='Offline'
            data-tooltip-place={tooltipPlace}
            style={{ imageRendering: 'pixelated' }}
          />
        </>
      )}
    </>
  );
};

export default OfflineIndicator;
