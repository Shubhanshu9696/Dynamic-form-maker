import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FormSchema, FormData } from '../types/form';
import { FormRenderer } from '../components/form-preview/FormRenderer';

const FormPreview: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormSchema | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForm = () => {
      try {
        const storedForm = sessionStorage.getItem('currentForm');
        if (storedForm) {
          const parsedForm = JSON.parse(storedForm);
          setForm(parsedForm);
          
          // Initialize form data with default values
          const initialData: FormData = {};
          parsedForm.fields.forEach((field: any) => {
            if (field.defaultValue !== undefined) {
              initialData[field.id] = field.defaultValue;
            }
          });
          setFormData(initialData);
        }
      } catch (error) {
        console.error('Error loading form:', error);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, []);

  const handleReset = () => {
    if (form) {
      const initialData: FormData = {};
      form.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        }
      });
      setFormData(initialData);
    }
  };

  if (loading) {
    return (
      <Box className="form-builder-container min-h-screen flex items-center justify-center">
        <Typography variant="h6" className="text-text-secondary">
          Loading form...
        </Typography>
      </Box>
    );
  }

  if (!form) {
    return (
      <Box className="form-builder-container min-h-screen">
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box className="text-center">
            <Alert severity="warning" className="mb-4">
              No form found for preview
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/create')}
              className="bg-gradient-primary"
            >
              Back to Form Builder
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="form-builder-container min-h-screen">
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Header */}
        <Box className="flex items-center justify-between mb-6">
          <Box>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/create')}
              className="mb-2 text-text-secondary hover:text-primary"
            >
              Back to Builder
            </Button>
            <Typography variant="h4" className="font-bold text-text-primary mb-2">
              {form.name || 'Form Preview'}
            </Typography>
            <Typography variant="body1" className="text-text-secondary">
              Preview how your form will behave for end users
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            className="bg-surface hover:bg-muted"
          >
            Reset Form
          </Button>
        </Box>

        {/* Form Preview */}
        <Box className="preview-container animate-fade-in">
          <FormRenderer
            form={form}
            formData={formData}
            onFormDataChange={setFormData}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default FormPreview;