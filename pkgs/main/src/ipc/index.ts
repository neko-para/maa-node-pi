import * as maa from '@nekosu/maa-node'

import { IpcHandle } from './helper'
import { setupPiIpc } from './pi'

export function setupIpc() {
  IpcHandle('MaaVersion', () => {
    return maa.version()
  })
  setupPiIpc()
}
