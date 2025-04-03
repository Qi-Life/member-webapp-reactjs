import apiClient1 from '~/configs/apiClient1';
import axios from 'axios';


export const getQuestions = async () => {
  return await apiClient1.get('/api/hoHolisticHealth/questions');
};

export const saveAnswer = async (rawData: any) => {
  return await apiClient1.post('/api/hoHolisticHealth/saveAnswer', rawData, {
    headers: {
      'Content-Type': 'application/json' // Ensure the content type matches your data format
    }
  })
};

export const getResults = async (params: any) => {
  return await apiClient1.get('/api/hoHolisticHealth/getResults', { params });
};