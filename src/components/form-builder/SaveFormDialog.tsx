import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from '@mui/material';

interface SaveFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const SaveFormDialog: React.FC<SaveFormDialogProps> = ({
  open,
  onClose,
  onSave
}) => {
  const [formName, setFormName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!formName.trim()) {
      setError('Form name is required');
      return;
    }
    
    onSave(formName.trim());
    setFormName('');
    setError('');
  };

  const handleClose = () => {
    setFormName('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" className="font-semibold">
          Save Form
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" className="text-text-secondary mb-4">
          Enter a name for your form. You can edit this later.
        </Typography>
        
        <TextField
          autoFocus
          fullWidth
          label="Form Name"
          value={formName}
          onChange={(e) => {
            setFormName(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          placeholder="e.g., Contact Form, Survey, Registration"
        />
      </DialogContent>
      
      <DialogActions className="px-6 pb-4">
        <Button
          onClick={handleClose}
          className="text-text-secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          className="bg-gradient-primary"
          disabled={!formName.trim()}
        >
          Save Form
        </Button>
      </DialogActions>
    </Dialog>
  );
};