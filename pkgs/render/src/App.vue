<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VBtn,
  VContainer,
  VMain,
  VSpacer
} from 'vuetify/components'

import GConfig from './comps/GConfig.vue'
import PiDetail from './comps/PiDetail.vue'
import PiManager from './comps/PiManager.vue'
import { piCurrentInfo } from './states/pi'

const maaVer = ref('')
const showPiManager = ref(true)

onMounted(() => {
  ipc.invoke('Maa_Version').then(ver => {
    maaVer.value = ver
  })
})

const gConfigEl = ref<InstanceType<typeof GConfig> | null>(null)
</script>

<template>
  <g-config ref="gConfigEl"></g-config>

  <v-app>
    <v-app-bar>
      <template #prepend>
        <v-app-bar-nav-icon @click="showPiManager = !showPiManager"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title> {{ piCurrentInfo?.name ?? '' }} </v-app-bar-title>

      <v-spacer></v-spacer>
      <span> {{ maaVer }} </span>
      <v-btn icon="settings" @click="gConfigEl?.show()"> </v-btn>
    </v-app-bar>
    <pi-manager v-model:show="showPiManager"></pi-manager>
    <v-main>
      <v-container>
        <pi-detail></pi-detail>
      </v-container>
    </v-main>
  </v-app>
</template>
