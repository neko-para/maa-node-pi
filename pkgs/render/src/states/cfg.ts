import type { GlobalConfig } from '@maanp/types/src/cfg'
import { ref, watch } from 'vue'

import { debounce } from '../utils/debounce'

export const gConfig = ref<GlobalConfig>({})

const saveConfig = debounce(async (v: GlobalConfig) => {
  await ipc.invoke('G_SetConfig', JSON.parse(JSON.stringify(v)))
})

watch(
  gConfig,
  async v => {
    saveConfig(v)
  },
  {
    deep: true
  }
)
