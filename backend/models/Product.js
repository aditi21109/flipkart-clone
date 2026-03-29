const db = require('../config/db');

// Attaches images array to each product row
function attachImages(products, images) {
  const map = {};
  products.forEach((p) => {
    map[p.id] = { ...p, images: [] };
  });
  images.forEach((img) => {
    if (map[img.product_id]) map[img.product_id].images.push(img.image_url);
  });
  return Object.values(map);
}

const Product = {
  // GET /products — search by name, filter by category, paginate
  async findAll({ search, category, page, limit }) {
    const offset = (page - 1) * limit;
    const params = [];
    const conditions = [];

    if (search) {
      // LIKE fallback — works even without a FULLTEXT index and handles short words
      conditions.push('p.name LIKE ?');
      params.push(`%${search}%`);
    }

    if (category) {
      conditions.push('p.category = ?');
      params.push(category);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [products] = await db.query(
      `SELECT p.id, p.name, p.description, p.price, p.discount_price,
              p.category, p.brand, p.stock, p.created_at
       FROM products p
       ${where}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    if (products.length === 0) return { products: [], total: 0 };

    // Fetch images for all products in one query
    const ids = products.map((p) => p.id);
    const [images] = await db.query(
      `SELECT product_id, image_url
       FROM product_images
       WHERE product_id IN (?)
       ORDER BY sort_order ASC`,
      [ids]
    );

    // Count total matching rows (for pagination meta)
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM products p ${where}`,
      params
    );

    return { products: attachImages(products, images), total };
  },

  // GET /products/:id
  async findById(id) {
    const [[product]] = await db.query(
      `SELECT id, name, description, price, discount_price,
              category, brand, stock, created_at
       FROM products
       WHERE id = ?`,
      [id]
    );

    if (!product) return null;

    const [images] = await db.query(
      `SELECT image_url FROM product_images
       WHERE product_id = ? ORDER BY sort_order ASC`,
      [id]
    );

    return { ...product, images: images.map((r) => r.image_url) };
  },
};

module.exports = Product;
