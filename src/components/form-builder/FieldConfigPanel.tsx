import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { FormField, ValidationRule, SelectOption, DerivedFieldConfig } from '../../types/form';

interface FieldConfigPanelProps {
  field: FormField | null;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onUpdateValidation: (fieldId: string, rules: ValidationRule[]) => void;
  onUpdateOptions: (fieldId: string, options: SelectOption[]) => void;
  onUpdateDerivedConfig: (fieldId: string, config: DerivedFieldConfig) => void;
  allFields: FormField[];
}

export const FieldConfigPanel: React.FC<FieldConfigPanelProps> = ({
  field,
  onUpdateField,
  onUpdateValidation,
  onUpdateOptions,
  onUpdateDerivedConfig,
  allFields
}) => {
  const [newRule, setNewRule] = useState<Partial<ValidationRule>>({});
  const [newOption, setNewOption] = useState({ label: '', value: '' });

  if (!field) return null;

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    onUpdateField(field.id, updates);
  };

  const addValidationRule = () => {
    if (newRule.type && newRule.message) {
      const rule: ValidationRule = {
        type: newRule.type,
        value: newRule.value,
        message: newRule.message
      };
      onUpdateValidation(field.id, [...field.validationRules, rule]);
      setNewRule({});
    }
  };

  const removeValidationRule = (index: number) => {
    const updatedRules = field.validationRules.filter((_, i) => i !== index);
    onUpdateValidation(field.id, updatedRules);
  };

  const addOption = () => {
    if (newOption.label && newOption.value && field.options) {
      onUpdateOptions(field.id, [...field.options, newOption]);
      setNewOption({ label: '', value: '' });
    }
  };

  const removeOption = (index: number) => {
    if (field.options) {
      const updatedOptions = field.options.filter((_, i) => i !== index);
      onUpdateOptions(field.id, updatedOptions);
    }
  };

  const updateOption = (index: number, updates: Partial<SelectOption>) => {
    if (field.options) {
      const updatedOptions = field.options.map((option, i) =>
        i === index ? { ...option, ...updates } : option
      );
      onUpdateOptions(field.id, updatedOptions);
    }
  };

  const toggleDerived = () => {
    if (field.isDerived) {
      handleFieldUpdate({ isDerived: false, derivedConfig: undefined });
    } else {
      handleFieldUpdate({ isDerived: true });
    }
  };

  const updateDerivedConfig = (updates: Partial<DerivedFieldConfig>) => {
    if (field.derivedConfig) {
      onUpdateDerivedConfig(field.id, { ...field.derivedConfig, ...updates });
    }
  };

  const availableParentFields = allFields.filter(f => f.id !== field.id && !f.isDerived);

  return (
    <Box className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
      {/* Basic Configuration */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" className="font-medium">
            Basic Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="space-y-3">
            <TextField
              fullWidth
              label="Field Label"
              value={field.label}
              onChange={(e) => handleFieldUpdate({ label: e.target.value })}
              size="small"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={field.required}
                  onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
                />
              }
              label="Required Field"
            />

            {field.type !== 'checkbox' && (
              <TextField
                fullWidth
                label="Default Value"
                value={field.defaultValue || ''}
                onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
                size="small"
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
              />
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Options Configuration for Select/Radio/Checkbox */}
      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" className="font-medium">
              Options
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="space-y-3">
              {field.options?.map((option, index) => (
                <Box key={index} className="flex gap-2">
                  <TextField
                    size="small"
                    placeholder="Label"
                    value={option.label}
                    onChange={(e) => updateOption(index, { label: e.target.value })}
                    className="flex-1"
                  />
                  <TextField
                    size="small"
                    placeholder="Value"
                    value={option.value}
                    onChange={(e) => updateOption(index, { value: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeOption(index)}
                    className="min-w-0 px-2"
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </Box>
              ))}
              
              <Box className="flex gap-2">
                <TextField
                  size="small"
                  placeholder="New option label"
                  value={newOption.label}
                  onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                  className="flex-1"
                />
                <TextField
                  size="small"
                  placeholder="Value"
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                  className="flex-1"
                />
                <Button
                  size="small"
                  onClick={addOption}
                  disabled={!newOption.label || !newOption.value}
                  className="min-w-0 px-2"
                >
                  <AddIcon fontSize="small" />
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Validation Rules */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" className="font-medium">
            Validation Rules ({field.validationRules.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="space-y-3">
            {field.validationRules.map((rule, index) => (
              <Box key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <Chip
                  label={rule.type}
                  size="small"
                  className="bg-primary-light text-primary"
                />
                <Typography variant="caption" className="flex-1 text-text-secondary">
                  {rule.message}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeValidationRule(index)}
                  className="min-w-0 px-1"
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </Box>
            ))}

            <Box className="space-y-2 pt-2 border-t border-border">
              <FormControl fullWidth size="small">
                <InputLabel>Validation Type</InputLabel>
                <Select
                  value={newRule.type || ''}
                  label="Validation Type"
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                >
                  <MenuItem value="required">Required</MenuItem>
                  <MenuItem value="minLength">Minimum Length</MenuItem>
                  <MenuItem value="maxLength">Maximum Length</MenuItem>
                  <MenuItem value="email">Email Format</MenuItem>
                  <MenuItem value="password">Password Rules</MenuItem>
                </Select>
              </FormControl>

              {(newRule.type === 'minLength' || newRule.type === 'maxLength') && (
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Length"
                  value={newRule.value || ''}
                  onChange={(e) => setNewRule({ ...newRule, value: parseInt(e.target.value) })}
                />
              )}

              <TextField
                fullWidth
                size="small"
                label="Error Message"
                value={newRule.message || ''}
                onChange={(e) => setNewRule({ ...newRule, message: e.target.value })}
              />

              <Button
                variant="outlined"
                size="small"
                onClick={addValidationRule}
                disabled={!newRule.type || !newRule.message}
                startIcon={<AddIcon />}
                className="w-full"
              >
                Add Rule
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Derived Field Configuration */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" className="font-medium">
            Derived Field
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="space-y-3">
            <FormControlLabel
              control={
                <Switch
                  checked={field.isDerived || false}
                  onChange={toggleDerived}
                />
              }
              label="Make this a derived field"
            />

            {field.isDerived && (
              <Box className="space-y-3 pt-2 border-t border-border">
                <FormControl fullWidth size="small">
                  <InputLabel>Computation Type</InputLabel>
                  <Select
                    value={field.derivedConfig?.computation || ''}
                    label="Computation Type"
                    onChange={(e) => updateDerivedConfig({ computation: e.target.value as any })}
                  >
                    <MenuItem value="age">Age from Date</MenuItem>
                    <MenuItem value="sum">Sum of Numbers</MenuItem>
                    <MenuItem value="concat">Concatenate Text</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="caption" className="text-text-secondary">
                  Select parent fields (computation will use these fields):
                </Typography>
                
                <Box className="max-h-32 overflow-y-auto border border-border rounded p-2">
                  {availableParentFields.map((parentField) => (
                    <FormControlLabel
                      key={parentField.id}
                      control={
                        <Switch
                          size="small"
                          checked={field.derivedConfig?.parentFields?.includes(parentField.id) || false}
                          onChange={(e) => {
                            const currentParents = field.derivedConfig?.parentFields || [];
                            const newParents = e.target.checked
                              ? [...currentParents, parentField.id]
                              : currentParents.filter(id => id !== parentField.id);
                            updateDerivedConfig({ parentFields: newParents });
                          }}
                        />
                      }
                      label={
                        <Typography variant="caption">
                          {parentField.label} ({parentField.type})
                        </Typography>
                      }
                      className="block"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};