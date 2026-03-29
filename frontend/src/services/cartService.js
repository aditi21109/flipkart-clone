import api from './api';

export const getCart      = ()                       => api.get('/cart');
export const addToCart    = (product_id, quantity)   => api.post('/cart', { product_id, quantity });
export const updateItem   = (id, quantity)           => api.put(`/cart/${id}`, { quantity });
export const removeItem   = (id)                     => api.delete(`/cart/${id}`);
