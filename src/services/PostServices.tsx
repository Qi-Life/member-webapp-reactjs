import apiClient from '~/configs/apiClient';

export const getPostList = async () => {
  return await apiClient.get('/api/posts');
};
