import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Data Management System
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Grid View
                </Button>
                <Button color="inherit" component={Link} to="/about">
                    About
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 