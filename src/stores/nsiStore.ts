import { storeToRefs } from 'pinia'

import api from '../services/api'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
// import { useReportStore } from '@stores/reportStore'
// import { useAlertStore } from '../stores/alertStore'
// import { useFilterStore } from '../stores/filterStore'
import { supabase } from '../services/supabase'

import { useAuthStore } from './authStore'
import { SettingType } from '@/types'

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

  //-------------------------------------| Организации |---------------------------------------
  const steam = reactive({
    api: {} as any,
    async getApi() {
      const apiURL = 'https://market.csgo.com/api/v2/prices/RUB.json'
      this.api = await getAxios(apiURL)
    }
  })
  //-------------------------------------| Организации |---------------------------------------
  const setting = reactive({
    item: {} as SettingType,
    async getSetting() {
      let { data, error } = await supabase
        .from('settings')
        .select("*")
        .eq('user_id', authStore.user?.id)
        if (data && data.length > 0) {
          console.log(data[0]);
          this.item = data[0]
        }
        
    },
    async set() {
      const { data, error } = await supabase
        .from('settings')
        .insert([
          this.item
        ])
        .select()
        
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
    //--------------|Организация|-------------------
    steam,
    //--------------|Объединенные Отделы|-----------
    setting
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
