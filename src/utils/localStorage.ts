import { FormSchema } from '../types/form';

const STORAGE_KEY = 'form-builder-forms';

export const saveForm = (form: FormSchema): void => {
  try {
    const existingForms = getForms();
    const formIndex = existingForms.findIndex(f => f.id === form.id);
    
    if (formIndex >= 0) {
      existingForms[formIndex] = { ...form, updatedAt: new Date() };
    } else {
      existingForms.push(form);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingForms));
  } catch (error) {
    console.error('Error saving form:', error);
    throw new Error('Failed to save form');
  }
};

export const getForms = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const forms = JSON.parse(stored);
    return forms.map((form: any) => ({
      ...form,
      createdAt: new Date(form.createdAt),
      updatedAt: new Date(form.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading forms:', error);
    return [];
  }
};

export const getForm = (id: string): FormSchema | null => {
  const forms = getForms();
  return forms.find(form => form.id === id) || null;
};

export const deleteForm = (id: string): void => {
  try {
    const forms = getForms();
    const updatedForms = forms.filter(form => form.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error deleting form:', error);
    throw new Error('Failed to delete form');
  }
};