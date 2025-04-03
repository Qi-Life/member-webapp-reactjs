import { appAction } from '../reducers/appReducer';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAccessToken, getToken, setAccessToken } from '../helpers/token';
import { configApp } from './config';
import { clearUserData } from './localstore';
// import errCode from '../asset/err/err.json';
// import store from '../store';
// import messageConfig from './messageConfig';
// const keyHeaderCheckAuth = 'x-request-fail';
// const dispatch = useDispatch();

const apiClient1 = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Client-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    // token: getAccessToken() || '',
  },
  timeout: 10000
});

apiClient1.interceptors.request.use(function (config: any) {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    // config.headers[keyHeaderCheckAuth] = 0;
  }
  return config;
});

apiClient1.interceptors.response.use(
  (res: any) => res,

  async (err: any) => {
    const originalConfig = err?.config;
    // if url api  is 'login' then do not refresh
    // if (originalConfig.url === 'login' || !err.response) return Promise.reject(err);
    // avoid endless loop
    // if (originalConfig.headers[keyHeaderCheckAuth] > 0) return Promise.reject(err);
    // originalConfig.headers[keyHeaderCheckAuth] += 1;
    if (err?.response?.status === 401 && !originalConfig?._retry) {
      originalConfig._retry = true;
      try {
        // const response = await apiClient1.get('refreshToken');
        // const accessToken = response.data.access_token;
        // setAccessToken(accessToken);
        // return apiClient1(originalConfig);
        clearUserData()
        setAccessToken('');
        localStorage.setItem('chat_messages', JSON.stringify([]));
        localStorage.removeItem('chatbot_thread')
        window.location.replace('/login');
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    return Promise.reject(err);
  }
);
export default apiClient1;
