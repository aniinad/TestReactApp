import React, { useEffect, useRef } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

interface TableauDashboardProps {
    dashboardUrl: string;
    title?: string;
}

const TableauDashboard: React.FC<TableauDashboardProps> = ({
    dashboardUrl,
    title = 'Tableau Dashboard'
}) => {
    const tableauContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        // Load the Tableau JavaScript API
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        script.async = true;
        script.onload = () => {
            if (tableauContainerRef.current) {
                try {
                    // Create the viz
                    const viz = new (window as any).tableau.Viz(
                        tableauContainerRef.current,
                        dashboardUrl,
                        {
                            hideTabs: true,
                            hideToolbar: false,
                            width: '100%',
                            height: '600px',
                            onFirstInteractive: () => {
                                setIsLoading(false);
                            },
                            onError: (error: any) => {
                                console.error('Tableau error:', error);
                                setError('Failed to load the Tableau dashboard. Please try again later.');
                                setIsLoading(false);
                            }
                        }
                    );

                    // Cleanup function
                    return () => {
                        if (viz) {
                            viz.dispose();
                        }
                    };
                } catch (err) {
                    console.error('Error creating Tableau viz:', err);
                    setError('Failed to initialize the Tableau dashboard.');
                    setIsLoading(false);
                }
            }
        };
        script.onerror = () => {
            console.error('Failed to load Tableau API');
            setError('Failed to load the Tableau API. Please check your internet connection.');
            setIsLoading(false);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [dashboardUrl]);

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading dashboard...</Typography>
                </Box>
            )}

            {error && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            <Box
                ref={tableauContainerRef}
                sx={{
                    width: '100%',
                    height: '600px',
                    visibility: isLoading ? 'hidden' : 'visible'
                }}
            />
        </Paper>
    );
};

export default TableauDashboard; 