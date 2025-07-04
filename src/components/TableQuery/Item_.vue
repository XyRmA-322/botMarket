<script lang="ts" setup>
import { type MarketItemSaleType, MyPriceType } from '@/types'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, type PropType } from 'vue'
import { useNsiStore } from '@/stores/nsiStore'

const { market } = storeToRefs(useNsiStore())

const props = defineProps({
  item: {
    type: Object as PropType<MarketItemSaleType>, //GroupedGraphicItem
    required: true
  },
  index: {
    type: Number,
    default: -1
  }
})

onMounted(() => {
  // console.log(props.item)
})

const onOpenEdit = () => {
  console.log(1)
}
const setMyPrice = () => {
  if (!props.item.my_price.market_hash_name) {
    props.item.my_price.market_hash_name = props.item.market_hash_name
  }
  market.value.setMyPrice(props.item.my_price)
}
</script>
<template>
  <tr v-if="index === 0 || item.classid !== market.items[index - 1].classid" class="main_table--row main_table--group_row">
    <td colspan="3">
      <div class="py-3 d-flex align-center justify-space-between">
        {{ item.market_hash_name }}
        <v-checkbox v-model="item.my_price.is_update" class="ml-5" label="Отслеживать"></v-checkbox>
        <v-text-field v-model="item.my_price.percent" style="width: 40px" label="%"></v-text-field>
        <v-text-field v-model="item.my_price.buy_price" style="width: 80px" label="Цена закупа"></v-text-field>
        <VBtnSave @click="setMyPrice()">ок</VBtnSave>
      </div>
    </td>
  </tr>
  <tr @dblclick="onOpenEdit()" class="main_table--row">
    <!-- <td>{{ index + 1 }}</td> -->
    <td>
      <v-avatar v-if="item.status === '2'" size="20" color="success"></v-avatar>
      <v-avatar v-if="item.status === '1'" size="20" color="red"></v-avatar>
      <v-avatar v-if="item.status === '3'" size="20" color="yellow"></v-avatar>
      <v-avatar v-if="item.status === '4'" size="20" color="primary"></v-avatar>
      {{ item.market_hash_name }}
    </td>
    <td>{{ item.price }}</td>
    <td>{{ item.classid }}_{{ item.instanceid }}</td>
  </tr>
</template>

<style scoped>
tr {
  transition: all 0.3s ease;
}
.text_res:not(:empty) {
  background: #e57373;
}
.item_title {
  font-weight: bold;
}
</style>
