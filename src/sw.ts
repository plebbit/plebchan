/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

// Precache all assets specified in the manifest
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Standard SW lifecycle methods
self.skipWaiting();
clientsClaim();
