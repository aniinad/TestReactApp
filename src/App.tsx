import React, { useEffect } from 'react';
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
    const { isAuthenticated, isInitialized, login } = useAuth();

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            login();
        }
    }, [isInitialized, isAuthenticated, login]);

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    return <>{children}</>;
};

// Base URL handler component
const BaseUrlHandler: React.FC = () => {
    const { isAuthenticated, isInitialized, redirectTo } = useAuth();

    useEffect(() => {
        if (isInitialized) {
            if (isAuthenticated) {
                // Redirect to admin page if authenticated
                redirectTo('/admin');
            } else {
                // Redirect to login if not authenticated
                redirectTo('/');
            }
        }
    }, [isInitialized, isAuthenticated, redirectTo]);

    return <div>Redirecting...</div>;
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
                    <Route path="/" element={<BaseUrlHandler />} />
                    <Route path="/dashboard" element={<TableauDashboardContainer />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
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