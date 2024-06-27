<script setup lang="ts">
import { ref } from 'vue'
import { VCard, VCardText, VDialog, VSwitch } from 'vuetify/components'

import { gConfig } from '../states/cfg'

const showDlg = ref(false)

function show() {
  showDlg.value = true
}

defineExpose({
  show
})
</script>

<template>
  <v-dialog v-model="showDlg">
    <v-card>
      <v-card-text>
        <v-switch color="primary" label="Maa Node Pi Debug" v-model="gConfig.debug"></v-switch>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
