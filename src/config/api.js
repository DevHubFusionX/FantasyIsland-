const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://fantasy-island.onrender.com').replace(/\/$/, '');

export const API = {
  auth: `${API_BASE_URL}/api/auth`,
  bookings: `${API_BASE_URL}/api/bookings`,
  suites: `${API_BASE_URL}/api/suites`,
  settings: `${API_BASE_URL}/api/settings`,
  tiers: `${API_BASE_URL}/api/tiers`,
};

export const formatImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // Remove leading slash if it exists and API_BASE_URL is not empty
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const baseUrl = API_BASE_URL || '';
  
  // Ensure there's a slash between base and path
  return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${cleanPath}`;
};

export default API_BASE_URL;
