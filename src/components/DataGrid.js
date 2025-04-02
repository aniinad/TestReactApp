import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import axios from 'axios';
import { Paper, Box } from '@mui/material';
import DataForm from './DataForm';

const DataGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [gridApi, setGridApi] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Replace with your API endpoint
            const response = await axios.get('https://api.example.com/data');
            setRowData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const defaultColDef = {
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        setSelectedRow(selectedRows[0] || null);
    };

    const handleDataUpdate = (updatedData) => {
        // Update the grid data after form submission
        setRowData(prevData =>
            prevData.map(row =>
                row.id === updatedData.id ? updatedData : row
            )
        );
        setSelectedRow(null);
    };

    // Replace with your actual column definitions based on API response
    const columnDefs = [
        { field: 'id', headerName: 'ID', checkboxSelection: true },
        { field: 'name', headerName: 'Name' },
        { field: 'email', headerName: 'Email' },
        { field: 'phone', headerName: 'Phone' },
        // Add more columns as needed
    ];

    return (
        <Box sx={{ display: 'flex', gap: 2, p: 2, height: 'calc(100vh - 100px)' }}>
            <Paper sx={{ flex: 2, height: '100%' }}>
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