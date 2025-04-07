import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

interface TableauDashboardProps {
    dashboardUrl: string;
    title?: string;
}

declare global {
    interface Window {
        tableau: any;
    }
}

const TableauDashboard: React.FC<TableauDashboardProps> = ({ dashboardUrl, title }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Load the Tableau JavaScript API
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
        script.async = true;
        script.onload = () => {
            console.log('Tableau API loaded successfully');
            createViz();
        };
        script.onerror = () => {
            console.error('Failed to load Tableau API');
            setError('Failed to load Tableau visualization. Please check your internet connection.');
            setLoading(false);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [dashboardUrl]);

    const createViz = () => {
        if (!containerRef.current) return;

        try {
            console.log('Creating Tableau visualization with URL:', dashboardUrl);

            // Clear any existing content
            containerRef.current.innerHTML = '';

            // Create the visualization
            const viz = new window.tableau.Viz(
                containerRef.current,
                dashboardUrl,
                {
                    width: '100%',
                    height: '600px',
                    hideTabs: false,
                    hideToolbar: false,
                    onFirstInteractive: () => {
                        console.log('Tableau visualization is interactive');
                        setLoading(false);
                    },
                    onError: (error: any) => {
                        console.error('Tableau visualization error:', error);
                        setError(`Error loading visualization: ${error.message || 'Unknown error'}`);
                        setLoading(false);
                    }
                }
            );

            return () => {
                if (viz) {
                    viz.dispose();
                }
            };
        } catch (err) {
            console.error('Error creating Tableau visualization:', err);
            setError(`Error creating visualization: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            {title && (
                <Typography variant="h5" component="h2" gutterBottom>
                    {title}
                </Typography>
            )}

            {loading && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '600px'
                }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                ref={containerRef}
                sx={{
                    width: '100%',
                    height: '600px',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    visibility: loading ? 'hidden' : 'visible'
                }}
            />
        </Box>
    );
};

export default TableauDashboard; 