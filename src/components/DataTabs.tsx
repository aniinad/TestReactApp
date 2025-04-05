import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper, Button, Stack } from '@mui/material';
import DataGrid from './DataGrid';
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
    const [selectedChildRow, setSelectedChildRow] = useState<GridData | null>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleMasterRowSelect = (row: GridData | null) => {
        setSelectedMasterRow(row);
    };

    const handleChildRowSelect = (row: GridData | null) => {
        console.log('Child row selected:', row); // Debug log
        setSelectedChildRow(row);
        // Switch to second tab when a child row is selected
        if (row) {
            console.log('Switching to tab 1'); // Debug log
            setTabValue(1);
        }
    };

    const handleBack = () => {
        if (tabValue === 1) {
            setTabValue(0);
            setSelectedChildRow(null);
        }
    };

    return (
        <Paper sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={tabValue === 0}
                    >
                        Back
                    </Button>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="data tabs"
                        sx={{ flexGrow: 1 }}
                    >
                        <Tab label="Master & Child Data" />
                        <Tab label="Child & Grandchild Data" disabled={!selectedChildRow} />
                    </Tabs>
                </Stack>
            </Box>
            <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 150px)' }}>
                    {/* Master Grid Section */}
                    <Box sx={{ flex: 2 }}>
                        <DataGrid
                            onRowSelect={handleMasterRowSelect}
                            isChildGrid={false}
                            title="Master Data"
                        />
                    </Box>
                    {/* Child Grid and Form Section */}
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
                                        onRowSelect={handleChildRowSelect}
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
                {selectedChildRow && (
                    <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 150px)' }}>
                        {/* Child Grid Section */}
                        <Box sx={{ flex: 2 }}>
                            <DataGrid
                                parentId={selectedMasterRow?.id}
                                onRowSelect={handleChildRowSelect}
                                isChildGrid={true}
                                title="Child Data"
                            />
                        </Box>
                        {/* Grandchild Grid and Form Section */}
                        <Box sx={{ flex: 1 }}>
                            <DataForm
                                data={selectedChildRow}
                                onSubmit={(updatedData) => {
                                    setSelectedChildRow(updatedData);
                                }}
                                onCancel={() => setSelectedChildRow(null)}
                            />
                            <Box sx={{ mt: 2 }}>
                                <DataGrid
                                    parentId={selectedChildRow.id}
                                    onRowSelect={() => { }}
                                    isChildGrid={true}
                                    title="Grandchild Data"
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </TabPanel>
        </Paper>
    );
};

export default DataTabs; 