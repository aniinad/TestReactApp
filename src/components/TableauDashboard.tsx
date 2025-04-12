import React, { useState } from 'react';
import { Box, Paper, Typography, Alert, Tabs, Tab } from '@mui/material';
import { TableauEmbed } from '@stoddabr/react-tableau-embed-live';

interface TableauTab {
    url: string;
    title: string;
}

interface TableauDashboardProps {
    tabs: TableauTab[];
    defaultTabIndex?: number;
    width?: string | number;
    height?: string | number;
}

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
            id={`tableau-tabpanel-${index}`}
            aria-labelledby={`tableau-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const TableauDashboard: React.FC<TableauDashboardProps> = ({
    tabs,
    defaultTabIndex = 0,
    width = '100%',
    height = '600px'
}) => {
    const [activeTab, setActiveTab] = useState(defaultTabIndex);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleError = (error: Error) => {
        setError(error.message);
        console.error('Tableau dashboard error:', error);
    };

    if (!tabs || tabs.length === 0) {
        return (
            <Alert severity="error">
                No tableau dashboards configured. Please provide tab configurations.
            </Alert>
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="tableau dashboard tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={tab.title}
                            id={`tableau-tab-${index}`}
                            aria-controls={`tableau-tabpanel-${index}`}
                        />
                    ))}
                </Tabs>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                </Alert>
            )}

            {tabs.map((tab, index) => (
                <TabPanel key={index} value={activeTab} index={index}>
                    <TableauEmbed
                        src={tab.url}
                        width={width}
                        height={height}
                        onError={handleError}
                    />
                </TabPanel>
            ))}
        </Paper>
    );
};

export default TableauDashboard; 