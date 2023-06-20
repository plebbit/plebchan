import { useEffect } from "react";
import { createAccount, setActiveAccount, useAccounts } from "@plebbit/plebbit-react-hooks";
import useAnonModeStore from "./stores/useAnonModeStore";

const useAnonMode = (threadCid, execute) => {
  const { accounts } = useAccounts();
  const { anonymousMode } = useAnonModeStore();

  useEffect(() => {
    const handleAnonMode = async () => {
      let storedAccounts = JSON.parse(localStorage.getItem('storedAccounts')) || {};

      if (!anonymousMode) return;

      if (!storedAccounts[threadCid] && execute) {
        await createAccount();

        if(accounts.length === 0) {
          console.log("No accounts available");
          return;
        }
        
        const lastAccount = accounts[accounts.length - 1];
        await setActiveAccount(lastAccount.name);
        storedAccounts[threadCid] = lastAccount.name;

        localStorage.setItem('storedAccounts', JSON.stringify(storedAccounts));
      } else {
        await setActiveAccount(storedAccounts[threadCid]);
      }
    }

    handleAnonMode();
  }, [threadCid, execute, accounts, anonymousMode]);

  return;
}
export default useAnonMode;