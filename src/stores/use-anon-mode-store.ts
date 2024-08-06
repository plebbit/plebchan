import { create } from 'zustand';
import localForageLru from '@plebbit/plebbit-react-hooks/dist/lib/localforage-lru/index.js';

interface AnonModeState {
  anonMode: boolean;
  threadSigners: { [key: string]: { privateKey: string; address: string } };
  addressSigners: { [address: string]: { privateKey: string; address: string } };
  setAnonMode: (mode: boolean) => void;
  setThreadSigner: (postCid: string, signer: { privateKey: string; address: string }) => void;
  getThreadSigner: (postCid: string) => { privateKey: string; address: string } | undefined;
  setAddressSigner: (signer: { privateKey: string; address: string }) => void;
  getAddressSigner: (address: string) => { privateKey: string; address: string } | undefined;
}

const anonModeStore = localForageLru.createInstance({
  name: 'anonModeStore',
  size: 1000,
});

const useAnonModeStore = create<AnonModeState>((set, get) => ({
  anonMode: true,
  threadSigners: {},
  addressSigners: {},
  setAnonMode: (mode: boolean) => set({ anonMode: mode }),
  setThreadSigner: (postCid: string, signer: { privateKey: string; address: string }) => {
    set((state) => ({
      threadSigners: { ...state.threadSigners, [postCid]: signer },
    }));
    anonModeStore.setItem(postCid, signer);
  },
  getThreadSigner: (postCid: string) => get().threadSigners[postCid],
  setAddressSigner: (signer: { privateKey: string; address: string }) => {
    set((state) => ({
      addressSigners: { ...state.addressSigners, [signer.address]: signer },
    }));
    anonModeStore.setItem(signer.address, signer);
  },
  getAddressSigner: (address: string) => get().addressSigners[address],
}));

const initializeAnonModeStore = async () => {
  const entries: [string, { privateKey: string; address: string }][] = await anonModeStore.entries();
  const threadSigners: { [key: string]: { privateKey: string; address: string } } = {};
  const addressSigners: { [key: string]: { privateKey: string; address: string } } = {};
  entries.forEach(([key, value]) => {
    if (value.address) {
      addressSigners[value.address] = value;
    }
    threadSigners[key] = value;
  });

  useAnonModeStore.setState((state) => ({
    threadSigners: { ...threadSigners, ...state.threadSigners },
    addressSigners: { ...addressSigners, ...state.addressSigners },
  }));
};

initializeAnonModeStore();

export default useAnonModeStore;
