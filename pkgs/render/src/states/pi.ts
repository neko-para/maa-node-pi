import {
  type Interface,
  type InterfaceConfig,
  type InterfaceId,
  type InterfaceInfo
} from '@maanp/types'
import { type WatchStopHandle, ref, watch } from 'vue'

import { debounce } from '../utils/debounce'

export const piCurrent = ref<InterfaceId | null>(null)
export const piCurrentInfo = ref<InterfaceInfo | null>(null)

export const piCurrentData = ref<Interface>({})
export const piCurrentCfg = ref<InterfaceConfig>({})

let piCurrentCfgWatchHandle: WatchStopHandle | null = null

const saveConfig = debounce(async (v: InterfaceConfig | null) => {
  if (piCurrent.value && v) {
    await ipc.invoke('Pi_SetConfig', piCurrent.value, JSON.parse(JSON.stringify(v)))
  }
})

watch(
  piCurrent,
  async v => {
    if (v) {
      piCurrentData.value = await ipc.invoke('Pi_Get', v)
      piCurrentCfg.value = await ipc.invoke('Pi_GetConfig', v)
      piCurrentCfgWatchHandle = watch(
        piCurrentCfg,
        v => {
          saveConfig(v)
        },
        {
          deep: true
        }
      )
    } else {
      piCurrentCfgWatchHandle?.()
      piCurrentCfgWatchHandle = null

      piCurrentData.value = {}
      piCurrentCfg.value = {}
    }
  },
  {
    immediate: true
  }
)
