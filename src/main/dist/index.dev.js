"use strict";

var _electron = require("electron");

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

var mainWindow;
var winURL = process.env.NODE_ENV === 'development' ? "http://localhost:9080" : "file://".concat(__dirname, "/index.html");

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new _electron.BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1200,
    icon: '../../src/renderer/assets/5f5b2a8eac157.256px.ico',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(winURL);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

_electron.app.on('ready', createWindow);

_electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    _electron.app.quit();
  }
});

_electron.app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */