import api from './api';
import { END_POINTS } from '../constants/apiConstants';

export const getJobs = async () => {
    const response = await api.get(END_POINTS.JOB.BASE);
    return response.data;
};

export const getJobDetail = async (id: string) => {
    const response = await api.get(END_POINTS.JOB.DETAIL(id));
    return response.data;
};

export const createJob = async (jobData: any) => {
    const response = await api.post(END_POINTS.JOB.BASE, jobData);
    return response.data;
};

export const acceptJob = async (id: string) => {
    const response = await api.patch(END_POINTS.JOB.ACCEPT(id));
    return response.data;
};

export const startJob = async (id: string) => {
    const response = await api.patch(END_POINTS.JOB.START(id));
    return response.data;
};

export const completeJob = async (id: string) => {
    const response = await api.patch(END_POINTS.JOB.COMPLETE(id));
    return response.data;
};

export const cancelJob = async (id: string) => {
    const response = await api.patch(END_POINTS.JOB.CANCEL(id));
    return response.data;
};

export const trackJob = async (id: string, coordinates: number[]) => {
    const response = await api.post(END_POINTS.JOB.TRACK(id), { coordinates });
    return response.data;
};
