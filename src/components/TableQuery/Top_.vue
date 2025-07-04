<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

// const Filter_ = defineAsyncComponent(() => import('@/components/TableQuery/Filter_.vue'))
const emits = defineEmits(['update:modelValue'])
const getOpen = (pVal: boolean) => {
  emits('update:modelValue', pVal)
}
</script>
<template>
  <v-card class="card-top py-2" elevation="0">
    <!-- <RangeSelect></RangeSelect> -->
    <!-- <Filter_ @update:model-value="getOpen"></Filter_> -->
  </v-card>
</template>

<style scoped>
.card-top {
  border: 0px solid #888888;
  border-radius: 8px;
  /* padding-top: 0px;
  padding-bottom: 0px; */
}
</style>
