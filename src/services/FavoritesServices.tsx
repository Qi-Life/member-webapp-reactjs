import apiClient1 from '~/configs/apiClient1';

export const getFavorites = async () => {
  return await apiClient1.get('/api/favorite/get');
};

export const saveFavorite = async (postData:any) => {
  return await apiClient1.post('/api/favorite/save', postData);
}