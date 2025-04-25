import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent, ICellEditorParams, ICellRendererParams } from 'ag-grid-community';
import { useApiService } from '../services/apiService';

// Import Ag-Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface AdminData {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

const AdminDataGrid: React.FC = () => {
    const [rowData, setRowData] = useState<AdminData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const apiService = useApiService();

    // Reference to track if component is mounted
    const isMounted = useRef(true);

    // Column definitions
    const columnDefs: ColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            editable: false,
            filter: 'agNumberColumnFilter'
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            editable: true,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            editable: true,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            editable: true,
            filter: 'agTextColumnFilter',
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Admin', 'User', 'Editor', 'Viewer']
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            editable: true,
            filter: 'agTextColumnFilter',
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Active', 'Inactive', 'Pending']
            }
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 1,
            editable: false,
            filter: 'agDateColumnFilter',
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString();
            }
        },
        {
            headerName: 'Actions',
            width: 120,
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.data.id)}
                    >
                        Delete
                    </Button>
                );
            }
        }
    ];

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use the ApiService to make the authenticated API call
                const apiEndpoint = '/api/admin/data';
                const data = await apiService.get<AdminData[]>(apiEndpoint);

                if (isMounted.current) {
                    setRowData(data);
                }
            } catch (err) {
                console.error('Error fetching admin data:', err);
                if (isMounted.current) {
                    setError('Failed to load data. Please try again later.');
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted.current = false;
        };
    }, [apiService]);

    // Handle grid ready event
    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
    };

    // Handle cell value changed
    const onCellValueChanged = async (params: any) => {
        try {
            const updatedData = params.data;
            const apiEndpoint = `/api/admin/data/${updatedData.id}`;

            // Update the data on the server
            await apiService.put(apiEndpoint, updatedData);

            // Show success message or handle as needed
            console.log('Data updated successfully');
        } catch (err) {
            console.error('Error updating data:', err);
            // Revert the change in the grid
            params.api.undoCellEditing();
        }
    };

    // Handle adding a new row
    const handleAddNew = () => {
        if (gridApi) {
            // Create a new empty row
            const newRow: AdminData = {
                id: 0, // This will be replaced by the server
                name: '',
                email: '',
                role: 'User',
                status: 'Active',
                createdAt: new Date().toISOString()
            };

            // Add the new row to the grid
            gridApi.applyTransaction({ add: [newRow] });

            // Start editing the first cell of the new row
            setTimeout(() => {
                gridApi.startEditingCell({
                    rowIndex: 0,
                    colKey: 'name'
                });
            }, 100);
        }
    };

    // Handle deleting a row
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const apiEndpoint = `/api/admin/data/${id}`;

                // Delete the data from the server
                await apiService.delete(apiEndpoint);

                // Remove the row from the grid
                if (gridApi) {
                    gridApi.applyTransaction({ remove: [{ id }] });
                }

                // Show success message or handle as needed
                console.log('Data deleted successfully');
            } catch (err) {
                console.error('Error deleting data:', err);
                setError('Failed to delete item. Please try again later.');
            }
        }
    };

    // Handle saving a new row
    const handleSaveNew = async (newData: AdminData) => {
        try {
            const apiEndpoint = '/api/admin/data';

            // Save the new data to the server
            const savedData = await apiService.post(apiEndpoint, newData);

            // Update the grid with the saved data (which includes the server-generated ID)
            if (gridApi) {
                gridApi.applyTransaction({
                    remove: [{ id: 0 }],
                    add: [savedData]
                });
            }

            // Show success message or handle as needed
            console.log('Data saved successfully');
        } catch (err) {
            console.error('Error saving data:', err);
            setError('Failed to save item. Please try again later.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Data Management</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddNew}
                    startIcon={<span>+</span>}
                >
                    Add New
                </Button>
            </Box>

            <Box sx={{ flexGrow: 1, height: 'calc(100% - 60px)' }}>
                <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        onCellValueChanged={onCellValueChanged}
                        rowSelection="multiple"
                        enableRangeSelection={true}
                        pagination={true}
                        paginationPageSize={10}
                        animateRows={true}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: true,
                        }}
                    />
                </div>
            </Box>
        </Box>
    );
};

export default AdminDataGrid; 