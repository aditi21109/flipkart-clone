import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem/CartItem';
import Loader   from '../components/Loader/Loader';
import { useCart } from '../context/CartContext';

function PriceSummary({ items, total }) {
  const mrpTotal      = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
  const discountTotal = items.reduce((s, i) => {
    const saved = i.discount_price
      ? (parseFloat(i.price) - parseFloat(i.discount_price)) * i.quantity
      : 0;
    return s + saved;
  }, 0);
  const deliveryCharge = parseFloat(total) >= 499 ? 0 : 40;
  const finalAmount    = parseFloat(total) + deliveryCharge;

  return (
    <div style={styles.summary}>
      <h3 style={styles.summaryTitle}>PRICE DETAILS</h3>
      <hr style={styles.divider} />

      <div style={styles.summaryRow}>
        <span>Price ({items.length} item{items.length !== 1 ? 's' : ''})</span>
        <span>₹{mrpTotal.toLocaleString('en-IN')}</span>
      </div>

      {discountTotal > 0 && (
        <div style={styles.summaryRow}>
          <span>Discount</span>
          <span style={{ color: '#388e3c' }}>− ₹{discountTotal.toLocaleString('en-IN')}</span>
        </div>
      )}

      <div style={styles.summaryRow}>
        <span>Delivery Charges</span>
        {deliveryCharge === 0
          ? <span style={{ color: '#388e3c' }}>FREE</span>
          : <span>₹{deliveryCharge}</span>
        }
      </div>

      <hr style={styles.divider} />

      <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: '1rem' }}>
        <span>Total Amount</span>
        <span>₹{finalAmount.toLocaleString('en-IN')}</span>
      </div>

      {discountTotal > 0 && (
        <p style={styles.savings}>
          You will save ₹{discountTotal.toLocaleString('en-IN')} on this order
        </p>
      )}
    </div>
  );
}

export default function CartPage() {
  const { items, total, loading } = useCart();
  const navigate = useNavigate();

  if (loading) return <div style={styles.page}><Loader /></div>;

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyWrap}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>Your cart is empty!</h2>
          <p style={styles.emptyText}>Add items to it now.</p>
          <button style={styles.shopBtn} onClick={() => navigate('/')}>Shop Now</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="max-w-[1100px] mx-auto px-4 flex flex-col md:flex-row gap-4 items-start">

        {/* ── Left: item list ── */}
        <div className="flex-1 min-w-0">
          <div style={styles.itemsCard}>
            <div style={styles.cartHeader}>
              <h2 style={styles.cartTitle}>My Cart ({items.length})</h2>
            </div>

            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {/* Place order bar */}
            <div style={styles.placeOrderBar}>
              <div />
              <button style={styles.placeOrderBtn} onClick={() => navigate('/checkout')}>
                Place Order →
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: price summary ── */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-3 md:sticky md:top-[72px]">
          <PriceSummary items={items} total={total} />

          <button style={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>

          <div style={styles.safeBadge}>
            <span>🔒</span>
            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page:         { background: '#f1f3f6', minHeight: '100vh', padding: '1rem 0 2rem' },
  layout:       { maxWidth: '1100px', margin: '0 auto', padding: '0 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' },

  // Items column
  itemsCol:     { flex: 1, minWidth: 0 },
  itemsCard:    { background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cartHeader:   { padding: '1rem 1.25rem', borderBottom: '1px solid #f0f0f0' },
  cartTitle:    { margin: 0, fontSize: '1rem', fontWeight: 600, color: '#212121' },
  placeOrderBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid #f0f0f0', background: '#fff' },
  placeOrderBtn: { padding: '0.75rem 2.5rem', background: '#fb641b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },

  // Summary column
  summaryCol:   { width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'sticky', top: '72px' },
  summary:      { background: '#fff', borderRadius: '4px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  summaryTitle: { fontSize: '0.78rem', fontWeight: 700, color: '#878787', letterSpacing: '0.08em', margin: '0 0 0.75rem' },
  summaryRow:   { display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#212121', padding: '0.4rem 0' },
  divider:      { border: 'none', borderTop: '1px solid #f0f0f0', margin: '0.5rem 0' },
  savings:      { color: '#388e3c', fontSize: '0.82rem', fontWeight: 500, textAlign: 'center', marginTop: '0.75rem', background: '#f0faf0', padding: '0.5rem', borderRadius: '4px' },
  checkoutBtn:  { width: '100%', padding: '0.85rem', background: '#fb641b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
  safeBadge:    { display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.75rem', color: '#878787', textAlign: 'center', justifyContent: 'center' },

  // Empty state
  emptyWrap:    { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '0.75rem' },
  emptyIcon:    { fontSize: '4rem' },
  emptyTitle:   { fontSize: '1.3rem', color: '#212121', margin: 0 },
  emptyText:    { color: '#878787', margin: 0 },
  shopBtn:      { marginTop: '0.5rem', padding: '0.75rem 2.5rem', background: '#2874f0', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
};
