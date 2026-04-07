import axios, { type AxiosResponse } from 'axios';
import { BASE_URL } from '../constants/apiConstants';

// Create a professional-grade Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT Identity Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Moderation
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Decommission session on token expiry
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * ELITE API HANDLER WRAPPER
 * Standardizes async execution and high-fidelity error normalization.
 */
export const handleApiCall = async <T>(
  apiCall: () => Promise<AxiosResponse<T>>
): Promise<{ success: boolean; data?: T; message?: string }> => {
  try {
    const response = await apiCall();
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('📡 API Handshake Failure:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Protocol Failure: Network Unstable',
    };
  }
};

export default axiosInstance;
