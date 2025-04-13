import React from 'react';
import { Cell as CellType, ColumnDefinition } from '@/types/sheet';
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
  column: ColumnDefinition;
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

  // Držet default prázdné pole
  let options: string[] = [];
  
  // If enumId is provided, use its values instead of options
  if (column.enumId) {
    const enumData = getEnum(column.enumId);
    if (enumData) {
      options = enumData.values.map(v => v.value);
    }
  }

  // Render appropriate editor based on column type and edit state
  const renderEditor = () => {
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
            value={cell.value as string} 
            options={options} 
            onValueChange={onFinishEdit} 
          />;
        case 'multiselect':
          return <MultiSelectInput 
            value={Array.isArray(cell.value) ? cell.value : []} 
            options={options} 
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
          return <MultiValueDisplay value={Array.isArray(cell.value) ? cell.value : []} />;
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
