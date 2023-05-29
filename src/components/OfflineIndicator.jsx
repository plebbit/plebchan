import React from "react";
import { useSubplebbit } from "@plebbit/plebbit-react-hooks";

const OfflineIndicator = ({ address, className, tooltipPlace, isText }) => {
  const subplebbit = useSubplebbit({ subplebbitAddress: address });
  const isOnline = subplebbit.updatedAt > Date.now() / 1000 - 60 * 20;

  return (
    <>
      {!isOnline && (
        <>
          {isText ? (
            <span
              className={className}
            >
              (OFFLINE)
            </span>
          ) : (
            <img
              className={className}
              alt="offline"
              src="assets/offline.png"
              data-tooltip-id="tooltip"
              data-tooltip-content="Offline"
              data-tooltip-place={tooltipPlace}
            />
          )}
        </>
      )}
    </>
  );
};

export default OfflineIndicator;