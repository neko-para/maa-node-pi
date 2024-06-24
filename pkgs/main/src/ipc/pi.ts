import { dialog } from 'electron'
import { existsSync } from 'fs'
import * as fs from 'fs/promises'
import { InterfaceId, InterfaceInfo } from 'maa-node-pi-types'
import * as path from 'path'
import { v4 } from 'uuid'

import { mainWindow } from '../window'
import { IpcHandle } from './helper'

const piIndex: Record<InterfaceId, InterfaceInfo> = {}

export function setupPiIpc() {
  IpcHandle('Pi_New', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'select interface',
      properties: ['openDirectory']
    })
    if (!result.canceled && result.filePaths.length > 0) {
      const p = result.filePaths[0]
      if (!existsSync(path.join(p, 'interface.json'))) {
        return null
      }
      const id = v4() as InterfaceId
      piIndex[id] = {
        name: path.basename(p),
        path: p
      }
      return id
    } else {
      return null
    }
  })

  IpcHandle('Pi_Info', id => {
    return piIndex[id] ?? null
  })

  IpcHandle('Pi_Get', async id => {
    if (!piIndex[id]) {
      return null
    }
    try {
      const content = await fs.readFile(path.join(piIndex[id].path, 'interface.json'), 'utf-8')
      return JSON.parse(content)
    } catch (_) {
      return null
    }
  })

  IpcHandle('Pi_List', () => {
    return Object.keys(piIndex) as InterfaceId[]
  })
}
