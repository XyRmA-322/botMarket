<script setup lang="ts">
import axios from 'axios'
import { defineAsyncComponent } from 'vue'
import { useAuthStore } from './stores/authStore'

const auth = useAuthStore()
const AuthForm = defineAsyncComponent(() => import('./views/AuthForm.vue'))
const Home = defineAsyncComponent(() => import('./views/Home_.vue'))

const fetchPrices = async () => {
  const { data } = await axios.get('/api/prices')
  console.log(data)
}
</script>

<template>
  <v-app :theme="'dark'">
    <v-main>
      <v-container>
        <AuthForm v-if="!auth.user"></AuthForm>
        <Home v-else></Home>
        <!-- <v-btn @click="fetchPrices"> Получить</v-btn> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.main_table td {
  font-size: 14px !important;
}
.main_table thead th {
  font-size: 16px !important;
  background: #2c75ff !important;
  text-align: center !important;
  color: #fff !important;
  border-right: 1px solid #c0c0c0 !important;
  border-bottom: 1px solid #c0c0c0 !important;
  height: max-content !important; /* Устанавливаем высоту на основе содержимого */
  padding: 3px 3px !important;
}

.main_table--row {
  cursor: pointer;
}
.main_table--row td {
  border-right: 1px solid #9e9e9e !important;
  border-bottom: 1px solid #9e9e9e !important;
  height: max-content; /* Устанавливаем высоту на основе содержимого */
  padding: 0 10px;
  /* padding: 2px 0 2px 15px !important; */
}
.main_table--group_row td {
  background: rgb(17, 135, 165);
  height: 40px;
}
</style>
