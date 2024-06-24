<script setup lang="ts">
import { onMounted, ref } from 'vue'

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
  <button @click="addInterface">add interface</button>
</template>
