import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
  timeout: 10000
})

export default axiosInstance
