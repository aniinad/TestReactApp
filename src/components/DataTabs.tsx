import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import { GridData } from '../types/grid';
import DataGrid from './DataGrid';
import DataForm from './DataForm';
import { ColDef } from 'ag-grid-community';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const DataTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [masterData, setMasterData] = useState<GridData[]>([]);
    const [childData, setChildData] = useState<GridData[]>([]);
    const [selectedMasterRow, setSelectedMasterRow] = useState<GridData | null>(null);
    const [selectedChildRow, setSelectedChildRow] = useState<GridData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getMasterGridEndpoint = (tabIndex: number): string => {
        switch (tabIndex) {
            case 0:
                return 'http://localhost:5000/api/data/type1';
            case 1:
                return 'http://localhost:5000/api/data/type2';
            case 2:
                return 'http://localhost:5000/api/data/type3';
            default:
                return 'http://localhost:5000/api/data/type1';
        }
    };

    const getColumnDefs = (tabIndex: number): ColDef[] => {
        switch (tabIndex) {
            case 0:
                return [
                    { field: 'id', headerName: 'ID' },
                    { field: 'name', headerName: 'Name' },
                    { field: 'email', headerName: 'Email' },
                    { field: 'phone', headerName: 'Phone' },
                    { field: 'address', headerName: 'Address' }
                ];
            case 1:
                return [
                    { field: 'id', headerName: 'ID' },
                    { field: 'productName', headerName: 'Product Name' },
                    { field: 'category', headerName: 'Category' },
                    { field: 'price', headerName: 'Price' },
                    { field: 'inStock', headerName: 'In Stock' }
                ];
            case 2:
                return [
                    { field: 'id', headerName: 'ID' },
                    { field: 'orderNumber', headerName: 'Order Number' },
                    { field: 'customerName', headerName: 'Customer Name' },
                    { field: 'orderDate', headerName: 'Order Date' },
                    { field: 'status', headerName: 'Status' },
                    { field: 'total', headerName: 'Total' }
                ];
            default:
                return [
                    { field: 'id', headerName: 'ID' },
                    { field: 'name', headerName: 'Name' }
                ];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(getMasterGridEndpoint(activeTab));
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMasterData(data);
                setSelectedMasterRow(null);
                setSelectedChildRow(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setSelectedMasterRow(null);
        setSelectedChildRow(null);
    };

    const handleMasterRowSelect = (row: GridData) => {
        console.log('Selected master row:', row);
        setSelectedMasterRow(row);
        setSelectedChildRow(null);
    };

    const handleChildRowSelect = (row: GridData) => {
        console.log('Selected child row:', row);
        setSelectedChildRow(row);
    };

    const handleDataUpdate = (updatedData: GridData) => {
        console.log('Updated data:', updatedData);
        setSelectedMasterRow(updatedData);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="data tabs">
                    <Tab label="Type 1 Data" />
                    <Tab label="Type 2 Data" />
                    <Tab label="Type 3 Data" />
                </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 2 }}>
                        <DataGrid
                            data={masterData}
                            onRowSelect={handleMasterRowSelect}
                            columnDefs={getColumnDefs(0)}
                            loading={loading}
                            error={error}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        {selectedMasterRow && (
                            <>
                                <DataForm
                                    data={selectedMasterRow}
                                    onUpdate={handleDataUpdate}
                                />
                                <Box sx={{ mt: 2 }}>
                                    <DataGrid
                                        data={childData}
                                        onRowSelect={handleChildRowSelect}
                                        columnDefs={[
                                            { field: 'id', headerName: 'ID' },
                                            { field: 'name', headerName: 'Name' }
                                        ]}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 2 }}>
                        <DataGrid
                            data={masterData}
                            onRowSelect={handleMasterRowSelect}
                            columnDefs={getColumnDefs(1)}
                            loading={loading}
                            error={error}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        {selectedMasterRow && (
                            <>
                                <DataForm
                                    data={selectedMasterRow}
                                    onUpdate={handleDataUpdate}
                                />
                                <Box sx={{ mt: 2 }}>
                                    <DataGrid
                                        data={childData}
                                        onRowSelect={handleChildRowSelect}
                                        columnDefs={[
                                            { field: 'id', headerName: 'ID' },
                                            { field: 'name', headerName: 'Name' }
                                        ]}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 2 }}>
                        <DataGrid
                            data={masterData}
                            onRowSelect={handleMasterRowSelect}
                            columnDefs={getColumnDefs(2)}
                            loading={loading}
                            error={error}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        {selectedMasterRow && (
                            <>
                                <DataForm
                                    data={selectedMasterRow}
                                    onUpdate={handleDataUpdate}
                                />
                                <Box sx={{ mt: 2 }}>
                                    <DataGrid
                                        data={childData}
                                        onRowSelect={handleChildRowSelect}
                                        columnDefs={[
                                            { field: 'id', headerName: 'ID' },
                                            { field: 'name', headerName: 'Name' }
                                        ]}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </TabPanel>
        </Box>
    );
};

export default DataTabs; 