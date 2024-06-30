<script setup lang="ts">
import { type Interface, type InterfaceConfig, type InterfaceRuntime } from '@maanp/types'
import { ref, watch } from 'vue'
import { VBtn, VCard, VCardActions, VCardSubtitle, VCardText, VCardTitle } from 'vuetify/components'

import { piCurrent, piCurrentCfg, piCurrentData, piCurrentInfo } from '../states/pi'
import PiController from './PiController.vue'
import PiResource from './PiResource.vue'
import PiTask from './PiTask.vue'

const running = ref(false)
const runLog = ref<[msg: string, detail: string][]>([])

function buildParam() {
  const param: InterfaceRuntime = {
    controller_param: null,
    resource_path: [],
    task: []
  }

  const ctrlInfo = piCurrentData.value.controller?.find(
    x => x.name === piCurrentCfg.value.controller?.name
  )
  if (!ctrlInfo) {
    console.error('no ctrlInfo')
    return null
  }
  if (ctrlInfo.type === 'Adb') {
    const adbInfo = piCurrentCfg.value.adb
    if (!adbInfo) {
      console.error('no adbInfo')
      return null
    }
    param.controller_param = {
      ctype: 'adb',
      adb_path: adbInfo.adb_path,
      adb_serial: adbInfo.address,
      adb_config: JSON.stringify(ctrlInfo.adb?.config ?? {}),
      adb_controller_type: (0xff - 1) | (0xff00 - (1 << 8)) | (0xff0000 - (2 << 16))
    }
  } else {
    console.error('no controller_param')
    return null
  }

  const resInfo = piCurrentData.value.resource?.find(x => x.name === piCurrentCfg.value.resource)
  if (!resInfo) {
    console.error('no resInfo')
    return null
  }
  param.resource_path = resInfo.path

  for (const task of piCurrentCfg.value.task ?? []) {
    const taskInfo = piCurrentData.value.task?.find(x => x.name === task.name)
    if (!taskInfo) {
      console.error('no taskInfo')
      return null
    }
    const p = taskInfo.param ?? {}
    for (const opt of taskInfo.option ?? []) {
      const optInfo = piCurrentData.value.option?.[opt]
      const optValue = task.option?.find(x => x.name === opt)?.value ?? null
      if (!optInfo) {
        console.error('no optInfo')
        return null
      }
      let optParam = optInfo.cases.find(x => x.name === optValue)?.param
      if (!optParam) {
        optParam = optInfo.cases.find(x => x.name === optInfo.default_case)?.param
      }
      if (!optParam) {
        optParam = {}
      }
      Object.assign(p, optParam)
    }
    param.task.push({
      name: task.name,
      entry: taskInfo.entry,
      param: p
    })
  }

  return param
}

async function runTask() {
  running.value = true
  const notifyId = ipc.on('TrivialCallback', (msg, detail) => {
    runLog.value.push([msg, detail])
  })

  const param = buildParam()
  console.log(param)
  if (param) {
    await ipc.invoke('Maa_Run', piCurrent.value!, JSON.parse(JSON.stringify(param)))
  }

  ipc.off('TrivialCallback', notifyId)
  running.value = false
}

function stopTask() {
  ipc.invoke('Maa_Stop', piCurrent.value!)
}
</script>

<template>
  <v-card v-if="piCurrentInfo && piCurrentData">
    <v-card-title>
      {{ piCurrentInfo.name }}
      {{ piCurrentData.version ? ` - ${piCurrentData.version}` : '' }}
    </v-card-title>
    <v-card-subtitle v-if="piCurrentData.message">
      {{ piCurrentData.message }}
    </v-card-subtitle>

    <v-card-text>
      <div class="d-flex flex-column ga-2">
        <pi-controller></pi-controller>
        <pi-resource></pi-resource>
        <pi-task></pi-task>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="runTask" :loading="running"> run </v-btn>
      <v-btn @click="stopTask" :disabled="!running"> stop </v-btn>
    </v-card-actions>
    <v-card-text v-if="runLog.length > 0">
      <div class="d-flex flex-column ga-2">
        <span v-for="(log, idx) of runLog" :key="idx"> {{ log[0] }} - {{ log[1] }} </span>
      </div>
    </v-card-text>
  </v-card>
</template>
