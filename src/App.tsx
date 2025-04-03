import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import DataGrid from './components/DataGrid';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<DataGrid />} />
                        <Route path="/about" element={<div>About Page</div>} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App; 