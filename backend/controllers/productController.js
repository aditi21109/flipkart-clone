const Product = require('../models/Product');

// GET /api/products?search=phone&category=Electronics&page=1&limit=10
async function getAllProducts(req, res, next) {
  try {
    const {
      search = '',
      category = '',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10)); // cap at 50

    const { products, total } = await Product.findAll({
      search: search.trim(),
      category: category.trim(),
      page: pageNum,
      limit: limitNum,
    });

    res.json({
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid product ID' });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ product });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllProducts, getProductById };
