import React from 'react';
import { CellDefinition } from '@/types/sheet';

interface SheetHeaderProps {
  columns: CellDefinition[];
}

const SheetHeader: React.FC<SheetHeaderProps> = ({ columns }) => {
  return (
    <div className="flex border-b border-sheet-border bg-sheet-header font-semibold text-gray-700 overflow-hidden">
      {/* Row controls column */}
      <div className="min-w-[40px] w-10 shrink-0 border-r border-sheet-border"></div>
      
      {/* Column headers */}
      <div className="flex-1 grid overflow-x-auto" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}>
        {columns.map((column) => (
          <div key={column.id} className="px-2 py-2 border-r border-sheet-border whitespace-nowrap">
            <div className="flex items-center">
              <span className="truncate">{column.name}</span>
              {column.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <div className="text-xs text-gray-500 truncate">{column.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SheetHeader;
