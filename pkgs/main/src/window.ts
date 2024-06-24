import { BrowserWindow, app } from 'electron'
import * as path from 'path'

export let mainWindow: BrowserWindow

export function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/main.js')
    }
    // icon: path.join(__dirname, '../render/assets/icon.png')
  })

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../render/index.html'))
  } else {
    mainWindow.loadURL(
      `http://${process.env.VITE_DEV_SERVER_HOST}:${process.env.VITE_DEV_SERVER_PORT}`
    )
    mainWindow.webContents.on('did-frame-finish-load', () => {
      // useDebug(mainWindow)
    })
  }
}
