// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ru } from 'vuetify/locale'
import { VBtn } from 'vuetify/components/VBtn'

// Create Vuetify instance
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi'
  },
  locale: {
    locale: 'ru',
    messages: { ru }
  },
  aliases: {
    VBtnRemove: VBtn,
    VBtnSave: VBtn,
    VBtnAdd: VBtn,
    VBtnCancel: VBtn,
    VBtnArchive: VBtn,
    VBtnBack: VBtn,
    VBtnPrimary: VBtn,
    VBtnEditIcon: VBtn
  },
  defaults: {
    VBtnRemove: {
      color: 'error',
      prependIcon: 'mdi-delete',
      density: 'comfortable'
    },
    VBtnCancel: {
      color: 'error',
      prependIcon: 'mdi-cancel',
      density: 'comfortable'
    },
    VBtnSave: {
      color: 'success',
      prependIcon: 'mdi-content-save-outline',
      density: 'comfortable'
    },
    VBtnAdd: {
      color: 'success',
      prependIcon: 'mdi-plus',
      density: 'comfortable'
    },
    VBtnBack: {
      color: 'dark',
      prependIcon: 'mdi-arrow-left',
      density: 'comfortable'
    },
    VBtnArchive: {
      color: 'warning',
      prependIcon: 'mdi-archive',
      density: 'comfortable'
    },
    VBtnPrimary: {
      color: 'primary',
      density: 'comfortable'
    },
    VBtnEditIcon: {
      color: 'blue',
      density: 'compact',
      variant: 'text',
      icon: 'mdi-pencil'
    },
    VTextField: { density: 'compact', variant: 'outlined', autocomplete: 'off', hideDetails: true },
    VTextarea: { counter: '256', density: 'compact', variant: 'outlined', noResize: true },
    VAutocomplete: { variant: 'outlined', density: 'compact', hideDetails: true },
    VCombobox: { variant: 'outlined', density: 'compact', autocomplete: 'off', hideDetails: true },
    VSelect: { variant: 'outlined', density: 'compact', autocomplete: 'off', hideDetails: true },
    VCheckbox: { variant: 'outlined', density: 'compact', hideDetails: true },
    VOtpInput: { type: 'text', length: '4', placeholder: '0', variant: 'outlined', density: 'compact' },
    VList: { density: 'compact' }
  }
})
