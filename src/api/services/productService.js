import apiClient from '../apiClient';

const productService = {
  // Mendapatkan semua produk (bisa dengan query params: page, limit, search, storeId)
  getAllProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/products?${queryString}` : '/api/products';
    return apiClient.get(url);
  },

  // Mendapatkan detail produk berdasarkan ID
  getProductById: (id) => {
    return apiClient.get(`/api/products/${id}`);
  },

  // Mendapatkan semua produk dari toko tertentu
  getStoreProducts: (storeId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/products/store/${storeId}?${queryString}` : `/api/products/store/${storeId}`;
    return apiClient.get(url);
  },

  // Membuat produk baru untuk toko tertentu
  createProduct: (storeId, productData) => {
    return apiClient.post(`/api/products/store/${storeId}`, productData);
  },

  // Memperbarui informasi produk
  updateProduct: (id, productData) => {
    return apiClient.put(`/api/products/${id}`, productData);
  },

  // Menghapus produk
  deleteProduct: (id) => {
    return apiClient.delete(`/api/products/${id}`);
  },
};

export default productService;
