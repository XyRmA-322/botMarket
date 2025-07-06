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
  const lPercent = props.item.my_price.percent / 100
  props.item.my_price.min_price = props.item.my_price.buy_price * (1 - lPercent)
  props.item.my_price.max_price = props.item.my_price.buy_price * (1 + lPercent)
  market.value.setMyPrice(props.item.my_price)
}
</script>
<template>
  <tr v-if="index === 0 || item.classid !== market.items[index - 1].classid" class="main_table--row main_table--group_row">
    <td colspan="3">
      <v-row class="text-left align-center" dense>
        <v-col cols="3">
          {{ item.market_hash_name }}
        </v-col>
        <v-col cols="1"> Мин цена маркет: {{ market.best_prices[item.market_hash_name]?.[0].price / 100 }}руб. </v-col>
        <v-col>
          <v-checkbox v-model="item.my_price.is_update" class="ml-5" label="Отслеживать"></v-checkbox>
        </v-col>
        <v-col class="py-2">
          <v-text-field v-model="item.my_price.percent" label="%"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="item.my_price.buy_price" label="Цена закупа (руб)"></v-text-field>
        </v-col>
        <v-col>
          <VBtnSave @click="setMyPrice()">ок</VBtnSave>
        </v-col>
      </v-row>
    </td>
  </tr>
  <tr @dblclick="onOpenEdit()" class="main_table--row">
    <!-- <td>{{ index + 1 }}</td> -->
    <td>
      <v-avatar v-if="item.status === '2'" size="20" color="success"></v-avatar>
      <v-avatar v-if="item.status === '1'" size="20" color="red"></v-avatar>
      <v-avatar v-if="item.status === '3'" size="20" color="yellow"></v-avatar>
      <v-avatar v-if="item.status === '4'" size="20" color="primary"></v-avatar>
      <v-avatar v-if="item.status === '7'" size="20" color="white"></v-avatar>
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
