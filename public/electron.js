const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const request = require('request');

const { version } = require('../package.json');
app.getVersion = () => version;
const { autoUpdater } = require('electron-updater');

// Disable warnings for:
// - Disabled webSecurity
// - allowRunningInsecureContent
// - Insecure Content-Security-Policy
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

ipcMain.on(
  'http-request',
  (event, { method, url, headers, body, metadata }) => {
    request(
      {
        method,
        url,
        headers,
        body,
        followAllRedirects: true,
        strictSSL: false,
      },
      (error, response, data) => {
        event.sender.send('http-request-completed', {
          metadata,
          statusCode: response ? response.statusCode : null,
          rawHeaders: response ? response.rawHeaders : null,
          data,
          error,
        });
      },
    );
  },
);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1600,
    height: 880,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  // In dev, load React app served by create-react-app.
  // In production, load built index.html.
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );

  // Open the DevTools.
  if (isDev) win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version of app is available.',
  });
});

autoUpdater.on('download-progress', progressObj => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message =
    log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message =
    log_message +
    ' (' +
    progressObj.transferred +
    '/' +
    progressObj.total +
    ')';
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: log_message,
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'Update downloaded.',
  });
});

app.on('ready', function () {
  autoUpdater.checkForUpdatesAndNotify();
});
