<script setup lang="ts">
import { type Interface, type InterfaceConfig } from 'maa-node-pi-types'
import { ref, watch } from 'vue'
import { VCard, VCardSubtitle, VCardText, VCardTitle } from 'vuetify/components'

import { piCurrent, piCurrentCfg, piCurrentData, piCurrentInfo } from '../states/pi'
import PiController from './PiController.vue'
</script>

<template>
  <v-card>
    <v-card-title>
      {{ piCurrentInfo?.name ?? 'unknown' }}
      {{ piCurrentData?.version ? ` - ${piCurrentData?.version}` : '' }}
    </v-card-title>
    <v-card-subtitle v-if="piCurrentData?.message">
      {{ piCurrentData?.message }}
    </v-card-subtitle>

    <v-card-text>
      <div class="d-flex flex-column">
        <pi-controller></pi-controller>
      </div>
    </v-card-text>
    {{ piCurrentData }}
    {{ piCurrentCfg }}
  </v-card>
</template>
