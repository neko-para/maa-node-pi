import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipc', {
  invoke: (msg: string, ...args: unknown[]) => {
    return ipcRenderer.invoke(msg, ...args)
  },
  on: (msg: string, func: (...args: unknown[]) => void) => {
    const wrap = (e: unknown, ...args: unknown[]) => {
      func(args)
    }
    ipcRenderer.on(msg, wrap)
    return wrap
  },
  off: (msg: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.off(msg, func)
  }
})
