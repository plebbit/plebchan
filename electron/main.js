import './log.js';
import { app, BrowserWindow, Menu, MenuItem, Tray, shell, dialog, nativeTheme, ipcMain, clipboard } from 'electron';
import isDev from 'electron-is-dev';
import fs from 'fs';
import path from 'path';
import EnvPaths from 'env-paths';
import startIpfs from './start-ipfs.js';
import './start-plebbit-rpc.js';
import { URL, fileURLToPath } from 'node:url';
import contextMenu from 'electron-context-menu';

// Determine __filename and dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

// Load package.json dynamically
const packageJson = JSON.parse(fs.readFileSync(path.join(dirname, '../package.json'), 'utf-8'));

let startIpfsError;
startIpfs.onError = (error) => {
  // only show error once or it spams the user
  const alreadyShownIpfsError = !!startIpfsError;
  startIpfsError = error;
  if (!alreadyShownIpfsError && error.message) {
    dialog.showErrorBox('IPFS warning', error.message);
  }
};

// send plebbit rpc auth key to renderer
const plebbitDataPath = !isDev ? EnvPaths('plebbit', { suffix: false }).data : path.join(dirname, '..', '.plebbit');
const plebbitRpcAuthKey = fs.readFileSync(path.join(plebbitDataPath, 'auth-key'), 'utf8');
ipcMain.on('get-plebbit-rpc-auth-key', (event) => event.reply('plebbit-rpc-auth-key', plebbitRpcAuthKey));

// use common user agent instead of electron so img, video, audio, iframe elements don't get blocked
// https://www.whatismybrowser.com/guides/the-latest-version/chrome
// https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome
// NOTE: eventually should probably fake sec-ch-ua header as well
let fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';
if (process.platform === 'darwin') fakeUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';
if (process.platform === 'linux') fakeUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';
const realUserAgent = `plebchan/${packageJson.version}`;

