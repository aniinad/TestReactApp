import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { useDataFetching } from '../hooks/useDataFetching';

interface Album {
    id: number;
    title: string;
    userId: number;
}

const DataGrid: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { data: albums, loading, error, refetch } = useDataFetching<Album[]>('https://jsonplaceholder.typicode.com/albums');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Data Grid
            </Typography>

            <Typography variant="body1" paragraph>
                This data grid displays albums fetched from an API using our custom hook.
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={refetch}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh Data'}
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

            {!loading && !error && albums && (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>User ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {albums
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((album) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={album.id}>
                                            <TableCell>{album.id}</TableCell>
                                            <TableCell>{album.title}</TableCell>
                                            <TableCell>{album.userId}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={albums.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default DataGrid; 