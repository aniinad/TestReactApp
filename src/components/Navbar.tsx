import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ApiIcon from '@mui/icons-material/Api';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../auth/AuthProvider';

const Navbar: React.FC = () => {
    const { isAuthenticated, user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    React App
                </Typography>

                {isAuthenticated ? (
                    <>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/"
                                startIcon={<BarChartIcon />}
                            >
                                Home
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/data-grid"
                                startIcon={<DataObjectIcon />}
                            >
                                Data Grid
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/dashboard"
                                startIcon={<BarChartIcon />}
                            >
                                Dashboard
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/api-example"
                                startIcon={<ApiIcon />}
                            >
                                API Example
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/data-loader"
                                startIcon={<DataObjectIcon />}
                            >
                                Data Loader
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/users"
                                startIcon={<PeopleIcon />}
                            >
                                Users
                            </Button>
                        </Box>

                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            {user?.username ? (
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                    {user.username.charAt(0).toUpperCase()}
                                </Avatar>
                            ) : (
                                <AccountCircleIcon />
                            )}
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button color="inherit" onClick={login}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 