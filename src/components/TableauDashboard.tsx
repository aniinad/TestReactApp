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

    // Check if Tableau API is available
    useEffect(() => {
        const checkTableauAPI = () => {
            if (window.tableau) {
                console.log('Tableau API already available');
                setApiLoaded(true);
                return true;
            }
            return false;
        };

        // Check immediately
        if (checkTableauAPI()) {
            return;
        }

        // If not available, set up a polling mechanism
        const intervalId = setInterval(() => {
            if (checkTableauAPI()) {
                clearInterval(intervalId);
            }
        }, 500);

        // Clean up interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    // Create visualization when API is loaded or URL changes
    useEffect(() => {
        if (apiLoaded && containerRef.current) {
            createViz();
        }
    }, [apiLoaded, dashboardUrl]);

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
            try {
                // Try the new API first
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
            } catch (apiError) {
                console.error('Error with new API, trying fallback:', apiError);

                // Fallback to the older API if the new one fails
                if (window.tableau.Viz) {
                    const viz = new window.tableau.Viz(
                        containerRef.current,
                        dashboardUrl,
                        {
                            width: '100%',
                            height: '600px',
                            hideTabs: false,
                            hideToolbar: false,
                            onFirstInteractive: () => {
                                console.log('Tableau visualization is interactive (fallback)');
                                setLoading(false);
                            },
                            onError: (error: any) => {
                                console.error('Tableau visualization error (fallback):', error);
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
                } else {
                    throw new Error('Neither Tableau API version is available');
                }
            }
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