
import React from 'react';
import { Cell as CellType, CellDefinition } from '@/types/sheet';
import { useEnums } from '@/contexts/EnumContext';
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
  column: CellDefinition;
  isEditing: boolean;
  onStartEdit: () => void;
  onFinishEdit: (value: string | number | string[] | null) => void;
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

  // Get options from enums if enumId is provided, otherwise use column options
  const getOptions = (): string[] => {
    if (column.enumId) {
      const enumData = getEnum(column.enumId);
      if (enumData && enumData.values) {
        return enumData.values.map(v => v.value);
      }
    }
    
    // Fallback to column options or empty array
    return Array.isArray(column.options) ? column.options : [];
  };

  // Get current value, ensuring it's the right type
  const getCurrentValue = () => {
    if (column.type === 'multiselect') {
      return Array.isArray(cell.value) ? cell.value : [];
    }
    return cell.value;
  };

  // Render appropriate editor based on column type and edit state
  const renderEditor = () => {
    const options = getOptions();
    const currentValue = getCurrentValue();
    
    if (isEditing) {
      // Input components for edit mode
      switch (column.type) {
        case 'int':
          return <NumberInput 
            value={currentValue as number}
            onValueChange={onFinishEdit}
            integer={true}
          />;
        case 'float':
          return <NumberInput 
            value={currentValue as number}
            onValueChange={onFinishEdit}
            integer={false}
          />;
        case 'date':
          return <DateInput 
            value={currentValue as string} 
            onValueChange={onFinishEdit} 
          />;
        case 'select':
          return <SelectInput 
            value={currentValue as string} 
            options={options} 
            onValueChange={onFinishEdit} 
          />;
        case 'multiselect':
          return <MultiSelectInput 
            value={currentValue as string[]} 
            options={options} 
            onValueChange={onFinishEdit} 
          />;
        case 'user':
          return <UserInput 
            value={currentValue as string} 
            onValueChange={onFinishEdit} 
          />;
        default:
          return <TextInput 
            value={currentValue as string} 
            onValueChange={onFinishEdit} 
          />;
      }
    } else {
      // Display components for read mode
      switch (column.type) {
        case 'date':
          return <DateDisplay value={currentValue as string} />;
        case 'multiselect':
          return <MultiValueDisplay value={currentValue as string[]} />;
        case 'user':
          return <UserDisplay value={currentValue as string} />;
        default:
          return <TextDisplay value={currentValue} />;
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
