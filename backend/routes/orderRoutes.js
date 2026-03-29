const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes require authentication
router.use(protect);

// POST /api/orders
router.post('/', placeOrder);

// GET  /api/orders
router.get('/', getUserOrders);

// GET  /api/orders/:id
router.get('/:id', getOrderById);

module.exports = router;
