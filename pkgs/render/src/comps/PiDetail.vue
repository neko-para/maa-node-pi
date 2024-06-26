<script setup lang="ts">
import { type Interface, type InterfaceConfig } from 'maa-node-pi-types'
import { ref, watch } from 'vue'
import { VCard, VCardSubtitle, VCardText, VCardTitle } from 'vuetify/components'

import { piCurrent, piCurrentCfg, piCurrentData, piCurrentInfo } from '../states/pi'
import PiController from './PiController.vue'
import PiResource from './PiResource.vue'
import PiTask from './PiTask.vue'
</script>

<template>
  <v-card>
    <v-card-title>
      {{ piCurrentInfo?.name ?? 'unknown' }}
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
    {{ piCurrentData }}
    {{ piCurrentCfg }}
  </v-card>
</template>
