import { useEffect } from 'react';
import { useAccount } from '@plebbit/plebbit-react-hooks';
import useAnonModeStore from './stores/useAnonModeStore';

const useAnonMode = (threadCid, execute) => {
  const account = useAccount();
  const { anonymousMode } = useAnonModeStore();

  useEffect(() => {
    const handleAnonMode = async () => {
      let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};

      if (!anonymousMode) {
        if (execute && storedSigners[threadCid]) {
          const signerPrivateKey = storedSigners[threadCid];
          if (account) {
            await account.plebbit.createSigner({ type: 'ed25519', privateKey: signerPrivateKey });
          }
        }
      }
    };

    handleAnonMode();
  }, [threadCid, execute, account, anonymousMode]);

  return;
};

export default useAnonMode;
