import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'
import type { AuthError, User } from '@supabase/supabase-js'
import { SettingType } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  settings: SettingType
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    settings: new SettingType()
  }),
  actions: {
    async init() {
      const { data: { user } } = await supabase.auth.getUser()
      this.user = user
    },
    async signIn(email: string, password: string) {
      this.isLoading = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
       
        
        if (error) throw error
        this.user = data.user
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          error: (error as AuthError).message 
        }
      } finally {
        this.isLoading = false
      }
    },
    async signUp(email: string, password: string) {
      this.isLoading = true
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/confirm`
          }
        })
        if (error) throw error
        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: (error as AuthError).message
        }
      } finally {
        this.isLoading = false
      }
    },
    async signOut() {
      await supabase.auth.signOut()
      this.user = null
    }
  }
})