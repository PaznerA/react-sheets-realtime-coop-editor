
import React, { createContext, useContext, useState, useEffect } from "react";
import { SheetData } from "@/types/sheet";
import { saveSheetData } from "@/services/projectService";
import { SheetContextType, SheetProviderProps } from "./sheet/types";

// Import operations
import * as rowOps from "./sheet/rowOperations";
import * as cellOps from "./sheet/cellOperations";
import * as columnOps from "./sheet/columnOperations";
import * as revisionOps from "./sheet/revisionOperations";

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
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

  // Row operations
  const addRow = (row: Omit<SheetProps, "id">) => {
    setSheetData(prevData => rowOps.addRow(prevData, row));
  };

  const updateRow = (rowId: string, updatedRow: Partial<SheetProps>) => {
    setSheetData(prevData => rowOps.updateRow(prevData, rowId, updatedRow));
  };

  const deleteRow = (rowId: string) => {
    setSheetData(prevData => rowOps.deleteRow(prevData, rowId));
  };

  const moveRow = (rowId: string, targetIndex: number) => {
    setSheetData(prevData => rowOps.moveRow(prevData, rowId, targetIndex));
  };

  const addRowAfter = (rowId: string) => {
    setSheetData(prevData => rowOps.addRowAfter(prevData, rowId));
  };

  const addRowBefore = (rowId: string) => {
    setSheetData(prevData => rowOps.addRowBefore(prevData, rowId));
  };

  const toggleGroupExpanded = (groupId: string) => {
    setSheetData(prevData => rowOps.toggleGroupExpanded(prevData, groupId));
  };

  const createGroup = (name: string, rowIds: string[]) => {
    setSheetData(prevData => rowOps.createGroup(prevData, name, rowIds));
  };

  // Cell operations
  const updateCell = (rowId: string, columnId: string, value: any) => {
    setSheetData(prevData => cellOps.updateCell(prevData, rowId, columnId, value));
  };

  // Column operations
  const addColumn = (column: Omit<CellDefinition, "id">) => {
    setSheetData(prevData => columnOps.addColumn(prevData, column));
  };

  const updateColumn = (columnId: string, updatedColumn: Partial<CellDefinition>) => {
    setSheetData(prevData => columnOps.updateColumn(prevData, columnId, updatedColumn));
  };

  const deleteColumn = (columnId: string) => {
    setSheetData(prevData => columnOps.deleteColumn(prevData, columnId));
  };

  const moveColumn = (columnId: string, targetIndex: number) => {
    setSheetData(prevData => columnOps.moveColumn(prevData, columnId, targetIndex));
  };

  // Revision operations
  const createRevision = (description: string) => {
    setSheetData(prevData => revisionOps.createRevision(prevData, description));
  };

  const saveRevision = createRevision;

  const loadRevision = (revisionIndex: number) => {
    setSheetData(prevData => revisionOps.loadRevision(prevData, revisionIndex));
  };

  // Aliases for compatibility
  const toggleGroup = toggleGroupExpanded;

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
    createGroup,
    saveRevision,
    toggleGroup,
    addRowAfter,
    addRowBefore
  };

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}
