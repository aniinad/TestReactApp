import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { TextField, Select, MenuItem, InputLabel, FormControl, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AdvancedGridPanel: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', height: '80vh', gap: 2 }}>
            {/* Left side: Grids */}
            <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
                {/* Top Grid */}
                <Box sx={{ flex: 1, minHeight: 0 }}>
                    {/* TODO: AgGridReact for top grid */}
                    <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
                        {/* <AgGridReact ... /> */}
                    </div>
                </Box>
                {/* Bottom Grid */}
                <Box sx={{ flex: 1, minHeight: 0 }}>
                    {/* TODO: AgGridReact for bottom grid */}
                    <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
                        {/* <AgGridReact ... /> */}
                    </div>
                </Box>
            </Box>
            {/* Right side: Edit Form */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* TODO: Edit form for selected row */}
                <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, mb: 2 }}>
                    <form>
                        {/* Example fields, replace with dynamic fields as needed */}
                        <TextField label="Name" fullWidth margin="normal" />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="dropdown-label">Dropdown</InputLabel>
                            <Select labelId="dropdown-label" label="Dropdown">
                                <MenuItem value="option1">Option 1</MenuItem>
                                <MenuItem value="option2">Option 2</MenuItem>
                            </Select>
                        </FormControl>
                        <DatePicker label="Date" renderInput={(params) => <TextField {...params} fullWidth margin="normal" />} />
                        <TextField label="Other Field" fullWidth margin="normal" />
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button variant="contained" color="primary">Save</Button>
                            <Button variant="outlined">Cancel</Button>
                        </Box>
                    </form>
                </Box>
                <Button variant="contained" color="success" sx={{ mb: 2 }}>Add New Entry</Button>
                <Button variant="outlined" color="secondary">Export Grid</Button>
            </Box>
        </Box>
    );
};

export default AdvancedGridPanel; 