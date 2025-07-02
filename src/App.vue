<script setup lang="ts">
import axios from 'axios';

const fetchPrices = async () => {
  const { data } = await axios.get('/api/prices');
  console.log(data);
  
};
</script>
  
<template>
    <v-app>
      <v-main>
        <v-container>
          <v-btn @click="fetchPrices">Получить</v-btn>
        </v-container>
      </v-main>
    </v-app>
  </template>
  