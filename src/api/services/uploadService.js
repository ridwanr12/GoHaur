import apiClient from '../apiClient';

const uploadService = {
  /**
   * Upload gambar, mengembalikan URL relatif dari backend.
   * @param {{uri:string,type?:string,fileName?:string}} file
   * @returns {Promise<string>} contoh: /uploads/abc.jpg
   */
  uploadImage: async file => {
    const response = await apiClient.upload('/api/uploads', file);
    return response.data.url;
  },
};

export default uploadService;
