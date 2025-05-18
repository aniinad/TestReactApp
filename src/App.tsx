import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DataGrid from './components/DataGrid';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ApiExample from './components/ApiExample';
import DataLoader from './components/DataLoader';
import UserList from './components/UserList';
import Profile from './components/Profile';
import TableauDashboardContainer from './components/TableauDashboardContainer';
import Admin from './components/Admin';
import PopupBlockedAlert from './components/PopupBlockedAlert';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

// AppContent component that uses auth context
const AppContent: React.FC = () => {
    const { isAuthenticated, isInitialized, popupBlocked } = useAuth();

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (popupBlocked) {
        return <PopupBlockedAlert />;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/data-grid" element={<ProtectedRoute><DataGrid /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/tableau" element={<ProtectedRoute><TableauDashboardContainer /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
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
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App; 