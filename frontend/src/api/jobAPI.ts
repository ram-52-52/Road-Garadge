import axiosInstance, { handleApiCall } from '../helper/apiFunction';
import { END_POINTS } from '../constants/apiConstants';

/**
 * JOB API CLIENT
 * High-fidelity handlers for real-time Assistance Lifecycle
 */
export const handleCreateJob = async (jobData: any) => {
  return await handleApiCall(() => axiosInstance.post(END_POINTS.JOB.BASE, jobData));
};

export const handleGetJobDetail = async (id: string) => {
  return await handleApiCall(() => axiosInstance.get(END_POINTS.JOB.DETAIL(id)));
};

export const handleAcceptJob = async (id: string) => {
  return await handleApiCall(() => axiosInstance.patch(END_POINTS.JOB.ACCEPT(id)));
};

export const handleStartJob = async (id: string) => {
  return await handleApiCall(() => axiosInstance.patch(END_POINTS.JOB.START(id)));
};

export const handleCompleteJob = async (id: string) => {
  return await handleApiCall(() => axiosInstance.patch(END_POINTS.JOB.COMPLETE(id)));
};

export const handleCancelJob = async (id: string) => {
  return await handleApiCall(() => axiosInstance.patch(END_POINTS.JOB.CANCEL(id)));
};

export const handleTrackJob = async (id: string, coordinates: number[]) => {
  return await handleApiCall(() => axiosInstance.post(END_POINTS.JOB.TRACK(id), { coordinates }));
};
