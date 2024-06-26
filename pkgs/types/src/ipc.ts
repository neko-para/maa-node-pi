import type * as maa from '@nekosu/maa-node'

import { Interface, InterfaceConfig, InterfaceId, InterfaceInfo } from './pi'

export type InvokeMain = {
  Pi_New: () => InterfaceId | null
  Pi_Info: (id: InterfaceId) => InterfaceInfo | null
  Pi_Get: (id: InterfaceId) => Interface
  Pi_List: () => InterfaceId[]
  Pi_GetConfig: (id: InterfaceId) => InterfaceConfig
  Pi_SetConfig: (id: InterfaceId, cfg: InterfaceConfig) => void

  Maa_Version: () => string
  Maa_AdbScan: () => (maa.AdbInfo & { name: string })[]
}

export type NotifyRender = {
  TrivialCallback: (interfaceId: InterfaceId, msg: string, detail: string) => void
}

export type IpcDecl = {
  invoke: <T extends keyof InvokeMain>(
    msg: T,
    ...args: Parameters<InvokeMain[T]>
  ) => Promise<ReturnType<InvokeMain[T]>>
  on: <T extends keyof NotifyRender>(
    msg: T,
    func: (...args: Parameters<NotifyRender[T]>) => void
  ) => void
}
