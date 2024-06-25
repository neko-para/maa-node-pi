<script setup lang="ts">
import { computed } from 'vue'
import { VCard, VCardText, VCardTitle, VSelect } from 'vuetify/components'

import { piCurrentCfg, piCurrentData } from '../states/pi'

const controllerTarget = computed<string>({
  set(v) {
    if (piCurrentCfg.value && piCurrentData.value) {
      const info = piCurrentData.value!.controller.find(x => x.name === v)!
      piCurrentCfg.value.controller = {
        name: info.name,
        type: info.type
      }
      delete piCurrentCfg.value.adb
      delete piCurrentCfg.value.win32
    }
  },
  get() {
    return piCurrentCfg.value!.controller.name
  }
})
</script>

<template>
  <v-card v-if="piCurrentData && piCurrentCfg">
    <v-card-title> Controller </v-card-title>
    <v-card-text>
      <v-select
        :items="piCurrentData.controller.map(x => x.name)"
        v-model="controllerTarget"
      ></v-select>
    </v-card-text>
    <v-card-text v-if="1"> </v-card-text>
  </v-card>
</template>
