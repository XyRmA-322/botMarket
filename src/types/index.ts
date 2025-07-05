// export type Rule = (v: any) => boolean | string
// export type AccumulatorType = { [key: string | number]: number }
// export type FormatObject = { [key: string]: string }

/*----------------------|Снэкбар|---------------------------*/
export class SettingType {
  recid: string | null = null
  sound: boolean = true
  update_price: boolean = true
  api_market: string = ''
  teleg_chat_id: string = ''
  teleg_bot_token: string = ''
  teleg_message: string = 'Подтвердите'
  steam_token?: string
  steam_token_date?: string
  // is_online?: boolean
  user_id: string = ''
}
/*----------------------|Мои цены|---------------------------*/
export class MyPriceType {
  market_hash_name: string = ''
  percent: number = 10
  buy_price: number = 0
  user_id: string = ''
  is_update: boolean = false
  min_price?: number
  max_price?: number
}
/*----------------------|Item с market|---------------------------*/
export type MarketItemSaleType = {
  assetid: string
  botid: string
  classid: string
  currency: string
  instanceid: string
  item_id: string
  left: number | null
  live_time: number
  market_hash_name: string
  position: number
  price: number
  real_instance: string
  status: string
  my_price: MyPriceType
}

/*----------------------|Item с market с лучшей ценой|---------------------------*/
export type BestSaleItemsType = {
  [key: string]: BestSaleItemType[]
}
export type BestSaleItemType = {
  id: number
  price: number
  class: string
  instance: string
  extra: object
}
// /*----------------------|Сотрудники|---------------------------*/
// export class FilterUserType {
//   station: string | null = null
//   organization: number | null = null
//   depart: string | null = null
//   sub_depart: string | null = null
// }

// export class UserType {
//   username: string = ''
//   token?: string
//   refToken?: string
//   isBoss?: boolean
//   roles?: string[]
//   info: UserInfo = new UserInfo()
//   changeLog: {
//     username: string
//     [key: string]: string // Индексный тип для остальных полей
//   } = { username: this.username }
// }

// export class UserInfo {
//   username: string = ''
//   employee_id: string = ''
//   email: string = ''
//   kc_id: string = ''
//   photo: string = ''
//   full_name: string = ''
//   organization?: OrganizationType
//   position: string = ''
//   active: boolean = false
//   attributes: AttributeItemType[] | null = null
//   // departStationFromAD?: DepartStationFromADType
//   linkKpStruct?: LinkKpStructType
// }

// /*----------------------|Организация|---------------------------*/
// export type OrganizationType = {
//   recid: number
//   children: OrganizationType[] | null
//   type: 'filial' | 'org'
//   name: string
//   name_full: string
//   name_short: string
//   name_abb: string
//   active_direct?: string
// }
// /*----------------------|Отдел|---------------------------*/
// export interface DepartType {
//   code: string
//   name?: string
//   namek: string
//   aup?: boolean
// }
// /*----------------------|Отделы АУП|---------------------------*/
// export type DepartAupType = DepartType & {
//   owner?: any
//   is_tn_ural: number
// }
// /*----------------------|Отделы филиалов|---------------------------*/
// export type DepartFilialType = DepartType & {
//   active?: number
//   parentDepartments: DepartAupType[]
// }
// /*----------------------|Департаменты ПАО|---------------------------*/
// export type DepartmentPaoType = DepartType & {}
// /*----------------------|Участок/Служба|---------------------------*/
// export type SubDepartType = {
//   code: string
//   name: string
//   name_full?: string
//   active: number
// }
// /*----------------------|Отделы и станции из AD|---------------------------*/
// export type DepartStationFromADType = {
//   recid: number | null
//   depart?: DepartType
//   station?: StationType
//   subdepart?: SubDepartType
//   ou1: string
//   ou2: string
//   ou3: string
//   ou4: string
// }
// /*----------------------|Станции|---------------------------*/
// export type StationType = {
//   code: string
//   name: string
//   title: string
//   organization: OrganizationType
//   active: number | null
//   ord: number | null
// }
// /*----------------------|Файлы|---------------------------*/
// export type FileType = {
//   recid: number | null
//   file_path: string
//   file_name: string
//   original_file_name: string
//   app_name: string
//   size: number
//   date_created: string
//   recid_record: number
//   descr: string
//   type: string
//   file?: File
// }
// /*----------------------|Аудит|---------------------------*/
// export type AuditType = {
//   date_time: string
//   new_value: string
//   old_value: string
//   operation_type: 'UPDATE' | 'INSERT' | 'DELETE'
//   recid: number
//   recid_record: number
//   table_name: string
//   username?: UserInfo
// }
// /*----------------------|Общие аттрибуты|---------------------------*/
// export class AttributeType {
//   code: string = ''
//   name: string = ''
// }
// /*----------------------|Общие аттрибуты|---------------------------*/
// export class AttributeItemType {
//   recid: number | null = null
//   username?: UserInfo
//   value: string = ''
//   attribute: AttributeType = new AttributeType()
// }
// /*----------------------|КП Структура|---------------------------*/

// export type LinkKpStructType = {
//   objid: string
//   depart?: DepartType
//   station?: StationType
//   sub_depart?: SubDepartType
//   sync_group: number
// }
