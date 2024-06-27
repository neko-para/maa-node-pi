import { existsSync } from 'fs'
import * as fs from 'fs/promises'

import { IpcHandle } from './helper'

export function setupGlobalIpc() {
  IpcHandle('G_SetConfig', async cfg => {
    await fs.writeFile('cfg.json', JSON.stringify(cfg, null, 2))
  })

  IpcHandle('G_GetConfig', async () => {
    if (!existsSync('cfg.json')) {
      return {}
    }
    try {
      const content = await fs.readFile('cfg.json', 'utf8')
      return JSON.parse(content)
    } catch (_) {
      return {}
    }
  })
}
