import React from "react";
import { useSubplebbit } from "@plebbit/plebbit-react-hooks";


const OfflineIndicator = ({ address, className, tooltipPlace }) => {
  const subplebbit = useSubplebbit({ subplebbitAddress: address });
  const isOnline = subplebbit.updatedAt > Date.now() / 1000 - 60 * 20;

  return (
    <>
      {!isOnline && (
        <>
          {" "}
          <img
            className={className}
            alt="offline"
            src="assets/offline.png"
            data-tooltip-id="tooltip"
            data-tooltip-content="OFFLINE"
            data-tooltip-place={tooltipPlace}
          />
        </>
      )}
    </>
  );
};

export default OfflineIndicator;