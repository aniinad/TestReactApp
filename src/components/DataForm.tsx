import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    TextField,
    Button,
    Stack,
    Typography,
    Box
} from '@mui/material';
import axios from 'axios';
import { DataFormProps, GridData } from '../types';

const DataForm: React.FC<DataFormProps> = ({ data, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<GridData>(data);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        setFormData(data);
    }, [data]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Replace with your API endpoint
            const response = await axios.put<GridData>(`https://api.example.com/data/${formData.id}`, formData);
            onSubmit(response.data);
        } catch (error) {
            console.error('Error updating data:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Edit Record
            </Typography>
            <Stack spacing={2}>
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
        </Box>
    );
};

export default DataForm; 