import axios from 'axios'

// 判断是否上线
const isProduction = process.env.NODE_ENV === 'production'

// 创建 axios 实例
const service = axios.create({
  // 本地用 localhost，上线 Cloudflare 自动用 /api，零修改切换
  baseURL: isProduction ? '/api' : 'http://localhost:5000/api',
  timeout: 5000
})

// 请求拦截器（带 token）
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err)
  }
)

export default service