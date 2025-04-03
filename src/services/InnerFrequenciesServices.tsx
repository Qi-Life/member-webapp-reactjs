import apiClient from '~/configs/apiClient';

export const getTrack = async (params?: any) => {
  return await apiClient.get('/api/track?' + params);
};

export const getFrequencyDetail = async (id?: string) => {
  return await apiClient.get('/api/frequencies', { params: { category: 1, id } });
};
