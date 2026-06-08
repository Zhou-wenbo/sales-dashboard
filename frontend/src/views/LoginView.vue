<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h2>欢迎回来</h2>
        <p>请登录您的账号</p>
      </div>

      <el-input
        v-model="form.username"
        placeholder="用户名"
        class="login-input"
        :prefix-icon="User"
      />
      <el-input
        v-model="form.password"
        type="password"
        placeholder="密码"
        class="login-input"
        :prefix-icon="Lock"
        show-password
      />

      <el-button type="primary" @click="handleLogin" class="login-btn" :loading="loading">
        登录
      </el-button>

      <div class="register-link">
        没有账号？
        <span @click="$router.push('/register')">立即注册</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import service from '../utils/request'

const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const { data } = await service.post('/auth/login', form.value)
    localStorage.setItem('token', data.token)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #4f46e5 0%, #38bdf8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.login-card {
  width: 420px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 40px;
  padding: 48px 40px;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.2s;
}

.login-card:hover {
  transform: translateY(-4px);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.login-header p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.login-input {
  margin-bottom: 20px;
}

.login-input :deep(.el-input__wrapper) {
  background-color: #f8fafc;
  border-radius: 28px;
  box-shadow: none;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  padding: 6px 16px;
}

.login-input :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e1;
}

.login-input :deep(.el-input__wrapper.is-focus) {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.login-input :deep(.el-input__inner) {
  font-size: 15px;
  color: #1e293b;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #4f46e5, #38bdf8);
  border: none;
  border-radius: 32px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 8px;
  transition: all 0.2s;
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(79, 70, 229, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.register-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #64748b;
}

.register-link span {
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.register-link span:hover {
  color: #4338ca;
  text-decoration: underline;
}

@media (max-width: 520px) {
  .login-card {
    width: 90%;
    padding: 40px 24px;
  }
  .login-header h2 {
    font-size: 24px;
  }
}
</style>