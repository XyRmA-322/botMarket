<script lang="ts" setup>
import { computed, defineAsyncComponent, watch } from 'vue'

import { defineProps, PropType } from 'vue'
const props = defineProps({
   modelValue: {
     type: Boolean as PropType<Boolean>,
     default: false
   }
})
const emits = defineEmits(['update:modelValue'])
const close = () => {
  emits('update:modelValue')
}
</script>

<template>
  <v-card v-if="modelValue" flat style="overflow: auto">
    Настройки
    <VBtnBack @click="close()"></VBtnBack>
  </v-card>
</template>

<style scoped></style>
