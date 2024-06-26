import * as maa from '@nekosu/maa-node'

import { IpcHandle } from './helper'

export function setupMaaIpc() {
  IpcHandle('Maa_Version', () => {
    return maa.version()
  })

  IpcHandle('Maa_AdbScan', async () => {
    return maa.AdbController.find()
  })
}
