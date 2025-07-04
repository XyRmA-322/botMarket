<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore'
import { useNsiStore } from '@/stores/nsiStore'
import { SettingType } from '@/types'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, watch } from 'vue'

const { setting } = storeToRefs(useNsiStore())
const authStore = useAuthStore()

const save = () => {
  if (authStore.user?.id) {
    // setting.value.item = new SettingType()
    setting.value.item.user_id = authStore.user?.id
    // setting.value.item.api_market = '8b40w7zrq0Q9Z8iV3WS80j8FN8H9G62'
  }
  console.log(setting.value.item)
  // return
  setting.value.set()
}
</script>

<template>
  <v-card>
    <v-text-field v-model.trim="setting.item.api_market" label="API Market" class="mt-4"></v-text-field>
    <v-checkbox v-model="setting.item.sound" label="Издавать звук при покупках" class="mt-4"></v-checkbox>
    <v-text-field v-model.trim="setting.item.teleg_bot_token" label="Токен телеграмм бота" class="mt-4"></v-text-field>
    <v-text-field v-model.trim="setting.item.teleg_chat_id" label="ID телеграмм чата" class="mt-4"></v-text-field>
    <v-text-field v-model.trim="setting.item.teleg_message" label="Сообщение в телегу при оповещении" class="mt-4"></v-text-field>
    <v-checkbox v-model="setting.item.update_price" label="Обновлять цены" class="mt-4"></v-checkbox>
    <v-textarea v-model.trim="setting.item.steam_token" label="Токен стима" class="mt-4" rows="4"></v-textarea>
    <a href="https://steamcommunity.com/pointssummary/ajaxgetasyncconfig">Ссылка для токена</a><br />
    <VBtnSave @click="save()" class="mt-4">Ок</VBtnSave>
    {{ setting.item }}
  </v-card>
</template>

<style scoped></style>
