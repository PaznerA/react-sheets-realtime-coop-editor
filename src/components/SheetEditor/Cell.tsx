
import React, { useState, useEffect } from 'react';
import { Cell as CellType, CellDefinition } from '@/types/sheet';
import CellEditor from './CellEditor/CellEditor';

interface CellProps {
  cell: CellType;
  column: CellDefinition;
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
