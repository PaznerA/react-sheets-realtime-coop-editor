
import { SheetData, ColumnDefinition, Cell } from "@/types/sheet";

export const addColumn = (prevData: SheetData, column: Omit<ColumnDefinition, "id">): SheetData => {
  const newColumn: ColumnDefinition = {
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
    
    const updatedCells = { ...row.cells };
    updatedCells[newColumn.id] = newCell;
    
    return {
      ...row,
      cells: updatedCells,
    };
  });
  
  return {
    ...prevData,
    columns: updatedColumns,
    rows: updatedRows,
  };
};

export const updateColumn = (prevData: SheetData, columnId: string, updatedColumn: Partial<ColumnDefinition>): SheetData => {
  return {
    ...prevData,
    columns: prevData.columns.map((column) =>
      column.id === columnId ? { ...column, ...updatedColumn } : column
    ),
  };
};

export const deleteColumn = (prevData: SheetData, columnId: string): SheetData => {
  const updatedColumns = prevData.columns.filter((column) => column.id !== columnId);
  
  const updatedRows = prevData.rows.map((row) => {
    const updatedCells = { ...row.cells };
    delete updatedCells[columnId];
    
    return {
      ...row,
      cells: updatedCells,
    };
  });
  
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
  
  // Aktualizujeme orderIndex pro všechny sloupce po přesunu
  const updatedColumns = columns.map((column, index) => ({
    ...column,
    orderIndex: index
  }));
  
  return {
    ...prevData,
    columns: updatedColumns,
  };
};
