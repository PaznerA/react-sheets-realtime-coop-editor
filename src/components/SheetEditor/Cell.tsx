
import React from 'react';
import { Cell as CellType, ColumnDefinition } from '@/types/sheet';
import CellEditor from './CellEditor/CellEditor';

interface CellProps {
  cell: CellType;
  column: ColumnDefinition;
  isEditing: boolean;
  onStartEdit: () => void;
  onFinishEdit: (value: string | number | string[] | null) => void;
}

const Cell: React.FC<CellProps> = ({ 
  cell, 
  column, 
  isEditing, 
  onStartEdit, 
  onFinishEdit 
}) => {
  return (
    <div className="w-full h-full flex items-center overflow-hidden">
      <div className="w-full">
        <CellEditor
          cell={cell}
          column={column}
          isEditing={isEditing}
          onStartEdit={onStartEdit}
          onFinishEdit={onFinishEdit}
        />
      </div>
    </div>
  );
};

export default Cell;
