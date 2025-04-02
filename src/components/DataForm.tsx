import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    TextField,
    Button,
    Stack,
    Typography,
    Box
} from '@mui/material';
import { DataFormProps, GridData } from '../types';

const DataForm: React.FC<DataFormProps> = ({ data, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<GridData>(data);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        setFormData(data);
    }, [data]);

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
            const response = await fetch('https://your-api-url.com/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            onSubmit(responseData);
        } catch (error) {
            console.error('Error submitting form:', error);
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