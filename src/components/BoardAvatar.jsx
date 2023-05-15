import React, { useEffect, useState } from "react";
import { useSubplebbit } from "@plebbit/plebbit-react-hooks";


const BoardAvatar = ({ address }) => {
  const [avatarUrl, setAvatarUrl] = useState("assets/plebchan.png");
  const subplebbit = useSubplebbit({ subplebbitAddress: address });

  const isOnline = subplebbit.updatedAt > Date.now() / 1000 - 60 * 20;

  useEffect(() => {
    if (subplebbit.suggested?.avatarUrl) {
      setAvatarUrl(subplebbit.suggested.avatarUrl);
    }
  }, [subplebbit.suggested?.avatarUrl, subplebbit]);

  return (
    <img
      className="board-avatar"
      alt="board logo"
      src={avatarUrl}
    />
  );
};

export default BoardAvatar;