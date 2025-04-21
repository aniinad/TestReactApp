import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import { useApiService } from '../services/apiService';

interface UserData {
    id: string;
    displayName: string;
    userPrincipalName: string;
}

const ApiExample: React.FC = () => {
    const apiService = useApiService();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Example API call to Microsoft Graph API
            const data = await apiService.get<UserData>('https://graph.microsoft.com/v1.0/me');
            setUserData(data);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to fetch user data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                API Example
            </Typography>

            <Typography variant="body1" paragraph>
                This component demonstrates how to make authenticated API calls using the access token.
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={fetchUserData}
                disabled={loading}
                sx={{ mb: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Fetch User Data'}
            </Button>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {userData && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">User Information:</Typography>
                    <Typography><strong>ID:</strong> {userData.id}</Typography>
                    <Typography><strong>Display Name:</strong> {userData.displayName}</Typography>
                    <Typography><strong>Email:</strong> {userData.userPrincipalName}</Typography>
                </Box>
            )}
        </Paper>
    );
};

export default ApiExample; 