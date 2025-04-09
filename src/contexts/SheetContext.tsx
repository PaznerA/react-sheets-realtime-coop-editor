
import React, { createContext, useContext, useState, useEffect } from "react";
import { SheetData, SheetRow, CellDefinition, Cell, SheetRevision } from "@/types/sheet";
import { saveSheetData } from "@/services/projectService";

interface SheetContextType {
  data: SheetData;
  addRow: (row: Omit<SheetRow, "id">) => void;
  updateRow: (rowId: string, updatedRow: Partial<SheetRow>) => void;
  deleteRow: (rowId: string) => void;
  moveRow: (rowId: string, targetIndex: number) => void;
  updateCell: (rowId: string, cellId: string, value: Cell["value"]) => void;
  addColumn: (column: Omit<CellDefinition, "id">) => void;
  updateColumn: (columnId: string, updatedColumn: Partial<CellDefinition>) => void;
  deleteColumn: (columnId: string) => void;
  moveColumn: (columnId: string, targetIndex: number) => void;
  createRevision: (description: string) => void;
  loadRevision: (revisionId: string) => void;
  toggleGroupExpanded: (groupId: string) => void;
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
  const [data, setData] = useState<SheetData>(
    initialData || {
      columns: [],
      rows: [],
      revisions: [],
      currentRevision: 0,
    }
  );

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (sheetId) {
      saveSheetData(sheetId, data);
    }
  }, [data, sheetId]);

  const addRow = (row: Omit<SheetRow, "id">) => {
    const newRow: SheetRow = {
      id: Math.random().toString(36).substring(2, 15),
      ...row,
    };
    setData((prevData) => ({
      ...prevData,
      rows: [...prevData.rows, newRow],
    }));
  };

  const updateRow = (rowId: string, updatedRow: Partial<SheetRow>) => {
    setData((prevData) => ({
      ...prevData,
      rows: prevData.rows.map((row) =>
        row.id === rowId ? { ...row, ...updatedRow } : row
      ),
    }));
  };

  const deleteRow = (rowId: string) => {
    setData((prevData) => ({
      ...prevData,
      rows: prevData.rows.filter((row) => row.id !== rowId),
    }));
  };

  const moveRow = (rowId: string, targetIndex: number) => {
    setData((prevData) => {
      const rows = [...prevData.rows];
      const rowIndex = rows.findIndex((row) => row.id === rowId);
      const [removedRow] = rows.splice(rowIndex, 1);
      rows.splice(targetIndex, 0, removedRow);
      
      // Update order property
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

  const updateCell = (rowId: string, cellId: string, value: Cell["value"]) => {
    setData((prevData) => ({
      ...prevData,
      rows: prevData.rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            cells: row.cells.map((cell) =>
              cell.id === cellId ? { ...cell, value } : cell
            ),
          };
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
    
    setData((prevData) => {
      // Add the new column
      const updatedColumns = [...prevData.columns, newColumn];
      
      // Add a new cell for this column to each existing row
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
    setData((prevData) => ({
      ...prevData,
      columns: prevData.columns.map((column) =>
        column.id === columnId ? { ...column, ...updatedColumn } : column
      ),
    }));
  };

  const deleteColumn = (columnId: string) => {
    setData((prevData) => {
      // Remove the column
      const updatedColumns = prevData.columns.filter((column) => column.id !== columnId);
      
      // Remove all cells for this column from each row
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
    setData((prevData) => {
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
      rows: JSON.parse(JSON.stringify(data.rows)), // Deep copy
    };
    
    setData((prevData) => ({
      ...prevData,
      revisions: [...prevData.revisions, newRevision],
      currentRevision: prevData.revisions.length,
    }));
  };

  const loadRevision = (revisionId: string) => {
    setData((prevData) => {
      const revisionIndex = prevData.revisions.findIndex((rev) => rev.id === revisionId);
      
      if (revisionIndex === -1) return prevData;
      
      return {
        ...prevData,
        rows: JSON.parse(JSON.stringify(prevData.revisions[revisionIndex].rows)), // Deep copy
        currentRevision: revisionIndex,
      };
    });
  };

  const toggleGroupExpanded = (groupId: string) => {
    setData((prevData) => ({
      ...prevData,
      rows: prevData.rows.map((row) =>
        row.id === groupId && row.isGroup
          ? { ...row, expanded: !row.expanded }
          : row
      ),
    }));
  };

  const value = {
    data,
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
  };

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}
