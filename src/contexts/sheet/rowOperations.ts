
import { SheetData, Row, Cell } from "@/types/sheet";

export const addRow = (prevData: SheetData, row: Omit<Row, "id">): SheetData => {
  const newRow: Row = {
    id: Math.random().toString(36).substring(2, 15),
    ...row,
  };
  return {
    ...prevData,
    rows: [...prevData.rows, newRow],
  };
};

export const updateRow = (prevData: SheetData, rowId: string, updatedRow: Partial<Row>): SheetData => {
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
    orderIndex: index,
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
  const newRowOrderIndex = referenceRow.orderIndex + 1;
  
  const updatedRows = rows.map(row => 
    row.orderIndex >= newRowOrderIndex ? { ...row, orderIndex: row.orderIndex + 1 } : row
  );
  
  // Create cells for each column in the sheet
  const newCells: { [columnId: string]: Cell } = {};
  prevData.columns.forEach(column => {
    newCells[column.id] = {
      id: Math.random().toString(36).substring(2, 15),
      columnId: column.id,
      value: null
    };
  });
  
  const newRow: Row = {
    id: Math.random().toString(36).substring(2, 15),
    sheetId: referenceRow.sheetId,
    cells: newCells,
    parentId: referenceRow.parentId,
    orderIndex: newRowOrderIndex
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
  const newRowOrderIndex = referenceRow.orderIndex;
  
  const updatedRows = rows.map(row => 
    row.orderIndex >= newRowOrderIndex ? { ...row, orderIndex: row.orderIndex + 1 } : row
  );
  
  // Create cells for each column in the sheet
  const newCells: { [columnId: string]: Cell } = {};
  prevData.columns.forEach(column => {
    newCells[column.id] = {
      id: Math.random().toString(36).substring(2, 15),
      columnId: column.id,
      value: null
    };
  });
  
  const newRow: Row = {
    id: Math.random().toString(36).substring(2, 15),
    sheetId: referenceRow.sheetId,
    cells: newCells,
    parentId: referenceRow.parentId,
    orderIndex: newRowOrderIndex
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
  
  const minOrderIndex = Math.min(...selectedRows.map(row => row.orderIndex));
  
  const updatedRows = rows.map(row => 
    row.orderIndex >= minOrderIndex ? { ...row, orderIndex: row.orderIndex + 1 } : row
  );
  
  // Create group cell for first column
  const newCells: { [columnId: string]: Cell } = {};
  const groupCell: Cell = {
    id: Math.random().toString(36).substring(2, 15),
    columnId: '',
    value: name
  };
  
  if (prevData.columns.length > 0) {
    newCells[prevData.columns[0].id] = groupCell;
  }
  
  const groupId = Math.random().toString(36).substring(2, 15);
  const groupRow: Row = {
    id: groupId,
    sheetId: prevData.id,
    cells: newCells,
    isGroup: true,
    expanded: true,
    orderIndex: minOrderIndex
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
