import api from './axios_inteceptor';

export const globalSearch = async (queryParams) => {
    const res = await api.get('search/', { params: queryParams });
    return res.data;
}