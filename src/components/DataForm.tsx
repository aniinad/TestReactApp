import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    TextField,
    Button,
    Stack,
    Typography,
    Box,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
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
    const [isNewChildDialogOpen, setIsNewChildDialogOpen] = useState<boolean>(false);
    const [newChildData, setNewChildData] = useState<Partial<ChildData>>({
        name: '',
        description: ''
    });

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

    const handleNewChildChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setNewChildData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewChildSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`https://your-api-url.com/child-data?parentId=${formData.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newChildData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const createdChild = await response.json();
            setChildData(prev => [...prev, createdChild]);
            setIsNewChildDialogOpen(false);
            setNewChildData({ name: '', description: '' });
        } catch (error) {
            console.error('Error creating child data:', error);
        } finally {
            setIsSubmitting(false);
        }
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        Child Records
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setIsNewChildDialogOpen(true)}
                    >
                        Add New Child
                    </Button>
                </Box>
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

            <Dialog open={isNewChildDialogOpen} onClose={() => setIsNewChildDialogOpen(false)}>
                <DialogTitle>Add New Child Record</DialogTitle>
                <form onSubmit={handleNewChildSubmit}>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                name="name"
                                label="Name"
                                value={newChildData.name}
                                onChange={handleNewChildChange}
                                fullWidth
                                required
                            />
                            <TextField
                                name="description"
                                label="Description"
                                value={newChildData.description}
                                onChange={handleNewChildChange}
                                fullWidth
                                required
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsNewChildDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default DataForm; 