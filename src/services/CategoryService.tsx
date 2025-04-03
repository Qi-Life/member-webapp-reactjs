// https://apiadmin.qienergy.ai/api/getAllCategories

import apiClient from '../configs/apiClient';
export const getAllCategories = async () => {
  return await apiClient.get('/api/getAllCategories');
};

export const getAllSubcategories = async (category?: string, subcategory?: string) => {
  return await apiClient.get('/api/subcategories', { params: { category: category, subcategory: subcategory } });
};
