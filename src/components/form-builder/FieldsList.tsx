import React from 'react';
import { Box, IconButton, Typography, Card, CardContent } from '@mui/material';
import { 
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Star as RequiredIcon
} from '@mui/icons-material';
import { FormField } from '../../types/form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FieldsListProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  onReorderFields: (startIndex: number, endIndex: number) => void;
}

interface SortableFieldItemProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const SortableFieldItem: React.FC<SortableFieldItemProps> = ({
  field,
  isSelected,
  onSelect,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const getFieldTypeColor = (type: string) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      number: 'bg-green-100 text-green-800',
      textarea: 'bg-purple-100 text-purple-800',
      select: 'bg-orange-100 text-orange-800',
      radio: 'bg-pink-100 text-pink-800',
      checkbox: 'bg-indigo-100 text-indigo-800',
      date: 'bg-teal-100 text-teal-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary-light' : 'bg-surface hover:bg-muted'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <Box className="flex items-center gap-3">
          <IconButton
            size="small"
            className="cursor-grab hover:bg-muted p-1"
            {...attributes}
            {...listeners}
          >
            <DragIcon fontSize="small" className="text-muted-foreground" />
          </IconButton>

          <Box className="flex-1 min-w-0">
            <Box className="flex items-center gap-2 mb-1">
              <Typography variant="body2" className="font-medium text-text-primary truncate">
                {field.label}
              </Typography>
              {field.required && (
                <RequiredIcon fontSize="small" className="text-error" />
              )}
              {field.isDerived && (
                <span className="text-xs bg-secondary-light text-secondary px-2 py-0.5 rounded">
                  Derived
                </span>
              )}
            </Box>
            
            <Box className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${getFieldTypeColor(field.type)}`}>
                {field.type.toUpperCase()}
              </span>
              {field.validationRules.length > 0 && (
                <span className="text-xs text-text-secondary">
                  {field.validationRules.length} rule{field.validationRules.length !== 1 ? 's' : ''}
                </span>
              )}
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-error hover:bg-error-light"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onReorderFields
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);
      onReorderFields(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <Box className="space-y-0">
          {fields.map((field) => (
            <SortableFieldItem
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              onSelect={() => onSelectField(field.id)}
              onDelete={() => onDeleteField(field.id)}
            />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
};