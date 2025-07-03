<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
// const Admin = defineAsyncComponent(() => import('../components/Admin/Admin_.vue'))

import { useRoute, type RouteRecordNameGeneric } from 'vue-router'
const route = useRoute()

const EditForm = defineAsyncComponent(() => import('@/components/EditForm.vue'))
const EditActSetGet = defineAsyncComponent(() => import('@/components/EditActSetGet.vue'))
const EditNd = defineAsyncComponent(() => import('@/components/EditNd.vue'))
const Audit_ = defineAsyncComponent(() => import('@/components/Helpers/Audit_.vue'))

const getRecid = computed((): number => {
  console.log(route)

  return Number(route.params?.recid)
})
const getName = computed((): RouteRecordNameGeneric => {
  return route.name
})

const getWidth = computed((): number => {
  return Number(route.meta.width)
})
const isOpen = computed((): boolean => {
  return !!getName.value
})
</script>
<template>
  <!-- Форма для добавления нового объекта -->
  <v-dialog v-model="isOpen" :max-width="getWidth" persistent>
    <EditForm v-if="getName === 'EditMain'" :recid="getRecid"></EditForm>
    <EditActSetGet v-if="getName === 'EditActSetGet'"></EditActSetGet>
    <EditNd v-if="getName === 'EditNd'" :recid="getRecid"></EditNd>
    <Audit_ v-if="getName === 'AuditMain'" :recid="getRecid" :type="'doc'"></Audit_>
    <Audit_ v-if="getName === 'AuditNd'" :recid="getRecid" :type="'nd'"></Audit_>
  </v-dialog>
</template>

<style scoped>
.border_card {
  padding: 12px;
  /* border: 1px solid gray; */
}
.border_card > .v-card-title {
  color: #2c75ff;
}
</style>
