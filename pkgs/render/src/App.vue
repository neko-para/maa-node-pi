<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VContainer,
  VMain,
  VSpacer
} from 'vuetify/components'

import PiDetail from './comps/PiDetail.vue'
import PiManager from './comps/PiManager.vue'
import { piCurrentInfo } from './states/pi'

const maaVer = ref('')
const showPiManager = ref(false)

onMounted(() => {
  ipc.invoke('MaaVersion').then(ver => {
    maaVer.value = ver
  })
})
</script>

<template>
  <v-app>
    <v-app-bar>
      <template #prepend>
        <v-app-bar-nav-icon @click="showPiManager = !showPiManager"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title> {{ piCurrentInfo?.name ?? '' }} </v-app-bar-title>

      <v-spacer></v-spacer>
      <span> {{ maaVer }} </span>
    </v-app-bar>
    <pi-manager v-model:show="showPiManager"></pi-manager>
    <v-main>
      <v-container>
        <pi-detail></pi-detail>
      </v-container>
    </v-main>
  </v-app>
</template>
