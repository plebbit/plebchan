import React, { useEffect, useState } from 'react';
import { useSubplebbit } from '@plebbit/plebbit-react-hooks';

const BoardAvatar = ({ address }) => {
  const [avatarUrl, setAvatarUrl] = useState('assets/plebchan.png');
  const subplebbit = useSubplebbit({ subplebbitAddress: address });

  useEffect(() => {
    if (subplebbit.suggested?.avatarUrl) {
      setAvatarUrl(subplebbit.suggested?.avatarUrl);
    }
  }, [subplebbit.suggested?.avatarUrl, subplebbit]);

  return <img className='board-avatar' alt='board avatar' src={avatarUrl} />;
};

export default BoardAvatar;
