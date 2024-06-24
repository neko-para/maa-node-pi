export type InterfaceId = string & { __brand: 'InterfaceId' }

export type InterfaceInfo = {
  path: string
}

export type Interface = {
  controller: {
    name: string
    type: 'Adb' | 'Win32'
    adb?: {
      touch?: number
      key?: number
      screencap?: number
      config?: unknown
    }
    win32?: {
      method: 'Find' | 'Search' | 'Cursor' | 'Desktop' | 'Foreground'
      class_name?: string
      window_name?: string
      touch?: number
      key?: number
      screencap?: number
    }
  }[]
  resource: {
    name: string
    path: string[]
  }[]
  task: {
    name: string
    entry: string
    param?: unknown
    option?: string[]
  }[]
  option?: Record<
    string,
    {
      cases: {
        name: string
        param?: unknown
      }[]
      default_case?: string
    }
  >
  recognizer: Record<
    string,
    {
      exec_path: string
      exec_param?: string[]
    }
  >
  action: Record<
    string,
    {
      exec_path: string
      exec_param?: string[]
    }
  >
  version?: string
  message?: string
}
