import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      console.warn('Token expirado o inválido');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const customerApi = {
  getAll: (page = 0, size = 5) => api.get(`/customers?page=${page}&size=${size}`),
  getById: id => api.get(`/customers/${id}`),
  create: data => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  remove: id => api.delete(`/customers/${id}`)
};

export const orderApi = {
  getAll: (page = 0, size = 5) => api.get(`/orders?page=${page}&size=${size}`),
  getById: id => api.get(`/orders/${id}`),
  create: data => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  remove: id => api.delete(`/orders/${id}`)
};

export const productApi = {
  getAll: (page = 0, size = 5) => api.get(`/products?page=${page}&size=${size}`),
  getById: id => api.get(`/products/${id}`),
  create: data => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: id => api.delete(`/products/${id}`)
};

export const supplierApi = {
  getAll: (page = 0, size = 5) => api.get(`/suppliers?page=${page}&size=${size}`),
  getById: id => api.get(`/suppliers/${id}`),
  create: data => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  remove: id => api.delete(`/suppliers/${id}`)
};

export const categoryApi = {
  getAll: (page = 0, size = 5) => api.get(`/categories?page=${page}&size=${size}`),
  getById: id => api.get(`/categories/${id}`),
  create: data => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: id => api.delete(`/categories/${id}`)
};

export default api;
