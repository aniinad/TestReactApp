import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Stack,
    Typography,
    Box
} from '@mui/material';
import axios from 'axios';

const DataForm = ({ data, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(data);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData(data);
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Replace with your API endpoint
            const response = await axios.put(`https://api.example.com/data/${formData.id}`, formData);
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
                {/* Add more fields based on your data structure */}

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