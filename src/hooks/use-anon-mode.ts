import { useAccount } from '@plebbit/plebbit-react-hooks';
import useAnonModeStore from '../stores/use-anon-mode-store';
import { useCallback, useMemo } from 'react';

const useAnonMode = (postCid?: string) => {
  const { anonMode, threadSigners, setThreadSigner, setAddressSigner, getAddressSigner } = useAnonModeStore((state) => ({
    anonMode: state.anonMode,
    threadSigners: state.threadSigners,
    setThreadSigner: state.setThreadSigner,
    setAddressSigner: state.setAddressSigner,
    getAddressSigner: state.getAddressSigner,
  }));

  const threadSigner = useMemo(() => (postCid ? threadSigners[postCid] : undefined), [postCid, threadSigners]);

  const account = useAccount();

  const getNewSigner = useCallback(async () => {
    if (anonMode) {
      if (!postCid || !threadSigner) {
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
      } else {
        try {
          const signer = await account?.plebbit.createSigner({ type: 'ed25519', privateKey: threadSigner?.privateKey });
          return signer;
        } catch (error) {
          console.error('Failed to retrieve anonymous signer:', error);
        }
      }
    }
    return null;
  }, [anonMode, postCid, threadSigner, account, setThreadSigner, setAddressSigner]);

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
