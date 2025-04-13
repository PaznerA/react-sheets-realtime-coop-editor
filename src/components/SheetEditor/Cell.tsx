
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
  // Make sure cell is a valid object before passing it to CellEditor
  if (!cell) {
    console.error('Cell is undefined', { column });
    return <div className="p-2 h-full">-</div>;
  }

  // Pass through to the CellEditor component
  return (
    <CellEditor
      cell={cell}
      column={column}
      isEditing={isEditing}
      onStartEdit={onStartEdit}
      onFinishEdit={onFinishEdit}
    />
  );
};

export default Cell;
