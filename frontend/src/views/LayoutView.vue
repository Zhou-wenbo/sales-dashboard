<template>
  <el-container class="app-layout">
    <el-aside :width="asideWidth" class="sidebar" :class="{ open: !isCollapse && isMobile }">
      <div class="logo-area" @click="toggleMenu">
        <el-icon><Menu /></el-icon>
      </div>

      <el-menu
        router
        :collapse="isCollapse"
        background-color="transparent"
        text-color="#e2e8f0"
        active-text-color="#38bdf8"
        class="sidebar-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>数据大盘</span>
        </el-menu-item>

        <el-menu-item index="/orders">
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
      </el-menu>

      <div class="logout-btn">
        <el-button type="danger" size="small" plain @click="logout">退出登录</el-button>
      </div>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-button v-if="isMobile" @click="toggleMenu" :icon="Menu" circle size="small" />
          <span class="title">销售数据分析系统</span>
        </div>
        <div class="header-right"></div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, DataBoard, Document } from '@element-plus/icons-vue'

const router = useRouter()
const isCollapse = ref(false)
const isMobile = ref(window.innerWidth <= 768)

const asideWidth = computed(() => (isCollapse.value ? '64px' : '260px'))

const toggleMenu = () => {
  isCollapse.value = !isCollapse.value
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const resize = () => {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) isCollapse.value = true
  else isCollapse.value = false
}

onMounted(() => window.addEventListener('resize', resize))
onUnmounted(() => window.removeEventListener('resize', resize))
</script>

<style scoped>
.app-layout {
  height: 100vh;
  background: #f1f5f9;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

/* ========== 侧边栏 ========== */
.sidebar {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  backdrop-filter: blur(2px);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  transition: width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
}

.logo-area {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f1f5f9;
  font-size: 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.2s;
}
.logo-area:hover {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  margin-top: 12px;
  background: transparent;
}
.sidebar-menu .el-menu-item {
  margin: 6px 12px;
  border-radius: 12px;
  transition: all 0.2s;
  height: 44px;
  line-height: 44px;
}
.sidebar-menu .el-menu-item:hover {
  background: rgba(56, 189, 248, 0.12);
  color: #ffffff;
}
.sidebar-menu .el-menu-item.is-active {
  background: linear-gradient(95deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.05));
  color: #38bdf8;
  border-right: none;
}
.sidebar-menu.el-menu--collapse .el-menu-item {
  margin: 6px auto;
  width: 44px;
  justify-content: center;
}

.logout-btn {
  padding: 20px 16px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.logout-btn .el-button {
  width: 100%;
  border-radius: 40px;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #f87171;
  transition: all 0.2s;
}
.logout-btn .el-button:hover {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

/* ========== 头部 ========== */
.header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  height: 64px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.title {
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(120deg, #0f172a, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.3px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ========== 主内容区 ========== */
.main-content {
  background: #f8fafc;
  padding: 20px 24px;
  overflow-y: auto;
}

/* ========== 移动端修复 ========== */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    width: 260px !important;
  }
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>