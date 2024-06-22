import { create, StoreApi } from 'zustand';
import localForageLru from '@plebbit/plebbit-react-hooks/dist/lib/localforage-lru/index.js';

interface ThemeState {
  themes: Record<string, string>;
  setTheme: (subplebbitAddress: string, theme: string) => void;
  getTheme: (subplebbitAddress: string) => string | null;
  loadThemes: () => Promise<void>;
}

const themeStore = localForageLru.createInstance({
  name: 'themeStore',
  size: 1000,
});

const useThemeStore = create<ThemeState>((set: StoreApi<ThemeState>['setState'], get: StoreApi<ThemeState>['getState']) => ({
  themes: {},
  setTheme: async (subplebbitAddress: string, theme: string) => {
    const currentThemes = get().themes;
    const updatedThemes = { ...currentThemes, [subplebbitAddress]: theme };
    await themeStore.setItem(subplebbitAddress, theme);
    set({ themes: updatedThemes });
  },
  getTheme: (subplebbitAddress: string) => {
    const currentThemes = get().themes;
    return currentThemes[subplebbitAddress] || null;
  },
  loadThemes: async () => {
    const entries: [string, string][] = await themeStore.entries();
    const themes: Record<string, string> = {};
    entries.forEach(([key, value]) => {
      themes[key] = value;
    });
    set({ themes });
  },
}));

// Load themes on store initialization
useThemeStore.getState().loadThemes();

export default useThemeStore;
