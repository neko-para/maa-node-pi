<script setup lang="ts">
import type * as maa from '@nekosu/maa-node'
import { computed, ref } from 'vue'
import {
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDialog,
  VList,
  VListItem,
  VSelect
} from 'vuetify/components'

import { piCurrentCfg, piCurrentData } from '../states/pi'

const resourceTarget = computed<string>({
  set(v) {
    const info = piCurrentData.value.resource?.find(x => x.name === v)
    if (info) {
      piCurrentCfg.value.resource = info.name
    }
  },
  get() {
    return piCurrentCfg.value.resource ?? ''
  }
})

const resourceTargetInfo = computed(() => {
  return piCurrentData.value.resource?.find(x => x.name === piCurrentCfg.value.resource) ?? null
})
</script>

<template>
  <v-card>
    <v-card-title> Resource </v-card-title>
    <v-card-text>
      <v-select
        :items="(piCurrentData.resource ?? []).map(x => x.name)"
        v-model="resourceTarget"
        hide-details
      ></v-select>
    </v-card-text>
    <v-card-text v-if="resourceTargetInfo">
      <div class="flex flex-column ga-2">
        <span v-for="(path, idx) in resourceTargetInfo.path" :key="idx">
          {{ path }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>
