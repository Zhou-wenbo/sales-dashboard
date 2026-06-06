const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router.use(auth);
router.get('/kpi', dashboardController.getKpi);
router.get('/trend', dashboardController.getTrend);
router.get('/category-pie', dashboardController.getCategoryPie);
router.get('/region-bar', dashboardController.getRegionBar);

module.exports = router;