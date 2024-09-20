import { useAccount } from '@plebbit/plebbit-react-hooks';
import useAnonModeStore from '../stores/use-anon-mode-store';
import { useCallback } from 'react';

const useAnonMode = (postCid?: string) => {
  const { anonMode, getThreadSigner, setThreadSigner, setAddressSigner, getAddressSigner } = useAnonModeStore((state) => ({
    anonMode: state.anonMode,
    getThreadSigner: state.getThreadSigner,
    setThreadSigner: state.setThreadSigner,
    setAddressSigner: state.setAddressSigner,
    getAddressSigner: state.getAddressSigner,
  }));

  const account = useAccount();

  const getNewSigner = useCallback(async () => {
    if (anonMode) {
      if (postCid) {
        const existingSigner = getThreadSigner(postCid);
        if (existingSigner) {
          return existingSigner;
        }
      }
      try {
        const signer = await account?.plebbit.createSigner();
        if (signer) {
          if (postCid) {
            setThreadSigner(postCid, signer);
          } else {
            setAddressSigner(signer);
          }
        }
        return signer;
      } catch (error) {
        console.error('Failed to create anonymous signer:', error);
      }
    }
    return null;
  }, [anonMode, postCid, account, getThreadSigner, setThreadSigner, setAddressSigner]);

  const getExistingSigner = useCallback(
    (address: string) => {
      const signer = getAddressSigner(address);
      return signer;
    },
    [getAddressSigner],
  );

  return { anonMode, getNewSigner, getExistingSigner };
};

export default useAnonMode;
