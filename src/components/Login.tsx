import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import {
    Box,
    Button,
    Typography,
    Container,
    Paper,
    CircularProgress
} from '@mui/material';
import { Microsoft as MicrosoftIcon } from '@mui/icons-material';

const Login: React.FC = () => {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        // If already authenticated, redirect to home
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await login();
            // Login successful, redirect will happen in useEffect
        } catch (err) {
            console.error('Login failed:', err);
            setError('Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        Sign in to your account
                    </Typography>

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<MicrosoftIcon />}
                        onClick={handleLogin}
                        disabled={isLoading}
                        sx={{ mt: 2, mb: 2, width: '100%' }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Sign in with Microsoft'
                        )}
                    </Button>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 