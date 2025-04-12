import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

interface TableauEmbedProps {
    dashboardUrl: string;
    width?: string | number;
    height?: string | number;
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

const TableauEmbed: React.FC<TableauEmbedProps> = ({
    dashboardUrl,
    width = '100%',
    height = '600px',
    onLoad,
    onError
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        const loadTableau = async () => {
            try {
                // Load Tableau JavaScript API
                const script = document.createElement('script');
                script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
                script.async = true;
                script.onload = () => {
                    if (containerRef.current) {
                        const viz = new (window as any).tableau.Viz(
                            containerRef.current,
                            dashboardUrl,
                            {
                                width: width,
                                height: height,
                                hideTabs: true,
                                hideToolbar: false
                            }
                        );
                        viz.addEventListener('firstinteractive', () => {
                            setIsLoading(false);
                            onLoad?.();
                        });
                    }
                };
                script.onerror = () => {
                    const error = new Error('Failed to load Tableau JavaScript API');
                    setError(error.message);
                    onError?.(error);
                };
                document.body.appendChild(script);

                return () => {
                    document.body.removeChild(script);
                };
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Unknown error occurred');
                setError(error.message);
                onError?.(error);
            }
        };

        loadTableau();
    }, [dashboardUrl, width, height, onLoad, onError]);

    return (
        <Box sx={{ position: 'relative', width, height }}>
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </Box>
    );
};

export default TableauEmbed; 