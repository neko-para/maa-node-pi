import { Interface, InterfaceConfig, InterfaceId, InterfaceInfo } from './pi'

export type InvokeMain = {
  MaaVersion: () => string

  Pi_New: () => InterfaceId | null
  Pi_Info: (id: InterfaceId) => InterfaceInfo | null
  Pi_Get: (id: InterfaceId) => Interface | null
  Pi_List: () => InterfaceId[]
  Pi_GetConfig: (id: InterfaceId) => InterfaceConfig | null
  Pi_SetConfig: (id: InterfaceId, cfg: InterfaceConfig) => void
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
