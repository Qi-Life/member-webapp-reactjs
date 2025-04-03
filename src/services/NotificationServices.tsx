import apiClient from '~/configs/apiClient';

export const getNotificationList = async (limit:number) => {
    return await apiClient.get('/api/noitifications',  { params: { limit } });
};

export const readNotification = async (postData:any) => {
    return await apiClient.post('/api/notifications/readAll',  postData);
};


export const getNotificationDetail = async (id:number) => {
    return await apiClient.get(`/api/noitifications/${id}`);
};
