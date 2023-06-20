import { useEffect } from "react";
import { createAccount, setActiveAccount, useAccounts } from "@plebbit/plebbit-react-hooks";
import useAnonModeStore from "./stores/useAnonModeStore";

const useAnonModeRef = (threadCidRef, execute) => {
  const {accounts} = useAccounts();
  const { anonymousMode } = useAnonModeStore();

  useEffect(() => {
    const handleAnonMode = async () => {
      let storedAccounts = JSON.parse(localStorage.getItem('storedAccounts')) || {};

      if (!anonymousMode) return;

      if (!storedAccounts[threadCidRef.current] && execute) {
        await createAccount();
        const lastAccount = accounts[accounts.length - 1];
        await setActiveAccount(lastAccount.name);
        storedAccounts[threadCidRef.current] = lastAccount.name;

        localStorage.setItem('storedAccounts', JSON.stringify(storedAccounts));
      } else {
        await setActiveAccount(storedAccounts[threadCidRef.current]);
      }
    }

    handleAnonMode();
  }, [threadCidRef, execute, accounts, anonymousMode]);

  return;
}
export default useAnonModeRef;