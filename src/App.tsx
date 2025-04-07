import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import DataTabs from './components/DataTabs';
import TableauDashboard from './components/TableauDashboard';

// Replace this URL with your own Tableau dashboard URL
const TABLEAU_DASHBOARD_URL = 'https://your-tableau-server.com/views/YourDashboard/YourView';

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
                                    dashboardUrl={TABLEAU_DASHBOARD_URL}
                                    title="Your Custom Dashboard"
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