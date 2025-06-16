import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton, Menu as DropdownMenu, MenuItem as DropdownMenuItem, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ApiIcon from '@mui/icons-material/Api';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../auth/AuthProvider';

const Navbar: React.FC = () => {
    const { isAuthenticated, user, login, logout, role, setRole, originalRole } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [impersonateAnchorEl, setImpersonateAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleClose();
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/login');
    };

    const handleImpersonateClick = (event: React.MouseEvent<HTMLElement>) => {
        setImpersonateAnchorEl(event.currentTarget);
    };

    const handleImpersonateClose = () => {
        setImpersonateAnchorEl(null);
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole(event.target.value);
        handleImpersonateClose();
    };

    const roles = ['Admin', 'User', 'Editor', 'Viewer'];

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
                                to="/tableau"
                                startIcon={<DashboardIcon />}
                            >
                                Tableau
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/admin"
                                startIcon={<AdminPanelSettingsIcon />}
                            >
                                Admin
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
                            {originalRole === 'Admin' && (
                                <Button
                                    color="inherit"
                                    onClick={handleImpersonateClick}
                                    startIcon={<AdminPanelSettingsIcon />}
                                >
                                    Impersonation ({role})
                                </Button>
                            )}
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
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
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
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>

                        {originalRole === 'Admin' && (
                            <DropdownMenu
                                anchorEl={impersonateAnchorEl}
                                open={Boolean(impersonateAnchorEl)}
                                onClose={handleImpersonateClose}
                            >
                                <RadioGroup value={role} onChange={handleRoleChange} sx={{ pl: 2, pr: 2 }}>
                                    {roles.map((r) => (
                                        <FormControlLabel key={r} value={r} control={<Radio />} label={r} />
                                    ))}
                                </RadioGroup>
                            </DropdownMenu>
                        )}
                    </>
                ) : (
                    <Box sx={{ marginLeft: 'auto' }}>
                        <Button color="inherit" onClick={login}>
                            Login
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 