import * as maa from '@nekosu/maa-node'

import { IpcHandle, IpcNotify } from './helper'
import { getProjectDir } from './pi'

export function setupMaaIpc() {
  IpcHandle('Maa_Version', () => {
    return maa.version()
  })

  IpcHandle('Maa_AdbScan', async () => {
    return maa.AdbController.find()
  })

  IpcHandle('Maa_Run', async (id, param) => {
    let ctrl: maa.ControllerBase | null = null
    if (param.controller_param?.ctype === 'adb') {
      ctrl = new maa.AdbController(param.controller_param)
    }
    if (!ctrl) {
      return false
    }
    const res = new maa.Resource()
    const inst = new maa.Instance()

    const notify = (msg: string, detail: string) => {
      IpcNotify('TrivialCallback', msg, detail)
    }
    ctrl.notify = notify
    res.notify = notify
    inst.notify = notify

    await ctrl.post_connection()
    for (const p of param.resource_path) {
      await res.post_path(p.replace('{PROJECT_DIR}', getProjectDir(id)))
    }
    inst.bind(ctrl)
    inst.bind(res)

    if (!inst.inited) {
      return false
    }

    for (const task of param.task) {
      await inst.post_task(task.entry, task.param as any).wait()
    }

    return true
  })
}
