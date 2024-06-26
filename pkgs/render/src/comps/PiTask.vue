<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDialog,
  VList,
  VListItem,
  VListItemAction,
  VListItemTitle,
  VSelect
} from 'vuetify/components'

import { piCurrentCfg, piCurrentData } from '../states/pi'

const showAddTask = ref(false)
const addTaskTask = ref<string | null>(null)

function startAddTask() {
  showAddTask.value = true
  addTaskTask.value = null
}

function addTask() {
  if (addTaskTask.value) {
    piCurrentCfg.value.task = [
      ...(piCurrentCfg.value.task ?? []),
      {
        name: addTaskTask.value,
        option: []
      }
    ]
  }
  showAddTask.value = false
}

function removeTask(index: number) {
  piCurrentCfg.value.task?.splice(index, 1)
}

function notUndefined<T>(x?: T): x is T {
  return !!x
}

const showCfgTask = ref(false)
const cfgTaskIndex = ref(0)
const cfgOptions = computed(() => {
  piCurrentCfg.value.task = piCurrentCfg.value.task ?? []
  if (cfgTaskIndex.value >= piCurrentCfg.value.task.length) {
    return
  }
  const taskCfg = piCurrentCfg.value.task[cfgTaskIndex.value]
  const taskInfo = piCurrentData.value.task?.find(x => x.name === taskCfg.name)
  if (!taskInfo) {
    return []
  }
  return (taskInfo.option ?? [])
    .map(opt => {
      const optCfg = piCurrentData.value.option?.[opt]
      if (optCfg) {
        return {
          ...optCfg,
          option: opt
        }
      } else {
        return undefined
      }
    })
    .filter(notUndefined)
})

function startCfgTask(index: number) {
  showCfgTask.value = true
  cfgTaskIndex.value = index
}

function cfgTaskSet(cfg: string, value: string) {
  piCurrentCfg.value.task = piCurrentCfg.value.task ?? []
  if (cfgTaskIndex.value >= piCurrentCfg.value.task.length) {
    return
  }
  const taskCfg = piCurrentCfg.value.task[cfgTaskIndex.value]
  taskCfg.option = taskCfg.option ?? []
  const existOpt = taskCfg.option.find(x => x.name === cfg) ?? null
  if (existOpt) {
    existOpt.value = value
  } else {
    taskCfg.option.push({
      name: cfg,
      value: value
    })
  }
}

function cfgTaskGet(cfg: string) {
  piCurrentCfg.value.task = piCurrentCfg.value.task ?? []
  if (cfgTaskIndex.value >= piCurrentCfg.value.task.length) {
    return
  }
  const taskCfg = piCurrentCfg.value.task[cfgTaskIndex.value]
  taskCfg.option = taskCfg.option ?? []
  const existOpt = taskCfg.option.find(x => x.name === cfg) ?? null
  if (existOpt) {
    return existOpt.value
  } else {
    const optCfg = piCurrentData.value.option?.[cfg]
    if (!optCfg) {
      return ''
    }
    if (typeof optCfg.default_case === 'string') {
      return optCfg.default_case
    }
    return optCfg.cases.length > 0 ? optCfg.cases[0].name : ''
  }
}
</script>

<template>
  <v-dialog v-model="showAddTask">
    <v-card>
      <v-card-text>
        <v-select
          :items="(piCurrentData.task ?? []).map(x => x.name)"
          v-model="addTaskTask"
          hide-details
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="addTask"> add </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showCfgTask">
    <v-card>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(option, idx) in cfgOptions" :key="idx">
            <v-select
              :label="option.option"
              :items="option.cases"
              item-title="name"
              item-value="name"
              :model-value="cfgTaskGet(option.option)"
              @update:model-value="(v: string) => cfgTaskSet(option.option, v)"
            ></v-select>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-card>
    <v-card-title> Task </v-card-title>
    <v-card-text v-if="piCurrentCfg.task && piCurrentCfg.task.length > 0">
      <v-list>
        <v-list-item v-for="(task, idx) in piCurrentCfg.task" :key="idx">
          <v-list-item-title>
            {{ task.name }}
          </v-list-item-title>
          <template #append>
            <v-list-item-action end>
              <v-btn icon="close" variant="text" @click="removeTask(idx)"></v-btn>
              <v-btn icon="menu" variant="text" @click="startCfgTask(idx)"></v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="startAddTask"> add </v-btn>
    </v-card-actions>
  </v-card>
</template>
