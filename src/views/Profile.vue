<template>
  <div class="profile-container">
    <div class="action-buttons">
      <a-button @click="$router.push('/')"> 返回首页 </a-button>
      <a-button danger type="primary" @click="handleLogout" :loading="loading">
        {{ loading ? "退出中..." : "退出登录" }}
      </a-button>
    </div>

    <a-spin :spinning="loading" tip="加载中...">
      <a-alert v-if="error" type="error" :message="error" show-icon class="error-alert" />
      <a-card :bordered="false" title="详细信息" v-if="userData">
        <a-descriptions :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
          <a-descriptions-item label="用户ID">
            {{ userData.id }}
          </a-descriptions-item>
          <a-descriptions-item label="用户名">
            {{ userData.name }}
          </a-descriptions-item>
          <a-descriptions-item label="邮箱">
              {{ userData.email }}
          </a-descriptions-item>
          <a-descriptions-item v-for="(value, key) in userDetailItems" :key="key" :label="key">
            {{ value || "未设置" }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ formatDate(userData.created_at || new Date()) }}
          </a-descriptions-item>
          <a-descriptions-item label="最后更新">
            {{ formatDate(userData.updated_at || new Date()) }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { apiService } from "../services/api"
import { formatDate, isAuthenticated } from "../utils/helpers"
import { message as antdMessage } from "ant-design-vue"

const router = useRouter()
const userData = ref<any>(null)
const loading = ref(true)
const error = ref("")

const userDetailItems = computed(() => {
  if (!userData.value) return {}

  const details: Record<string, any> = {}
  const userDataObj = userData.value as Record<string, any>

  // 过滤掉id, name, email等已经在上方显示的基本信息
  const excludeKeys = ["id", "name", "email", "created_at", "updated_at"]

  for (const key in userDataObj) {
    if (!excludeKeys.includes(key)) {
      // 格式化显示的键名
      const formattedKey = key
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      details[formattedKey] = userDataObj[key]
    }
  }

  return details
})

onMounted(async () => {
  try {
    loading.value = true

    // 尝试从localStorage获取用户数据（缓存）
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      userData.value = JSON.parse(storedUser)
    }

    // 尝试请求最新的用户资料
    try {
      let response;
      try {
        response = await apiService.getUserProfile()
      } catch (e) {
        // todo:/api/user暂时过不了，如果失败了，尝试从二次login接口获取
        response = await apiService.login({
          email: "",
          password: "",
        })
      }
      // 更新用户数据
      userData.value = response.data.data || response.data
      // 更新localStorage缓存
      localStorage.setItem("user", JSON.stringify(userData.value))
    } catch {}
  } finally {
    loading.value = false
  }
})

const handleLogout = async () => {
  try {
    loading.value = true
    // 调用登出API，服务器会清除会话Cookie
    await apiService.logout()
    // 显示成功消息
    antdMessage.success("已成功退出登录")
    // 返回首页
    router.push("/")
  } catch (err) {
    // 即使登出API失败，也清除本地数据（apiService.logout内部已处理）
    // 显示信息
    antdMessage.info("已退出登录")
    router.push("/")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}

.error-alert {
  margin-bottom: 16px;
}
</style>
