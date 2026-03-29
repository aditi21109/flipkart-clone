const pool = require('../config/db'); // pool.promise() instance

const Order = {
  // Place order inside a transaction.
  // conn is a dedicated connection obtained by the controller.
  async create(conn, { userId, cartItems, totalAmount, shipping }) {
    // 1. Insert the order row
    const [orderResult] = await conn.query(
      `INSERT INTO orders
         (user_id, total_amount, shipping_name, shipping_phone,
          shipping_address, shipping_city, shipping_pincode)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        totalAmount,
        shipping.name,
        shipping.phone,
        shipping.address,
        shipping.city,
        shipping.pincode,
      ]
    );
    const orderId = orderResult.insertId;

    // 2. Insert all order_items in one batch
    const itemRows = cartItems.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.discount_price ?? item.price, // lock in price at time of purchase
    ]);
    await conn.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?',
      [itemRows]
    );

    // 3. Decrement stock for each product
    for (const item of cartItems) {
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [item.quantity, item.product_id, item.quantity]
      );
    }

    // 4. Clear user's cart
    await conn.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    return orderId;
  },

  // GET /orders — all orders for a user (summary list, no items)
  async findAllByUserId(userId) {
    const [orders] = await pool.query(
      `SELECT id, total_amount, status, created_at,
              shipping_city, shipping_pincode
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return orders;
  },

  // GET /orders/:id — full order with its items
  async findById(orderId, userId) {
    const [[order]] = await pool.query(
      `SELECT id, total_amount, status,
              shipping_name, shipping_phone, shipping_address,
              shipping_city, shipping_pincode, created_at
       FROM orders
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );
    if (!order) return null;

    const [items] = await pool.query(
      `SELECT
         oi.id,
         oi.quantity,
         oi.price_at_purchase,
         p.id   AS product_id,
         p.name AS product_name,
         p.brand,
         (SELECT image_url FROM product_images
          WHERE product_id = p.id
          ORDER BY sort_order ASC LIMIT 1) AS image
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return { ...order, items };
  },
};

module.exports = Order;
