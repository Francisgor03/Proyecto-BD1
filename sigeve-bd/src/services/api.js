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

// Clientes
export const customerApi = {
  getAll: (page = 0, size = 5) => api.get(`/customers?page=${page}&size=${size}`),
  getById: id => api.get(`/customers/${id}`),
  create: data => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  remove: id => api.delete(`/customers/${id}`)
};

// Pedidos
export const orderApi = {
  getAll: (page = 0, size = 5) => api.get(`/orders?page=${page}&size=${size}`),
  getById: id => api.get(`/orders/${id}`),
  create: data => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  remove: id => api.delete(`/orders/${id}`)
};

// Detalle de pedidos
export const orderDetailsApi = {
  getByOrderId: orderId => api.get(`/orderDetails/order/${orderId}`),
  deleteOrderDetail: (orderId, productId) => api.delete(`/orderDetails/order/${orderId}/product/${productId}`)
};

// Productos
export const productApi = {
  getAll: (page = 0, size = 5) => api.get(`/products?page=${page}&size=${size}`),
  getById: id => api.get(`/products/${id}`),
  create: data => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: id => api.delete(`/products/${id}`)
};

// Proveedores
export const supplierApi = {
  getAll: (page = 0, size = 5) => api.get(`/suppliers?page=${page}&size=${size}`),
  getById: id => api.get(`/suppliers/${id}`),
  create: data => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  remove: id => api.delete(`/suppliers/${id}`)
};

// Categorías
export const categoryApi = {
  getAll: (page = 0, size = 5) => api.get(`/categories?page=${page}&size=${size}`),
  getById: id => api.get(`/categories/${id}`),
  create: data => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: id => api.delete(`/categories/${id}`)
};

// Transportistas
export const shipperApi = {
  getAll: (page = 0, size = 5) => api.get(`/shippers?page=${page}&size=${size}`),
  getById: id => api.get(`/shippers/${id}`),
  create: data => api.post('/shippers', data),
  update: (id, data) => api.put(`/shippers/${id}`, data),
  remove: id => api.delete(`/shippers/${id}`)
};

// Región
export const regionApi = {
  getAll: (page = 0, size = 5) => api.get(`/region?page=${page}&size=${size}`),
  getById: id => api.get(`/region/${id}`),
  create: data => api.post('/region', data),
  update: (id, data) => api.put(`/region/${id}`, data),
  remove: id => api.delete(`/region/${id}`)
};

// Territorios
export const territoryApi = {
  getAll: (page = 0, size = 5) => api.get(`/territories?page=${page}&size=${size}`),
  getById: id => api.get(`/territories/${id}`),
  create: data => api.post('/territories', data),
  update: (id, data) => api.put(`/territories/${id}`, data),
  remove: id => api.delete(`/territories/${id}`)
};

// Empleados
export const employeesApi = {
  getAll: (page = 0, size = 5) => api.get(`/employees?page=${page}&size=${size}`),
  getById: id => api.get(`/employees/${id}`),
  create: data => api.post(`/employees`, data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  remove: id => api.delete(`/employees/${id}`)
};

// Reportes generales
export const reportesApi = {
  getDetallePedidos: () => api.get('/reportes/detalle-pedidos'),
  getVentasClienteRegion: () => api.get('/reportes/ventas-cliente-region'),
};

// Ventas por categoría
export const ventasCategoriaApi = {
  getAll: () => api.get('/reportes/ventas-por-categoria'), 
};

// Ventas mensuales
export const ventasMensualesApi = {
  getAll: () => api.get('/reportes/ventas-mensuales'),
};

// Procedimientos
export const procedimientosApi = {
  getHistorialCliente: id => api.get(`/procedimientos/historial-cliente/${id}`)
};

export default api;
