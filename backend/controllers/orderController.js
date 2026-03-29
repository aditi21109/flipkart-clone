const pool = require('../config/db');
const Order = require('../models/Order');

// POST /api/orders
// Body: { shipping: { name, phone, address, city, pincode } }
async function placeOrder(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const { shipping } = req.body;

    // Validate shipping fields
    const required = ['name', 'phone', 'address', 'city', 'pincode'];
    const missing = required.filter((f) => !shipping?.[f]?.toString().trim());
    if (missing.length) {
      return res.status(400).json({
        message: `Missing shipping fields: ${missing.join(', ')}`,
      });
    }

    // Fetch user's current cart (joined with product data)
    const [cartItems] = await conn.query(
      `SELECT
         ci.id          AS cart_item_id,
         ci.quantity,
         p.id           AS product_id,
         p.name,
         p.price,
         p.discount_price,
         p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock for every item before touching anything
    const outOfStock = cartItems.filter((item) => item.stock < item.quantity);
    if (outOfStock.length) {
      return res.status(400).json({
        message: 'Some items exceed available stock',
        items: outOfStock.map((i) => ({ product_id: i.product_id, name: i.name, available: i.stock })),
      });
    }

    // Calculate total using discount_price when available
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.discount_price ?? item.price);
      return sum + price * item.quantity;
    }, 0);

    // ── Transaction ───────────────────────────────────────────────────────────
    await conn.beginTransaction();

    const orderId = await Order.create(conn, {
      userId: req.user.id,
      cartItems,
      totalAmount: totalAmount.toFixed(2),
      shipping,
    });

    await conn.commit();
    // ─────────────────────────────────────────────────────────────────────────

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      total: totalAmount.toFixed(2),
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release(); // always return connection to pool
  }
}

// GET /api/orders
async function getUserOrders(req, res, next) {
  try {
    const orders = await Order.findAllByUserId(req.user.id);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id
async function getOrderById(req, res, next) {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) return res.status(400).json({ message: 'Invalid order ID' });

    const order = await Order.findById(orderId, req.user.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, getUserOrders, getOrderById };
