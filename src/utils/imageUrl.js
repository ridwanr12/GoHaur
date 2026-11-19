import API_CONFIG from '../api/config';

/**
 * URL gambar dari backend (mis. /uploads/abc.jpg) harus diberi BASE_URL
 * supaya bisa dirender Image React Native.
 */
export function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) {
    return null;
  }
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  return `${API_CONFIG.BASE_URL}${pathOrUrl}`;
}
