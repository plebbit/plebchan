import { create } from 'zustand';
import localForageLru from '@plebbit/plebbit-react-hooks/dist/lib/localforage-lru/index.js';

interface AnonModeState {
  anonMode: boolean;
  threadSigners: { [key: string]: any };
  addressSigners: { [address: string]: any };
  setAnonMode: (mode: boolean) => void;
  setThreadSigner: (postCid: string, signer: any) => void;
  getThreadSigner: (postCid: string) => any | undefined;
  setAddressSigner: (signer: any) => void;
  getAddressSigner: (address: string) => any | undefined;
}

const anonModeStore = localForageLru.createInstance({
  name: 'anonModeStore',
  size: 1000,
});

const useAnonModeStore = create<AnonModeState>((set, get) => ({
  anonMode: true,
  threadSigners: {},
  addressSigners: {},
  setAnonMode: (mode: boolean) => {
    set({ anonMode: mode });
    anonModeStore.setItem('anonMode', mode);
  },
  setThreadSigner: (postCid: string, signer: any) => {
    set((state) => ({
      threadSigners: { ...state.threadSigners, [postCid]: signer },
    }));
    anonModeStore.setItem(postCid, signer);
  },
  getThreadSigner: (postCid: string) => get().threadSigners[postCid],
  setAddressSigner: (signer: any) => {
    set((state) => ({
      addressSigners: { ...state.addressSigners, [signer.address]: signer },
    }));
    anonModeStore.setItem(signer.address, signer);
  },
  getAddressSigner: (address: string) => get().addressSigners[address],
  currentAnonSignerAddress: null,
}));

const initializeAnonModeStore = async () => {
  const entries: [string, any][] = await anonModeStore.entries();
  const threadSigners: { [key: string]: any } = {};
  const addressSigners: { [key: string]: any } = {};
  let anonMode = true; // Default value

  entries.forEach(([key, value]) => {
    if (key === 'anonMode') {
      anonMode = value;
    } else if (value.address) {
      addressSigners[value.address] = value;
    } else {
      threadSigners[key] = value;
    }
  });

  useAnonModeStore.setState((state) => ({
    anonMode, // Set the retrieved anonMode state
    threadSigners: { ...threadSigners, ...state.threadSigners },
    addressSigners: { ...addressSigners, ...state.addressSigners },
  }));
};

initializeAnonModeStore();

export default useAnonModeStore;
