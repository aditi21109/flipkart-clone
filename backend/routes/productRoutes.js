const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById } = require('../controllers/productController');

// GET /api/products?search=&category=&page=&limit=
router.get('/', getAllProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

module.exports = router;
