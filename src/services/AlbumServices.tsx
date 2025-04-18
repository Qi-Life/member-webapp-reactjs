import apiClient from '~/configs/apiClient';


export const getFeaturedAlbums = async () => {
    return await apiClient.get('/api/featured_albums');
};
export const getFreeAlbums = async (keyword?: string) => {
    return await apiClient.get('/api/free_albums', { params: { keyword } });
};

export const getAlbums = async (keyword?: string, limit: any = 10, page: any = 1) => {
    return await apiClient.get('/api/albums', { params: { keyword, limit, page } });
};

export const getIndividualAlbum = async () => {
    return await apiClient.get('/api/getInvidualAlbum')
}

export const getFullCollections = async () => {
    return await apiClient.get('/api/getFullCollections')
}