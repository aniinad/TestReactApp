import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Container, Typography, Button, Alert } from '@mui/material';
import Navbar from './components/Navbar';
import DataTabs from './components/DataTabs';
import TableauDashboardContainer from './components/TableauDashboardContainer';
import { AuthProvider } from './auth/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import ApiExample from './components/ApiExample';

// Replace this URL with your own Tableau dashboard URL
const TABLEAU_DASHBOARD_URL = 'https://your-tableau-server.com/views/YourDashboard/YourView';

const tableauTabs = [
    {
        url: "https://your-tableau-server/views/dashboard1",
        title: "Sales Dashboard"
    },
    {
        url: "https://your-tableau-server/views/dashboard2",
        title: "Marketing Analytics"
    },
    {
        url: "https://your-tableau-server/views/dashboard3",
        title: "Customer Insights"
    }
];

const App: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);

    const handleButtonClick = () => {
        setMessage("Button clicked! This function was called successfully.");

        // You can add more functionality here
        console.log("Button clicked at:", new Date().toISOString());
    };

    return (
        <AuthProvider>
            <Router>
                <CssBaseline />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Tableau Dashboards
                        </Typography>

                        {/* Button and message display */}
                        <Box sx={{ my: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleButtonClick}
                                sx={{ mb: 2 }}
                            >
                                Click Me
                            </Button>

                            {message && (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    {message}
                                </Alert>
                            )}
                        </Box>

                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Navigate to="/data" replace />
                                </ProtectedRoute>
                            } />
                            <Route path="/data" element={
                                <ProtectedRoute>
                                    <DataTabs />
                                </ProtectedRoute>
                            } />
                            <Route
                                path="/tableau"
                                element={
                                    <ProtectedRoute>
                                        <TableauDashboardContainer
                                            apiEndpoint="/api/tableau/tabs"
                                            height="700px"
                                        />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/api-example"
                                element={
                                    <ProtectedRoute>
                                        <ApiExample />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Container>
                </Box>
            </Router>
        </AuthProvider>
    );
};

export default App; 