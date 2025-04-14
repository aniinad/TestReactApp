import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import TableauDashboard from './TableauDashboard';

interface TableauTab {
    url: string;
    title: string;
}

interface TableauDashboardContainerProps {
    apiEndpoint: string;
    width?: string | number;
    height?: string | number;
}

const TableauDashboardContainer: React.FC<TableauDashboardContainerProps> = ({
    apiEndpoint,
    width = '100%',
    height = '600px'
}) => {
    const [tabs, setTabs] = useState<TableauTab[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTabs = async () => {
            try {
                setLoading(true);
                const response = await fetch(apiEndpoint);

                if (!response.ok) {
                    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                // Validate the data structure
                if (!Array.isArray(data)) {
                    throw new Error('API returned invalid data format. Expected an array of tabs.');
                }

                // Validate each tab has the required properties
                const validTabs = data.filter((tab: any) =>
                    tab && typeof tab === 'object' &&
                    typeof tab.url === 'string' &&
                    typeof tab.title === 'string'
                );

                if (validTabs.length === 0) {
                    throw new Error('No valid tableau tabs found in the API response.');
                }

                setTabs(validTabs);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(errorMessage);
                console.error('Error fetching tableau tabs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTabs();
    }, [apiEndpoint]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <TableauDashboard
            tabs={tabs}
            width={width}
            height={height}
        />
    );
};

export default TableauDashboardContainer; 