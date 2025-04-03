import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
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
        // If a row is selected in master grid, switch to child grid tab
        if (row) {
            setTabValue(1);
        }
    };

    const handleChildRowSelect = (row: GridData | null) => {
        setSelectedChildRow(row);
        // If a row is selected in child grid, switch to details tab
        if (row) {
            setTabValue(2);
        }
    };

    return (
        <Paper sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="data tabs">
                    <Tab label="Master Grid" />
                    <Tab label="Child Grid" disabled={!selectedMasterRow} />
                    <Tab label="Details" disabled={!selectedChildRow} />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                <DataGrid
                    onRowSelect={handleMasterRowSelect}
                    isChildGrid={false}
                />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {selectedMasterRow && (
                    <DataGrid
                        parentId={selectedMasterRow.id}
                        onRowSelect={handleChildRowSelect}
                        isChildGrid={true}
                    />
                )}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                {selectedChildRow && (
                    <Box>
                        <h2>Details</h2>
                        <pre>{JSON.stringify(selectedChildRow, null, 2)}</pre>
                    </Box>
                )}
            </TabPanel>
        </Paper>
    );
};

export default DataTabs; 