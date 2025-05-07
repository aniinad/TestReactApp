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
                <Box sx={{ p: 3 }}>
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
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="admin tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Data Management" {...a11yProps(0)} />
                    <Tab label="User Management" {...a11yProps(1)} />
                    <Tab label="Settings" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <AdminDataGrid />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Typography variant="h6">User Management</Typography>
                <Typography>User management functionality coming soon...</Typography>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Typography variant="h6">Settings</Typography>
                <Typography>Settings functionality coming soon...</Typography>
            </TabPanel>
        </Box>
    );
};

export default Admin; 