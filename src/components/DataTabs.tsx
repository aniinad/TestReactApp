import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import DataGrid from './DataGrid';
import DataForm from './DataForm';
import { GridData } from '../types';

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
            id={`data-tabpanel-${index}`}
            aria-labelledby={`data-tab-${index}`}
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
    const [tabValue, setTabValue] = useState(0);
    const [selectedMasterRow, setSelectedMasterRow] = useState<GridData | null>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        // Clear selected row when changing tabs
        setSelectedMasterRow(null);
    };

    const handleMasterRowSelect = (row: GridData | null) => {
        setSelectedMasterRow(row);
    };

    // Function to get the API endpoint based on the current tab
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
        <Paper sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="data tabs"
                    sx={{ flexGrow: 1 }}
                >
                    <Tab label="Type 1 Data" />
                    <Tab label="Type 2 Data" />
                    <Tab label="Type 3 Data" />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 150px)' }}>
                    {/* Master Grid Section */}
                    <Box sx={{ flex: 2 }}>
                        <DataGrid
                            onRowSelect={handleMasterRowSelect}
                            isChildGrid={false}
                            title="Type 1 Master Data"
                            apiEndpoint={getMasterGridEndpoint(0)}
                        />
                    </Box>
                    {/* Form and Child Grid Section */}
                    <Box sx={{ flex: 1 }}>
                        {selectedMasterRow && (
                            <>
                                <DataForm
                                    data={selectedMasterRow}
                                    onSubmit={(updatedData) => {
                                        setSelectedMasterRow(updatedData);
                                    }}
                                    onCancel={() => setSelectedMasterRow(null)}
                                />
                                <Box sx={{ mt: 2 }}>
                                    <DataGrid
                                        parentId={selectedMasterRow.id}
                                        onRowSelect={() => { }}
                                        isChildGrid={true}
                                        title="Child Data"
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 150px)' }}>
                    {/* Master Grid Section */}
                    <Box sx={{ flex: 2 }}>
                        <DataGrid
                            onRowSelect={handleMasterRowSelect}
                            isChildGrid={false}
                            title="Type 2 Master Data"
                            apiEndpoint={getMasterGridEndpoint(1)}
                        />
                    </Box>
                    {/* Form and Child Grid Section */}
                    <Box sx={{ flex: 1 }}>
                        {selectedMasterRow && (
                            <>
                                <DataForm
                                    data={selectedMasterRow}
                                    onSubmit={(updatedData) => {
                                        setSelectedMasterRow(updatedData);
                                    }}
                                    onCancel={() => setSelectedMasterRow(null)}
                                />
                                <Box sx={{ mt: 2 }}>
                                    <DataGrid
                                        parentId={selectedMasterRow.id}
                                        onRowSelect={() => { }}
                                        isChildGrid={true}
                                        title="Child Data"
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 150px)' }}>
                    {/* Master Grid Section */}
                    <Box sx={{ flex: 2 }}>
                        <DataGrid
                            onRowSelect={handleMasterRowSelect}
                            isChildGrid={false}
                            title="Type 3 Master Data"
                            apiEndpoint={getMasterGridEndpoint(2)}
                        />
                    </Box>
                    {/* Form and Child Grid Section */}
                    <Box sx={{ flex: 1 }}>
                        {selectedMasterRow && (
                            <>
                                <DataForm
                                    data={selectedMasterRow}
                                    onSubmit={(updatedData) => {
                                        setSelectedMasterRow(updatedData);
                                    }}
                                    onCancel={() => setSelectedMasterRow(null)}
                                />
                                <Box sx={{ mt: 2 }}>
                                    <DataGrid
                                        parentId={selectedMasterRow.id}
                                        onRowSelect={() => { }}
                                        isChildGrid={true}
                                        title="Child Data"
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </TabPanel>
        </Paper>
    );
};

export default DataTabs; 