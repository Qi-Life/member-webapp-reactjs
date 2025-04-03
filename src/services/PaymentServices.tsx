import apiClient from "~/configs/apiClient";

export const handlePayment = async (postData: any) => {
    return await apiClient.post('/api/payment_add', postData);
};

export const create_subscription = async (postData: any) => {
    return await apiClient.post('/api/c-payment/create_subscription', postData);
};