<script lang="ts" setup>
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/authStore'
import { useNsiStore } from '@/stores/nsiStore';
import { storeToRefs } from 'pinia';
const authStore = useAuthStore()
const {setting} = storeToRefs(useNsiStore())
const Settings = defineAsyncComponent(() => import('./Settings.vue'))

const openSetting = ref<boolean>(false)

onMounted(() => {
  setting.value.getSetting()
})

</script>
<template>
  <v-sheet>
    <v-toolbar>
      <v-btn @click="openSetting = true">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-toolbar>
    <Settings v-model="openSetting" @update:model-value="openSetting = false"></Settings>
  </v-sheet>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
