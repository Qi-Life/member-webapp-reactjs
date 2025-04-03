import apiClient from '~/configs/apiClient';
import path from '~/helpers/path';

export const getSilentScalarList = async (tier?:string) => {
    return await apiClient.get(`/api/silent-scalars?tier=${tier}`);
};

export const getSilentScalarCoverImage = (src: string = '') => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    if (typeof src === 'string') {
        return path.joinPaths(apiUrl, 'assets/uploads/silentscalar/', src);
    }
    return ''
};

export const getSilentScalarSource = (src: string = '') => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    if (typeof src === 'string') {
        return path.joinPaths(apiUrl, 'assets/uploads/silentscalar/', src);
    }
    return ''
};
