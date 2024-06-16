// main.js

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    // titleBarStyle: 'hidden',
    width: 1400,
    height: 940,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  mainWindow.loadFile("./index.html");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("start-display", (event, data) => {
  mainWindow.webContents.send("display-images", data);
});

// アプリを終了するためのイベントリスナー
ipcMain.on("quit-app", () => {
  app.quit();
});
