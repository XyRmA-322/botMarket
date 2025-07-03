<script lang="ts" setup>
import { computed, defineAsyncComponent, watch } from 'vue'

import { defineProps, PropType } from 'vue'
const props = defineProps({
   modelValue: {
     type: Boolean as PropType<boolean>,
     default: false
   }
})

const FormSetting = defineAsyncComponent(() => import('@/components/FormSettings.vue'))

const emits = defineEmits(['update:modelValue'])
const close = () => {
  emits('update:modelValue')
}
const isOpen = computed(():boolean => {
return props.modelValue || false
})
</script>

<template>
  <v-dialog v-model="isOpen" width="800">
    <v-card v-if="modelValue" flat min-height="600" style="overflow: auto">
      <v-toolbar>
        <v-card-title>Настройки аккаунта</v-card-title>
        <v-spacer></v-spacer>
        <VBtnBack @click="close()">Закрыть</VBtnBack>
      </v-toolbar>
      <v-card-text>
        <FormSetting></FormSetting>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
