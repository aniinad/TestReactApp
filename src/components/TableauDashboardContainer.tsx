import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import TableauDashboard from './TableauDashboard';
import { useAuth } from '../auth/AuthProvider';
import { loginRequest } from '../authConfig';

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
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const { getAccessToken, isInitialized } = useAuth();

    // Get the API scope from environment variables
    const apiScope = process.env.REACT_APP_API_SCOPE || 'api://YOUR_API_ID/access_as_user';

    // Fetch access token for Tableau SSO
    useEffect(() => {
        const fetchAccessToken = async () => {
            // Only attempt to get the token if MSAL is initialized
            if (!isInitialized) {
                console.log('MSAL not yet initialized, waiting...');
                return;
            }

            try {
                const token = await getAccessToken();
                setAccessToken(token);
            } catch (err) {
                console.error('Error fetching access token for Tableau SSO:', err);
            }
        };

        fetchAccessToken();
    }, [getAccessToken, isInitialized]);

    useEffect(() => {
        const fetchTabs = async () => {
            // Only attempt to fetch tabs if MSAL is initialized
            if (!isInitialized) {
                console.log('MSAL not yet initialized, waiting...');
                return;
            }

            try {
                setLoading(true);

                // Get the access token with explicit scopes
                // This ensures the token has the correct audience
                const token = await getAccessToken();

                if (!token) {
                    throw new Error('Failed to get access token. Please try logging in again.');
                }

                // Make the API call with the token
                const response = await fetch(apiEndpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                // Check if response is OK
                if (!response.ok) {
                    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
                }

                // Check content type to ensure we're getting JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
                }

                // Parse the JSON response
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

                // Log additional details for debugging
                console.log('API Endpoint:', apiEndpoint);
                console.log('API Scope:', apiScope);
                console.log('Login Request Scopes:', loginRequest.scopes);
                console.log('Error details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTabs();
    }, [apiEndpoint, getAccessToken, apiScope, isInitialized]);

    if (!isInitialized) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
                <Box sx={{ ml: 2 }}>
                    Initializing authentication...
                </Box>
            </Box>
        );
    }

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
            accessToken={accessToken}
        />
    );
};

export default TableauDashboardContainer; 