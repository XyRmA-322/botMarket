import { storeToRefs } from 'pinia'

import api from '../services/api'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
// import { useReportStore } from '@stores/reportStore'
// import { useAlertStore } from '../stores/alertStore'
// import { useFilterStore } from '../stores/filterStore'
import { supabase } from '../services/supabase'

import { useAuthStore } from './authStore'
import { BestSaleItemsType, type MarketItemSaleType, MyPriceType, SettingType } from '@/types'
import axios from 'axios'

import sound from '@/assets/sound.mp3'

export const getAxios = async (pApi: string) => {
  try {
    const apiURL = pApi
    const res = await api.get(apiURL)

    return res
  } catch (error) {
    // useAlertStore().show({ message: 'api-41' + error, type: 'error' })
    return []
  }
}
export const postAxios = async (pApi: string, pItem: object, pCheck: boolean = true) => {
  try {
    if (pCheck) {
      if (!confirm('Сохранить запись?')) return false
    }
    const apiURL = pApi
    const res = await api.post(apiURL, pItem)
    return res.data
  } catch (error) {
    // useAlertStore().show({ message: 'api-53' + error, type: 'error' })
    return []
  }
}
export const deleteAxios = async (pApi: string): Promise<boolean | number> => {
  try {
    if (!confirm('Удалить запись?')) return false
    const apiURL = pApi
    const res = await api.delete(apiURL, {})
    return res.status
  } catch (error) {
    // useAlertStore().show({ message: 'api-64' + error, type: 'error' })
    return false
  }
}

