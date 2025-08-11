import { useState, useCallback } from 'react';
import { FormField, FormSchema, FieldType, ValidationRule, SelectOption, DerivedFieldConfig } from '../types/form';
import { saveForm } from '../utils/localStorage';

export const useFormBuilder = (initialForm?: FormSchema) => {
  const [fields, setFields] = useState<FormField[]>(initialForm?.fields || []);
  const [formName, setFormName] = useState(initialForm?.name || '');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const addField = useCallback((type: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      validationRules: [],
      order: fields.length,
      options: type === 'select' || type === 'radio' ? [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ] : undefined
    };

    setFields(prev => [...prev, newField]);
    setSelectedFieldId(newField.id);
  }, [fields.length]);

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  }, []);

  const deleteField = useCallback((fieldId: string) => {
    setFields(prev => {
      const filtered = prev.filter(field => field.id !== fieldId);
      return filtered.map((field, index) => ({ ...field, order: index }));
    });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  }, [selectedFieldId]);

  const reorderFields = useCallback((startIndex: number, endIndex: number) => {
    setFields(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((field, index) => ({ ...field, order: index }));
    });
  }, []);

  const updateFieldValidation = useCallback((fieldId: string, rules: ValidationRule[]) => {
    updateField(fieldId, { validationRules: rules });
  }, [updateField]);

  const updateFieldOptions = useCallback((fieldId: string, options: SelectOption[]) => {
    updateField(fieldId, { options });
  }, [updateField]);

  const updateDerivedConfig = useCallback((fieldId: string, config: DerivedFieldConfig) => {
    updateField(fieldId, { isDerived: true, derivedConfig: config });
  }, [updateField]);

  const saveFormSchema = useCallback((name: string) => {
    const schema: FormSchema = {
      id: initialForm?.id || `form_${Date.now()}`,
      name,
      fields: fields.sort((a, b) => a.order - b.order),
      createdAt: initialForm?.createdAt || new Date(),
      updatedAt: new Date()
    };

    saveForm(schema);
    setFormName(name);
    return schema;
  }, [fields, initialForm]);

  const getSelectedField = useCallback(() => {
    return fields.find(field => field.id === selectedFieldId) || null;
  }, [fields, selectedFieldId]);

  return {
    fields,
    formName,
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
  };
};