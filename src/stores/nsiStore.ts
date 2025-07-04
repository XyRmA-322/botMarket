import { storeToRefs } from 'pinia'

import api from '../services/api'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
// import { useReportStore } from '@stores/reportStore'
// import { useAlertStore } from '../stores/alertStore'
// import { useFilterStore } from '../stores/filterStore'
import { supabase } from '../services/supabase'

import { useAuthStore } from './authStore'
import { type MarketItemSaleType, MyPriceType, SettingType } from '@/types'
import axios from 'axios'

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
      try {
        // Получаем Steam куки из браузера (если пользователь авторизован)
        const steamCookies = document.cookie.split(';').find((c) => c.trim().startsWith('steamLoginSecure='))
        console.log(document.cookie)

        if (!steamCookies) {
          throw new Error('Steam login required')
        }

        const response = await axios.post('/api/csgo-ping', {
          steamCookies: steamCookies
        })

        console.log('Ping successful:', response.data)
        return response.data
      } catch (error) {
        console.error('Ping failed:', error)
        throw error
      }
    }
  })
  //-------------------------------------| Телега |---------------------------------------
  const teleg = reactive({
    async sendMessage() {
      const apiURL = 'https://api.telegram.org/bot' + setting.item.teleg_bot_token + '/sendMessage?chat_id=' + setting.item.teleg_chat_id + '&text=' + setting.item.teleg_message
      await getAxios(apiURL)
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
    async getItemsOnSale() {
      try {
        await this.getMyPrices()
        const response = await axios.get('/api/get_items', {
          headers: {
            'X-CSGO-API-KEY': setting.item.api_market
          }
        })
        const tempList: MarketItemSaleType[] = response.data.items

        // Создаем Map для быстрого поиска цен по market_hash_name
        const pricesMap = new Map<string, MyPriceType>()
        this.my_prices.forEach((price) => {
          pricesMap.set(price.market_hash_name, price)
        })

        // Добавляем my_price к каждому элементу
        const itemsWithPrices = tempList.map((item) => ({
          ...item,
          my_price: pricesMap.get(item.market_hash_name) || new MyPriceType()
        }))

        // Сортировка
        const collator = new Intl.Collator(undefined, { sensitivity: 'base' })
        itemsWithPrices.sort((a, b) => collator.compare(a.market_hash_name, b.market_hash_name))

        console.log(itemsWithPrices)
        this.items = itemsWithPrices
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
        this.getItemsOnSale()
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
  // const formLoading = ref(false)
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
    market
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
    // formLoading,
    // openNav
  }
})
