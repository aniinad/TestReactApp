import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import AdminDataGrid from './AdminDataGrid';

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
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, height: '100%' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `admin-tab-${index}`,
        'aria-controls': `admin-tabpanel-${index}`,
    };
}

const Admin: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
                    <Tab label="Data Management" {...a11yProps(0)} />
                    <Tab label="User Management" {...a11yProps(1)} />
                    <Tab label="Settings" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                <AdminDataGrid />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Typography>User Management Content</Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <Typography>Settings Content</Typography>
            </TabPanel>
        </Box>
    );
};

export default Admin; 