import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipc', {
  invoke: (msg: string, ...args: unknown[]) => {
    return ipcRenderer.invoke(msg, ...args)
  }
})
