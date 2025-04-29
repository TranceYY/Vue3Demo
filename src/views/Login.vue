<template>
  <div class="login-container">
    <a-card class="login-card">
      <template #title>
        <div class="login-header">
          <h2 class="title">欢迎登录</h2>
        </div>
      </template>
      <a-alert v-if="error" type="error" :message="error" show-icon class="error-alert" />
      <a-form
        layout="vertical"
        :model="formState"
        @finish="handleLogin"
        :rules="[
          { required: true, message: '请输入邮箱地址!' },
          { type: 'email', message: '请输入有效的邮箱地址!' },
        ]"
      >
        <a-form-item label="邮箱地址" name="email">
          <a-input v-model:value="formState.email" placeholder="请输入邮箱地址" size="large">
            <template #prefix>
              <MailOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
          <a-input-password v-model:value="formState.password" placeholder="请输入密码" size="large">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block size="large">
            {{ loading ? "登录中..." : "登录" }}
          </a-button>
        </a-form-item>
      </a-form>

      <div class="footer-links">
        <a-button type="link" @click="$router.push('/')">
          <template #icon><ArrowLeftOutlined /></template>
          返回首页
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue"
import { message } from "ant-design-vue"
import { apiService } from "../services/api"

const router = useRouter()
const loading = ref(false)
const error = ref("")

const formState = reactive({
  email: "test@example.com",
  password: "password",
})

const handleLogin = async () => {
  loading.value = true
  error.value = ""

  try {
    const response = await apiService.login({
      email: formState.email,
      password: formState.password,
    })

    if (response.data) {
      message.success("登录成功")
      router.push("/profile")
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = "登录失败，请稍后重试"
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-header .title {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.login-header .subtitle {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.error-alert {
  margin-bottom: 24px;
}

.footer-links {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
