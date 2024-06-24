// it is import to use `import * as`
import * as maa from '@nekosu/maa-node'
import { BrowserWindow, app } from 'electron'
import * as path from 'path'

import pkg from '../../../package.json'
import { setupIpc } from './ipc'
import { createWindow } from './window'

console.log(maa.version(), maa.AdbController.agent_path())

app.setAboutPanelOptions({
  applicationName: pkg.name,
  applicationVersion: pkg.version
  // iconPath: path.join(__dirname, '../render/assets/icon.png')
})

app.on('ready', async () => {
  createWindow()
  setupIpc()
})

app.on('window-all-closed', () => {
  app.quit()
})
