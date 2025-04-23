import React from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { useDataFetching } from '../hooks/useDataFetching';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
}

const UserList: React.FC = () => {
    const { data, loading, error, refetch } = useDataFetching<User[]>('https://jsonplaceholder.typicode.com/users');

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                User List
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={refetch}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh Users'}
                </Button>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && data && data.length > 0 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Users ({data.length})
                    </Typography>
                    <List>
                        {data.map((user) => (
                            <ListItem key={user.id} divider>
                                <ListItemAvatar>
                                    <Avatar>{user.name.charAt(0)}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.name}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                {user.username}
                                            </Typography>
                                            {` — ${user.email}`}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            {!loading && !error && (!data || data.length === 0) && (
                <Alert severity="info">
                    No users available. Click the button above to fetch users.
                </Alert>
            )}
        </Box>
    );
};

export default UserList; 