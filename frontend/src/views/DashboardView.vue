<template>
  <div class="dashboard">
    <!-- 顶部 KPI 卡片 -->
    <div class="kpi-grid">
      <div v-for="(item, idx) in cards" :key="idx" class="kpi-card">
        <div class="kpi-label">{{ item.label }}</div>
        <div class="kpi-value">{{ formatNumber(item.value) }}</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <span class="chart-title">📈 销售额趋势（近30天）</span>
        </div>
        <div ref="trendChartRef" class="chart-container"></div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <span class="chart-title">🥧 品类销售额占比</span>
        </div>
        <div ref="pieChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import service from '../utils/request'  // 全局统一接口（自动区分环境）

const cards = ref([
  { label: '总销售额', value: 0 },
  { label: '订单总数', value: 0 },
  { label: '平均客单价', value: 0 },
  { label: '支付率', value: '100%' },
])

const trendChartRef = ref(null)
const pieChartRef = ref(null)
let trendChart = null
let pieChart = null

// 数字格式化
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  if (typeof num === 'number') {
    if (num > 1000) return num.toLocaleString()
    return num.toString()
  }
  return num
}

// 加载 KPI
const loadKpi = async () => {
  try {
    const { data } = await service.get('/dashboard/kpi')
    cards.value[0].value = data.totalSales || 0
    cards.value[1].value = data.orderCount || 0
    cards.value[2].value = data.avgOrderValue || 0
  } catch (error) {
    console.error('加载KPI失败', error)
    ElMessage.warning('加载关键指标失败')
  }
}

// 加载趋势图
const loadTrend = async () => {
  try {
    const { data } = await service.get('/dashboard/trend', { params: { days: 30 } })
    const dates = data.dates || []
    const sales = data.sales || []
    if (!trendChart) trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { top: 40, left: 60, right: 30, bottom: 30, containLabel: true },
      xAxis: { type: 'category', data: dates, axisLabel: { rotate: 30 }, name: '日期' },
      yAxis: { type: 'value', name: '销售额 (元)', nameLocation: 'middle', nameGap: 50 },
      series: [{
        type: 'line',
        data: sales,
        smooth: true,
        areaStyle: { opacity: 0.3, color: '#4f46e5' },
        lineStyle: { width: 3, color: '#4f46e5' },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#4f46e5', borderColor: '#fff', borderWidth: 2 }
      }]
    })
  } catch (error) {
    console.error('加载趋势图失败', error)
    ElMessage.warning('加载销售趋势失败')
  }
}

// 加载饼图
const loadPie = async () => {
  try {
    const { data } = await service.get('/dashboard/category-pie')
    if (!pieChart) pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left', textStyle: { color: '#333' } },
      series: [{
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        data: data.map(item => ({ name: item.name, value: item.value })),
        label: { show: true, formatter: '{b}: {d}%', fontWeight: 'normal' },
        labelLine: { length: 10, length2: 8, smooth: true },
        emphasis: { scale: true, label: { show: true, fontWeight: 'bold' } }
      }]
    })
  } catch (error) {
    console.error('加载饼图失败', error)
    ElMessage.warning('加载品类占比失败')
  }
}

// 统一加载
const loadAll = async () => {
  await Promise.all([loadKpi(), loadTrend(), loadPie()])
}

// 窗口缩放
const handleResize = () => {
  if (trendChart) trendChart.resize()
  if (pieChart) pieChart.resize()
}

onMounted(async () => {
  await loadAll()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (trendChart) trendChart.dispose()
  if (pieChart) pieChart.dispose()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(145deg, #f1f5f9 0%, #e6edf4 100%);
  padding: 2rem;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.kpi-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 28px;
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.2s;
}

.kpi-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 16px 32px -12px rgba(0, 0, 0, 0.1);
}

.kpi-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #4b5563;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.8rem;
}

.chart-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 32px;
  padding: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: box-shadow 0.2s;
}

.chart-card:hover {
  box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.08);
}

.chart-header {
  padding: 0.5rem 1rem 0;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(120deg, #1e293b, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.chart-container {
  width: 100%;
  height: 380px;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .chart-container {
    height: 300px;
  }
}
</style>