import axios from 'axios'

// Creating an instance for axios to be used by the token interceptor service
const instance = axios.create({
  baseURL: '/api',
})

export default instance
