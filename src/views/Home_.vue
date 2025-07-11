<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useNsiStore } from '@/stores/nsiStore'
import { storeToRefs } from 'pinia'
const authStore = useAuthStore()
const { setting, steam, market, formLoading, loadStatus, loadText } = storeToRefs(useNsiStore())
const Settings = defineAsyncComponent(() => import('./Settings.vue'))

const Thead_ = defineAsyncComponent(() => import('@/components/TableQuery/Thead_.vue'))
const Item_ = defineAsyncComponent(() => import('@/components/TableQuery/Item_.vue'))
const Bottom_ = defineAsyncComponent(() => import('@/components/TableQuery/Bottom_.vue'))
const RefreshSwitch = defineAsyncComponent(() => import('@/components/TableQuery/RefreshSwitch.vue'))
const PercentPlus = defineAsyncComponent(() => import('@/components/PercentPlus.vue'))
const openSetting = ref<boolean>(false)

onMounted(() => {
  setting.value.getSetting()
})

const test = () => {
  steam.value.pingMarket()
}
const getItemsOnSale = () => {
  market.value.getItemsOnSale()
}
const tableHeight = computed(() => {
  return window.innerHeight - 170 + 'px' //
})
</script>
<template>
  <v-sheet>
    <v-toolbar>
      <v-btn @click="openSetting = true">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn @click="test()">Ping</v-btn>
      <v-btn @click="getItemsOnSale()">Предметы на продаже</v-btn>
      <v-spacer></v-spacer>
      <PercentPlus></PercentPlus>
      <v-spacer></v-spacer>
      <RefreshSwitch></RefreshSwitch>
    </v-toolbar>
    <v-progress-linear v-model="loadStatus" height="25" color="purple">
      <strong>{{ loadText }}</strong>
    </v-progress-linear>
    <v-table class="table main_table" :height="tableHeight" density="compact" fixed-header>
      <Thead_ />
      <Item_ v-for="(item, i) in market.items" :key="item.item_id" :item="item" :index="i" />
    </v-table>
    <Bottom_></Bottom_>
    <Settings v-model="openSetting" @update:model-value="openSetting = false"></Settings>
  </v-sheet>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
