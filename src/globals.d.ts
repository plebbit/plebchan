declare global {
  interface Window {
    isElectron: boolean;
  }
}

declare global {
  interface Window {
    electronApi?: {
      isElectron: boolean;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      getNotificationStatus: () => Promise<'granted' | 'denied' | 'not-determined' | 'not-supported'>;
      getPlatform: () => Promise<NodeJS.Platform>;
      testNotification: () => Promise<{ success: boolean; reason?: string }>;
    };
  }
}

export {};
