import { useEffect, useMemo } from 'react';
import { useAccount, useSubplebbits } from '@plebbit/plebbit-react-hooks';
import { create } from 'zustand';

const useSubplebbitsStats = (options: any) => {
  const { subplebbitAddresses, accountName } = options || {};
  const account = useAccount({ accountName });
  const { subplebbits } = useSubplebbits({ subplebbitAddresses });

  const { setSubplebbitStats, subplebbitsStats } = useSubplebbitsStatsStore();

  useEffect(() => {
    if (!subplebbitAddresses || subplebbitAddresses.length === 0 || !account) {
      return;
    }

    subplebbits.forEach((subplebbit) => {
      if (subplebbit && subplebbit.statsCid && !subplebbitsStats[subplebbit.address]) {
        account.plebbit
          .fetchCid(subplebbit.statsCid)
          .then((fetchedStats: any) => {
            setSubplebbitStats(subplebbit.address, JSON.parse(fetchedStats));
          })
          .catch((error: any) => {
            console.error('Fetching subplebbit stats failed', { subplebbitAddress: subplebbit.address, error });
          });
      }
    });
  }, [account, subplebbits, setSubplebbitStats, subplebbitsStats, subplebbitAddresses]);

  return useMemo(() => {
    return subplebbitAddresses.reduce((acc: any, address: any) => {
      acc[address] = subplebbitsStats[address] || { loading: true };
      return acc;
    }, {});
  }, [subplebbitsStats, subplebbitAddresses]);
};

export type SubplebbitsStatsState = {
  subplebbitsStats: { [subplebbitAddress: string]: any };
  setSubplebbitStats: Function;
};

const useSubplebbitsStatsStore = create<SubplebbitsStatsState>((set) => ({
  subplebbitsStats: {},
  setSubplebbitStats: (subplebbitAddress: string, subplebbitStats: any) =>
    set((state) => ({
      subplebbitsStats: { ...state.subplebbitsStats, [subplebbitAddress]: subplebbitStats },
    })),
}));

export default useSubplebbitsStats;
