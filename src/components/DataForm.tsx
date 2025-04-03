import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    TextField,
    Button,
    Stack,
    Typography,
    Box,
    Paper
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { DataFormProps, GridData, ChildData } from '../types';

const DataForm: React.FC<DataFormProps> = ({ data, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<GridData>(data);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [childData, setChildData] = useState<ChildData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setFormData(data);
        if (data.id) {
            fetchChildData(data.id);
        }
    }, [data]);

    const fetchChildData = async (parentId: number): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://your-api-url.com/child-data?parentId=${parentId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setChildData(data);
        } catch (error) {
            console.error('Error fetching child data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prevData: GridData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const csfbPoolAllocation = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            };

            const response = await fetch(`https://your-api-url.com/endpoint?allocationSak=${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(csfbPoolAllocation)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            onSubmit(responseData);
        } catch (error) {
            console.error('Error updating data:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const childColumnDefs: ColDef[] = [
        { field: 'id', headerName: 'ID' },
        { field: 'name', headerName: 'Name' },
        { field: 'description', headerName: 'Description' },
        // Add other child data columns as needed
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Edit Record
                </Typography>
                <Stack spacing={2}>
                    <input
                        type="hidden"
                        name="id"
                        value={formData.id || ''}
                    />
                    <TextField
                        name="name"
                        label="Name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="email"
                        label="Email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="phone"
                        label="Phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        fullWidth
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            type="button"
                            onClick={onCancel}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            Save Changes
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Paper sx={{ p: 2, height: '400px' }}>
                <Typography variant="h6" gutterBottom>
                    Child Records
                </Typography>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography>Loading child data...</Typography>
                    </Box>
                ) : (
                    <div className="ag-theme-material" style={{ height: '100%', width: '100%' }}>
                        <AgGridReact
                            rowData={childData}
                            columnDefs={childColumnDefs}
                            defaultColDef={{
                                sortable: true,
                                filter: true,
                                resizable: true,
                                flex: 1,
                            }}
                        />
                    </div>
                )}
            </Paper>
        </Box>
    );
};

export default DataForm; 