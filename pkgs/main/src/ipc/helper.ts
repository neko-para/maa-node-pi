import { InvokeMain, NotifyRender } from '@maanp/types'
import { ipcMain } from 'electron'

import { mainWindow } from '../window'

type MaybePromise<T> = T | Promise<T>

export function IpcHandle<T extends keyof InvokeMain>(
  msg: T,
  func: (...args: Parameters<InvokeMain[T]>) => MaybePromise<ReturnType<InvokeMain[T]>>
) {
  ipcMain.handle(msg, (e, ...args) => {
    return func(...(args as any))
  })
}

export function IpcNotify<T extends keyof NotifyRender>(
  msg: T,
  ...args: Parameters<NotifyRender[T]>
) {
  mainWindow.webContents.send(msg, ...args)
}
