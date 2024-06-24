<script setup lang="ts">
import type { InterfaceId } from 'maa-node-pi-types'
import { onMounted, ref } from 'vue'
import { VCard, VList } from 'vuetify/components'

const piInfo = ref<InterfaceId[]>([])

onMounted(async () => {
  piInfo.value = await ipc.invoke('Pi_List')
})
</script>

<template>
  <VCard>
    <v-list> </v-list>
  </VCard>
</template>
