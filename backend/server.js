const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 连接成功'))
  .catch(err => console.error('❌ MongoDB 连接失败:', err.message));

// 已有的
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
// 新增 ↓
app.use('/api/orders', require('./routes/orders'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 服务器运行在 http://localhost:${PORT}`));