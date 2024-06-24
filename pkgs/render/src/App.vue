<script setup lang="ts">
import { onMounted, ref } from 'vue'

import PiManager from './comps/PiManager.vue'

const maaVer = ref('')

onMounted(() => {
  ipc.invoke('MaaVersion').then(ver => {
    maaVer.value = ver
  })
})

function addInterface() {
  ipc.invoke('Pi_New')
}
</script>

<template>
  <div>Hello world! Maa: {{ maaVer }}</div>
  <v-btn @click="addInterface">add interface</v-btn>
  <pi-manager></pi-manager>
</template>
