import { useEffect } from "react";
import { createAccount, setActiveAccount, useAccounts } from "@plebbit/plebbit-react-hooks";

const useAnonMode = (threadCid, execute) => {
  const {accounts} = useAccounts();

  useEffect(() => {
    const handleAnonMode = async () => {
      let storedAccounts = JSON.parse(localStorage.getItem('storedAccounts')) || {};

      if (!storedAccounts[threadCid] && execute) {
        await createAccount();
        const lastAccount = accounts[accounts.length - 1];
        await setActiveAccount(lastAccount.name);
        storedAccounts[threadCid] = lastAccount.name;

        localStorage.setItem('storedAccounts', JSON.stringify(storedAccounts));
      } else {
        await setActiveAccount(storedAccounts[threadCid]);
      }
    }

    handleAnonMode();
  }, [threadCid, execute, accounts]);

  return;
}
export default useAnonMode;