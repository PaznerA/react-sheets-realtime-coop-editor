
import { SheetData, Cell } from "@/types/sheet";

export const updateCell = (prevData: SheetData, rowId: string, columnId: string, value: Cell["value"]): SheetData => {
  return {
    ...prevData,
    rows: prevData.rows.map((row) => {
      if (row.id === rowId) {
        const cellIndex = row.cells.findIndex(cell => cell.columnId === columnId);
        
        if (cellIndex !== -1) {
          const updatedCells = [...row.cells];
          updatedCells[cellIndex] = { ...updatedCells[cellIndex], value };
          return { ...row, cells: updatedCells };
        } else {
          const newCell: Cell = {
            id: Math.random().toString(36).substring(2, 15),
            columnId,
            value
          };
          return { ...row, cells: [...row.cells, newCell] };
        }
      }
      return row;
    }),
  };
};
