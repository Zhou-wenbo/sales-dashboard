const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Order = require('../models/Order');
const User = require('../models/User');
require('dotenv').config();

const categories = ['电子产品', '服装', '家居', '食品', '图书'];
const regions = ['华东', '华南', '华北', '西南', '西北'];

async function generate() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find();
  if (users.length === 0) throw new Error('请先注册至少一个用户');
  const userId = users[0]._id;
  const orders = [];
  for (let i = 0; i < 1000; i++) {
    orders.push({
      user: userId,
      amount: faker.number.int({ min: 50, max: 5000 }),
      category: faker.helpers.arrayElement(categories),
      region: faker.helpers.arrayElement(regions),
      status: 'paid',
      date: faker.date.between({ from: '2024-01-01', to: '2025-05-31' })
    });
  }
  await Order.insertMany(orders);
  console.log('✅ 已生成1000条订单');
  process.exit(0);
}
generate().catch(console.error);