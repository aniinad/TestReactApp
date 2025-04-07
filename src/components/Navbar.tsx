import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';

const Navbar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Data Management App
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/"
                    >
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/data"
                    >
                        Data Grid
                    </Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/tableau"
                        startIcon={<BarChartIcon />}
                    >
                        Dashboards
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 