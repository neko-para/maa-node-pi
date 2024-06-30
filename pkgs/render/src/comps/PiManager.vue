<script setup lang="ts">
import type { InterfaceId, InterfaceInfo } from '@maanp/types'
import { onMounted, ref } from 'vue'
import {
  VBtn,
  VCard,
  VDivider,
  VList,
  VListItem,
  VListItemAction,
  VListItemTitle,
  VNavigationDrawer
} from 'vuetify/components'

import { piCurrent, piCurrentInfo } from '../states/pi'

defineProps<{
  show: boolean
}>()

const emits = defineEmits<{
  'update:show': [boolean]
}>()

const piInfo = ref<
  {
    id: InterfaceId
    info: InterfaceInfo | null
  }[]
>([])

onMounted(() => {
  syncInterface()
})

async function syncInterface() {
  piInfo.value = await Promise.all(
    (await ipc.invoke('Pi_List')).map(async id => ({
      id,
      info: await ipc.invoke('Pi_Info', id)
    }))
  )
}

async function addInterface() {
  await ipc.invoke('Pi_New')
  await syncInterface()
}

function setCurrent(id: InterfaceId, info: InterfaceInfo | null) {
  piCurrent.value = id
  piCurrentInfo.value = info
}
</script>

<template>
  <v-navigation-drawer :model-value="show" @update:model-value="v => emits('update:show', v)">
    <v-list-item>
      <v-list-item-action>
        <v-btn @click="addInterface"> add </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item v-for="item in piInfo" :key="item.id" @click="setCurrent(item.id, item.info)">
      <v-list-item-title v-if="piCurrent === item.id" class="font-weight-bold">
        {{ item.info?.name }}
      </v-list-item-title>
      <v-list-item-title v-else>
        {{ item.info?.name }}
      </v-list-item-title>
    </v-list-item>
  </v-navigation-drawer>
</template>