// add right click menu
contextMenu({
  // prepend custom buttons to top
  prepend: (defaultActions, parameters, browserWindow) => [
    {
      label: 'Back',
      visible: parameters.mediaType === 'none',
      enabled: browserWindow?.webContents?.canGoBack(),
      click: () => browserWindow?.webContents?.goBack(),
    },
    {
      label: 'Forward',
      visible: parameters.mediaType === 'none',
      enabled: browserWindow?.webContents?.canGoForward(),
      click: () => browserWindow?.webContents?.goForward(),
    },
    {
      label: 'Reload',
      visible: parameters.mediaType === 'none',
      click: () => browserWindow?.webContents?.reload(),
    },
  ],
  showLookUpSelection: false,
  showCopyImage: true,
  showCopyImageAddress: true,
  showSaveImageAs: true,
  showSaveLinkAs: true,
  showInspectElement: true,
  showServices: false,
  showSearchWithGoogle: false,
});

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#000000' : '#ffffff',
    webPreferences: {
      webSecurity: true, // must be true or iframe embeds like youtube can do remote code execution
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true, // TODO: change to isDev when no bugs left
      preload: path.join(dirname, '../build/electron/preload.cjs'),
    },
  });

  // set fake user agent
  mainWindow.webContents.userAgent = fakeUserAgent;

  // set custom user agent and other headers for window.fetch requests to prevent origin errors
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders({ urls: ['*://*/*'] }, (details, callback) => {
    const isIframe = !!details.frame?.parent;
    // if not a fetch request (or fetch request is from within iframe), do nothing, filtering webRequest by types doesn't seem to work
    if (details.resourceType !== 'xhr' || isIframe) {
      return callback({ requestHeaders: details.requestHeaders });
    }
    // add privacy
    details.requestHeaders['User-Agent'] = realUserAgent;
    details.requestHeaders['sec-ch-ua'] = undefined;
    details.requestHeaders['sec-ch-ua-platform'] = undefined;
    details.requestHeaders['sec-ch-ua-mobile'] = undefined;
    details.requestHeaders['Sec-Fetch-Dest'] = undefined;
    details.requestHeaders['Sec-Fetch-Mode'] = undefined;
    details.requestHeaders['Sec-Fetch-Site'] = undefined;
    // prevent origin errors
    details.requestHeaders['Origin'] = undefined;
    callback({ requestHeaders: details.requestHeaders });
  });

  // fix cors errors for window.fetch. must not be enabled for iframe or can cause remote code execution
  mainWindow.webContents.session.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, (details, callback) => {
    const isIframe = !!details.frame?.parent;
    // if not a fetch request (or fetch request is from within iframe), do nothing, filtering webRequest by types doesn't seem to work
    if (details.resourceType !== 'xhr' || isIframe) {
      return callback({ responseHeaders: details.responseHeaders });
    }
    // must delete lower case headers or both '*, *' could get added
    delete details.responseHeaders['access-control-allow-origin'];
    delete details.responseHeaders['access-control-allow-headers'];
    delete details.responseHeaders['access-control-allow-methods'];
    delete details.responseHeaders['access-control-expose-headers'];
    details.responseHeaders['Access-Control-Allow-Origin'] = '*';
    details.responseHeaders['Access-Control-Allow-Headers'] = '*';
    details.responseHeaders['Access-Control-Allow-Methods'] = '*';
    details.responseHeaders['Access-Control-Expose-Headers'] = '*';
    callback({ responseHeaders: details.responseHeaders });
  });

  const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', async () => {
    // make sure back button is disabled on launch
    mainWindow.webContents.clearHistory();

    mainWindow.show();

    if (isDev) {
      mainWindow.openDevTools();
    }

    if (startIpfsError) {
      dialog.showErrorBox('IPFS warning', startIpfsError.message);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // don't open new windows
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    mainWindow.loadURL(url);
  });

  // open links in external browser
  // do not open links in plebchan or will lead to remote execution
  mainWindow.webContents.on('will-navigate', (e, originalUrl) => {
    if (originalUrl != mainWindow.webContents.getURL()) {
      e.preventDefault();
      try {
        // do not let the user open any url with shell.openExternal
        // or it will lead to remote execution https://benjamin-altpeter.de/shell-openexternal-dangers/

        // only open valid https urls to prevent remote execution
        // will throw if url isn't valid
        const validatedUrl = new URL(originalUrl);
        let serializedUrl = '';

        // make an exception for ipfs stats
        if (validatedUrl.toString() === 'http://localhost:50019/webui/') {
          serializedUrl = validatedUrl.toString();
        } else if (validatedUrl.protocol === 'https:') {
          // open serialized url to prevent remote execution
          serializedUrl = validatedUrl.toString();
        } else {
          throw Error(`can't open url '${originalUrl}', it's not https and not the allowed http exception`);
        }

        shell.openExternal(serializedUrl);
      } catch (e) {
        console.warn(e);
      }
    }
  });

  // open links (with target="_blank") in external browser
  // do not open links in plebchan or will lead to remote execution
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const originalUrl = url;
    try {
      // do not let the user open any url with shell.openExternal
      // or it will lead to remote execution https://benjamin-altpeter.de/shell-openexternal-dangers/

      // only open valid https urls to prevent remote execution
      // will throw if url isn't valid
      const validatedUrl = new URL(originalUrl);
      let serializedUrl = '';

      // make an exception for ipfs stats
      if (validatedUrl.toString() === 'http://localhost:50019/webui/') {
        serializedUrl = validatedUrl.toString();
      } else if (validatedUrl.protocol === 'https:') {
        // open serialized url to prevent remote execution
        serializedUrl = validatedUrl.toString();
      } else {
        throw Error(`can't open url '${originalUrl}', it's not https and not the allowed http exception`);
      }

      shell.openExternal(serializedUrl);
    } catch (e) {
      console.warn(e);
    }
    return { action: 'deny' };
  });

  // deny permissions like location, notifications, etc https://www.electronjs.org/docs/latest/tutorial/security#5-handle-session-permission-requests-from-remote-content
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    // deny all permissions
    return callback(false);
  });

  // deny attaching webview https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
  mainWindow.webContents.on('will-attach-webview', (e, webPreferences, params) => {
    // deny all
    e.preventDefault();
  });

  if (process.platform !== 'darwin') {
    // tray
    const trayIconPath = path.join(dirname, '..', isDev ? 'public' : 'build', 'electron-tray-icon.png');
    const tray = new Tray(trayIconPath);
    tray.setToolTip('plebchan');
    const trayMenu = Menu.buildFromTemplate([
      {
        label: 'Open plebchan',
        click: () => {
          mainWindow.show();
        },
      },
      {
        label: 'Quit plebchan',
        click: () => {
          mainWindow.destroy();
          app.quit();
        },
      },
    ]);
    tray.setContextMenu(trayMenu);

    // show/hide on tray right click
    tray.on('right-click', () => {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });

    // close to tray
    if (!isDev) {
      let isQuiting = false;
      app.on('before-quit', () => {
        isQuiting = true;
      });
      mainWindow.on('close', (event) => {
        if (!isQuiting) {
          event.preventDefault();
          mainWindow.hide();
          event.returnValue = false;
        }
      });
    }
  }

  const appMenuBack = new MenuItem({
    label: '←',
    enabled: mainWindow?.webContents?.canGoBack(),
    click: () => mainWindow?.webContents?.goBack(),
  });
  const appMenuForward = new MenuItem({
    label: '→',
    enabled: mainWindow?.webContents?.canGoForward(),
    click: () => mainWindow?.webContents?.goForward(),
  });
  const appMenuReload = new MenuItem({
    label: '⟳',
    role: 'reload',
    click: () => mainWindow?.webContents?.reload(),
  });

  // application menu
  // hide useless electron help menu
  if (process.platform === 'darwin') {
    const appMenu = Menu.getApplicationMenu();
    appMenu.insert(1, appMenuBack);
    appMenu.insert(2, appMenuForward);
    appMenu.insert(3, appMenuReload);
    Menu.setApplicationMenu(appMenu);
  } else {
    // Other platforms
    const originalAppMenuWithoutHelp = Menu.getApplicationMenu()?.items.filter((item) => item.role !== 'help');
    const appMenu = [appMenuBack, appMenuForward, appMenuReload, ...originalAppMenuWithoutHelp];
    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu));
  }
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle request to copy text to clipboard
ipcMain.handle('copy-to-clipboard', async (event, text) => {
  try {
    clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error('[Electron Main] Error copying to clipboard:', error);
    return { success: false, error: error.message };
  }
});

// Handle request for platform info
ipcMain.handle('get-platform', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
  };
});
