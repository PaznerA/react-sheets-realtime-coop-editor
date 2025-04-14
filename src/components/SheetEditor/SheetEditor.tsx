import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, Undo2 } from 'lucide-react';
import { useSheet } from '@/contexts/SheetContext';
import SheetHeader from './SheetHeader';
import Row from './Row';
import RevisionPanel from './RevisionPanel';
import GroupDialog from './GroupDialog';
import { toast } from 'sonner';
import { Row as RowType } from '@/types/sheet';

const SheetEditor: React.FC = () => {
  const { sheetData, addRowAfter, addRow } = useSheet();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Function to handle row selection for grouping
  const handleSelectForGroup = (rowId: string) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId) 
        : [...prev, rowId]
    );
  };

  const clearSelection = () => {
    setSelectedRows([]);
  };

  // Create row hierarchy for display
  const renderRows = () => {
    // First, sort rows by orderIndex
    const sortedRows = [...sheetData.rows].sort((a, b) => a.orderIndex - b.orderIndex);
    
    // Keep track of parent group visibility
    const groupVisibility: Record<string, boolean> = {};
    
    // Fill group visibility based on expanded state
    sheetData.rows.forEach(row => {
      if (row.isGroup) {
        groupVisibility[row.id] = !!row.expanded;
      }
    });

    return sortedRows.map(row => {
      // For non-group rows, check if parent is expanded
      const isVisible = row.parentId 
        ? groupVisibility[row.parentId] 
        : true;
      
      // Calculate nesting level for indentation
      let level = 0;
      if (row.parentId) {
        level = 1; // Direct child of a group
      }

      return (
        <Row 
          key={row.id}
          row={row}
          columns={sheetData.columns}
          level={level}
          isVisible={isVisible}
          onSelectForGroup={handleSelectForGroup}
          isSelected={selectedRows.includes(row.id)}
        />
      );
    });
  };

  // Add row at the end
  const handleAddRow = () => {
    // Check if we have existing rows
    if (sheetData.rows.length > 0) {
      // Get the last row to add after it
      const lastRow = [...sheetData.rows]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .slice(-1)[0];
      
      addRowAfter(lastRow.id);
      toast.success('Nový řádek byl přidán.');
    } else {
      // No existing rows, create first row with cells for each column
      const newCells = sheetData.columns.map(column => ({
        id: Math.random().toString(36).substring(2, 15),
        columnId: column.id,
        value: null
      }));
      
      // Add first row with orderIndex 0
      const newRow: Omit<RowType, "id"> = {
        cells: newCells.reduce((acc, cell) => {
          acc[cell.columnId] = cell;
          return acc;
        }, {} as Record<string, typeof newCells[0]>),
        sheetId: sheetData.id,
        orderIndex: 0
      };
      
      addRow(newRow);
      toast.success('První řádek byl přidán.');
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-md shadow-soft overflow-hidden">
      {/* Toolbar */}
      <div className="p-2 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between bg-sheet-header gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddRow}
            className="flex items-center gap-1 bg-white"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Přidat řádek</span>
            <span className="sm:hidden">Řádek</span>
          </Button>
          
          <Separator orientation="vertical" className="h-8 hidden sm:block" />
          
          <GroupDialog 
            onSelectForGroup={handleSelectForGroup}
            selectedRows={selectedRows}
            clearSelection={clearSelection}
          />

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          <RevisionPanel />
        </div>

        <div>
          <Button variant="default" size="sm" className="flex items-center gap-1 bg-primary">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Uložit změny</span>
            <span className="sm:hidden">Uložit</span>
          </Button>
        </div>
      </div>

      {/* Sheet Header */}
      <SheetHeader columns={sheetData.columns} />
      
      {/* Sheet Content */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="min-w-max">
          {renderRows()}
        </div>
      </div>
    </div>
  );
};

export default SheetEditor;
