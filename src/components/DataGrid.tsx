import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import axios from 'axios';
import { Paper, Box, CircularProgress, Typography } from '@mui/material';
import DataForm from './DataForm';
import { GridData } from '../types';

const DataGrid: React.FC = () => {
    const [rowData, setRowData] = useState<GridData[]>([]);
    const [selectedRow, setSelectedRow] = useState<GridData | null>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            // Replace with your API endpoint
            const response = await axios.get<GridData[]>('https://api.example.com/data');
            setRowData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setIsLoading(false);
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
            setSelectedRow(selectedRows[0] || null);
        }
    };

    const handleDataUpdate = (updatedData: GridData): void => {
        setRowData(prevData =>
            prevData.map(row =>
                row.id === updatedData.id ? updatedData : row
            )
        );
        setSelectedRow(null);
    };

    const columnDefs: ColDef[] = [
        { field: 'id', headerName: 'ID', checkboxSelection: true },
        { field: 'name', headerName: 'Name' },
        { field: 'email', headerName: 'Email' },
        { field: 'phone', headerName: 'Phone' },
    ];

    return (
        <Box sx={{ display: 'flex', gap: 2, p: 2, height: 'calc(100vh - 100px)' }}>
            <Paper sx={{ flex: 2, height: '100%', position: 'relative' }}>
                {isLoading ? (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <CircularProgress />
                        <Typography>Loading data...</Typography>
                    </Box>
                ) : error ? (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                        }}
                    >
                        <Typography color="error">{error}</Typography>
                        <Button
                            variant="contained"
                            onClick={fetchData}
                            sx={{ mt: 2 }}
                        >
                            Retry
                        </Button>
                    </Box>
                ) : (
                    <div className="ag-theme-material" style={{ height: '100%', width: '100%' }}>
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
            </Paper>

            {selectedRow && (
                <Paper sx={{ flex: 1, p: 2 }}>
                    <DataForm
                        data={selectedRow}
                        onSubmit={handleDataUpdate}
                        onCancel={() => setSelectedRow(null)}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default DataGrid; 