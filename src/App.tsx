import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DataGrid from './components/DataGrid';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ApiExample from './components/ApiExample';
import DataLoader from './components/DataLoader';
import UserList from './components/UserList';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

// Main app content that uses the auth context
const AppContent: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/data-grid" element={<ProtectedRoute><DataGrid /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/api-example" element={<ProtectedRoute><ApiExample /></ProtectedRoute>} />
                    <Route path="/data-loader" element={<ProtectedRoute><DataLoader /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                </Routes>
            </Box>
        </Box>
    );
};

// Main App component
const App: React.FC = () => {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <Router>
                    <AppContent />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App; 