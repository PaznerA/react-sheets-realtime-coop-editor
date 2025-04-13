
import { SheetData, Cell } from "@/types/sheet";

export const updateCell = (prevData: SheetData, rowId: string, columnId: string, value: Cell["value"]): SheetData => {
  return {
    ...prevData,
    rows: prevData.rows.map((row) => {
      if (row.id === rowId) {
        // Handle cell update in the row's cells object
        const updatedCells = { ...row.cells };
        
        if (updatedCells[columnId]) {
          // Update existing cell
          updatedCells[columnId] = { 
            ...updatedCells[columnId], 
            value 
          };
        } else {
          // Create new cell if it doesn't exist
          updatedCells[columnId] = {
            id: Math.random().toString(36).substring(2, 15),
            columnId,
            value
          };
        }
        
        return { ...row, cells: updatedCells };
      }
      return row;
    }),
  };
};

// Get cell value with proper type conversion based on column type
export const getCellValue = (data: SheetData, rowId: string, columnId: string) => {
  const row = data.rows.find(r => r.id === rowId);
  if (!row || !row.cells[columnId]) return null;
  
  const cell = row.cells[columnId];
  const column = data.columns.find(c => c.id === columnId);
  
  if (!column) return cell.value;
  
  // Convert value based on column type
  switch (column.type) {
    case 'int':
      return typeof cell.value === 'number' ? cell.value : parseInt(cell.value, 10) || 0;
    case 'float':
      return typeof cell.value === 'number' ? cell.value : parseFloat(cell.value) || 0;
    case 'multiselect':
      return Array.isArray(cell.value) ? cell.value : [];
    default:
      return cell.value;
  }
};
