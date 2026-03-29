import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import { getOrderById } from '../services/orderService';

const STATUS_META = {
  pending:   { label: 'Order Placed',  color: '#ff9f00', icon: '📋' },
  confirmed: { label: 'Confirmed',     color: '#2874f0', icon: '✅' },
  shipped:   { label: 'Shipped',       color: '#ff9f00', icon: '🚚' },
  delivered: { label: 'Delivered',     color: '#388e3c', icon: '📦' },
  cancelled: { label: 'Cancelled',     color: '#d32f2f', icon: '✕'  },
};

export default function OrderDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();
  const justPlaced = location.state?.justPlaced;

  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data.order))
      .catch(() => setError('Order not found or access denied.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={styles.page}><Loader /></div>;

  if (error) return (
    <div style={styles.page}>
      <div style={styles.emptyWrap}>
        <p style={{ color: '#d32f2f', fontSize: '1.1rem' }}>{error}</p>
        <button style={styles.backBtn} onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );

  const status  = STATUS_META[order.status] || STATUS_META.pending;
  const total   = parseFloat(order.total_amount);
  const delivery = total >= 499 ? 0 : 40;

  return (
    <div style={styles.page}>

      {/* ── Success banner (shown only right after placing) ── */}
      {justPlaced && (
        <div style={styles.successBanner}>
          <span style={{ fontSize: '1.4rem' }}>🎉</span>
          <div>
            <p style={styles.successTitle}>Order placed successfully!</p>
            <p style={styles.successSub}>Thank you for shopping with us.</p>
          </div>
        </div>
      )}

      <div className="max-w-[1100px] mx-auto p-4 flex flex-col md:flex-row gap-4 items-start">

        {/* ── Left: items ── */}
        <div className="flex-1 min-w-0">

          {/* Order meta */}
          <div style={styles.card}>
            <div style={styles.orderMeta}>
              <div>
                <p style={styles.metaLabel}>Order ID</p>
                <p style={styles.metaValue}>#{order.id}</p>
              </div>
              <div>
                <p style={styles.metaLabel}>Placed on</p>
                <p style={styles.metaValue}>
                  {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p style={styles.metaLabel}>Total</p>
                <p style={styles.metaValue}>₹{(total + delivery).toLocaleString('en-IN')}</p>
              </div>
              <div style={{ ...styles.statusBadge, background: status.color }}>
                {status.icon} {status.label}
              </div>
            </div>
          </div>

          {/* Item list */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <img
                  src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                  alt={item.product_name}
                  style={styles.itemImg}
                  onClick={() => navigate(`/product/${item.product_id}`)}
                />
                <div style={styles.itemInfo}>
                  <p style={styles.itemName} onClick={() => navigate(`/product/${item.product_id}`)}>
                    {item.product_name}
                  </p>
                  <p style={styles.itemMeta}>{item.brand}</p>
                  <p style={styles.itemMeta}>Qty: {item.quantity}</p>
                </div>
                <div style={styles.itemPriceCol}>
                  <p style={styles.itemPrice}>
                    ₹{parseFloat(item.price_at_purchase).toLocaleString('en-IN')}
                  </p>
                  <p style={styles.itemSubtotal}>
                    Subtotal: ₹{(parseFloat(item.price_at_purchase) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button style={styles.backBtn} onClick={() => navigate('/')}>
            ← Continue Shopping
          </button>
        </div>

        {/* ── Right: delivery + price ── */}
        <div className="w-full md:w-[300px] shrink-0 md:sticky md:top-[72px]">

          {/* Delivery address */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Delivery Address</h3>
            <p style={styles.addrName}>{order.shipping_name}</p>
            <p style={styles.addrLine}>{order.shipping_address}</p>
            <p style={styles.addrLine}>{order.shipping_city} – {order.shipping_pincode}</p>
            <p style={styles.addrPhone}>📞 {order.shipping_phone}</p>
          </div>

          {/* Price summary */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Price Details</h3>
            <div style={styles.priceRow}>
              <span>Items ({order.items.length})</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div style={styles.priceRow}>
              <span>Delivery</span>
              {delivery === 0
                ? <span style={{ color: '#388e3c' }}>FREE</span>
                : <span>₹{delivery}</span>}
            </div>
            <hr style={styles.divider} />
            <div style={{ ...styles.priceRow, fontWeight: 700, fontSize: '1rem' }}>
              <span>Total</span>
              <span>₹{(total + delivery).toLocaleString('en-IN')}</span>
            </div>

            <div style={styles.codBadge}>
              💵 Cash on Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:          { background: '#f1f3f6', minHeight: '100vh', padding: '0 0 3rem' },
  layout:        { maxWidth: '1100px', margin: '1rem auto', padding: '0 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' },

  successBanner: { display: 'flex', alignItems: 'center', gap: '1rem', background: '#e8f5e9', borderBottom: '2px solid #388e3c', padding: '1rem 2rem' },
  successTitle:  { margin: 0, fontWeight: 700, fontSize: '1rem', color: '#1b5e20' },
  successSub:    { margin: 0, fontSize: '0.85rem', color: '#388e3c' },

  card:          { background: '#fff', borderRadius: '4px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1rem' },
  cardTitle:     { fontSize: '0.9rem', fontWeight: 700, color: '#212121', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.04em' },
  divider:       { border: 'none', borderTop: '1px solid #f0f0f0', margin: '0.75rem 0' },

  orderMeta:     { display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' },
  metaLabel:     { margin: 0, fontSize: '0.75rem', color: '#878787', textTransform: 'uppercase', letterSpacing: '0.04em' },
  metaValue:     { margin: '0.2rem 0 0', fontSize: '0.95rem', fontWeight: 600, color: '#212121' },
  statusBadge:   { marginLeft: 'auto', padding: '0.35rem 0.85rem', borderRadius: '20px', color: '#fff', fontSize: '0.82rem', fontWeight: 700 },

  itemRow:       { display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0', alignItems: 'center' },
  itemImg:       { width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: '4px', cursor: 'pointer', flexShrink: 0 },
  itemInfo:      { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  itemName:      { margin: 0, fontWeight: 500, fontSize: '0.9rem', color: '#212121', cursor: 'pointer' },
  itemMeta:      { margin: 0, fontSize: '0.78rem', color: '#878787' },
  itemPriceCol:  { textAlign: 'right', flexShrink: 0 },
  itemPrice:     { margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#212121' },
  itemSubtotal:  { margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#878787' },

  mainCol:       { flex: 1, minWidth: 0 },
  sideCol:       { width: '300px', flexShrink: 0, position: 'sticky', top: '72px' },

  addrName:      { margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.95rem', color: '#212121' },
  addrLine:      { margin: '0 0 0.2rem', fontSize: '0.88rem', color: '#444' },
  addrPhone:     { margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#444' },
  priceRow:      { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#212121', padding: '0.35rem 0' },
  codBadge:      { marginTop: '0.75rem', background: '#fff8e1', color: '#f57f17', fontSize: '0.82rem', fontWeight: 600, padding: '0.5rem 0.75rem', borderRadius: '4px', textAlign: 'center' },

  backBtn:       { padding: '0.65rem 1.5rem', background: '#2874f0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 },
  emptyWrap:     { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '0.75rem' },
};
