import httpClient from "../config/http"

// 获取/检查CSRF token
const getCsrfTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "XSRF-TOKEN") {
      return decodeURIComponent(value)
    }
  }
  return null
}

// 清除CSRF token
const clearCsrfToken = () => {
  document.cookie = "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

// API服务对象
export const apiService = {
  // 获取服务器信息
  getServerInfo() {
    // return httpClient.get("/")
    return httpClient.get("/server-info")
  },

  // 获取CSRF Cookie
  getCsrfCookie() {
    return httpClient.get("/csrf-cookie")
  },

  // 登录
  async login(credentials: { email: string; password: string }) {
    // 先获取CSRF令牌 - 这是关键步骤
    try {
      if (credentials.email && credentials.password) {
        //二次login时跳过getCsrfCookie()
        await this.getCsrfCookie()
      }
    } catch (err) {
      // 继续尝试登录
    }

    return httpClient.post("/login", credentials).then((response) => {
      // 只要状态码是200，就认为登录成功
      if (response.status === 200) {
        // 存储简单的登录状态标志
        localStorage.setItem("isLogin", "true")
      }
      return response
    })
  },

  // 检查是否有CSRF token
  hasCsrfToken() {
    return !!getCsrfTokenFromCookie()
  },

  // 退出
  logout() {
    return httpClient
      .post("/logout")
      .then((response) => {
        // 清除登录状态
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user")

        // 清除CSRF token
        clearCsrfToken()

        return response
      })
      .catch((error) => {
        // 即使API调用失败也清除本地状态
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user")
        clearCsrfToken()

        return Promise.reject(error)
      })
  },

  // 获取用户资料
  getUserProfile() {
    return httpClient.get("/api/user").catch((error) => {
      // 不再自动清除登录状态
      return Promise.reject(error)
    })
  },
}

export default apiService
