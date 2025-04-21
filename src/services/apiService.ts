import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuth } from '../auth/AuthProvider';

// Create a custom hook for API calls with authentication
export const useApiService = () => {
    const { getAccessToken } = useAuth();

    // Create an axios instance with default config
    const createAxiosInstance = (): AxiosInstance => {
        return axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL || 'https://your-api-url.com',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    // Function to add the access token to the request
    const addAuthHeader = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        try {
            const token = await getAccessToken();
            return {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                },
            };
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    };

    // Generic GET request with authentication
    const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const axiosInstance = createAxiosInstance();
        const authConfig = await addAuthHeader(config || {});
        const response = await axiosInstance.get<T>(url, authConfig);
        return response.data;
    };

    // Generic POST request with authentication
    const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
        const axiosInstance = createAxiosInstance();
        const authConfig = await addAuthHeader(config || {});
        const response = await axiosInstance.post<T>(url, data, authConfig);
        return response.data;
    };

    // Generic PUT request with authentication
    const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
        const axiosInstance = createAxiosInstance();
        const authConfig = await addAuthHeader(config || {});
        const response = await axiosInstance.put<T>(url, data, authConfig);
        return response.data;
    };

    // Generic DELETE request with authentication
    const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const axiosInstance = createAxiosInstance();
        const authConfig = await addAuthHeader(config || {});
        const response = await axiosInstance.delete<T>(url, authConfig);
        return response.data;
    };

    return {
        get,
        post,
        put,
        delete: del,
    };
}; 