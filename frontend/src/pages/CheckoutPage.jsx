import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';
import Loader from '../components/Loader/Loader';

// ── Reusable form field ───────────────────────────────────────────────────────
function Field({ label, name, type = 'text', value, onChange, error, placeholder, required }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label} {required && <span style={styles.required}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
      />
      {error && <span style={styles.fieldError}>{error}</span>}
    </div>
  );
}

// ── Order summary sidebar ─────────────────────────────────────────────────────
function OrderSummary({ items, total }) {
  const mrpTotal      = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
  const discountTotal = items.reduce((s, i) => {
    return s + (i.discount_price
      ? (parseFloat(i.price) - parseFloat(i.discount_price)) * i.quantity
      : 0);
  }, 0);
  const delivery   = parseFloat(total) >= 499 ? 0 : 40;
  const finalTotal = parseFloat(total) + delivery;

  return (
    <div style={styles.summaryCard}>
      <h3 style={styles.summaryTitle}>ORDER SUMMARY</h3>
      <hr style={styles.divider} />

      {/* Item list */}
      <div style={styles.itemList}>
        {items.map((item) => (
          <div key={item.id} style={styles.summaryItem}>
            <img
              src={item.image || 'https://via.placeholder.com/48x48?text=No+Image'}
              alt={item.name}
              style={styles.summaryImg}
            />
            <div style={styles.summaryItemInfo}>
              <p style={styles.summaryItemName}>{item.name}</p>
              <p style={styles.summaryItemMeta}>
                Qty: {item.quantity} × ₹{parseFloat(item.discount_price ?? item.price).toLocaleString('en-IN')}
              </p>
            </div>
            <span style={styles.summaryItemTotal}>
              ₹{(parseFloat(item.discount_price ?? item.price) * item.quantity).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      <hr style={styles.divider} />

      {/* Price breakdown */}
      <div style={styles.priceRow}>
        <span>Price ({items.length} item{items.length !== 1 ? 's' : ''})</span>
        <span>₹{mrpTotal.toLocaleString('en-IN')}</span>
      </div>
      {discountTotal > 0 && (
        <div style={styles.priceRow}>
          <span>Discount</span>
          <span style={{ color: '#388e3c' }}>− ₹{discountTotal.toLocaleString('en-IN')}</span>
        </div>
      )}
      <div style={styles.priceRow}>
        <span>Delivery</span>
        {delivery === 0
          ? <span style={{ color: '#388e3c' }}>FREE</span>
          : <span>₹{delivery}</span>}
      </div>

      <hr style={styles.divider} />

      <div style={{ ...styles.priceRow, fontWeight: 700, fontSize: '1rem' }}>
        <span>Total</span>
        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
      </div>

      {discountTotal > 0 && (
        <p style={styles.savings}>
          You save ₹{discountTotal.toLocaleString('en-IN')} 🎉
        </p>
      )}
    </div>
  );
}

// ── Checkout page ─────────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', phone: '', address: '', city: '', pincode: '' };

export default function CheckoutPage() {
  const { items, total, loading, clearCart } = useCart();
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ ...EMPTY_FORM, name: user?.name || '' });
  const [errors, setErrors]   = useState({});
  const [placing, setPlacing] = useState(false);
  const [apiError, setApiError] = useState('');

  if (loading) return <div style={styles.page}><Loader /></div>;

  if (items.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyWrap}>
          <p style={{ fontSize: '2rem' }}>🛒</p>
          <h2 style={{ color: '#212121' }}>Nothing to checkout</h2>
          <p style={{ color: '#878787' }}>Your cart is empty.</p>
          <button style={styles.shopBtn} onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = 'Full name is required';
    if (!form.phone.trim())   e.phone   = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit phone number';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim())    e.city    = 'City is required';
    if (!form.pincode.trim()) e.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode';
    return e;
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }

    setPlacing(true);
    setApiError('');
    try {
      const res = await placeOrder({
        name:    form.name.trim(),
        phone:   form.phone.trim(),
        address: form.address.trim(),
        city:    form.city.trim(),
        pincode: form.pincode.trim(),
      });
      clearCart();
      navigate(`/order/${res.data.orderId}`, { state: { justPlaced: true } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div style={styles.page}>

      {/* ── Breadcrumb ── */}
      <nav style={styles.breadcrumb}>
        <span style={styles.breadLink} onClick={() => navigate('/')}>Home</span>
        <span style={styles.sep}>›</span>
        <span style={styles.breadLink} onClick={() => navigate('/cart')}>Cart</span>
        <span style={styles.sep}>›</span>
        <span style={{ color: '#212121' }}>Checkout</span>
      </nav>

      <div className="max-w-[1100px] mx-auto p-4 flex flex-col md:flex-row gap-4 items-start">

        {/* ── Left: address form ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span style={styles.stepBadge}>1</span> Delivery Address
            </h2>

            {apiError && <p style={styles.apiError}>{apiError}</p>}

            <form onSubmit={handlePlaceOrder} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Field label="Full Name"    name="name"    value={form.name}    onChange={handleChange} error={errors.name}    placeholder="Jason" required />
                <Field label="Phone Number" name="phone"   type="tel" value={form.phone}   onChange={handleChange} error={errors.phone}   placeholder="10-digit mobile number" required />
              </div>

              <Field label="Address (House No, Street, Area)" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="123, MG Road, Indiranagar" required />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Field label="City"    name="city"    value={form.city}    onChange={handleChange} error={errors.city}    placeholder="Bangalore" required />
                <Field label="Pincode" name="pincode" type="tel" value={form.pincode} onChange={handleChange} error={errors.pincode} placeholder="560001" required />
              </div>

              <hr style={styles.divider} />

              {/* ── Payment notice ── */}
              <div style={styles.card2}>
                <h3 style={styles.cardTitle}>
                  <span style={styles.stepBadge}>2</span> Payment
                </h3>
                <div style={styles.codRow}>
                  <span style={styles.codIcon}>💵</span>
                  <div>
                    <p style={styles.codLabel}>Cash on Delivery</p>
                    <p style={styles.codNote}>Pay when your order is delivered.</p>
                  </div>
                  <span style={styles.codCheck}>✓</span>
                </div>
              </div>

              <button
                type="submit"
                style={{ ...styles.placeBtn, ...(placing ? styles.placeBtnDisabled : {}) }}
                disabled={placing}
              >
                {placing ? 'Placing Order…' : `Place Order  ₹${(parseFloat(total) + (parseFloat(total) >= 499 ? 0 : 40)).toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>
        </div>

        {/* ── Right: order summary ── */}
        <div className="w-full md:w-[340px] shrink-0 md:sticky md:top-[72px]">
          <OrderSummary items={items} total={total} />
        </div>

      </div>
    </div>
  );
}

const styles = {
  page:         { background: '#f1f3f6', minHeight: '100vh', padding: '0 0 3rem' },
  breadcrumb:   { padding: '0.6rem 1.5rem', fontSize: '0.82rem', color: '#878787', display: 'flex', gap: '0.35rem', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f0f0f0' },
  breadLink:    { cursor: 'pointer', color: '#2874f0' },
  sep:          { color: '#ccc' },
  layout:       { maxWidth: '1100px', margin: '1rem auto', padding: '0 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' },

  // Form column
  formCol:      { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' },
  card:         { background: '#fff', borderRadius: '4px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  card2:        { background: '#f9f9f9', borderRadius: '4px', padding: '1rem', marginBottom: '1.25rem', border: '1px solid #f0f0f0' },
  cardTitle:    { fontSize: '1rem', fontWeight: 600, color: '#212121', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' },
  stepBadge:    { background: '#2874f0', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 },
  fieldGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' },
  field:        { display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' },
  label:        { fontSize: '0.82rem', fontWeight: 500, color: '#555' },
  required:     { color: '#d32f2f' },
  input:        { padding: '0.6rem 0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.95rem', outline: 'none' },
  inputError:   { borderColor: '#d32f2f' },
  fieldError:   { fontSize: '0.75rem', color: '#d32f2f' },
  divider:      { border: 'none', borderTop: '1px solid #f0f0f0', margin: '1.25rem 0' },
  apiError:     { color: '#d32f2f', background: '#fdecea', padding: '0.75rem', borderRadius: '4px', fontSize: '0.875rem', marginBottom: '1rem' },
  codRow:       { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  codIcon:      { fontSize: '1.5rem' },
  codLabel:     { margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#212121' },
  codNote:      { margin: 0, fontSize: '0.78rem', color: '#878787' },
  codCheck:     { marginLeft: 'auto', color: '#388e3c', fontWeight: 700, fontSize: '1.1rem' },
  placeBtn:     { width: '100%', padding: '0.9rem', background: '#fb641b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' },
  placeBtnDisabled: { background: '#ccc', cursor: 'not-allowed' },

  // Summary column
  summaryCol:   { width: '340px', flexShrink: 0, position: 'sticky', top: '72px' },
  summaryCard:  { background: '#fff', borderRadius: '4px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  summaryTitle: { fontSize: '0.78rem', fontWeight: 700, color: '#878787', letterSpacing: '0.08em', margin: '0 0 0.75rem' },
  itemList:     { display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' },
  summaryItem:  { display: 'flex', gap: '0.6rem', alignItems: 'center' },
  summaryImg:   { width: '48px', height: '48px', objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: '4px', flexShrink: 0 },
  summaryItemInfo: { flex: 1, minWidth: 0 },
  summaryItemName: { margin: 0, fontSize: '0.82rem', color: '#212121', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  summaryItemMeta: { margin: 0, fontSize: '0.75rem', color: '#878787' },
  summaryItemTotal: { fontSize: '0.88rem', fontWeight: 600, flexShrink: 0 },
  priceRow:     { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#212121', padding: '0.35rem 0' },
  savings:      { color: '#388e3c', fontSize: '0.82rem', fontWeight: 500, textAlign: 'center', marginTop: '0.75rem', background: '#f0faf0', padding: '0.5rem', borderRadius: '4px' },

  // Empty state
  emptyWrap:    { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '0.5rem' },
  shopBtn:      { marginTop: '0.75rem', padding: '0.7rem 2rem', background: '#2874f0', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' },
};
