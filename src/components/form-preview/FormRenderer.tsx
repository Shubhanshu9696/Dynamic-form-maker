import React, { useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Typography,
  Alert,
  Button
} from '@mui/material';
import { FormSchema, FormData, FormField } from '../../types/form';
import { validateForm, computeDerivedValue } from '../../utils/formValidation';

interface FormRendererProps {
  form: FormSchema;
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  form,
  formData,
  onFormDataChange
}) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  // Update derived fields when parent fields change
  useEffect(() => {
    const derivedFields = form.fields.filter(field => field.isDerived);
    const updatedData = { ...formData };
    let hasChanges = false;

    derivedFields.forEach(field => {
      const newValue = computeDerivedValue(field, formData);
      if (newValue !== formData[field.id]) {
        updatedData[field.id] = newValue;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      onFormDataChange(updatedData);
    }
  }, [formData, form.fields, onFormDataChange]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const updatedData = { ...formData, [fieldId]: value };
    onFormDataChange(updatedData);
    
    // Clear error for this field if it exists
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    const validation = validateForm(form.fields, formData);
    
    if (validation.isValid) {
      setSubmitted(true);
      setErrors({});
      console.log('Form submitted successfully:', formData);
    } else {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach(error => {
        errorMap[error.fieldId] = error.message;
      });
      setErrors(errorMap);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = errors[field.id];
    const isRequired = field.required;

    if (field.isDerived) {
      return (
        <Box key={field.id} className="mb-4">
          <Typography variant="body2" className="text-text-secondary mb-1">
            {field.label} (Computed)
          </Typography>
          <Box className="p-3 bg-muted rounded border">
            <Typography variant="body1" className="text-text-primary">
              {value !== null && value !== undefined ? String(value) : 'No value'}
            </Typography>
          </Box>
        </Box>
      );
    }

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <TextField
            key={field.id}
            fullWidth
            label={field.label}
            type={field.type}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={isRequired}
            error={!!error}
            helperText={error}
            className="mb-4"
          />
        );

      case 'textarea':
        return (
          <TextField
            key={field.id}
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={isRequired}
            error={!!error}
            helperText={error}
            className="mb-4"
          />
        );

      case 'date':
        return (
          <TextField
            key={field.id}
            fullWidth
            type="date"
            label={field.label}
            value={value ? (value instanceof Date ? value.toISOString().split('T')[0] : value) : ''}
            onChange={(e) => handleFieldChange(field.id, new Date(e.target.value))}
            required={isRequired}
            error={!!error}
            helperText={error}
            InputLabelProps={{ shrink: true }}
            className="mb-4"
          />
        );

      case 'select':
        return (
          <FormControl key={field.id} fullWidth className="mb-4" error={!!error}>
            <FormLabel>{field.label}{isRequired && ' *'}</FormLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" className="text-error mt-1">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl key={field.id} className="mb-4" error={!!error}>
            <FormLabel>{field.label}{isRequired && ' *'}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" className="text-error mt-1">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl key={field.id} className="mb-4" error={!!error}>
            <FormLabel>{field.label}{isRequired && ' *'}</FormLabel>
            <Box>
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={Array.isArray(value) ? value.includes(option.value) : false}
                      onChange={(e) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        const newValues = e.target.checked
                          ? [...currentValues, option.value]
                          : currentValues.filter(v => v !== option.value);
                        handleFieldChange(field.id, newValues);
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </Box>
            {error && (
              <Typography variant="caption" className="text-error mt-1">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <Box className="text-center py-8">
        <Alert severity="success" className="mb-4">
          <Typography variant="h6" className="font-semibold mb-2">
            Form Submitted Successfully!
          </Typography>
          <Typography variant="body2">
            This is a preview - in a real application, the form data would be processed.
          </Typography>
        </Alert>
        
        <Button
          variant="outlined"
          onClick={() => setSubmitted(false)}
          className="mt-4"
        >
          Submit Another Response
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" className="font-bold text-text-primary mb-6">
        {form.name}
      </Typography>
      
      <Box className="space-y-4">
        {form.fields
          .sort((a, b) => a.order - b.order)
          .map(renderField)}
      </Box>

      <Box className="mt-8 pt-6 border-t border-border">
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          className="bg-gradient-primary px-8"
        >
          Submit Form
        </Button>
      </Box>
    </Box>
  );
};