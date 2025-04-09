
import { SheetData, CellDefinition, Cell } from "@/types/sheet";

export const addColumn = (prevData: SheetData, column: Omit<CellDefinition, "id">): SheetData => {
  const newColumn: CellDefinition = {
    id: Math.random().toString(36).substring(2, 15),
    ...column,
  };
  
  const updatedColumns = [...prevData.columns, newColumn];
  
  const updatedRows = prevData.rows.map((row) => {
    const newCell: Cell = {
      id: Math.random().toString(36).substring(2, 15),
      columnId: newColumn.id,
      value: null,
    };
    return {
      ...row,
      cells: [...row.cells, newCell],
    };
  });
  
  return {
    ...prevData,
    columns: updatedColumns,
    rows: updatedRows,
  };
};

export const updateColumn = (prevData: SheetData, columnId: string, updatedColumn: Partial<CellDefinition>): SheetData => {
  return {
    ...prevData,
    columns: prevData.columns.map((column) =>
      column.id === columnId ? { ...column, ...updatedColumn } : column
    ),
  };
};

export const deleteColumn = (prevData: SheetData, columnId: string): SheetData => {
  const updatedColumns = prevData.columns.filter((column) => column.id !== columnId);
  
  const updatedRows = prevData.rows.map((row) => ({
    ...row,
    cells: row.cells.filter((cell) => cell.columnId !== columnId),
  }));
  
  return {
    ...prevData,
    columns: updatedColumns,
    rows: updatedRows,
  };
};

export const moveColumn = (prevData: SheetData, columnId: string, targetIndex: number): SheetData => {
  const columns = [...prevData.columns];
  const columnIndex = columns.findIndex((column) => column.id === columnId);
  const [removedColumn] = columns.splice(columnIndex, 1);
  columns.splice(targetIndex, 0, removedColumn);
  
  return {
    ...prevData,
    columns,
  };
};
