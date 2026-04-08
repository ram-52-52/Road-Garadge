import api from './api';
import { END_POINTS } from '../constants/apiConstants';

export const getVehicles = async () => {
  const response = await api.get(END_POINTS.VEHICLE.BASE);
  return response.data;
};

export const addVehicle = async (formData: FormData) => {
  const response = await api.post(END_POINTS.VEHICLE.BASE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
