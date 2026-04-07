import axiosInstance, { handleApiCall } from '../helper/apiFunction';
import { END_POINTS } from '../constants/apiConstants';

/**
 * AUTH API CLIENT
 * Expert Handlers for Authentication Lifecycle
 */
export const handleLogin = async (credentials: any) => {
  return await handleApiCall(() => axiosInstance.post(END_POINTS.AUTH.VERIFY_OTP, credentials));
};

export const handleRegister = async (userData: any) => {
  return await handleApiCall(() => axiosInstance.post(END_POINTS.AUTH.REGISTER, userData));
};

export const handleGetMe = async () => {
  return await handleApiCall(() => axiosInstance.get(END_POINTS.AUTH.ME));
};

export const handleRequestOTP = async (phone: string) => {
  return await handleApiCall(() => axiosInstance.post(END_POINTS.AUTH.REQUEST_OTP, { phone }));
};
