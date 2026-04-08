import api from './api';
import { END_POINTS } from '../constants/apiConstants';

export const getChatHistory = async (jobId: string) => {
  const response = await api.get(END_POINTS.CHAT.HISTORY(jobId));
  return response.data;
};
