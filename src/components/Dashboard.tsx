import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useDataFetching } from '../hooks/useDataFetching';

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

const Dashboard: React.FC = () => {
    const { data: posts, loading, error } = useDataFetching<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=6');

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Typography variant="body1" paragraph>
                This dashboard displays data fetched from an API using our custom hook.
            </Typography>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <Typography>Loading dashboard data...</Typography>
                </Box>
            )}

            {error && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
                    <Typography color="error">Error: {error}</Typography>
                </Paper>
            )}

            {!loading && !error && posts && (
                <Grid container spacing={3}>
                    {posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Paper sx={{ p: 2, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    {post.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {post.body.substring(0, 100)}...
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Dashboard; 