import api from './api';

export const placeOrder   = (shipping) => api.post('/orders', { shipping });
export const getOrders    = ()         => api.get('/orders');
export const getOrderById = (id)       => api.get(`/orders/${id}`);
