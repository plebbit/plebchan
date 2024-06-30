import { create, StoreApi } from 'zustand';
import localForageLru from '@plebbit/plebbit-react-hooks/dist/lib/localforage-lru/index.js';

interface ThemeState {
  themes: {
    nsfw: string;
    sfw: string;
    all: string;
    subscriptions: string;
  };
  setTheme: (category: keyof ThemeState['themes'], theme: string) => void;
  getTheme: (category: keyof ThemeState['themes']) => string | null;
  loadThemes: () => Promise<void>;
}

const themeStore = localForageLru.createInstance({
  name: 'themeStore',
  size: 1000,
});

const useThemeStore = create<ThemeState>((set: StoreApi<ThemeState>['setState'], get: StoreApi<ThemeState>['getState']) => ({
  themes: {
    nsfw: 'yotsuba',
    sfw: 'yotsuba-b',
    all: 'yotsuba-b',
    subscriptions: 'yotsuba-b',
  },
  setTheme: async (category, theme) => {
    const currentThemes = get().themes;
    const updatedThemes = { ...currentThemes, [category]: theme };
    await themeStore.setItem(category, theme);
    set({ themes: updatedThemes });
  },
  getTheme: (category) => {
    const currentThemes = get().themes;
    return currentThemes[category] || null;
  },
  loadThemes: async () => {
    const entries: [keyof ThemeState['themes'], string][] = await themeStore.entries();
    const themes: Record<keyof ThemeState['themes'], string> = {
      nsfw: 'yotsuba',
      sfw: 'yotsuba-b',
      all: 'yotsuba-b',
      subscriptions: 'yotsuba-b',
    };
    entries.forEach(([key, value]) => {
      themes[key] = value;
    });
    set({ themes });
  },
}));

// Load themes on store initialization
useThemeStore.getState().loadThemes();

export default useThemeStore;
