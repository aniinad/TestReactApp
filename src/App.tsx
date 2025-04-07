import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import DataTabs from './components/DataTabs';
import TableauDashboard from './components/TableauDashboard';

const App: React.FC = () => {
    return (
        <Router>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/data" replace />} />
                        <Route path="/data" element={<DataTabs />} />
                        <Route
                            path="/tableau"
                            element={
                                <TableauDashboard
                                    dashboardUrl="https://public.tableau.com/views/Superstore/Overview"
                                    title="Sales Dashboard"
                                />
                            }
                        />
                    </Routes>
                </Container>
            </Box>
        </Router>
    );
};

export default App; 