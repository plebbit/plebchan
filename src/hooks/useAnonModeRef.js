import { useEffect } from "react";
import { setActiveAccount, useAccount } from "@plebbit/plebbit-react-hooks";
import useAnonModeStore from "./stores/useAnonModeStore";

const useAnonModeRef = (threadCidRef, execute) => {
  const account = useAccount();
  const { anonymousMode } = useAnonModeStore();

  useEffect(() => {
    const handleAnonMode = async () => {
      let storedSigners = JSON.parse(localStorage.getItem('storedSigners')) || {};

      if (!anonymousMode) return;

      if (!storedSigners[threadCidRef] && execute) {
        const signer = await account?.plebbit.createSigner();
        storedSigners[threadCidRef] = signer.privateKey;

        localStorage.setItem('storedSigners', JSON.stringify(storedSigners));
      } else {
        const signerPrivateKey = storedSigners[threadCidRef];
        const signer = await account?.plebbit.createSigner({privateKey: signerPrivateKey});
        await setActiveAccount(account, {signer});
      }
    }

    handleAnonMode();
  }, [threadCidRef, execute, account, anonymousMode]);

  return;
}
export default useAnonModeRef;