import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DataGrid from './components/DataGrid';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ApiExample from './components/ApiExample';
import DataLoader from './components/DataLoader';
import UserList from './components/UserList';
import Profile from './components/Profile';
import { AuthProvider } from './auth/AuthProvider';

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

function App() {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Navbar />
                        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                                <Route path="/data-grid" element={<ProtectedRoute><DataGrid /></ProtectedRoute>} />
                                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                <Route path="/api-example" element={<ProtectedRoute><ApiExample /></ProtectedRoute>} />
                                <Route path="/data-loader" element={<ProtectedRoute><DataLoader /></ProtectedRoute>} />
                                <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            </Routes>
                        </Box>
                    </Box>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App; 