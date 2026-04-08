import api from './api';
import { END_POINTS } from '../constants/apiConstants';

export const getGarageProfile = async () => {
    const response = await api.get(END_POINTS.GARAGE.PROFILE);
    return response.data;
};

export const getGarageEarnings = async (id: string) => {
    const response = await api.get(END_POINTS.GARAGE.EARNINGS(id));
    return response.data;
};

export const getGarageJobs = async (id: string) => {
    const response = await api.get(END_POINTS.GARAGE.JOBS(id));
    return response.data;
};

export const toggleGarageStatus = async (id: string) => {
    const response = await api.patch(`/garages/${id}/status`);
    return response.data;
};
