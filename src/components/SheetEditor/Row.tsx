
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Edit, ArrowDown, ArrowUp, FolderPlus, Trash2 } from 'lucide-react';
import Cell from './Cell';
import { Row as RowType, ColumnDefinition, Cell as CellType } from '@/types/sheet';
import { useSheet } from '@/contexts/SheetContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RowProps {
  row: RowType;
  columns: ColumnDefinition[];
  level?: number;
  isVisible?: boolean;
  onSelectForGroup?: (rowId: string) => void;
  isSelected?: boolean;
}

const Row: React.FC<RowProps> = ({ 
  row, 
  columns, 
  level = 0,
  isVisible = true,
  onSelectForGroup,
  isSelected = false
}) => {
  const { updateCell, toggleGroup, addRowAfter, addRowBefore, deleteRow } = useSheet();
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const handleCellEdit = (columnId: string) => {
    setEditingCell(`${row.id}_${columnId}`);
  };

  const handleCellUpdate = (columnId: string, value: string | number | string[] | null) => {
    updateCell(row.id, columnId, value);
    setEditingCell(null);
  };

  const handleGroupToggle = () => {
    if (row.isGroup) {
      toggleGroup(row.id);
    }
  };

  const isGroup = !!row.isGroup;
  // Find cell without columnId (for group headers)
  const groupCell = Object.values(row.cells || {}).find(cell => !(cell as CellType).columnId) as CellType | undefined;
  
  // Indentation for hierarchical display
  const indentPadding = level * 20;

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`flex relative ${
        isGroup 
          ? 'bg-sheet-group font-medium' 
          : 'hover:bg-gray-50'
      } ${
        isSelected ? 'bg-sheet-selected' : ''
      } border-b border-sheet-border transition-colors`}
    >
      {/* Row controls */}
      <div 
        className="min-w-[40px] w-10 shrink-0 flex items-center justify-center border-r border-sheet-border"
      >
        {isGroup ? (
          <button 
            onClick={handleGroupToggle}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {row.expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Možnosti řádku</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => addRowBefore(row.id)}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Nový řádek nad
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addRowAfter(row.id)}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Nový řádek pod
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Upravit
              </DropdownMenuItem>
              {onSelectForGroup && (
                <DropdownMenuItem onClick={() => onSelectForGroup(row.id)}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  {isSelected ? 'Odebrat ze skupiny' : 'Přidat do skupiny'}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => deleteRow(row.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Smazat řádek
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Cells */}
      <div className="flex-1 grid grid-flow-col auto-cols-fr" 
           style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}>
        {columns.map((column, index) => {
          // For group rows, only show the name in the first column
          if (isGroup && index > 0) {
            return <div key={column.id} className="border-r border-sheet-border"></div>;
          }

          // Find cell for this column
          const cell = row.cells[column.id] || 
                       (isGroup && index === 0 && groupCell) || 
                       { id: `empty_${row.id}_${column.id}`, columnId: column.id, value: null };

          const cellId = `${row.id}_${column.id}`;
          const isEditing = editingCell === cellId;

          return (
            <div 
              key={column.id} 
              className="sheet-cell border-r border-sheet-border whitespace-nowrap overflow-hidden"
              style={index === 0 ? { paddingLeft: `${indentPadding + 4}px` } : {}}
            >
              <Cell 
                cell={cell}
                column={column}
                isEditing={isEditing}
                onStartEdit={() => handleCellEdit(column.id)}
                onFinishEdit={(value) => handleCellUpdate(column.id, value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Row;
