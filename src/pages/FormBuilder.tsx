import React from 'react';
import { Box, Container, Typography, Button, Divider } from '@mui/material';
import { Add as AddIcon, Preview as PreviewIcon, Save as SaveIcon } from '@mui/icons-material';
import { useFormBuilder } from '../hooks/useFormBuilder';
import { FieldTypeSelector } from '../components/form-builder/FieldTypeSelector';
import { FieldsList } from '../components/form-builder/FieldsList';
import { FieldConfigPanel } from '../components/form-builder/FieldConfigPanel';
import { SaveFormDialog } from '../components/form-builder/SaveFormDialog';
import { useNavigate } from 'react-router-dom';

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const {
    fields,
    selectedFieldId,
    addField,
    updateField,
    deleteField,
    reorderFields,
    updateFieldValidation,
    updateFieldOptions,
    updateDerivedConfig,
    saveFormSchema,
    getSelectedField,
    setSelectedFieldId
  } = useFormBuilder();

  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);

  const handleSaveForm = (name: string) => {
    const savedForm = saveFormSchema(name);
    setSaveDialogOpen(false);
    // Store the current form in session storage for preview
    sessionStorage.setItem('currentForm', JSON.stringify(savedForm));
  };

  const handlePreview = () => {
    const tempForm = {
      id: 'temp',
      name: 'Preview Form',
      fields: fields.sort((a, b) => a.order - b.order),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    sessionStorage.setItem('currentForm', JSON.stringify(tempForm));
    navigate('/preview');
  };

  return (
    <Box className="form-builder-container min-h-screen">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box className="flex items-center justify-between mb-6">
          <Box>
            <Typography variant="h4" className="font-bold text-text-primary mb-2">
              Form Builder
            </Typography>
            <Typography variant="body1" className="text-text-secondary">
              Create dynamic forms with customizable fields and validations
            </Typography>
          </Box>
          <Box className="flex gap-3">
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
              disabled={fields.length === 0}
              className="bg-surface hover:bg-primary-light"
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => setSaveDialogOpen(true)}
              disabled={fields.length === 0}
              className="bg-gradient-primary"
            >
              Save Form
            </Button>
          </Box>
        </Box>

        <Divider className="mb-6" />

        <Box className="grid grid-cols-12 gap-6 min-h-[600px]">
          {/* Left Sidebar - Field Types */}
          <Box className="col-span-3 builder-sidebar rounded-lg p-4">
            <Typography variant="h6" className="font-semibold text-text-primary mb-4">
              Field Types
            </Typography>
            <FieldTypeSelector onAddField={addField} />
          </Box>

          {/* Center - Fields List */}
          <Box className="col-span-6 bg-surface rounded-lg p-4 custom-scrollbar overflow-y-auto">
            <Box className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold text-text-primary">
                Form Fields ({fields.length})
              </Typography>
            </Box>
            
            {fields.length === 0 ? (
              <Box className="text-center py-12">
                <AddIcon className="text-6xl text-muted-foreground mb-4" />
                <Typography variant="h6" className="text-muted-foreground mb-2">
                  No fields added yet
                </Typography>
                <Typography variant="body2" className="text-text-secondary">
                  Start building your form by adding fields from the sidebar
                </Typography>
              </Box>
            ) : (
              <FieldsList
                fields={fields}
                selectedFieldId={selectedFieldId}
                onSelectField={setSelectedFieldId}
                onDeleteField={deleteField}
                onReorderFields={reorderFields}
              />
            )}
          </Box>

          {/* Right Sidebar - Field Configuration */}
          <Box className="col-span-3 builder-sidebar rounded-lg p-4">
            <Typography variant="h6" className="font-semibold text-text-primary mb-4">
              Field Configuration
            </Typography>
            
            {selectedFieldId ? (
              <FieldConfigPanel
                field={getSelectedField()}
                onUpdateField={updateField}
                onUpdateValidation={updateFieldValidation}
                onUpdateOptions={updateFieldOptions}
                onUpdateDerivedConfig={updateDerivedConfig}
                allFields={fields}
              />
            ) : (
              <Box className="text-center py-8">
                <Typography variant="body2" className="text-text-secondary">
                  Select a field to configure its properties
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      <SaveFormDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSaveForm}
      />
    </Box>
  );
};

export default FormBuilder;