export const useNsiStore = defineStore('storeNsi', () => {
  // const reportStore = useReportStore()
  // const alertStore = useAlertStore()
  const authStore = useAuthStore()
  // const { filter } = storeToRefs(useFilterStore())

  //-------------------------------------| Steam |---------------------------------------
  const steam = reactive({
    api: {} as any,
    async pingMarket() {
      teleg.playSound()

      // Используем правильный путь (зависит от структуры вашего проекта)
      // try {
      //   // Получаем Steam куки из браузера (если пользователь авторизован)
      //   const steamCookies = document.cookie.split(';').find((c) => c.trim().startsWith('steamLoginSecure='))
      //   console.log(document.cookie)
      //   if (!steamCookies) {
      //     throw new Error('Steam login required')
      //   }
      //   const response = await axios.post('/api/csgo-ping', {
      //     steamCookies: steamCookies
      //   })
      //   console.log('Ping successful:', response.data)
      //   return response.data
      // } catch (error) {
      //   console.error('Ping failed:', error)
      //   throw error
      // }
    }
  })
  //-------------------------------------| Телега |---------------------------------------
  const teleg = reactive({
    async sendMessage() {
      const apiURL = 'https://api.telegram.org/bot' + setting.item.teleg_bot_token + '/sendMessage?chat_id=' + setting.item.teleg_chat_id + '&text=' + setting.item.teleg_message
      await getAxios(apiURL)
    },
    async playSound() {
      const audio = new Audio(sound) // или  для Vue
      audio.volume = setting.item.volume
      // Обработка promise от play()
      audio
        .play()
        .then(() => console.log('Sound played successfully'))
        .catch((error) => console.error('Error playing sound:', error))
    }
  })
  //-------------------------------------| Настройка |---------------------------------------
  const setting = reactive({
    item: {} as SettingType,
    async getSetting() {
      let { data, error } = await supabase.from('settings').select('*').eq('user_id', authStore.user?.id)
      if (data && data.length > 0) {
        this.item = data[0]
      }
    },
    async set() {
      if (this.item.recid) {
        await supabase.from('settings').update([this.item]).eq('recid', this.item.recid).select()
      } else {
        await supabase.from('settings').insert([this.item]).select()
      }
    }
  })
  //-------------------------------------| Маркет |---------------------------------------
  const market = reactive({
    items: [] as MarketItemSaleType[],
    my_prices: [] as MyPriceType[],
    best_prices: {} as BestSaleItemsType,
    uniqueUpdatedNames: [] as string[],

    async getItemsOnSale() {
      try {
        loadStatus.value = 0
        loadText.value = 'Получение моих цен'
        await this.getMyPrices()
        loadStatus.value = 15
        loadText.value = 'Получение выставленных предметов'
        const response = await axios.get('/api/get_items', {
          headers: {
            'X-CSGO-API-KEY': setting.item.api_market
          }
        })
        const tempList: MarketItemSaleType[] = response.data.items
        loadStatus.value = 40
        loadText.value = 'Обработка'

        // Создаем Map для быстрого поиска цен по market_hash_name
        const pricesMap = new Map<string, MyPriceType>()
        this.my_prices.forEach((price) => {
          pricesMap.set(price.market_hash_name, price)
        })
        loadStatus.value = 50
        loadText.value = 'Объединение с моими ценами'
        // Добавляем my_price к каждому элементу
        const itemsWithPrices = tempList.map((item) => ({
          ...item,
          my_price: pricesMap.get(item.market_hash_name) || new MyPriceType()
        }))
        loadStatus.value = 60
        loadText.value = 'Сортировка'
        // Сортировка
        let IsBuyItem: boolean = false
        const collator = new Intl.Collator(undefined, { sensitivity: 'base' })
        itemsWithPrices.sort((a, b) => {
          if ((a.status == '2' || b.status == '2') && !IsBuyItem) {
            IsBuyItem = true
            console.log(1)
          }
          return collator.compare(a.market_hash_name, b.market_hash_name)
        })
        if (IsBuyItem) {
          teleg.sendMessage()
          teleg.playSound()
        }
        loadStatus.value = 65
        loadText.value = 'Уникальные названия'
        this.uniqueUpdatedNames = [...new Set(itemsWithPrices.filter((item) => item.my_price?.is_update === true).map((item) => item.market_hash_name))]
        loadStatus.value = 75
        loadText.value = 'Получение лучших цен'
        this.items = itemsWithPrices

        await this.getBestSaleItems()
      } catch (error) {
        console.error('Error fetching items:', error)
        throw error
      }
    },
    async getMyPrices() {
      let { data, error } = await supabase.from('my_price').select('*').eq('user_id', authStore.user?.id)
      if (data && data.length > 0) {
        this.my_prices = data
      }
    },
    async setMyPrice(pItem: MyPriceType) {
      if (authStore.user?.id) {
        pItem.user_id = authStore.user.id
        await supabase.from('my_price').upsert([pItem]).eq('market_hash_name', pItem.market_hash_name).eq('user_id', authStore.user?.id).select()
        // this.getItemsOnSale()
      }
    },
    async massSetPrice(marketHashName: string, newPrice: number) {
      try {
        // Проверка минимальной цены
        if (newPrice < 50) {
          throw new Error('Minimum price is 50 kopecks')
        }

        const response = await axios.get('/api/mass_set_price', {
          headers: {
            'X-CSGO-API-KEY': setting.item.api_market
          },
          params: {
            marketHashName: encodeURIComponent(marketHashName),
            newPrice: Math.round(newPrice) // Убедимся, что цена целая
          }
        })

        if (!response.data.success) {
          throw new Error('Failed to update prices: ' + JSON.stringify(response.data))
        }

        return response.data
      } catch (error) {
        console.error('Error in massSetPrice:', error)
        throw error
      }
    },
    async getBestSaleItems() {
      this.best_prices = {}
      const chunkSize = 50
      const chunks = Array.from({ length: Math.ceil(this.uniqueUpdatedNames.length / chunkSize) }, (_, i) => this.uniqueUpdatedNames.slice(i * chunkSize, (i + 1) * chunkSize))

      // Формируем строки запроса
      const queryStrings = chunks.map((chunk) => chunk.map((name) => `&list_hash_name[]=${encodeURIComponent(name)}`).join(''))

      // Отправляем запросы и получаем данные
      const allResponses = await Promise.all(
        queryStrings.map((query) =>
          axios.get<BestSaleItemsType>(`/api/search_list_items_by_hash_name_all`, {
            headers: {
              'X-CSGO-API-KEY': setting.item.api_market
            },
            params: {
              marketHashNames: query
            }
          })
        )
      )

      // Извлекаем data из каждого ответа и объединяем
      const allData: any = allResponses.map((res) => res.data.data)
      console.log(allData)

      this.best_prices = Object.assign({}, ...allData)
      // Теперь обновляем цены
      loadText.value = 'Обновление новых цен'
      loadStatus.value = 85

      await this.updatePricesBasedOnBestPrices()
      loadStatus.value = 100
    },
    async updatePricesBasedOnBestPrices() {
      const RUB_TO_KOPECKS = 100

      try {
        // 1. Подготовка данных
        const itemsToUpdate: { item_id: number; price: number }[] = []
        const itemsByHashName: Record<string, MarketItemSaleType[]> = {}

        // Группируем предметы по market_hash_name
        this.items.forEach((item) => {
          if (!itemsByHashName[item.market_hash_name]) {
            itemsByHashName[item.market_hash_name] = []
          }
          itemsByHashName[item.market_hash_name].push(item)
        })

        // 2. Определение новых цен
        for (const [marketHashName, items] of Object.entries(itemsByHashName)) {
          const myPrice = items[0].my_price
          if (!myPrice?.is_update) continue

          const bestPrices = this.best_prices[marketHashName]
          if (!bestPrices?.length) continue

          const bestMarketPrice = bestPrices[0].price / RUB_TO_KOPECKS
          const currentMinPrice = Math.min(...items.map((i) => i.price))
          let newPrice = currentMinPrice

          // Логика определения новой цены
          if (myPrice.min_price !== undefined && bestMarketPrice < myPrice.min_price) {
            newPrice = myPrice.max_price ?? currentMinPrice
          } else if (currentMinPrice > bestMarketPrice) {
            newPrice = Math.max(bestMarketPrice - 0.01, myPrice.min_price ?? 0)
          } else if (currentMinPrice === bestMarketPrice) {
            newPrice = (bestPrices[1]?.price ?? bestPrices[0].price - 1) / RUB_TO_KOPECKS
          }

          const newPriceInKopecks = Math.round(newPrice * RUB_TO_KOPECKS)
          const currentPriceInKopecks = Math.round(currentMinPrice * RUB_TO_KOPECKS)

          if (newPriceInKopecks !== currentPriceInKopecks && newPriceInKopecks >= 50) {
            items.forEach((item) => {
              itemsToUpdate.push({
                item_id: parseInt(item.item_id),
                price: newPriceInKopecks
              })
            })
          }
        }

        // 3. Обновление цен батчами по 50 предметов
        if (itemsToUpdate.length > 0) {
          loadStatus.value = 0
          loadText.value = 'Обновление цен...'

          const BATCH_SIZE = 50
          let processed = 0
          let totalUpdated = 0
          let totalFailed = 0

          for (let i = 0; i < itemsToUpdate.length; i += BATCH_SIZE) {
            const batch = itemsToUpdate.slice(i, i + BATCH_SIZE)

            try {
              const result = await this.massSetPriceV2(batch)
              totalUpdated += result.updated.length
              totalFailed += result.failed.length

              if (result.failed.length > 0) {
                console.warn('Failed to update items:', result.failed)
              }
            } catch (error) {
              console.error('Batch update error:', error)
              totalFailed += batch.length
            }

            processed += batch.length
            loadStatus.value = Math.round((processed / itemsToUpdate.length) * 100)

            // Задержка между батчами
            if (i + BATCH_SIZE < itemsToUpdate.length) {
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }
          }

          loadText.value = `Обновлено ${totalUpdated} позиций, не удалось: ${totalFailed}`
        } else {
          loadText.value = 'Нет цен для обновления'
        }
      } catch (error) {
        console.error('Ошибка в updatePricesBasedOnBestPrices:', error)
        loadText.value = 'Ошибка при обновлении цен'
        throw error
      }
    },
    async massSetPriceV2(items: { item_id: number; price: number }[], currency: string = 'RUB') {
      try {
        // Валидация
        if (currency === 'RUB') {
          const invalidItem = items.find((item) => item.price > 0 && item.price < 50)
          if (invalidItem) {
            throw new Error(`Price for item ${invalidItem.item_id} is below minimum (50 kopecks)`)
          }
        }

        const response = await axios.post(
          '/api/mass_set_price_v2',
          JSON.stringify({ items, currency }), // Явное преобразование в JSON
          {
            headers: {
              'X-CSGO-API-KEY': setting.item.api_market,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.data?.success) {
          throw new Error(response.data?.error || 'Invalid response format')
        }

        return {
          success: true,
          updated: response.data.items?.filter((item: any) => item.success) || [],
          failed: items.filter((item) => !response.data.items?.some((su: any) => su.item_id === item.item_id))
        }
      } catch (error) {
        console.error('Detailed error:', error)
        throw error
      }
    }
  })
  // //-------------------------------------| Объединенные Отделы |--------------------------------------
  // const departFilter = computed((): DepartType[] => {
  //   return departCombined.list.filter(
  //     (item) => ([2, 21].includes(doc.value.editItem.organization?.recid || 0) && item.aup) || (![2, 21].includes(doc.value.editItem.organization?.recid || 0) && !item.aup)
  //   )
  // })
  // const departNewFilter = computed((): DepartType[] => {
  //   return departCombined.list.filter(
  //     (item) => ([2, 21].includes(doc.value.editItem.organization_new?.recid || 0) && item.aup) || (![2, 21].includes(doc.value.editItem.organization_new?.recid || 0) && !item.aup)
  //   )
  // })
  // const departForFilter = computed((): DepartType[] => {
  //   return departCombined.list.filter((item) => ([2, 21].includes(filter.value.organization || 0) && item.aup) || (![2, 21].includes(filter.value.organization || 0) && !item.aup))
  // })
  // const departCombined = reactive({
  //   list: [] as DepartType[],
  //   async get() {
  //     const apiURL = '/common/departcombined/all'
  //     this.list = await getAxios(apiURL)
  //   }
  // })
  // //-----------------------------| Пользователи |----------------------------------------
  // const users = reactive({
  //   list: [] as UserInfo[],
  //   filterUser: {
  //     organization: null,
  //     station: null,
  //     depart: null,
  //     sub_depart: null
  //   } as FilterUserType,
  //   async getByOrg(pOrg: number | undefined) {
  //     return
  //     const apiURL: string = '/common/iisuser/byfilial/' + pOrg
  //     this.list = await getAxios(apiURL)
  //   },
  //   async getUsersByFilter() {
  //     const apiURL: string = '/common/iisuser/byfilter'
  //     this.list = await postAxios(apiURL, this.filterUser, false)
  //   }
  // })
  // //-------------------------------------| Общие аттрибуты |--------------------------------------
  // const attributes = reactive({
  //   list: [] as AttributeType[],
  //   async getBySystem() {
  //     const apiURL = '/common/attribute/system/' + import.meta.env.VITE_APP_NAME
  //     this.list = await getAxios(apiURL)
  //   }
  // })
  // //-------------------------------------| Файлы |--------------------------
  // const file = reactive({
  //   appName: null,

  //   async set(pItem: FileType) {
  //     const apiURL = '/common/files/updateFile'
  //     return await postAxios(apiURL, pItem)
  //   },
  //   async upload(pFile: File | undefined, pAppName: string) {
  //     if (!pFile) return
  //     try {
  //       const formData = new FormData()
  //       formData.append('file', pFile)
  //       formData.append('app_name', pAppName)
  //       formData.append('descr', '')
  //       formData.append('recid_record', '-1')
  //       formLoading.value = true

  //       const apiURL = '/common/files/uploadFile'
  //       const res = await api.post(apiURL, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           'Access-Control-Allow-Origin': '*'
  //         }
  //       })
  //       return res.data
  //     } catch (error) {
  //       formLoading.value = false
  //       alertStore.show({ message: error + '', type: 'error' })
  //       return false
  //     }
  //   }
  // })
  // //------------------------------------| Прочее |-------------------------------------------
  const formLoading = ref(false)
  const loadStatus = ref<number>(0)
  const loadText = ref<string>('Начало')
  // const openNav = ref<boolean>(true)

  // // const stateFguList = ref([
  // //   { id: null, name: 'Все' },
  // //   { id: 1, name: 'Открыто' },
  // //   { id: 3, name: 'Закрыто' }
  // // ])

  return {
    //--------------|Steam|-------------------
    steam,
    //--------------|Телега|-------------------
    teleg,
    //--------------|Объединенные Отделы|-----------
    setting,
    //--------------|Маркет|-----------
    market,
    // departFilter,
    // departNewFilter,
    // departForFilter,
    // departCombined,
    // //--------------|Пользователи|------------------
    // users,
    // //--------------|Общие аттрибуты|---------------
    // attributes,
    // //--------------|Файлы|---------------
    // file,
    // //----------------|Прочее|---------
    formLoading,
    loadStatus,
    loadText
    // openNav
  }
})
