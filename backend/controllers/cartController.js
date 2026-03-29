const Cart = require('../models/Cart');
const db = require('../config/db');

// Validate product exists and has enough stock
async function validateProduct(productId, requiredQty = 1) {
  const [[product]] = await db.query(
    'SELECT id, stock FROM products WHERE id = ?',
    [productId]
  );
  if (!product) return { error: 'Product not found', status: 404 };
  if (product.stock < requiredQty) return { error: 'Insufficient stock', status: 400 };
  return { product };
}

// GET /api/cart
async function getCart(req, res, next) {
  try {
    const items = await Cart.getByUserId(req.user.id);
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.discount_price || item.price);
      return sum + price * item.quantity;
    }, 0);

    res.json({ items, total: total.toFixed(2) });
  } catch (err) {
    next(err);
  }
}

// POST /api/cart
// Body: { product_id, quantity }
async function addToCart(req, res, next) {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: 'product_id is required' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: 'quantity must be a positive integer' });
    }

    const { error, status, product } = await validateProduct(product_id, qty);
    if (error) return res.status(status).json({ message: error });

    // Prevent duplicate — update quantity if item already in cart
    const existing = await Cart.findByUserAndProduct(req.user.id, product_id);
    if (existing) {
      const newQty = existing.quantity + qty;
      if (product.stock < newQty) {
        return res.status(400).json({ message: 'Insufficient stock for requested quantity' });
      }
      await Cart.updateQuantity(existing.id, newQty);
      return res.json({ message: 'Cart item quantity updated', cartItemId: existing.id, quantity: newQty });
    }

    const cartItemId = await Cart.addItem(req.user.id, product_id, qty);
    res.status(201).json({ message: 'Item added to cart', cartItemId, quantity: qty });
  } catch (err) {
    next(err);
  }
}

// PUT /api/cart/:id
// Body: { quantity }
async function updateCartItem(req, res, next) {
  try {
    const cartItemId = parseInt(req.params.id, 10);
    if (isNaN(cartItemId)) return res.status(400).json({ message: 'Invalid cart item ID' });

    const qty = parseInt(req.body.quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: 'quantity must be a positive integer' });
    }

    const item = await Cart.findItem(cartItemId, req.user.id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    const { error, status } = await validateProduct(item.product_id, qty);
    if (error) return res.status(status).json({ message: error });

    await Cart.updateQuantity(cartItemId, qty);
    res.json({ message: 'Cart item updated', cartItemId, quantity: qty });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/:id
async function removeFromCart(req, res, next) {
  try {
    const cartItemId = parseInt(req.params.id, 10);
    if (isNaN(cartItemId)) return res.status(400).json({ message: 'Invalid cart item ID' });

    const item = await Cart.findItem(cartItemId, req.user.id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    await Cart.removeItem(cartItemId);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
