import React from 'react';
import { Alert, Button, Box, Typography } from '@mui/material';
import { useAuth } from '../auth/AuthProvider';

const PopupBlockedAlert: React.FC = () => {
    const { login, setPopupBlocked } = useAuth();

    const handleRedirectLogin = async () => {
        try {
            // Reset the popup blocked flag
            setPopupBlocked(false);
            // Attempt login with redirect
            await login();
        } catch (error) {
            console.error('Redirect login failed:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Alert
                severity="warning"
                sx={{ mb: 2 }}
            >
                <Typography variant="h6" gutterBottom>
                    Popup Blocked
                </Typography>
                <Typography paragraph>
                    Your browser has blocked the authentication popup. This is preventing automatic login from working.
                </Typography>
                <Typography paragraph>
                    You have two options:
                </Typography>
                <Box component="ol" sx={{ pl: 2, mb: 2 }}>
                    <li>
                        <Typography>
                            <strong>Enable popups</strong> for this site in your browser settings and refresh the page.
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            <strong>Use redirect login</strong> which will navigate away from this page and return after authentication.
                        </Typography>
                    </li>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRedirectLogin}
                    sx={{ mt: 1 }}
                >
                    Continue with Redirect Login
                </Button>
            </Alert>
        </Box>
    );
};

export default PopupBlockedAlert; 