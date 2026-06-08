<template>
  <div class="orders-page">
    <div class="page-header">
      <h2>订单管理</h2>
      <p>查看和管理所有销售订单</p>
    </div>

    <div class="filter-card">
      <el-form :inline="true" :model="filter" class="filter-form">
        <el-form-item label="商品分类">
          <el-select v-model="filter.category" placeholder="全部" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="load" :loading="loading" icon="Search">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-card">
      <el-table
        :data="list"
        v-loading="loading"
        stripe
        border
        class="order-table"
        :empty-text="'暂无订单数据'"
      >
        <el-table-column prop="_id" label="订单ID" min-width="200" show-overflow-tooltip />
        <el-table-column prop="amount" label="金额（元）" sortable>
          <template #default="{ row }">
            {{ row.amount?.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" />
        <el-table-column prop="region" label="地区" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row._id)" :icon="Delete" circle />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Search } from '@element-plus/icons-vue'
import service from '../utils/request'

const list = ref([])
const filter = ref({ category: '' })
const loading = ref(false)
const categories = ['电子产品', '服装', '家居', '食品', '图书']

const load = async () => {
  loading.value = true
  try {
    const params = {}
    if (filter.value.category) params.category = filter.value.category
    const { data } = await service.get('/orders', { params })
    list.value = data.orders || data
  } catch (err) {
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

const resetFilter = () => {
  filter.value.category = ''
  load()
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该订单吗？', '提示', { type: 'warning' })
    await service.delete(`/orders/${id}`)
    ElMessage.success('删除成功')
    load()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(() => load())
</script>

<style scoped>
.orders-page {
  padding: 20px;
  background: #f8fafc;
  min-height: 100%;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  margin-bottom: 24px;
}
.page-header h2 {
  font-size: 1.6rem;
  font-weight: 700;
  background: linear-gradient(120deg, #0f172a, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin: 0 0 4px 0;
  letter-spacing: -0.3px;
}
.page-header p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.filter-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 28px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.6);
}
.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.filter-form .el-form-item {
  margin-bottom: 0;
}
:deep(.el-select) {
  width: 160px;
}
:deep(.el-input__wrapper) {
  background-color: #fff;
  border-radius: 28px;
  box-shadow: none;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}
:deep(.el-input__wrapper:hover) {
  border-color: #cbd5e1;
}
:deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
}

.table-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 28px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.6);
}
.order-table {
  border-radius: 20px;
  overflow: hidden;
}
:deep(.el-table th) {
  background-color: #f1f5f9;
  color: #1e293b;
  font-weight: 600;
}
:deep(.el-table .el-button) {
  border-radius: 24px;
}
</style>