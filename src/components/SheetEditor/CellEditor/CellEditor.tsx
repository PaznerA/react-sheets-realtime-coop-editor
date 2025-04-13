import React from 'react';
import { Cell as CellType, ColumnDefinition } from '@/types/sheet';
import { useEnums } from '@/contexts/EnumContext';
import { EnumValueId, EnumValues } from '@/types/enum';
import TextDisplay from './DisplayComponents/TextDisplay';
import DateDisplay from './DisplayComponents/DateDisplay';
import UserDisplay from './DisplayComponents/UserDisplay';
import MultiValueDisplay from './DisplayComponents/MultiValueDisplay';
import TextInput from './InputComponents/TextInput';
import NumberInput from './InputComponents/NumberInput';
import DateInput from './InputComponents/DateInput';
import SelectInput from './InputComponents/SelectInput';
import MultiSelectInput from './InputComponents/MultiSelectInput';
import UserInput from './InputComponents/UserInput';

interface CellEditorProps {
  cell: CellType;
  column: ColumnDefinition;
  isEditing: boolean;
  onStartEdit: () => void;
  onFinishEdit: (value: string | number | EnumValueId | EnumValues | null) => void;
}

const CellEditor: React.FC<CellEditorProps> = ({
  cell,
  column,
  isEditing,
  onStartEdit,
  onFinishEdit
}) => {
  const { getEnum } = useEnums();

  const handleDblClick = () => {
    if (!isEditing) {
      onStartEdit();
    }
  };

<<<<<<< HEAD
  // Držet default prázdné pole
  let options: string[] = [];
  
  // If enumId is provided, use its values instead of options
  if (column.enumId) {
    const enumData = getEnum(column.enumId);
    if (enumData) {
      options = enumData.values.map(v => v.value);
=======
  // Get options from enums if enumId is provided
  const getEnumOptions = () => {
    if (column.enumId) {
      const enumData = getEnum(column.enumId);
      if (enumData && enumData.values && Array.isArray(enumData.values)) {
        return enumData.values.map(v => ({
          id: v.id,
          value: v.value
        }));
      }
>>>>>>> 917ad4831cd22262650eb47e4e79519cc1a23299
    }
    
    // Fallback to empty array
    return [];
  };
  
  // Get current enum value(s)
  const getCurrentEnumValue = () => {
    if (column.type === 'multiselect') {
      return Array.isArray(cell.value) ? cell.value : [];
    }
    return cell.value;
  };

  // Convert enum IDs to their display values for rendering
  const getEnumDisplayValue = (enumValueId: EnumValueId | EnumValues) => {
    if (!column.enumId) return enumValueId;
    
    const enumData = getEnum(column.enumId);
    if (!enumData) return enumValueId;
    
    if (Array.isArray(enumValueId)) {
      // Handle multiselect case
      return enumValueId.map(id => {
        const enumValue = enumData.values.find(v => v.id === id);
        return enumValue ? enumValue.value : id;
      });
    } else {
      // Handle single select case
      const enumValue = enumData.values.find(v => v.id === enumValueId);
      return enumValue ? enumValue.value : enumValueId;
    }
  };

  // Render appropriate editor based on column type and edit state
  const renderEditor = () => {
    const enumOptions = getEnumOptions();
    const currentValue = getCurrentEnumValue();
    
    if (isEditing) {
      // Input components for edit mode
      switch (column.type) {
        case 'int':
          return <NumberInput 
            value={cell.value ? Number(cell.value) : 0}
            onValueChange={onFinishEdit}
            integer={true}
          />;
        case 'float':
          return <NumberInput 
            value={cell.value ? Number(cell.value) : 0}
            onValueChange={onFinishEdit}
            integer={false}
          />;
        case 'date':
          return <DateInput 
            value={cell.value as string} 
            onValueChange={onFinishEdit} 
          />;
        case 'select':
          return <SelectInput 
            value={currentValue as EnumValueId} 
            options={enumOptions} 
            onValueChange={onFinishEdit} 
          />;
        case 'multiselect':
          return <MultiSelectInput 
            value={currentValue as EnumValues} 
            options={enumOptions} 
            onValueChange={onFinishEdit} 
          />;
        case 'user':
          return <UserInput 
            value={cell.value as string} 
            onValueChange={onFinishEdit} 
          />;
        default:
          return <TextInput 
            value={cell.value as string} 
            onValueChange={onFinishEdit} 
          />;
      }
    } else {
      // Display components for read mode
      switch (column.type) {
        case 'date':
          return <DateDisplay value={cell.value as string} />;
        case 'multiselect':
          return <MultiValueDisplay value={getEnumDisplayValue(cell.value as EnumValues) as string[]} />;
        case 'select':
          return <TextDisplay value={getEnumDisplayValue(cell.value as EnumValueId) as string} />;
        case 'user':
          return <UserDisplay value={cell.value as string} />;
        default:
          return <TextDisplay value={cell.value} />;
      }
    }
  };

  // For column headers (maintaining group header styling)
  if (column.id === 'name' && cell.value && !cell.columnId) {
    return (
      <div className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
        {cell.value}
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-full min-h-[32px] px-2 flex items-center ${
        isEditing ? '' : 'cursor-cell'
      }`}
      onDoubleClick={handleDblClick}
    >
      {renderEditor()}
    </div>
  );
};

export default CellEditor;
