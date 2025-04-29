// import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios"
import axios, { AxiosInstance } from "axios"


// 根据环境确定基础URL
const getBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL || ""
  }
  return import.meta.env.VITE_API_BASE_URL || ""
}

// axios实例
const httpClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, // 确保每次请求都带上 csrf cookie
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
      //"X-Requested-With": "XMLHttpRequest",
  },
  timeout: 10000,
  // xsrfCookieName: "XSRF-TOKEN",
  // xsrfHeaderName: "X-XSRF-TOKEN",
})

// 请求拦截器
// httpClient.interceptors.request.use(
//   (config) => {
//     // 设置XSRF-TOKEN头部
//     const cookies = document.cookie.split(";")
//     let xsrfToken = ""
//
//     for (const cookie of cookies) {
//       const [name, value] = cookie.trim().split("=")
//       if (name === "XSRF-TOKEN") {
//         xsrfToken = decodeURIComponent(value)
//         break
//       }
//     }
//
//     if (xsrfToken) {
//       config.headers["X-XSRF-TOKEN"] = xsrfToken
//     }
//
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// 通用错误处理
// const handleApiError = (error: AxiosError) => {
//   return Promise.reject(error)
// }

// 添加响应拦截器处理错误
// httpClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => handleApiError(error)
// )

export default httpClient
