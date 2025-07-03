import axiosInstance from '../services/api'

const setup = (store: any) => {
  axiosInstance.interceptors.request.use(
    (config:any) => {
      // If user is authenticated, place access token in request header.
      if (store.authenticated) {
        config.headers['Authorization'] = `Bearer ${store.user.token}`
      }

      return config
    },
    (error:any) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (res:any) => {
      return res
    },
    async (error:any) => {
      const oriConfig = error.config

      if (error.response?.status === 401 && !oriConfig._retry) {
        oriConfig._retry = true

        try {
          // Refresh token then retry once
          await store.refreshUserToken()

          // Place refreshed access token in the request header
          oriConfig.headers.headers['Authorization'] = `Bearer ${store.user.token}`

          return axiosInstance(oriConfig)
        } catch (_error) {
          console.error('Refresh token failed')
          console.log({ message: 'tokeninterceptors-40' + _error, type: 'error' })

          return Promise.reject(_error)
        }
      }

      return Promise.reject(error)
    }
  )
}

export default setup
