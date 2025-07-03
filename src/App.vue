<script setup lang="ts">
import axios from 'axios';
import { defineAsyncComponent } from 'vue';
import { useAuthStore } from './stores/authStore';


const auth = useAuthStore()
const AuthForm = defineAsyncComponent(() => import('./views/AuthForm.vue'))
const Home = defineAsyncComponent(() => import('./views/Home_.vue'))

const fetchPrices = async () => {
  const { data } = await axios.get('/api/prices');
  console.log(data);
  
};
</script>
  
<template>
    <v-app :theme="'dark'">
      <v-main>
        <v-container>
          <AuthForm v-if="!auth.user"></AuthForm>
          <Home v-else></Home>
          <v-btn @click="fetchPrices"> Получить</v-btn>
        </v-container>
      </v-main>
    </v-app>
  </template>
  