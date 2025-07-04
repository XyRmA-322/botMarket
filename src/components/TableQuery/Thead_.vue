<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { type PropType } from 'vue'

const row = 1
</script>

<template>
  <thead>
    <tr>
      <th :rowspan="row" class="text-center" style="width: 500px">Название</th>
      <th :rowspan="row" class="text-center" style="width: 40px">Цена маркета</th>
      <th :rowspan="row" class="text-left" style="width: 40px">Класс</th>
    </tr>
  </thead>
</template>

<style scoped></style>
