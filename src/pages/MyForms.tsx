import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
   
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Preview as PreviewIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FormSchema } from '../types/form';
import { getForms, deleteForm } from '../utils/localStorage';
import { format } from 'date-fns';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadForms = () => {
      try {
        const savedForms = getForms();
        setForms(savedForms.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
      } catch (error) {
        console.error('Error loading forms:', error);
      }
    };

    loadForms();
  }, []);

  const handlePreviewForm = (form: FormSchema) => {
    sessionStorage.setItem('currentForm', JSON.stringify(form));
    navigate('/preview');
  };

  const handleEditForm = (form: FormSchema) => {
    sessionStorage.setItem('editForm', JSON.stringify(form));
    navigate('/create');
  };

  const handleDeleteForm = (formId: string) => {
    setFormToDelete(formId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (formToDelete) {
      try {
        deleteForm(formToDelete);
        setForms(prev => prev.filter(form => form.id !== formToDelete));
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
    setDeleteDialogOpen(false);
    setFormToDelete(null);
  };

  return (
    <Box className="form-builder-container min-h-screen">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box className="flex items-center justify-between mb-6">
          <Box>
            <Typography variant="h4" className="font-bold text-text-primary mb-2">
              My Forms
            </Typography>
            <Typography variant="body1" className="text-text-secondary">
              Manage all your saved forms in one place
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
            className="bg-gradient-primary"
          >
            Create New Form
          </Button>
        </Box>

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <Box className="text-center py-12">
            <DescriptionIcon className="text-8xl text-muted-foreground mb-4" />
            <Typography variant="h5" className="text-muted-foreground mb-2">
              No forms created yet
            </Typography>
            <Typography variant="body1" className="text-text-secondary mb-6">
              Start building your first form to see it here
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create')}
              className="bg-gradient-primary"
              size="large"
            >
              Create Your First Form
            </Button>
          </Box>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="h-full bg-surface hover:shadow-md transition-all duration-200 animate-fade-in">
                <CardContent className="pb-2">
                  <Typography variant="h6" className="font-semibold text-text-primary mb-2 truncate">
                    {form.name}
                  </Typography>
                  
                  <Box className="flex items-center gap-2 mb-3">
                    <Chip 
                      label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                      size="small"
                      className="bg-primary-light text-primary"
                    />
                    {form.fields.some(f => f.isDerived) && (
                      <Chip 
                        label="Has derived fields"
                        size="small"
                        className="bg-secondary-light text-secondary"
                      />
                    )}
                  </Box>

                  <Typography variant="body2" className="text-text-secondary mb-1">
                    Created: {format(form.createdAt, 'MMM dd, yyyy')}
                  </Typography>
                  {form.updatedAt.getTime() !== form.createdAt.getTime() && (
                    <Typography variant="body2" className="text-text-secondary">
                      Updated: {format(form.updatedAt, 'MMM dd, yyyy')}
                    </Typography>
                  )}
                </CardContent>

                <CardActions className="px-4 pb-4 pt-0">
                  <Button
                    size="small"
                    startIcon={<PreviewIcon />}
                    onClick={() => handlePreviewForm(form)}
                    className="text-primary hover:bg-primary-light"
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditForm(form)}
                    className="text-text-secondary hover:bg-muted"
                  >
                    Edit
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteForm(form.id)}
                    className="ml-auto text-error hover:bg-error-light"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </div>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Form
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this form? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            className="text-text-secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete}
            className="text-error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyForms;