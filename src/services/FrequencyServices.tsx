/* eslint @typescript-eslint/no-var-requires: "off" */

import { removeNullParams } from '~/helpers/util';
import apiClient from '../configs/apiClient';

export const getFrequencies = async (
    keyword?: string | '',
    category?: string[] | [],
    subcategory?: string | '',
    page?: string | '1',
    id?: number | string | '',
    limit?: number | string | '20'
) => {
    let params = removeNullParams({ keyword, category, subcategory, page, id, limit })
    return await apiClient.get('/api/frequencies', { params });
};

interface TypeFrequency {
    frequency_id: any;
}

export const getMp3s = async (search: string = '', subcat: any) => {

    try {
        let params = {
            params: removeNullParams({
                keyword: search,
                categoryId: subcat.catId,
                subcategoryId: subcat.subId,
                limit: 100
            })
        }
        console.log("🚀 ~ getMp3s ~ subcat:", params)

        params = JSON.parse(JSON.stringify(params));
        const response = await apiClient.get(`/api/getMp3PlaylistAdd`, params);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch MP3s:", error);
        throw error; // rethrowing to let the calling code handle it
    }
};

export const getRifes = async (search: string, limit: number = 100) => {
    return await apiClient.get(`/api/frequencies?keyword=${search}&limit=${limit}`);
}

export const AddFrequencytoPlaylist = async (params: any) => {
    return await apiClient.post('/api/add_frequency_to_playlist', params);
};

export const searchFrequency = async (
    keyword?: string | '',
    category?: any,
    page?: string | '1',
    id?: string | '',
    limit?: string | '20'
) => {
    return await apiClient.get('/api/frequencies', { params: { keyword, category, page, id, limit } });
};