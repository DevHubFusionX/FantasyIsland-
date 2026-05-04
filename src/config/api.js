// For unified deployment (serving frontend from backend), base URL is empty in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:5000');

export const API = {
  auth: `${API_BASE_URL}/api/auth`,
  bookings: `${API_BASE_URL}/api/bookings`,
  suites: `${API_BASE_URL}/api/suites`,
  settings: `${API_BASE_URL}/api/settings`,
};

export default API_BASE_URL;
