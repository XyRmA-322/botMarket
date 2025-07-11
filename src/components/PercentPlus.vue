<script lang="ts" setup>
import { computed, ref } from 'vue'

const buy = ref<number>(0)
const percent = ref<number>(13)
const sell = ref<number>(0)

const getPlus = computed((): string => {
  return (((sell.value * (1 - percent.value / 100) - buy.value) / buy.value) * 100 || 0).toFixed(2)
})
</script>
<template>
  <v-row dense>
    <v-col cols="3">
      <v-text-field v-model="buy" type="number" label="цена, покупки"></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field v-model="sell" type="number" label="цена, продажи"></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field v-model="percent" type="number" label="комиссия"></v-text-field>
    </v-col>
    <v-col cols="3" class="d-flex align-center"> Выгода: {{ getPlus }}% </v-col>
  </v-row>
</template>

<style scoped></style>
