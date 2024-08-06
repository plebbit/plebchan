import { useAccount } from '@plebbit/plebbit-react-hooks';
import useAnonModeStore from '../stores/use-anon-mode-store';

const useAnonMode = (postCid?: string) => {
  const { anonMode, threadSigners, setThreadSigner, setAddressSigner, getAddressSigner } = useAnonModeStore((state) => ({
    anonMode: state.anonMode,
    threadSigners: state.threadSigners,
    setThreadSigner: state.setThreadSigner,
    setAddressSigner: state.setAddressSigner,
    getAddressSigner: state.getAddressSigner,
  }));

  const threadSigner = postCid ? threadSigners[postCid] : undefined;

  const account = useAccount();

  const getNewSigner = async () => {
    if (anonMode) {
      if (!postCid || !threadSigner) {
        try {
          const signer = await account?.plebbit.createSigner();
          if (signer) {
            if (postCid) {
              setThreadSigner(postCid, { privateKey: signer.privateKey, address: signer.address });
            } else {
              setAddressSigner({ privateKey: signer.privateKey, address: signer.address });
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
  };

  const getExistingSigner = (address: string) => {
    return getAddressSigner(address);
  };

  return { anonMode, getNewSigner, getExistingSigner };
};

export default useAnonMode;
