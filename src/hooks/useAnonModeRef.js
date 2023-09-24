import { useEffect } from 'react';
import { useAccount } from '@plebbit/plebbit-react-hooks';
import useAnonModeStore from './stores/useAnonModeStore';

const useAnonModeRef = (threadCidRef, execute) => {
  const account = useAccount();
  const { anonymousMode } = useAnonModeStore();

  useEffect(() => {
    const handleAnonMode = async () => {
      let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};

      if (!anonymousMode) {
        if (execute && storedSigners[threadCidRef]) {
          const signerPrivateKey = storedSigners[threadCidRef];
          if (account) {
            await account.plebbit.createSigner({ type: 'ed25519', privateKey: signerPrivateKey });
          }
        }
      }
    };

    handleAnonMode();
  }, [threadCidRef, execute, account, anonymousMode]);

  return;
};
export default useAnonModeRef;
