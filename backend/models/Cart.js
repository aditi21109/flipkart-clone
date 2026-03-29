const db = require('../config/db');

const Cart = {
  // Fetch all cart items for a user, joined with product details + first image
  async getByUserId(userId) {
    const [rows] = await db.query(
      `SELECT
         ci.id,
         ci.quantity,
         p.id          AS product_id,
         p.name,
         p.price,
         p.discount_price,
         p.brand,
         p.stock,
         (SELECT image_url FROM product_images
          WHERE product_id = p.id
          ORDER BY sort_order ASC LIMIT 1) AS image
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`,
      [userId]
    );
    return rows;
  },

  // Find a single cart item by its id + user_id (ownership check)
  async findItem(cartItemId, userId) {
    const [[row]] = await db.query(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );
    return row || null;
  },

  // Check if product already exists in user's cart
  async findByUserAndProduct(userId, productId) {
    const [[row]] = await db.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return row || null;
  },

  // Insert a new cart item
  async addItem(userId, productId, quantity) {
    const [result] = await db.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
    return result.insertId;
  },

  // Update quantity on an existing cart item
  async updateQuantity(cartItemId, quantity) {
    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, cartItemId]
    );
  },

  // Delete a cart item
  async removeItem(cartItemId) {
    await db.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
  },
};

module.exports = Cart;
