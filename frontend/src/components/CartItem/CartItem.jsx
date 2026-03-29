import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const PLACEHOLDER = 'https://via.placeholder.com/100x100?text=No+Image';

export default function CartItem({ item }) {
  const { changeQuantity, deleteItem } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const price    = parseFloat(item.discount_price ?? item.price);
  const mrp      = item.discount_price ? parseFloat(item.price) : null;
  const subtotal = price * item.quantity;

  async function handleQtyChange(newQty) {
    if (newQty < 1 || newQty > Math.min(item.stock, 10)) return;
    setUpdating(true);
    try { await changeQuantity(item.id, newQty); }
    finally { setUpdating(false); }
  }

  async function handleRemove() {
    setRemoving(true);
    try { await deleteItem(item.id); }
    finally { setRemoving(false); }
  }

  return (
    <div className={`flex gap-3 sm:gap-4 p-4 sm:p-5 border-b border-gray-100 items-start transition-opacity ${removing ? 'opacity-40' : ''}`}>

      {/* Image */}
      <img
        src={item.image || PLACEHOLDER}
        alt={item.name}
        className="w-20 h-20 sm:w-[100px] sm:h-[100px] object-contain cursor-pointer shrink-0 bg-gray-50 border border-gray-100 rounded p-1"
        onClick={() => navigate(`/product/${item.product_id}`)}
      />

      {/* Info */}
      <div style={styles.info}>
        <p style={styles.name} onClick={() => navigate(`/product/${item.product_id}`)}>
          {item.name}
        </p>
        <p style={styles.brand}>{item.brand}</p>

        {/* Price */}
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{price.toLocaleString('en-IN')}</span>
          {mrp && <span style={styles.mrp}>₹{mrp.toLocaleString('en-IN')}</span>}
          {mrp && (
            <span style={styles.off}>
              {Math.round(((mrp - price) / mrp) * 100)}% off
            </span>
          )}
        </div>

        {/* Quantity stepper */}
        <div style={styles.qtyRow}>
          <button
            style={{ ...styles.qtyBtn, ...(item.quantity <= 1 || updating ? styles.qtyBtnDisabled : {}) }}
            onClick={() => handleQtyChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || updating}
          >−</button>

          <span style={styles.qtyValue}>{item.quantity}</span>

          <button
            style={{ ...styles.qtyBtn, ...(item.quantity >= Math.min(item.stock, 10) || updating ? styles.qtyBtnDisabled : {}) }}
            onClick={() => handleQtyChange(item.quantity + 1)}
            disabled={item.quantity >= Math.min(item.stock, 10) || updating}
          >+</button>

          {updating && <span style={styles.updatingText}>Updating…</span>}
        </div>
      </div>

      {/* Right — subtotal + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0 ml-auto">
        <p style={styles.subtotal}>₹{subtotal.toLocaleString('en-IN')}</p>
        <button style={styles.removeBtn} onClick={handleRemove} disabled={removing}>
          {removing ? '…' : 'Remove'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  row:          { display: 'flex', gap: '1rem', padding: '1.25rem', borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start', transition: 'opacity 0.2s' },
  image:        { width: '100px', height: '100px', objectFit: 'contain', cursor: 'pointer', flexShrink: 0, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '4px', padding: '4px' },
  info:         { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  name:         { fontSize: '0.95rem', color: '#212121', margin: 0, cursor: 'pointer', fontWeight: 500 },
  brand:        { fontSize: '0.78rem', color: '#878787', margin: 0 },
  priceRow:     { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  price:        { fontSize: '1rem', fontWeight: 700, color: '#212121' },
  mrp:          { fontSize: '0.85rem', color: '#878787', textDecoration: 'line-through' },
  off:          { fontSize: '0.82rem', color: '#388e3c', fontWeight: 500 },
  qtyRow:       { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' },
  qtyBtn:       { width: '28px', height: '28px', border: '1px solid #c2c2c2', borderRadius: '50%', background: '#fff', cursor: 'pointer', fontSize: '1.1rem', lineHeight: '26px', textAlign: 'center', color: '#212121', fontWeight: 600 },
  qtyBtnDisabled: { color: '#ccc', borderColor: '#e0e0e0', cursor: 'not-allowed' },
  qtyValue:     { minWidth: '28px', textAlign: 'center', fontSize: '0.95rem', fontWeight: 600 },
  updatingText: { fontSize: '0.78rem', color: '#878787' },
  right:        { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem', flexShrink: 0 },
  subtotal:     { fontSize: '1.05rem', fontWeight: 700, color: '#212121', margin: 0 },
  removeBtn:    { background: 'none', border: 'none', color: '#d32f2f', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 500, padding: '4px 8px', borderRadius: '4px' },
};
