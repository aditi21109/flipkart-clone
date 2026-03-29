import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateItem, removeItem } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems]   = useState([]);
  const [total, setTotal]   = useState('0.00');
  const [loading, setLoading] = useState(false);

  // Fetch cart whenever auth state changes
  useEffect(() => {
    if (isAuthenticated) fetchCart();
    else { setItems([]); setTotal('0.00'); }
  }, [isAuthenticated]);

  async function fetchCart() {
    try {
      setLoading(true);
      const res = await getCart();
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch {
      // silently fail — cart will show empty
    } finally {
      setLoading(false);
    }
  }

  async function addItem(productId, quantity = 1) {
    await addToCart(productId, quantity);
    await fetchCart();
  }

  async function changeQuantity(id, quantity) {
    await updateItem(id, quantity);
    await fetchCart();
  }

  async function deleteItem(id) {
    await removeItem(id);
    await fetchCart();
  }

  function clearCart() {
    setItems([]);
    setTotal('0.00');
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, total, loading, itemCount, addItem, changeQuantity, deleteItem, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
