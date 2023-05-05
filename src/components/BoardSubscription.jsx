import React from "react";
import { useSubplebbit } from "@plebbit/plebbit-react-hooks";
import { Tooltip } from 'react-tooltip';


const BoardSubscription = ({ address }) => {
  const subplebbit = useSubplebbit({ subplebbitAddress: address });
  const isOnline = subplebbit.updatedAt > Date.now() / 1000 - 60 * 20;

  return (
    <>
      {address}&nbsp;{!isOnline && (
        <img className="disconnected" alt="offline" src="assets/offline.png"
        data-tooltip-id="tooltip"
        data-tooltip-content="OFFLINE"
        data-tooltip-place="top" />
      )}
    </>
  );
};

export default BoardSubscription;