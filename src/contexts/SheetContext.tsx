import React, { createContext, useContext, useState, useEffect } from "react";
import { SheetData, SheetRow, CellDefinition, Cell, SheetRevision } from "@/types/sheet";
import { saveSheetData } from "@/services/projectService";

interface SheetContextType {
  sheetData: SheetData;
  addRow: (row: Omit<SheetRow, "id">) => void;
  updateRow: (rowId: string, updatedRow: Partial<SheetRow>) => void;
  deleteRow: (rowId: string) => void;
  moveRow: (rowId: string, targetIndex: number) => void;
  updateCell: (rowId: string, columnId: string, value: Cell["value"]) => void;
  addColumn: (column: Omit<CellDefinition, "id">) => void;
  updateColumn: (columnId: string, updatedColumn: Partial<CellDefinition>) => void;
  deleteColumn: (columnId: string) => void;
  moveColumn: (columnId: string, targetIndex: number) => void;
  createRevision: (description: string) => void;
  loadRevision: (revisionIndex: number) => void;
  toggleGroupExpanded: (groupId: string) => void;
  
  createGroup: (name: string, rowIds: string[]) => void;
  saveRevision: (description: string) => void;
  toggleGroup: (groupId: string) => void;
  addRowAfter: (rowId: string) => void;
  addRowBefore: (rowId: string) => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
}

interface SheetProviderProps {
  children: React.ReactNode;
  initialData?: SheetData;
  sheetId?: string;
}

export function SheetProvider({
  children,
  initialData,
  sheetId = "default",
}: SheetProviderProps) {
  const [sheetData, setSheetData] = useState<SheetData>(
    initialData || {
      columns: [],
      rows: [],
      revisions: [],
      currentRevision: 0,
    }
  );

  useEffect(() => {
    if (sheetId) {
      saveSheetData(sheetId, sheetData);
    }
  }, [sheetData, sheetId]);

  const addRow = (row: Omit<SheetRow, "id">) => {
    const newRow: SheetRow = {
      id: Math.random().toString(36).substring(2, 15),
      ...row,
    };
    setSheetData((prevData) => ({
      ...prevData,
      rows: [...prevData.rows, newRow],
    }));
  };

  const updateRow = (rowId: string, updatedRow: Partial<SheetRow>) => {
    setSheetData((prevData) => ({
      ...prevData,
      rows: prevData.rows.map((row) =>
        row.id === rowId ? { ...row, ...updatedRow } : row
      ),
    }));
  };

  const deleteRow = (rowId: string) => {
    setSheetData((prevData) => ({
      ...prevData,
      rows: prevData.rows.filter((row) => row.id !== rowId),
    }));
  };

  const moveRow = (rowId: string, targetIndex: number) => {
    setSheetData((prevData) => {
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
    });
  };

  const updateCell = (rowId: string, columnId: string, value: Cell["value"]) => {
    setSheetData((prevData) => ({
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
    }));
  };

  const addColumn = (column: Omit<CellDefinition, "id">) => {
    const newColumn: CellDefinition = {
      id: Math.random().toString(36).substring(2, 15),
      ...column,
    };
    
    setSheetData((prevData) => {
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
    });
  };

  const updateColumn = (columnId: string, updatedColumn: Partial<CellDefinition>) => {
    setSheetData((prevData) => ({
      ...prevData,
      columns: prevData.columns.map((column) =>
        column.id === columnId ? { ...column, ...updatedColumn } : column
      ),
    }));
  };

  const deleteColumn = (columnId: string) => {
    setSheetData((prevData) => {
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
    });
  };

  const moveColumn = (columnId: string, targetIndex: number) => {
    setSheetData((prevData) => {
      const columns = [...prevData.columns];
      const columnIndex = columns.findIndex((column) => column.id === columnId);
      const [removedColumn] = columns.splice(columnIndex, 1);
      columns.splice(targetIndex, 0, removedColumn);
      
      return {
        ...prevData,
        columns,
      };
    });
  };

  const createRevision = (description: string) => {
    const newRevision: SheetRevision = {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date(),
      description,
      rows: JSON.parse(JSON.stringify(sheetData.rows)),
    };
    
    setSheetData((prevData) => ({
      ...prevData,
      revisions: [...prevData.revisions, newRevision],
      currentRevision: prevData.revisions.length,
    }));
  };

  const saveRevision = createRevision;

  const loadRevision = (revisionIndex: number) => {
    setSheetData((prevData) => {
      if (revisionIndex < 0 || revisionIndex >= prevData.revisions.length) {
        return prevData;
      }
      
      return {
        ...prevData,
        rows: JSON.parse(JSON.stringify(prevData.revisions[revisionIndex].rows)),
        currentRevision: revisionIndex,
      };
    });
  };

  const toggleGroupExpanded = (groupId: string) => {
    setSheetData((prevData) => ({
      ...prevData,
      rows: prevData.rows.map((row) =>
        row.id === groupId && row.isGroup
          ? { ...row, expanded: !row.expanded }
          : row
      ),
    }));
  };

  const toggleGroup = toggleGroupExpanded;

  const addRowAfter = (rowId: string) => {
    setSheetData((prevData) => {
      const rows = [...prevData.rows];
      const rowIndex = rows.findIndex((row) => row.id === rowId);
      
      if (rowIndex === -1) return prevData;
      
      const referenceRow = rows[rowIndex];
      const newRowOrder = referenceRow.order + 1;
      
      const updatedRows = rows.map(row => 
        row.order >= newRowOrder ? { ...row, order: row.order + 1 } : row
      );
      
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
    });
  };

  const addRowBefore = (rowId: string) => {
    setSheetData((prevData) => {
      const rows = [...prevData.rows];
      const rowIndex = rows.findIndex((row) => row.id === rowId);
      
      if (rowIndex === -1) return prevData;
      
      const referenceRow = rows[rowIndex];
      const newRowOrder = referenceRow.order;
      
      const updatedRows = rows.map(row => 
        row.order >= newRowOrder ? { ...row, order: row.order + 1 } : row
      );
      
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
    });
  };

  const createGroup = (name: string, rowIds: string[]) => {
    setSheetData((prevData) => {
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
    });
  };

  const value = {
    sheetData,
    addRow,
    updateRow,
    deleteRow,
    moveRow,
    updateCell,
    addColumn,
    updateColumn,
    deleteColumn,
    moveColumn,
    createRevision,
    loadRevision,
    toggleGroupExpanded,
    
    saveRevision,
    toggleGroup,
    addRowAfter,
    addRowBefore,
    createGroup
  };

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}
