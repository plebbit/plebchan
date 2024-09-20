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
    anonModeStore.setItem(`threadSigner_${postCid}`, signer);
  },
  getThreadSigner: (postCid: string) => {
    const state = get();
    if (state.threadSigners[postCid]) {
      return state.threadSigners[postCid];
    }
    return null;
  },
  setAddressSigner: (signer: any) => {
    set((state) => ({
      addressSigners: { ...state.addressSigners, [signer.address]: signer },
    }));
    anonModeStore.setItem(`addressSigner_${signer.address}`, signer);
  },
  getAddressSigner: (address: string) => {
    const state = get();
    if (state.addressSigners[address]) {
      return state.addressSigners[address];
    }
    return null;
  },
}));

const initializeAnonModeStore = async () => {
  const entries: [string, any][] = await anonModeStore.entries();
  const threadSigners: { [key: string]: any } = {};
  const addressSigners: { [key: string]: any } = {};
  let anonMode = true;

  entries.forEach(([key, value]) => {
    if (key === 'anonMode') {
      anonMode = value;
    } else if (key.startsWith('threadSigner_')) {
      const postCid = key.replace('threadSigner_', '');
      threadSigners[postCid] = value;
    } else if (key.startsWith('addressSigner_')) {
      const address = key.replace('addressSigner_', '');
      addressSigners[address] = value;
    }
  });

  useAnonModeStore.setState({
    anonMode,
    threadSigners,
    addressSigners,
  });
};

initializeAnonModeStore();

export default useAnonModeStore;
