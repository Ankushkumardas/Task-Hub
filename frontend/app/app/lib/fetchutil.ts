import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            (config as any).headers = { Authorization: `Bearer ${token}` };
        }
    }
    return config;
});

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError | any) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const postdata = async (path: string, data: any) => {
    try {
        const res = await api.post(path, data);
        return res.data;
    } catch (err: any) {
        // Normalize axios error so callers can read a useful message/body
        if (err.response && err.response.data) {
            // Preserve server-provided body
            throw err.response.data;
        }
        throw err;
    }
}

export const fetchdata = async (path: string) => {
    const res = await api.get(path)
    return res.data;
}

export const updatedata = async (path: string, data: any)=>{
    const res = await api.put(path, data);
    return res.data;
}

export const deletedata = async (path: string) => {
    const res = await api.delete(path)
    return res.data;
}