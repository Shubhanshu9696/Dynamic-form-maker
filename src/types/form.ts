export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'custom';
  value?: string | number;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DerivedFieldConfig {
  parentFields: string[];
  formula: string;
  computation: 'age' | 'sum' | 'concat' | 'custom';
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean | string[];
  options?: SelectOption[];
  validationRules: ValidationRule[];
  isDerived?: boolean;
  derivedConfig?: DerivedFieldConfig;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormData {
  [fieldId: string]: string | number | boolean | string[] | Date;
}

export interface FieldError {
  fieldId: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: FieldError[];
}

export type FieldConfigPanelType = 'basic' | 'validation' | 'derived' | null;