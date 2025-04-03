/* eslint @typescript-eslint/no-var-requires: "off" */

import apiClient from '../configs/apiClient';
import apiClient1 from '~/configs/apiClient1';

import { AuthInterface, RegisterType, UpdateType, VerifyType } from '../interface/auth.interface';

export const getUser = async () => {
  return await apiClient.get(`/api/me`);
};

export const loginUser = async (params: AuthInterface) => {
  return await apiClient.post('/api/login', params);
};

export const logoutUser = async (params: any) => {
  return await apiClient.post('/logout', params);
};

// "Content-Type": "application/x-www-form-urlencoded"

export const registerUser = async (params: RegisterType) => {
  return await apiClient1.post('/api/register', params);
};

export const forgotPassword = async (email: string) => {
  return await apiClient1.post('/api/forgot_pw', { email: email });
};

export const changePassword = async (params: any) => {
  return await apiClient1.post('/api/change_pw', params);
};

export const updatePassword = async (params: UpdateType) => {
  return await apiClient1.post('/user/profile/updatepassword', params);
};

export const newPassword = async (params: any) => {
  return await apiClient1.post('/api/new_pw', params);
};

export const verifyUser = async (params: VerifyType) => {
  return await apiClient1.post('/api/verify_user', params);
};

// favorites

// categories
export const subCategories = async (params: any) => {
  return await apiClient.get('/api/subcategories', { params });
};

// define('LOGIN_URL', 'https://apiadmin.qienergy.ai/api/login');
// define('FORGOT_PW_URL', 'https://apiadmin.qienergy.ai/api/forgot_pw');
// define('CHANGE_PW_URL', 'https://apiadmin.qienergy.ai/api/change_pw');
// define('PROFILE_UPDATEPASSWORD_URL', 'https://apiadmin.qienergy.ai/api/user/profile/updatepassword');
// define('VERIFY_USER_EMAIL', 'https://apiadmin.qienergy.ai/api/verify_user_email');
// define('SECRECT_KEY_CAPTCHA', '6LdCuLYjAAAAAAwp8yRbLznnmU8ajOdr7MI_bxug');
// define('SITE_KEY_CAPTCHA', '6LdCuLYjAAAAACtfg4l9LOzY0xTuuHSNV3w6rTgp');
// define('ME_PROFILE', 'https://apiadmin.qienergy.ai/api/me');
