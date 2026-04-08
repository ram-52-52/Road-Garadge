import axiosInstance from '../helper/apiFunction';

export const updateGarageProfile = (data: any) => axiosInstance.patch('/garages/profile', data);
export const deleteGarageProfile = () => axiosInstance.delete('/garages/profile');
export const getMyGarage = () => axiosInstance.get('/garages/profile');
export const getGarageReviews = (id: string) => axiosInstance.get(`/garages/${id}/reviews`);
export const getGarageAnalytics = (id: string) => axiosInstance.get(`/garages/${id}/earnings`);
export const toggleGarageStatus = (id: string) => axiosInstance.patch(`/garages/${id}/status`);
