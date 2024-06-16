const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const jsonFilePath = path.join(__dirname, "odai.json"); // JSONファイルのパス

contextBridge.exposeInMainWorld("electronAPI", {
  startDisplay: (data) => ipcRenderer.send("start-display", data),
  onDisplayImages: (callback) => ipcRenderer.on("display-images", callback),
  readImageFiles: (directory) => {
    const files = fs.readdirSync(directory);
    return files
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map((file) => path.join(directory, file));
  },
  readJSONFile: () => {
    const rawData = fs.readFileSync(jsonFilePath);
    return JSON.parse(rawData);
  },
  quitApp: () => ipcRenderer.send("quit-app"),
  getPath: (dir) => path.join(__dirname, dir),
});
