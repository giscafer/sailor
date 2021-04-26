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

export const doPost = (endpoint: string, data: any, config = {}) => {
    return new Promise((resolve, reject) => {
        fetcher({
            url: `${BASE_URL}${endpoint}`,
            method: 'post',
            data,
            config: {
                ...config,
                headers: {
                    authorization: getToken()
                }
            }
        })
            .then((resp: AxiosResponse) => {
                responseHandle(resp, resolve, reject);
            })
            .catch((err: AxiosError) => {
                toast.error('服务异常');
                reject(err);
            });
    });
};

export const doGet = (endpoint: string, data: any | null = {}) => {
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
                responseHandle(resp, resolve, reject);
            })
            .catch((err: AxiosError) => {
                toast.error('服务异常');
                reject(err);
            });
    });
};

function responseHandle(resp: AxiosResponse, resolve: Function, reject: Function) {
    if (resp.status !== 200) {
        reject(resp);
    } else {
        if (resp.config.responseType === 'blob') {
            // 附件下载
            const disposition = resp.headers['content-disposition'] || '';
            resolve({
                content: resp.data,
                filename: disposition.replace('attachment; filename=', '')
            });
            return;
        }
        const data = resp.data || {};
        if (data.status === 401) {
            if (!location.hash.startsWith('#/login')) {
                location.replace('/#/login');
                toast.error(resp.data?.msg || '操作失败', '提示');
            }
        } else if (resp.data?.status !== 0) {
            toast.error(resp.data?.msg || '操作失败', '提示');
        }
        resolve(resp.data?.data || {});
    }
}
