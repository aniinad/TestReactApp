import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Button } from '@mui/material';
import { useApiService } from '../services/apiService';

interface DataItem {
    id: number;
    title: string;
    completed: boolean;
}

const DataLoader: React.FC = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const apiService = useApiService();

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Using our API service with fetch
            const result = await apiService.get<DataItem[]>('https://jsonplaceholder.typicode.com/todos');
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load data when component mounts
        fetchData();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Data Loader Example
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchData}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh Data'}
                </Button>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && data.length > 0 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Data Items ({data.length})
                    </Typography>
                    <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                        {data.map((item) => (
                            <Box
                                key={item.id}
                                sx={{
                                    p: 1,
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        backgroundColor: item.completed ? 'green' : 'red',
                                        mr: 2
                                    }}
                                />
                                <Typography>{item.title}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            )}

            {!loading && !error && data.length === 0 && (
                <Alert severity="info">
                    No data available. Click the button above to fetch data.
                </Alert>
            )}
        </Box>
    );
};

export default DataLoader; 