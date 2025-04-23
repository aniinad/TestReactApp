import { useState, useEffect } from 'react';
import { useApiService } from '../services/apiService';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useDataFetching<T>(url: string, initialData: T | null = null) {
    const [state, setState] = useState<FetchState<T>>({
        data: initialData,
        loading: true,
        error: null,
    });

    const apiService = useApiService();

    const fetchData = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const result = await apiService.get<T>(url);
            setState({
                data: result,
                loading: false,
                error: null,
            });
        } catch (err) {
            setState({
                data: initialData,
                loading: false,
                error: err instanceof Error ? err.message : 'An unknown error occurred',
            });
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    return {
        ...state,
        refetch: fetchData,
    };
} 