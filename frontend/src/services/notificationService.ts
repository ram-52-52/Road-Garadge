import api from './api';
import { END_POINTS } from '../constants/apiConstants';

export const getNotifications = async () => {
  const response = await api.get(END_POINTS.NOTIFICATION.BASE);
  return response.data;
};

export const markAsRead = async (id: string) => {
  const response = await api.patch(END_POINTS.NOTIFICATION.READ(id));
  return response.data;
};
