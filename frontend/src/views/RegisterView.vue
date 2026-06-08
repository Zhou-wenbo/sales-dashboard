<template>
  <div class="register-page">
    <div class="register-card">
      <div class="register-header">
        <h2>创建账号</h2>
        <p>加入我们，开始管理您的业务</p>
      </div>

      <el-input
        v-model="form.username"
        placeholder="用户名"
        class="register-input"
        :prefix-icon="User"
        clearable
      />
      <el-input
        v-model="form.password"
        type="password"
        placeholder="密码（至少6位）"
        class="register-input"
        :prefix-icon="Lock"
        show-password
      />

      <el-button
        type="primary"
        @click="handleRegister"
        class="register-btn"
        :loading="loading"
      >
        注册
      </el-button>

      <div class="login-link">
        已有账号？
        <span @click="$router.push('/login')">返回登录</span>
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

const handleRegister = async () => {
  if (!form.value.username) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!form.value.password || form.value.password.length < 6) {
    ElMessage.warning('密码长度不能少于6位')
    return
  }

  loading.value = true
  try {
    await service.post('/auth/register', form.value)
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (err) {
    const msg = err.response?.data?.message || '注册失败'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #4f46e5 0%, #38bdf8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.register-card {
  width: 420px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 40px;
  padding: 48px 40px;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.2s;
}

.register-card:hover {
  transform: translateY(-4px);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.register-header p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.register-input {
  margin-bottom: 20px;
}

.register-input :deep(.el-input__wrapper) {
  background-color: #f8fafc;
  border-radius: 28px;
  box-shadow: none;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  padding: 6px 16px;
}

.register-input :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e1;
}

.register-input :deep(.el-input__wrapper.is-focus) {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.register-input :deep(.el-input__inner) {
  font-size: 15px;
  color: #1e293b;
}

.register-btn {
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

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(79, 70, 229, 0.4);
}

.register-btn:active {
  transform: translateY(0);
}

.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #64748b;
}

.login-link span {
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.login-link span:hover {
  color: #4338ca;
  text-decoration: underline;
}

@media (max-width: 520px) {
  .register-card {
    width: 90%;
    padding: 40px 24px;
  }
  .register-header h2 {
    font-size: 24px;
  }
}
</style>