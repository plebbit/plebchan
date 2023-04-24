// force IpfsHttpClient to use node-fetch to fix max 6 connections
// temporary, eventually we will fork ipfs-http-client and replace
// 'native-fetch'
const mock = require('mock-require');
const fetch = require('node-fetch');
mock('ipfs-utils/src/env.js', {
  isTest: false,
  isElectron: false,
  isElectronMain: false,
  isElectronRenderer: false,
  isNode: true,
  isBrowser: false,
  isWebWorker: false,
  isEnvWithDom: false,
  isReactNative: false,
});
mock('native-fetch', {
  default: fetch.default,
  Headers: fetch.Headers,
  Request: fetch.Request,
  Response: fetch.Response,
});

const envPaths = require('env-paths').default('plebchan', { suffix: false });
const { contextBridge } = require('electron')
const path = require('path')

// dev uses http://localhost, prod uses file://...index.html
const isDev = window.location.protocol === 'http:';

const defaultPlebbitOptions = {
  // find the user's OS data path
  dataPath: !isDev ? envPaths.data : path.join(__dirname, '..', '.plebbit'),
  ipfsHttpClientsOptions: ['http://localhost:5001/api/v0'] || undefined,
  // TODO: having to define pubsubHttpClientOptions and ipfsHttpClientOptions is a bug with plebbit-js
  pubsubHttpClientsOptions: ['http://localhost:5001/api/v0'] || undefined,
  // electron starts the local ipfs gateway on port 11028 because 8080 is too common
  ipfsGatewayUrls: ['http://localhost:11028'] || undefined,
};

// expose plebbit-js native functions into electron's renderer
contextBridge.exposeInMainWorld('plebbitJsNativeFunctions', require('@plebbit/plebbit-js').nativeFunctions.node)
contextBridge.exposeInMainWorld('defaultPlebbitOptions', defaultPlebbitOptions)

// try/catch localStorage.debug because causes unknown error sometimes
try {
  if (isDev) localStorage.debug = 'plebbit-js:*,plebbit-react-hooks:*,plebchan:*';
} catch (e) {
  console.log(e);
}
