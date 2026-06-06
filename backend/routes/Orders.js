const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// 全量使用登录验证
router.use(auth);

// 获取订单列表（支持分页 + 搜索）
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 搜索条件
    const filter = { user: req.userId };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.region) filter.region = req.query.region;

    const orders = await Order.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 删除订单
router.delete('/:id', async (req, res) => {
  try {
    await Order.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;