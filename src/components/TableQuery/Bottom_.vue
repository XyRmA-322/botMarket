<script lang="ts" setup></script>
<template>
  <v-row align="center" class="pa-4">
    <span class="ml-3">
      <v-avatar size="20" color="red"></v-avatar>
      - Вещь выставлена на продажу
    </span>
    <span class="ml-3">
      <v-avatar size="20" color="success"></v-avatar>
      - Вы продали вещь и должны ее передать боту
    </span>
    <span class="ml-3">
      <v-avatar size="20" color="yellow"></v-avatar>
      - Ожидание передачи боту купленной вами вещи от продавца
    </span>
    <span class="ml-3">
      <v-avatar size="20" color="primary"></v-avatar>
      - Вы можете забрать купленную вещь
    </span>
  </v-row>
</template>

<style scoped>
.legend_table {
  margin: 2px 2px 0 2px;
  width: 20px;
  height: 20px;
}
</style>
