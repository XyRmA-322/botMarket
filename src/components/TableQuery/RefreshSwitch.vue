<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useNsiStore } from '@/stores/nsiStore'
import { storeToRefs } from 'pinia'

const { setting, market } = storeToRefs(useNsiStore())

const autoRefreshEnabled = ref(false)
let refreshInterval: any = null
const REFRESH_INTERVAL = 60000 // 60 секунд

const handleAutoRefreshChange = (enabled: boolean | null) => {
  if (enabled) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

const startAutoRefresh = async () => {
  // Сразу запускаем первое обновление
  await runUpdateCycle()

  // Затем устанавливаем интервал
  refreshInterval = setInterval(async () => {
    if (autoRefreshEnabled.value) {
      await runUpdateCycle()
    }
  }, REFRESH_INTERVAL)
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

const runUpdateCycle = async () => {
  try {
    await market.value.getItemsOnSale()
    console.log('Цикл обновления завершен')
  } catch (error) {
    console.error('Ошибка в цикле обновления:', error)
    // Можно добавить уведомление об ошибке
  }
}

// Очищаем интервал при размонтировании компонента
onBeforeUnmount(() => {
  stopAutoRefresh()
})

watch(
  () => autoRefreshEnabled.value,
  (newV) => {
    if (newV) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }
  }
)
watch(
  () => setting.value.item.update_price,
  (newV) => {
    autoRefreshEnabled.value = newV
  },
  {
    immediate: true //позволяет вызвать watch сразу после создания
  }
)
</script>

<template>
  <v-switch v-model="autoRefreshEnabled" color="primary" label="Автообновление" @update:model-value="handleAutoRefreshChange"></v-switch>
</template>
