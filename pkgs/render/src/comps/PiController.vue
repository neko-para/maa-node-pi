<script setup lang="ts">
import type * as maa from '@nekosu/maa-node'
import { computed, ref } from 'vue'
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDialog,
  VSelect
} from 'vuetify/components'

import { piCurrentCfg, piCurrentData } from '../states/pi'

const controllerTarget = computed<string>({
  set(v) {
    if (piCurrentCfg.value && piCurrentData.value) {
      const info = piCurrentData.value.controller.find(x => x.name === v)
      if (info) {
        piCurrentCfg.value.controller = {
          name: info.name,
          type: info.type
        }
        delete piCurrentCfg.value.adb
        delete piCurrentCfg.value.win32
      }
    }
  },
  get() {
    return piCurrentCfg.value?.controller.name ?? ''
  }
})

const controllerTargetInfo = computed(() => {
  return (
    piCurrentData.value?.controller.find(x => x.name === piCurrentCfg.value?.controller.name) ??
    null
  )
})

const showAdbSelelector = ref(false)
const adbScaning = ref(false)
const adbInfo = ref<({ name: string } & maa.AdbInfo)[]>([])
const adbInfoIdx = ref(-1)

async function adbPerformScan() {
  adbScaning.value = true
  adbInfoIdx.value = -1
  adbInfo.value = []
  adbInfo.value = await ipc.invoke('Maa_AdbScan')
  adbScaning.value = false
  adbInfoIdx.value = 0
}

async function adbPerformSave() {
  if (adbInfoIdx.value === -1) {
    return
  }
  const info = adbInfo.value[adbInfoIdx.value]
  if (piCurrentCfg.value) {
    piCurrentCfg.value.adb = {
      adb_path: info.adb_path,
      address: info.adb_serial,
      config: info.adb_config
    }
  }
  showAdbSelelector.value = false
}
</script>

<template>
  <v-dialog v-model="showAdbSelelector">
    <v-card>
      <v-card-text v-if="adbInfo.length > 0">
        <v-select
          :items="
            adbInfo.map((x, i) => {
              return { ...x, title: `${x.adb_serial} - ${x.adb_path}`, value: i }
            })
          "
          v-model="adbInfoIdx"
          hide-details
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="adbPerformScan" :loading="adbScaning"> scan </v-btn>
        <v-btn @click="adbPerformSave" :loading="adbScaning" :disabled="adbInfoIdx === -1">
          ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card v-if="piCurrentData && piCurrentCfg">
    <v-card-title> Controller </v-card-title>
    <v-card-text>
      <v-select
        :items="piCurrentData.controller.map(x => x.name)"
        v-model="controllerTarget"
        hide-details
      ></v-select>
    </v-card-text>
    <v-card-actions v-if="controllerTargetInfo">
      <template v-if="controllerTargetInfo.type === 'Adb'">
        <span class="text-body-1">
          {{ piCurrentCfg.adb ? `${piCurrentCfg.adb.address} - ${piCurrentCfg.adb.adb_path}` : '' }}
        </span>
        <v-btn @click="showAdbSelelector = true"> reconfigure </v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>
