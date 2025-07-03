<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
import { useAuthStore } from '../stores/authStore'
const authStore = useAuthStore()
const Settings = defineAsyncComponent(() => import('./Settings.vue'))

const openSetting = ref<boolean>(false)

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
