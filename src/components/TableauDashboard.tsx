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
    const [apiLoaded, setApiLoaded] = useState(false);

    useEffect(() => {
        // Check if Tableau API is already loaded
        if (window.tableau) {
            setApiLoaded(true);
            createViz();
            return;
        }

        // Load the Tableau Embedding API v3
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
        script.async = true;
        script.onload = () => {
            console.log('Tableau Embedding API v3 loaded successfully');
            setApiLoaded(true);
            createViz();
        };
        script.onerror = () => {
            console.error('Failed to load Tableau Embedding API v3');
            setError('Failed to load Tableau visualization. Please check your internet connection.');
            setLoading(false);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [dashboardUrl]);

    const createViz = async () => {
        if (!containerRef.current || !apiLoaded) return;

        try {
            console.log('Creating Tableau visualization with URL:', dashboardUrl);

            // Clear any existing content
            containerRef.current.innerHTML = '';

            // Make sure tableau API is available
            if (!window.tableau) {
                throw new Error('Tableau Embedding API not properly loaded');
            }

            // Create the visualization using the new Embedding API v3
            const viz = await window.tableau.VizManager.createViz({
                ref: containerRef.current,
                src: dashboardUrl,
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
            });

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

    // Recreate viz when API is loaded
    useEffect(() => {
        if (apiLoaded) {
            createViz();
        }
    }, [apiLoaded]);

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