
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
  // If cell is undefined or invalid, render a placeholder
  if (!cell || !cell.id) {
    console.warn('Cell is undefined or invalid', { column, cellData: cell });
    return (
      <div 
        className="p-2 h-full border-r border-b border-sheet-border"
        onClick={onStartEdit}
      >
        -
      </div>
    );
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
