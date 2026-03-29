import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar          from './components/Navbar/Navbar';
import ProtectedRoute  from './components/ProtectedRoute/ProtectedRoute';

import HomePage          from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import OrderDetailPage   from './pages/OrderDetailPage';
import OrdersPage        from './pages/OrdersPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';

export default function App() {
  const [category, setCategory] = useState('');

  return (
    <>
      <Navbar category={category} onCategorySelect={setCategory} />

      <Routes>
        <Route path="/"            element={<HomePage category={category} onCategoryChange={setCategory} />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />

        <Route path="/cart" element={
          <ProtectedRoute><CartPage /></ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute><CheckoutPage /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />
        <Route path="/order/:id" element={
          <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}
