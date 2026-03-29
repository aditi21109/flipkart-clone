const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes are protected — user must be logged in
router.use(protect);

// GET    /api/cart
router.get('/', getCart);

// POST   /api/cart
router.post('/', addToCart);

// PUT    /api/cart/:id
router.put('/:id', updateCartItem);

// DELETE /api/cart/:id
router.delete('/:id', removeFromCart);

module.exports = router;
