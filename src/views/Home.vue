<template>
  <div class="container">
    <a-spin :spinning="loading" tip="加载中..." size="large">
      <div class="content-container">
        <div class="header-actions">
          <a-button type="primary" @click="$router.push('/login')" v-if="!isAuthenticated"> 登录 </a-button>
          <a-button @click="$router.push('/profile')" :disabled="!isAuthenticated"> 个人资料 </a-button>
        </div>

        <a-card title="请求[/api/info]" class="mb-20">
          <template #extra>
            <a-button type="primary" @click="fetchServerInfo"> 获取信息 </a-button>
          </template>
          <a-typography v-if="serverInfo">
            <a-typography-paragraph>
              <pre class="server-info-pre">{{ JSON.stringify(serverInfo, null, 2) }}</pre>
            </a-typography-paragraph>
          </a-typography>
          <a-empty v-else description="暂无服务器信息" />
        </a-card>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { apiService } from "../services/api"
import { isAuthenticated as checkAuth } from "../utils/helpers"

const router = useRouter()
const serverInfo = ref(null)
const loading = ref(true)
const error = ref("")
const errorDetails = ref("")
const requestStatus = ref("未发送")
const testResult = ref("")

// 是否为开发环境
const isDev = ref(import.meta.env.DEV)

const isAuthenticated = computed(() => {
  return checkAuth()
})

async function fetchServerInfo() {
  try {
    loading.value = true
    error.value = ""
    errorDetails.value = ""
    requestStatus.value = "请求中..."

    const response = await apiService.getServerInfo()
    serverInfo.value = response.data
    requestStatus.value = "成功"
    loading.value = false
  } catch (err: any) {
    error.value = "获取服务器信息失败。"
    errorDetails.value = JSON.stringify(
      {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers,
      },
      null,
      2
    )
    requestStatus.value = err.response ? `${err.response.status} ${err.response.statusText}` : "网络错误"
    loading.value = false
  }
}

onMounted(() => {
  loading.value = false
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-container {
  margin-top: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.server-info-pre,
.error-details,
.test-result-pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
  max-height: 400px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
