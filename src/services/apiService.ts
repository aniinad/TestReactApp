import { useAuth } from '../auth/AuthProvider';

interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

export const useApiService = () => {
    const { getAccessToken, isInitialized } = useAuth();
    const baseUrl = process.env.REACT_APP_API_BASE_URL || '';

    const getHeaders = async () => {
        if (!isInitialized) {
            throw new Error('MSAL is not initialized yet. Please wait a moment and try again.');
        }

        const token = await getAccessToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    };

    const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return {
            data,
            status: response.status,
            statusText: response.statusText,
        };
    };

    const get = async <T>(url: string): Promise<T> => {
        if (!isInitialized) {
            throw new Error('MSAL is not initialized yet. Please wait a moment and try again.');
        }

        const headers = await getHeaders();
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'GET',
            headers,
        });

        const result = await handleResponse<T>(response);
        return result.data;
    };

    const post = async <T>(url: string, data: any): Promise<T> => {
        if (!isInitialized) {
            throw new Error('MSAL is not initialized yet. Please wait a moment and try again.');
        }

        const headers = await getHeaders();
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        const result = await handleResponse<T>(response);
        return result.data;
    };

    const put = async <T>(url: string, data: any): Promise<T> => {
        if (!isInitialized) {
            throw new Error('MSAL is not initialized yet. Please wait a moment and try again.');
        }

        const headers = await getHeaders();
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        const result = await handleResponse<T>(response);
        return result.data;
    };

    const del = async <T>(url: string): Promise<T> => {
        if (!isInitialized) {
            throw new Error('MSAL is not initialized yet. Please wait a moment and try again.');
        }

        const headers = await getHeaders();
        const response = await fetch(`${baseUrl}${url}`, {
            method: 'DELETE',
            headers,
        });

        const result = await handleResponse<T>(response);
        return result.data;
    };

    return {
        get,
        post,
        put,
        delete: del,
    };
}; 