// https://apiadmin.qienergy.ai/api/getAllCategories

import apiClient from '../configs/apiClient';

interface DeviceToken {
    os?: string,
    token: string
}

export const addDeviceTokenFCM = async (postData: DeviceToken) => {
    return await apiClient.post('/api/profiles/add_device_token', postData);
};

export const getProfile = async () => {
    return await apiClient.get('/api/me');
}