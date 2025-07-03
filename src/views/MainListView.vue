<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, onMounted, provide, reactive, ref, type ToRef } from 'vue'

const Top_ = defineAsyncComponent(() => import('@components/TableQuery/Top_.vue'))
const Bottom_ = defineAsyncComponent(() => import('@components/TableQuery/Bottom_.vue'))
const Actions_ = defineAsyncComponent(() => import('@components/TableQuery/Actions_.vue'))
const Thead_ = defineAsyncComponent(() => import('@components/TableQuery/Thead_.vue'))
const Item_ = defineAsyncComponent(() => import('@components/TableQuery/Item_.vue'))
// const Navigation_ = defineAsyncComponent(() => import('@components/Rsp/Navigation_.vue'))

// const EditItem = defineAsyncComponent(() => import('./EditItem.vue'))
import { type AccumulatorType } from '@/types'
import { useFilterStore } from '@stores/filterStore'
import { useNsiStore } from '@stores/nsiStore'
import { isWithinInterval, parse } from 'date-fns'

import type { AccConfidenceDoc } from './types/confidence'
import { useAuthStore } from '../stores/authStore'

const { filter, selected } = storeToRefs(useFilterStore())
const { doc } = storeToRefs(useConfidenceStore())
const { hasPermission } = storeToRefs(useAuthStore())

const isOpen = ref<boolean>(false)
const getOpen = (pVal: boolean) => {
  isOpen.value = pVal
}
const isHideFilter = reactive<{ val: boolean; changeVal: () => void }>({
  val: true,
  changeVal() {
    this.val = !this.val
  }
})
provide('isHideFilter', isHideFilter)

const tableHeight = computed(() => {
  return window.innerHeight - 295 + 'px' //
})

onMounted(() => {
  // nsiStore.getFavoriteList(authStore.user?.info?.username)
})

const toggleSelect = (id: number, isSelected: boolean) => {
  if (!isSelected) {
    selected.value = selected.value.filter((item) => item !== id)
  } else {
    selected.value = [...selected.value, id]
  }
}
const allSelected = computed({
  get: () => selected.value.length === doc.value.list.length && doc.value.list.length > 0,
  set: (value: boolean) => {
    selected.value = value ? doc.value.list.map((item) => item.recid || 0) : []
  }
})

const indeterminate = computed(() => selected.value.length > 0 && selected.value.length < doc.value.list.length)
</script>

<template>
  <v-card class="px-0 pt-0">
    <v-sheet class="pa-0">
      <Top_ @update:model-value="getOpen" />
      <Actions_ :selected="indeterminate || allSelected" class="mb-4" />
      <v-table class="table main_table" :height="tableHeight" density="compact" fixed-header>
        <Thead_ :selected="selected" :all-selected="allSelected" :indeterminate="indeterminate" @update:all-selected="allSelected = $event" />

        <Item_ v-for="(item, i) in doc.list" :key="item.recid + '1'" :item="item" :index="i" :selected="selected.includes(item.recid || 0)" @toggle-select="toggleSelect" />
      </v-table>
      <Bottom_ />
      <router-view></router-view>
    </v-sheet>
  </v-card>
</template>

<style scoped></style>
