import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

function discountPct(price, discountPrice) {
  if (!discountPrice) return null;
  return Math.round(((price - discountPrice) / price) * 100);
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { items, addItem, changeQuantity, deleteItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding]   = useState(false);
  const [updating, setUpdating] = useState(false);

  const off          = discountPct(product.price, product.discount_price);
  const image        = product.images?.[0] || 'https://via.placeholder.com/200x200?text=No+Image';
  const displayPrice = product.discount_price ?? product.price;
  const inStock      = product.stock > 0;

  // Find this product in the cart (if present)
  const cartItem = items.find((i) => i.product_id === product.id);
  const inCart   = !!cartItem;

  async function handleAddToCart(e) {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!inStock || adding) return;
    setAdding(true);
    try { await addItem(product.id, 1); }
    finally { setAdding(false); }
  }

  async function handleDecrease(e) {
    e.stopPropagation();
    if (updating) return;
    setUpdating(true);
    try {
      if (cartItem.quantity === 1) {
        await deleteItem(cartItem.id);   // remove from cart entirely
      } else {
        await changeQuantity(cartItem.id, cartItem.quantity - 1);
      }
    } finally { setUpdating(false); }
  }

  async function handleIncrease(e) {
    e.stopPropagation();
    if (updating || cartItem.quantity >= Math.min(product.stock, 10)) return;
    setUpdating(true);
    try { await changeQuantity(cartItem.id, cartItem.quantity + 1); }
    finally { setUpdating(false); }
  }

  return (
    <div
      className="bg-white border border-gray-100 rounded cursor-pointer flex flex-col hover:shadow-lg transition-shadow duration-200 group"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative flex items-center justify-center bg-gray-50 p-4 h-44">
        <img
          src={image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {off && (
          <span className="absolute top-2 left-2 bg-flipgreen text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {off}% off
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-red-500 text-sm font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-xs text-flipgray">{product.brand}</p>
        <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug">{product.name}</p>

        <div className="flex items-baseline gap-1.5 flex-wrap mt-1">
          <span className="text-base font-bold text-gray-900">
            ₹{Number(displayPrice).toLocaleString('en-IN')}
          </span>
          {product.discount_price && (
            <span className="text-xs text-flipgray line-through">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          )}
          {off && <span className="text-xs text-flipgreen font-semibold">{off}% off</span>}
        </div>

        <p className="text-[11px] text-flipgray mt-0.5">
          {Number(displayPrice) >= 499 ? '✓ Free delivery' : 'Delivery ₹40'}
        </p>

        {/* CTA — stepper if in cart, button if not */}
        <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
          {inCart ? (
            <div className="flex items-center justify-between bg-fliporange rounded overflow-hidden">
              <button
                className="text-white font-bold text-xl w-10 h-9 flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50"
                onClick={handleDecrease}
                disabled={updating}
              >
                −
              </button>
              <span className="text-white font-bold text-sm min-w-[1.5rem] text-center">
                {updating ? '…' : cartItem.quantity}
              </span>
              <button
                className="text-white font-bold text-xl w-10 h-9 flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50"
                onClick={handleIncrease}
                disabled={updating || cartItem.quantity >= Math.min(product.stock, 10)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className={`w-full py-1.5 rounded text-sm font-semibold transition-colors
                ${!inStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : adding
                    ? 'bg-fliporange/70 text-white cursor-wait'
                    : 'bg-fliporange text-white hover:bg-orange-600'}`}
              onClick={handleAddToCart}
              disabled={!inStock || adding}
            >
              {adding ? 'Adding…' : inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
