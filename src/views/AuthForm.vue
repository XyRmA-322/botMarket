<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'
import { onMounted, ref } from 'vue'

const tab = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const error = ref('')

const auth = useAuthStore()

const emailRules = [
  (v: string) => !!v || 'Email обязателен',
  (v: string) => /.+@.+\..+/.test(v) || 'Email должен быть валидным'
]

const passwordRules = [
  (v: string) => !!v || 'Пароль обязателен',
  (v: string) => v.length >= 6 || 'Пароль должен быть не менее 6 символов'
]

onMounted(()=>{
  auth.init()
})

const handleSubmit = async () => {
  error.value = ''
  
  if (tab.value === 'login') {
    const result = await auth.signIn(email.value, password.value)
    if (!result.success) error.value = result.error || 'Ошибка входа'
  } else {
    // const result = await auth.signInWithGoogle()
    const result = await auth.signUp(email.value, password.value)
    if (!result.success) {
      error.value = result.error || 'Ошибка регистрации'
    } else {
      error.value = 'Проверьте вашу почту для подтверждения!'
    }
  }
}
</script>
<template>
  <v-card max-width="500" class="mx-auto">
    <v-tabs v-model="tab" grow>
      <v-tab value="login">Вход</v-tab>
      <v-tab value="register">Регистрация</v-tab>
    </v-tabs>

    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          type="email"
          required
        />

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          class="mt-4"
          label="Пароль"
          type="password"
          required
        />

        <v-btn 
          type="submit" 
          color="primary" 
          block 
          :loading="auth.isLoading"
        >
          {{ tab === 'login' ? 'Войти' : 'Зарегистрироваться' }}
        </v-btn>

        <v-alert
          v-if="error"
          type="error"
          class="mt-4"
        >
          {{ error }}
        </v-alert>
      </v-form>
    </v-card-text>
  </v-card>
</template>

