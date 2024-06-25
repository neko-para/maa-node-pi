import { dialog } from 'electron'
import { existsSync } from 'fs'
import * as fs from 'fs/promises'
import { InterfaceId, InterfaceInfo } from 'maa-node-pi-types'
import * as path from 'path'
import { v4 } from 'uuid'

import { mainWindow } from '../window'
import { IpcHandle } from './helper'

const piIndex: Record<InterfaceId, InterfaceInfo> = {}

function writeCfg() {
  fs.writeFile('pi.json', JSON.stringify(piIndex, null, 2))
}

async function readCfg() {
  if (!existsSync('pi.json')) {
    return
  }
  const buf = await fs.readFile('pi.json', 'utf8')
  Object.assign(piIndex, JSON.parse(buf))
}

function nameOfPath(p: string) {
  let name = path.basename(p)
  while (['install'].includes(name)) {
    p = path.dirname(p)
    name = path.basename(p)
  }
  return name
}

export function setupPiIpc() {
  readCfg()

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
        name: nameOfPath(p),
        path: p
      }
      writeCfg()
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

  IpcHandle('Pi_GetConfig', async id => {
    const info = piIndex[id]
    if (!info) {
      return null
    }
    const cfgPath = path.join(info.path, 'config', 'maa_pi_config.json')
    if (!existsSync(cfgPath)) {
      return null
    }
    try {
      const content = await fs.readFile(cfgPath, 'utf8')
      return JSON.parse(content)
    } catch (_) {
      return null
    }
  })

  IpcHandle('Pi_SetConfig', async (id, cfg) => {
    const info = piIndex[id]
    if (!info) {
      return
    }
    const cfgPath = path.join(info.path, 'config', 'maa_pi_config.json')
    await fs.mkdir(path.dirname(cfgPath), { recursive: true })
    await fs.writeFile(cfgPath, JSON.stringify(cfg, null, 4))
  })
}
