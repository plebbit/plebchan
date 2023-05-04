import React from "react";
import { useSubplebbit } from "@plebbit/plebbit-react-hooks";

const BoardSubscription = ({ address }) => {

  const subplebbit = useSubplebbit({ subplebbitAddress: address });
  const isOnline = subplebbit.updatedAt > Date.now() / 1000 - 60 * 20;


  return (
    <>
      &nbsp;{address}{!isOnline && (
        <img className="disconnected" alt="offline" src="assets/offline.png" />
      )}
    </>
  );
};

export default BoardSubscription;