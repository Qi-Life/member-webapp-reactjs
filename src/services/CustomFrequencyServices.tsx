import apiClient from '~/configs/apiClient';
import apiClient1 from '~/configs/apiClient1';

export const getCustomFrequencies = async () => {
  return await apiClient.get('/api/custom_frequencies');
};
export const getCustomFrequenciesDetail = async (id: any) => {
  return await apiClient.get(`/api/get_custom_frequencies_by_id/${id}`);
};

export const addCustomFrequencies = async (params: any) => {
  return await apiClient1.post('/api/add_custom_frequencies', params);
};

export const updateCustomFrequencies = async (postData:any) => {
  return await apiClient1.post('/api/update_custom_frequencies', postData);
};

export const updateInforCustomFrequencies = async (postData:any) => {
  return await apiClient1.post('/api/update_name_des_custom_frequencies', postData);
}

export const deleteCustomFrequencies = async (id: any) => {
  return await apiClient1.post(`/api/delete_custom_frequencies/${id}`);
};
