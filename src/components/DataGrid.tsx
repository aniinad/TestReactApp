import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { Paper, Box, CircularProgress, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField } from '@mui/material';
import DataForm from './DataForm';
import { GridData } from '../types';

interface DataGridProps {
    parentId?: number;
    onRowSelect?: (row: GridData | null) => void;
    isChildGrid?: boolean;
    title?: string;
}

const DataGrid: React.FC<DataGridProps> = ({ parentId, onRowSelect, isChildGrid = false, title = 'Data Grid' }) => {
    const [rowData, setRowData] = useState<GridData[]>([]);
    const [selectedRow, setSelectedRow] = useState<GridData | null>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewDialogOpen, setIsNewDialogOpen] = useState<boolean>(false);
    const [newData, setNewData] = useState<Partial<GridData>>({
        name: '',
        email: '',
        phone: '',
        parentId: parentId
    });

    useEffect(() => {
        fetchData();
    }, [parentId]);

    const fetchData = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const url = isChildGrid
                ? `https://api.example.com/data/children/${parentId}`
                : 'https://api.example.com/data';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRowData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setNewData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const response = await fetch('https://api.example.com/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setIsNewDialogOpen(false);
            setNewData({ name: '', email: '', phone: '', parentId });
            await fetchData();
        } catch (error) {
            console.error('Error creating new entry:', error);
        }
    };

    const defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    };

    const onGridReady = (params: { api: GridApi }): void => {
        setGridApi(params.api);
    };

    const onSelectionChanged = (): void => {
        if (gridApi) {
            const selectedRows = gridApi.getSelectedRows();
            const selectedRow = selectedRows[0] || null;
            setSelectedRow(selectedRow);
            if (onRowSelect) {
                console.log('Row selected:', selectedRow);
                onRowSelect(selectedRow);
            }
        }
    };

    const handleDataUpdate = (updatedData: GridData): void => {
        setRowData(prevData =>
            prevData.map(row =>
                row.id === updatedData.id ? updatedData : row
            )
        );
        setSelectedRow(null);
        if (onRowSelect) {
            onRowSelect(null);
        }
    };

    const columnDefs: ColDef[] = [
        { field: 'id', headerName: 'ID', checkboxSelection: true },
        { field: 'name', headerName: 'Name' },
        { field: 'email', headerName: 'Email' },
        { field: 'phone', headerName: 'Phone' },
    ];

    return (
        <Paper sx={{ height: '100%', position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2 }}>
                <Typography variant="h6">{title}</Typography>
                <Button
                    variant="contained"
                    onClick={() => setIsNewDialogOpen(true)}
                >
                    Add New Entry
                </Button>
            </Box>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading data...</Typography>
                </Box>
            ) : error ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="error">{error}</Typography>
                    <Button onClick={fetchData} sx={{ ml: 2 }}>Retry</Button>
                </Box>
            ) : (
                <div className="ag-theme-material" style={{ height: 'calc(100% - 48px)', width: '100%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        rowSelection="single"
                        onSelectionChanged={onSelectionChanged}
                        enableRangeSelection={true}
                        groupSelectsChildren={true}
                        animateRows={true}
                    />
                </div>
            )}

            <Dialog
                open={isNewDialogOpen}
                onClose={() => setIsNewDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        width: '50%',
                        maxHeight: '80vh',
                        minHeight: '50vh'
                    }
                }}
            >
                <DialogTitle>Add New Entry</DialogTitle>
                <form onSubmit={handleNewSubmit}>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                name="name"
                                label="Name"
                                value={newData.name}
                                onChange={handleNewChange}
                                fullWidth
                                required
                                size="medium"
                            />
                            <TextField
                                name="email"
                                label="Email"
                                value={newData.email}
                                onChange={handleNewChange}
                                fullWidth
                                required
                                size="medium"
                            />
                            <TextField
                                name="phone"
                                label="Phone"
                                value={newData.phone}
                                onChange={handleNewChange}
                                fullWidth
                                required
                                size="medium"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setIsNewDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Paper>
    );
};

export default DataGrid; 