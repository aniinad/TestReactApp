import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, ICellEditorParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useApiService } from '../services/apiService';

// Define the data interface
interface AdminData {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    createdAt: string;
}

const AdminDataGrid: React.FC = () => {
    const apiService = useApiService();
    const [rowData, setRowData] = useState<AdminData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gridApi, setGridApi] = useState<any>(null);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use environment variable for API endpoint
                const apiEndpoint = `${process.env.REACT_APP_API_BASE_URL}/api/admin/data`;
                console.log('API Endpoint:', apiEndpoint); // Debug log

                const data = await apiService.get<AdminData[]>(apiEndpoint);
                setRowData(data);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiService]);

    // Column Definitions
    const columnDefs: ColDef[] = [
        { field: 'id', headerName: 'ID', width: 70, editable: false },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        { field: 'email', headerName: 'Email', width: 200, editable: true },
        {
            field: 'role',
            headerName: 'Role',
            width: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Admin', 'User', 'Editor', 'Viewer']
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Active', 'Inactive', 'Pending']
            }
        },
        { field: 'lastLogin', headerName: 'Last Login', width: 150, editable: false },
        { field: 'createdAt', headerName: 'Created At', width: 150, editable: false },
        {
            headerName: 'Actions',
            width: 120,
            cellRenderer: (params: any) => (
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(params.data.id)}
                >
                    Delete
                </Button>
            )
        }
    ];

    // Default column definition
    const defaultColDef = {
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    };

    // Grid ready event handler
    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        // Auto-size columns to fit content
        params.api.sizeColumnsToFit();
    };

    // Handle cell value changes
    const onCellValueChanged = async (params: any) => {
        try {
            const updatedData = params.data;
            const apiEndpoint = `${process.env.REACT_APP_API_BASE_URL}/api/admin/data/${updatedData.id}`;
            await apiService.put(apiEndpoint, updatedData);
        } catch (err) {
            console.error('Error updating data:', err);
            // Revert the change in the grid
            params.api.undoCellEditing();
        }
    };

    // Handle adding new row
    const handleAddNew = () => {
        const newRow: AdminData = {
            id: Date.now(), // Temporary ID
            name: '',
            email: '',
            role: 'User',
            status: 'Pending',
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        setRowData([...rowData, newRow]);
    };

    // Handle deleting row
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                const apiEndpoint = `${process.env.REACT_APP_API_BASE_URL}/api/admin/data/${id}`;
                await apiService.delete(apiEndpoint);
                setRowData(rowData.filter((row: AdminData) => row.id !== id));
            } catch (err) {
                console.error('Error deleting data:', err);
                setError('Failed to delete entry. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Admin Data Management</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddNew}
                >
                    Add New
                </Button>
            </Box>
            <div
                className="ag-theme-alpine"
                style={{
                    height: 600,
                    width: '100%',
                    '--ag-header-height': '50px',
                    '--ag-header-foreground-color': '#000',
                    '--ag-header-background-color': '#f5f5f5',
                    '--ag-row-hover-color': 'rgba(0, 0, 0, 0.04)',
                    '--ag-selected-row-background-color': 'rgba(0, 0, 0, 0.08)',
                } as React.CSSProperties}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    onCellValueChanged={onCellValueChanged}
                    pagination={true}
                    paginationPageSize={10}
                    enableCellTextSelection={true}
                    rowSelection="multiple"
                    animateRows={true}
                    suppressRowClickSelection={true}
                />
            </div>
        </Box>
    );
};

export default AdminDataGrid; 