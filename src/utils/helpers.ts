/**
 * 浏览器信息获取工具
 */
export const getBrowserInfo = (): string => {
  const userAgent = navigator.userAgent
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Chrome")) return "Chrome"
  if (userAgent.includes("Safari")) return "Safari"
  if (userAgent.includes("Edge")) return "Edge"
  if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer"
  return "Unknown Browser"
}

/**
 * 操作系统信息获取工具
 */
export const getOSInfo = (): string => {
  const userAgent = navigator.userAgent
  if (userAgent.includes("Windows")) return "Windows"
  if (userAgent.includes("Mac")) return "MacOS"
  if (userAgent.includes("Linux")) return "Linux"
  if (userAgent.includes("Android")) return "Android"
  if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS"
  return "Unknown OS"
}

/**
 * 屏幕尺寸获取工具
 */
export const getScreenSize = (): string => {
  return `${window.screen.width} x ${window.screen.height}`
}

/**
 * 日期格式化工具
 */
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString)
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * 认证状态检查
 * 结合isLogin标志和CSRF token来判断
 */
export const isAuthenticated = (): boolean => {
  // 检查登录状态标志和CSRF token
  const hasCsrfToken = (): boolean => {
    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
      const [name] = cookie.trim().split("=")
      if (name === "XSRF-TOKEN") {
        return true
      }
    }
    return false
  }

  return localStorage.getItem("isLogin") === "true" && hasCsrfToken()
}

/**
 * 安全地访问嵌套对象属性
 */
export const safeGet = (obj: any, path: string, defaultValue: any = undefined): any => {
  const keys = path.split(".")
  return keys.reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : defaultValue
  }, obj)
}
