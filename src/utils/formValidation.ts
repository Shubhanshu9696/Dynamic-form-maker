import { FormField, FormData, ValidationRule, FieldError, FormValidation } from '../types/form';

export const validateField = (field: FormField, value: any): FieldError[] => {
  const errors: FieldError[] = [];

  for (const rule of field.validationRules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '') || 
            (Array.isArray(value) && value.length === 0)) {
          errors.push({ fieldId: field.id, message: rule.message || `${field.label} is required` });
        }
        break;
      
      case 'minLength':
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push({ 
            fieldId: field.id, 
            message: rule.message || `${field.label} must be at least ${rule.value} characters` 
          });
        }
        break;
      
      case 'maxLength':
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push({ 
            fieldId: field.id, 
            message: rule.message || `${field.label} must not exceed ${rule.value} characters` 
          });
        }
        break;
      
      case 'email':
        if (typeof value === 'string' && value && !isValidEmail(value)) {
          errors.push({ 
            fieldId: field.id, 
            message: rule.message || 'Please enter a valid email address' 
          });
        }
        break;
      
      case 'password':
        if (typeof value === 'string' && !isValidPassword(value)) {
          errors.push({ 
            fieldId: field.id, 
            message: rule.message || 'Password must be at least 8 characters and contain a number' 
          });
        }
        break;
    }
  }

  return errors;
};

export const validateForm = (fields: FormField[], formData: FormData): FormValidation => {
  const allErrors: FieldError[] = [];

  fields.forEach(field => {
    const value = formData[field.id];
    const fieldErrors = validateField(field, value);
    allErrors.push(...fieldErrors);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

export const computeDerivedValue = (field: FormField, formData: FormData): any => {
  if (!field.isDerived || !field.derivedConfig) return null;

  const { parentFields, computation } = field.derivedConfig;
  
  switch (computation) {
    case 'age':
      const birthDate = formData[parentFields[0]] as Date;
      if (birthDate && birthDate instanceof Date) {
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1;
        }
        return age;
      }
      return null;
    
    case 'sum':
      return parentFields.reduce((sum, fieldId) => {
        const value = formData[fieldId];
        return sum + (typeof value === 'number' ? value : 0);
      }, 0);
    
    case 'concat':
      return parentFields
        .map(fieldId => formData[fieldId])
        .filter(Boolean)
        .join(' ');
    
    default:
      return null;
  }
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /\d/.test(password);
};