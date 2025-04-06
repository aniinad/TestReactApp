import React, { useState } from 'react';
import { Box, Tab, Tabs, Paper, Grid as MuiGrid } from '@mui/material';
import DataGrid from './DataGrid';
import DataForm from './DataForm';
import { GridData } from '../types';
import { ColDef } from 'ag-grid-community';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ height: '100%' }}
        >
            {value === index && (
                <Box sx={{ height: '100%' }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const DataTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [selectedMasterRow, setSelectedMasterRow] = useState<GridData | null>(null);
    const [selectedChildRow, setSelectedChildRow] = useState<GridData | null>(null);

    // Define column definitions for each tab
    const getColumnDefs = (tabIndex: number): ColDef[] => {
        switch (tabIndex) {
            case 0: // Type 1 Data
                return [
                    { field: 'id', headerName: 'ID', checkboxSelection: true },
                    { field: 'name', headerName: 'Name' },
                    { field: 'email', headerName: 'Email' },
                    { field: 'phone', headerName: 'Phone' },
                    { field: 'address', headerName: 'Address' },
                ];
            case 1: // Type 2 Data
                return [
                    { field: 'id', headerName: 'ID', checkboxSelection: true },
                    { field: 'productName', headerName: 'Product' },
                    { field: 'category', headerName: 'Category' },
                    { field: 'price', headerName: 'Price' },
                    { field: 'inStock', headerName: 'In Stock' },
                ];
            case 2: // Type 3 Data
                return [
                    { field: 'id', headerName: 'ID', checkboxSelection: true },
                    { field: 'orderNumber', headerName: 'Order #' },
                    { field: 'customerName', headerName: 'Customer' },
                    { field: 'orderDate', headerName: 'Date' },
                    { field: 'status', headerName: 'Status' },
                    { field: 'total', headerName: 'Total' },
                ];
            default:
                return [
                    { field: 'id', headerName: 'ID', checkboxSelection: true },
                    { field: 'name', headerName: 'Name' },
                    { field: 'email', headerName: 'Email' },
                    { field: 'phone', headerName: 'Phone' },
                ];
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
        setActiveTab(newValue);
        // Clear selection when changing tabs
        setSelectedMasterRow(null);
        setSelectedChildRow(null);
    };

    const handleMasterRowSelect = (row: GridData | null): void => {
        console.log('Master row selected:', row);
        setSelectedMasterRow(row);
    };

    const handleChildRowSelect = (row: GridData | null): void => {
        console.log('Child row selected:', row);
        setSelectedChildRow(row);
    };

    const handleDataUpdate = (updatedData: GridData): void => {
        console.log('Data updated:', updatedData);
        setSelectedMasterRow(updatedData);
    };

    const getMasterGridEndpoint = (tabIndex: number): string => {
        switch (tabIndex) {
            case 0:
                return 'https://api.example.com/data/type1';
            case 1:
                return 'https://api.example.com/data/type2';
            case 2:
                return 'https://api.example.com/data/type3';
            default:
                return 'https://api.example.com/data';
        }
    };

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="data tabs">
                    <Tab label="Type 1 Data" />
                    <Tab label="Type 2 Data" />
                    <Tab label="Type 3 Data" />
                </Tabs>
            </Box>
            <TabPanel value={activeTab} index={0}>
                <MuiGrid container spacing={2} sx={{ height: '100%' }}>
                    <MuiGrid item xs={12} md={6}>
                        <DataGrid
                            apiEndpoint={getMasterGridEndpoint(0)}
                            onRowSelect={handleMasterRowSelect}
                            title="Type 1 Data"
                            columnDefs={getColumnDefs(0)}
                        />
                    </MuiGrid>
                    {selectedMasterRow && (
                        <>
                            <MuiGrid item xs={12} md={6}>
                                <DataForm
                                    data={selectedMasterRow}
                                    onSubmit={handleDataUpdate}
                                    onCancel={() => setSelectedMasterRow(null)}
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12}>
                                <DataGrid
                                    parentId={selectedMasterRow.id}
                                    onRowSelect={handleChildRowSelect}
                                    isChildGrid={true}
                                    title="Child Data"
                                />
                            </MuiGrid>
                        </>
                    )}
                </MuiGrid>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
                <MuiGrid container spacing={2} sx={{ height: '100%' }}>
                    <MuiGrid item xs={12} md={6}>
                        <DataGrid
                            apiEndpoint={getMasterGridEndpoint(1)}
                            onRowSelect={handleMasterRowSelect}
                            title="Type 2 Data"
                            columnDefs={getColumnDefs(1)}
                        />
                    </MuiGrid>
                    {selectedMasterRow && (
                        <>
                            <MuiGrid item xs={12} md={6}>
                                <DataForm
                                    data={selectedMasterRow}
                                    onSubmit={handleDataUpdate}
                                    onCancel={() => setSelectedMasterRow(null)}
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12}>
                                <DataGrid
                                    parentId={selectedMasterRow.id}
                                    onRowSelect={handleChildRowSelect}
                                    isChildGrid={true}
                                    title="Child Data"
                                />
                            </MuiGrid>
                        </>
                    )}
                </MuiGrid>
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
                <MuiGrid container spacing={2} sx={{ height: '100%' }}>
                    <MuiGrid item xs={12} md={6}>
                        <DataGrid
                            apiEndpoint={getMasterGridEndpoint(2)}
                            onRowSelect={handleMasterRowSelect}
                            title="Type 3 Data"
                            columnDefs={getColumnDefs(2)}
                        />
                    </MuiGrid>
                    {selectedMasterRow && (
                        <>
                            <MuiGrid item xs={12} md={6}>
                                <DataForm
                                    data={selectedMasterRow}
                                    onSubmit={handleDataUpdate}
                                    onCancel={() => setSelectedMasterRow(null)}
                                />
                            </MuiGrid>
                            <MuiGrid item xs={12}>
                                <DataGrid
                                    parentId={selectedMasterRow.id}
                                    onRowSelect={handleChildRowSelect}
                                    isChildGrid={true}
                                    title="Child Data"
                                />
                            </MuiGrid>
                        </>
                    )}
                </MuiGrid>
            </TabPanel>
        </Box>
    );
};

export default DataTabs; 