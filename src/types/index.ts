export interface GridData {
    id: number;
    name: string;
    email: string;
    phone: string;
    [key: string]: any; // For additional fields
}

export interface DataFormProps {
    data: GridData;
    onSubmit: (data: GridData) => void;
    onCancel: () => void;
} 