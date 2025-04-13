
import { SheetData, SheetRow, Cell } from "@/types/sheet";

export const addRow = (prevData: SheetData, row: Omit<SheetRow, "id">): SheetData => {
  const newRow: SheetRow = {
    id: Math.random().toString(36).substring(2, 15),
    ...row,
  };
  return {
    ...prevData,
    rows: [...prevData.rows, newRow],
  };
};

export const updateRow = (prevData: SheetData, rowId: string, updatedRow: Partial<SheetRow>): SheetData => {
  return {
    ...prevData,
    rows: prevData.rows.map((row) =>
      row.id === rowId ? { ...row, ...updatedRow } : row
    ),
  };
};

export const deleteRow = (prevData: SheetData, rowId: string): SheetData => {
  return {
    ...prevData,
    rows: prevData.rows.filter((row) => row.id !== rowId),
  };
};

export const moveRow = (prevData: SheetData, rowId: string, targetIndex: number): SheetData => {
  const rows = [...prevData.rows];
  const rowIndex = rows.findIndex((row) => row.id === rowId);
  const [removedRow] = rows.splice(rowIndex, 1);
  rows.splice(targetIndex, 0, removedRow);
  
  const updatedRows = rows.map((row, index) => ({
    ...row,
    order: index,
  }));
  
  return {
    ...prevData,
    rows: updatedRows,
  };
};

export const addRowAfter = (prevData: SheetData, rowId: string): SheetData => {
  const rows = [...prevData.rows];
  const rowIndex = rows.findIndex((row) => row.id === rowId);
  
  if (rowIndex === -1) return prevData;
  
  const referenceRow = rows[rowIndex];
  const newRowOrder = referenceRow.order + 1;
  
  const updatedRows = rows.map(row => 
    row.order >= newRowOrder ? { ...row, order: row.order + 1 } : row
  );
  
  // Create cells for each column in the sheet
  const newCells = prevData.columns.map(column => ({
    id: Math.random().toString(36).substring(2, 15),
    columnId: column.id,
    value: null
  }));
  
  const newRow: SheetRow = {
    id: Math.random().toString(36).substring(2, 15),
    cells: newCells,
    parentId: referenceRow.parentId,
    order: newRowOrder
  };
  
  return {
    ...prevData,
    rows: [...updatedRows, newRow]
  };
};

export const addRowBefore = (prevData: SheetData, rowId: string): SheetData => {
  const rows = [...prevData.rows];
  const rowIndex = rows.findIndex((row) => row.id === rowId);
  
  if (rowIndex === -1) return prevData;
  
  const referenceRow = rows[rowIndex];
  const newRowOrder = referenceRow.order;
  
  const updatedRows = rows.map(row => 
    row.order >= newRowOrder ? { ...row, order: row.order + 1 } : row
  );
  
  // Create cells for each column in the sheet
  const newCells = prevData.columns.map(column => ({
    id: Math.random().toString(36).substring(2, 15),
    columnId: column.id,
    value: null
  }));
  
  const newRow: SheetRow = {
    id: Math.random().toString(36).substring(2, 15),
    cells: newCells,
    parentId: referenceRow.parentId,
    order: newRowOrder
  };
  
  return {
    ...prevData,
    rows: [...updatedRows, newRow]
  };
};

export const toggleGroupExpanded = (prevData: SheetData, groupId: string): SheetData => {
  return {
    ...prevData,
    rows: prevData.rows.map((row) =>
      row.id === groupId && row.isGroup
        ? { ...row, expanded: !row.expanded }
        : row
    ),
  };
};

export const createGroup = (prevData: SheetData, name: string, rowIds: string[]): SheetData => {
  const rows = [...prevData.rows];
  
  const selectedRows = rows.filter(row => rowIds.includes(row.id));
  if (selectedRows.length === 0) return prevData;
  
  const minOrder = Math.min(...selectedRows.map(row => row.order));
  
  const updatedRows = rows.map(row => 
    row.order >= minOrder ? { ...row, order: row.order + 1 } : row
  );
  
  const groupCell: Cell = {
    id: Math.random().toString(36).substring(2, 15),
    columnId: '',
    value: name
  };
  
  const groupId = Math.random().toString(36).substring(2, 15);
  const groupRow: SheetRow = {
    id: groupId,
    cells: [groupCell],
    isGroup: true,
    groupName: name,
    expanded: true,
    order: minOrder
  };
  
  const rowsWithParents = updatedRows.map(row => 
    rowIds.includes(row.id) 
      ? { ...row, parentId: groupId }
      : row
  );
  
  return {
    ...prevData,
    rows: [...rowsWithParents, groupRow]
  };
};
