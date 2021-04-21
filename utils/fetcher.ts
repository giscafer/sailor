import {toast} from 'amis';
import Axios, {AxiosError, AxiosResponse} from 'axios';
import {BASE_URL} from '../config';

const getToken = () => {
    const token = localStorage.getItem('sailorToken');
    if (token) {
        return `Bearer ${token}`;
    }
    return;
};

export const fetcher = ({url, method, data, config}: any) => {
    config = config || {};
    config.headers = config.headers || {};
    config.withCredentials = true;

    if (method !== 'post' && method !== 'put' && method !== 'patch') {
        if (data) {
            config.params = data;
        }
        return (Axios as any)[method](url, config);
    } else if (data && data instanceof FormData) {
        // config.headers = config.headers || {};
        // config.headers['Content-Type'] = 'multipart/form-data';
    } else if (data && typeof data !== 'string' && !(data instanceof Blob) && !(data instanceof ArrayBuffer)) {
        data = JSON.stringify(data);
        config.headers['Content-Type'] = 'application/json';
    }

    return (Axios as any)[method](url, data, config);
};

export const isCancel = (e: any) => Axios.isCancel(e);

export const doPost = (endpoint: string, data: any) => {
    return new Promise((resolve, reject) => {
        fetcher({
            url: `${BASE_URL}${endpoint}`,
            method: 'post',
            data,
            config: {
                headers: {
                    authorization: getToken()
                }
            }
        })
            .then((resp: AxiosResponse) => {
                if (resp.status !== 200) {
                    reject(resp);
                } else {
                    const data = resp.data || {};
                    if (data.status === 401) {
                        location.replace('/#/login');
                    }
                    if (resp.data?.status !== 0) {
                        toast.error(resp.data?.msg || '操作失败', '提示');
                    }
                    resolve(resp.data?.data || {});
                }
            })
            .catch((err: AxiosError) => reject(err));
    });
};

export const doGet = (endpoint: string, data: any | null = null) => {
    return new Promise((resolve, reject) => {
        fetcher({
            url: `${BASE_URL}${endpoint}`,
            method: 'get',
            data,
            config: {
                headers: {
                    authorization: getToken()
                }
            }
        })
            .then((resp: AxiosResponse) => {
                if (resp.status !== 200) {
                    reject(resp);
                } else {
                    console.log(resp.data);
                    if (resp.data?.status !== 0) {
                        toast.error(resp.data?.msg || '操作失败', '提示');
                    }
                    resolve(resp.data?.data || {});
                }
            })
            .catch((err: AxiosError) => reject(err));
    });
};
