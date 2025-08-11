import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { 
  TextFields as TextIcon,
  Numbers as NumberIcon,
  Subject as TextareaIcon,
  ArrowDropDown as SelectIcon,
  RadioButtonChecked as RadioIcon,
  CheckBox as CheckboxIcon,
  DateRange as DateIcon
} from '@mui/icons-material';
import { FieldType } from '../../types/form';

interface FieldTypeSelectorProps {
  onAddField: (type: FieldType) => void;
}

const fieldTypes: Array<{ type: FieldType; label: string; icon: React.ReactNode; description: string }> = [
  {
    type: 'text',
    label: 'Text',
    icon: <TextIcon />,
    description: 'Single line text input'
  },
  {
    type: 'number',
    label: 'Number',
    icon: <NumberIcon />,
    description: 'Numeric input field'
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: <TextareaIcon />,
    description: 'Multi-line text input'
  },
  {
    type: 'select',
    label: 'Select',
    icon: <SelectIcon />,
    description: 'Dropdown selection'
  },
  {
    type: 'radio',
    label: 'Radio',
    icon: <RadioIcon />,
    description: 'Single choice from options'
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: <CheckboxIcon />,
    description: 'Multiple selections'
  },
  {
    type: 'date',
    label: 'Date',
    icon: <DateIcon />,
    description: 'Date picker input'
  }
];

export const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ onAddField }) => {
  return (
    <Box className="space-y-2">
      {fieldTypes.map((fieldType) => (
        <Button
          key={fieldType.type}
          variant="outlined"
          fullWidth
          startIcon={fieldType.icon}
          onClick={() => onAddField(fieldType.type)}
          className="justify-start p-3 h-auto bg-surface hover:bg-primary-light hover:border-primary border-border text-left"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0.5
          }}
        >
          <Typography variant="body2" className="font-medium text-text-primary">
            {fieldType.label}
          </Typography>
          <Typography variant="caption" className="text-text-secondary text-xs">
            {fieldType.description}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};