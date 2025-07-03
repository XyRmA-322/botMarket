import type { AxiosInstance } from 'axios'

function ErrorInterceptor(Api: AxiosInstance) {
  Api.interceptors.response.use(
    (response) => {
      const { data } = response

      if (data.status) {
        return data
      } else {
        throw new Error(data.message)
      }
    },
    (error) => {
      throw new Error(error)
    }
  )

  return Api
}

export default ErrorInterceptor
