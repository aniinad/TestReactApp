import React from 'react';
import { Box, Typography, Paper, Avatar, Divider, Card, CardContent } from '@mui/material';
import { useAuth } from '../auth/AuthProvider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';

const Profile: React.FC = () => {
    const { user } = useAuth();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                User Profile
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'secondary.main',
                            fontSize: '2rem',
                            mr: 2
                        }}
                    >
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h5">
                            {user?.name || user?.displayName || 'User Name'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {user?.username || user?.userPrincipalName || 'username'}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Account Information
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
                    <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AccountCircleIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="subtitle1" fontWeight="bold">Username</Typography>
                                </Box>
                                <Typography variant="body1">
                                    {user?.username || user?.userPrincipalName || 'Not available'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                                </Box>
                                <Typography variant="body1">
                                    {user?.email || user?.userPrincipalName || 'Not available'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="subtitle1" fontWeight="bold">Account Created</Typography>
                                </Box>
                                <Typography variant="body1">
                                    {user?.createdDateTime || 'Not available'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="subtitle1" fontWeight="bold">Authentication Method</Typography>
                                </Box>
                                <Typography variant="body1">
                                    {user?.authenticationMethods || 'Azure AD'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        This information is retrieved from your Microsoft account through Azure AD authentication.
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile; 