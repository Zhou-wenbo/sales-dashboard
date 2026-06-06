const Order = require('../models/Order');

exports.getKpi = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$amount' }, orderCount: { $sum: 1 }, avgOrderValue: { $avg: '$amount' } } }
    ]);
    const kpi = result[0] || { totalSales: 0, orderCount: 0, avgOrderValue: 0 };
    res.json(kpi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTrend = async (req, res) => {
  try {
    const pipeline = [
      { $group: { 
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, 
        sales: { $sum: '$amount' } 
      }},
      { $sort: { _id: 1 } }
    ];
    const result = await Order.aggregate(pipeline);
    
    res.json({
      dates: result.map(r => r._id),
      sales: result.map(r => r.sales)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoryPie = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $group: { _id: '$category', value: { $sum: '$amount' } } },
      { $sort: { value: -1 } }
    ]);
    res.json(result.map(item => ({ name: item._id, value: item.value })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRegionBar = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $group: { _id: '$region', sales: { $sum: '$amount' } } },
      { $sort: { sales: -1 } }
    ]);
    res.json({ regions: result.map(r => r._id), sales: result.map(r => r.sales) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};