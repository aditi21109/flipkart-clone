import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageCarousel       from '../components/ImageCarousel/ImageCarousel';
import Loader              from '../components/Loader/Loader';
import { getProductById }  from '../services/productService';
import { useCart }         from '../context/CartContext';
import { useAuth }         from '../context/AuthContext';

function calcDiscount(price, discountPrice) {
  if (!discountPrice) return null;
  return Math.round(((price - discountPrice) / price) * 100);
}

export default function ProductDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [qty, setQty]           = useState(1);
  const [cartMsg, setCartMsg]   = useState(''); // success / error feedback

  useEffect(() => {
    setLoading(true);
    setError('');
    getProductById(id)
      .then((res) => setProduct(res.data.product))
      .catch(() => setError('Product not found or failed to load.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddToCart() {
    if (!isAuthenticated) { navigate('/login', { state: { from: { pathname: `/product/${id}` } } }); return; }
    try {
      await addItem(product.id, qty);
      showCartMessage('✓ Added to cart!', '#388e3c');
    } catch {
      showCartMessage('Could not add to cart.', '#d32f2f');
    }
  }

  async function handleBuyNow() {
    if (!isAuthenticated) { navigate('/login', { state: { from: { pathname: `/product/${id}` } } }); return; }
    try {
      await addItem(product.id, qty);
      navigate('/cart');
    } catch {
      showCartMessage('Could not add to cart.', '#d32f2f');
    }
  }

  function showCartMessage(msg, color) {
    setCartMsg({ text: msg, color });
    setTimeout(() => setCartMsg(''), 3000);
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return <div style={styles.page}><Loader /></div>;

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{ ...styles.page, textAlign: 'center', paddingTop: '4rem' }}>
      <p style={{ color: '#d32f2f', fontSize: '1.1rem' }}>{error}</p>
      <button style={styles.btnBack} onClick={() => navigate('/')}>← Back to Home</button>
    </div>
  );

  const off          = calcDiscount(product.price, product.discount_price);
  const displayPrice = product.discount_price ?? product.price;
  const inStock      = product.stock > 0;
  const maxQty       = Math.min(product.stock, 5); // cap quantity selector at 5

  return (
    <div style={styles.page}>

      {/* ── Breadcrumb ── */}
      <nav style={styles.breadcrumb}>
        <span style={styles.breadLink} onClick={() => navigate('/')}>Home</span>
        <span style={styles.sep}>›</span>
        <span style={styles.breadLink} onClick={() => navigate(`/?category=${product.category}`)}>{product.category}</span>
        <span style={styles.sep}>›</span>
        <span style={styles.breadCurrent}>{product.name}</span>
      </nav>

      {/* ── Main card ── */}
      <div className="max-w-[1100px] mx-auto bg-white rounded shadow-sm my-4 flex flex-col md:flex-row">

        {/* Left — carousel */}
        <div className="w-full md:w-[380px] shrink-0 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col gap-4">
          <ImageCarousel images={product.images} />

          {/* Sticky action buttons on desktop */}
          <div style={styles.stickyActions}>
            <div style={styles.qtyRow}>
              <span style={styles.qtyLabel}>Qty:</span>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                style={styles.qtySelect}
                disabled={!inStock}
              >
                {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {cartMsg && (
              <p style={{ ...styles.cartMsg, color: cartMsg.color }}>{cartMsg.text}</p>
            )}

            <button
              style={{ ...styles.btnCart, ...(!inStock ? styles.btnDisabled : {}) }}
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              🛒 {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              style={{ ...styles.btnBuy, ...(!inStock ? styles.btnDisabled : {}) }}
              onClick={handleBuyNow}
              disabled={!inStock}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>

        {/* Right — product info */}
        <div className="flex-1 min-w-0 p-4 md:p-6 flex flex-col gap-2">
          <p style={styles.brand}>{product.brand}</p>
          <h1 style={styles.name}>{product.name}</h1>

          {/* Rating placeholder */}
          <div style={styles.ratingRow}>
            <span style={styles.ratingBadge}>4.3 ★</span>
            <span style={styles.ratingCount}>2,345 Ratings & 456 Reviews</span>
          </div>

          <hr style={styles.divider} />

          {/* Price */}
          <div style={styles.priceSection}>
            <span style={styles.price}>₹{Number(displayPrice).toLocaleString('en-IN')}</span>
            {product.discount_price && <>
              <span style={styles.mrp}>₹{Number(product.price).toLocaleString('en-IN')}</span>
              <span style={styles.offBadge}>{off}% off</span>
            </>}
          </div>

          {/* Stock indicator */}
          <p style={{ ...styles.stockLabel, color: inStock ? '#388e3c' : '#d32f2f' }}>
            {inStock ? `In Stock (${product.stock} left)` : 'Out of Stock'}
          </p>

          <hr style={styles.divider} />

          {/* Highlights */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>Highlights</p>
            <ul style={styles.highlights}>
              <li>Brand: <strong>{product.brand}</strong></li>
              <li>Category: <strong>{product.category}</strong></li>
              {product.stock > 0 && <li>Availability: <strong style={{ color: '#388e3c' }}>In Stock</strong></li>}
            </ul>
          </div>

          <hr style={styles.divider} />

          {/* Description */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>Description</p>
            <p style={styles.description}>{product.description || 'No description available.'}</p>
          </div>

          <hr style={styles.divider} />

          {/* Delivery info */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>Delivery</p>
            <div style={styles.deliveryInfo}>
              <span style={styles.deliveryIcon}>🚚</span>
              <span>Free delivery on orders above ₹499</span>
            </div>
            <div style={styles.deliveryInfo}>
              <span style={styles.deliveryIcon}>🔄</span>
              <span>7 days easy return policy</span>
            </div>
            <div style={styles.deliveryInfo}>
              <span style={styles.deliveryIcon}>✅</span>
              <span>100% authentic products</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:         { background: '#f1f3f6', minHeight: '100vh', padding: '0 0 2rem' },
  breadcrumb:   { padding: '0.6rem 1.5rem', fontSize: '0.82rem', color: '#878787', display: 'flex', gap: '0.35rem', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f0f0f0' },
  breadLink:    { cursor: 'pointer', color: '#2874f0' },
  sep:          { color: '#ccc' },
  breadCurrent: { color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' },

  card:  { maxWidth: '1100px', margin: '1rem auto', background: '#fff', borderRadius: '4px', display: 'flex', gap: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },

  // Left column
  left:          { width: '380px', flexShrink: 0, padding: '1.5rem 1rem', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '1rem' },
  stickyActions: { display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' },
  qtyRow:        { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  qtyLabel:      { fontSize: '0.9rem', color: '#212121', fontWeight: 500 },
  qtySelect:     { padding: '0.3rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem', cursor: 'pointer' },
  cartMsg:       { fontSize: '0.85rem', fontWeight: 500, margin: 0 },
  btnCart:       { padding: '0.85rem', background: '#ff9f00', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' },
  btnBuy:        { padding: '0.85rem', background: '#fb641b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' },
  btnDisabled:   { background: '#ccc', cursor: 'not-allowed' },
  btnBack:       { marginTop: '1rem', padding: '0.6rem 1.25rem', background: '#2874f0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },

  // Right column
  right:         { flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  brand:         { fontSize: '0.82rem', color: '#878787', margin: 0 },
  name:          { fontSize: '1.3rem', fontWeight: 400, color: '#212121', margin: 0, lineHeight: 1.4 },

  ratingRow:     { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  ratingBadge:   { background: '#388e3c', color: '#fff', fontSize: '0.82rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' },
  ratingCount:   { fontSize: '0.82rem', color: '#878787' },

  divider:       { border: 'none', borderTop: '1px solid #f0f0f0', margin: '0.5rem 0' },

  priceSection:  { display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' },
  price:         { fontSize: '1.75rem', fontWeight: 700, color: '#212121' },
  mrp:           { fontSize: '1rem', color: '#878787', textDecoration: 'line-through' },
  offBadge:      { fontSize: '1rem', fontWeight: 600, color: '#388e3c' },
  stockLabel:    { fontSize: '0.85rem', fontWeight: 500, margin: 0 },

  section:       { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  sectionTitle:  { fontSize: '0.82rem', fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 },
  highlights:    { paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem', color: '#212121' },
  description:   { fontSize: '0.9rem', color: '#444', lineHeight: 1.7, margin: 0 },

  deliveryInfo:  { display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: '#444', padding: '0.2rem 0' },
  deliveryIcon:  { fontSize: '1rem' },
};
