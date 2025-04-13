import React, { createContext, useContext, useState, useEffect } from "react";
import { SheetData, SheetRow, CellDefinition } from "@/types/sheet";
import { saveSheetData } from "@/services/projectService";
import { SheetContextType, SheetProviderProps } from "./sheet/types";
import { createEmptySheet } from "@/data/defaultTemplates";

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
    initialData || createEmptySheet()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (sheetId) {
      const saveData = async () => {
        try {
          setLoading(true);
          await saveSheetData(sheetId, sheetData);
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
          setLoading(false);
        }
      };
      
      saveData();
    }
  }, [sheetData, sheetId]);

  // Row operations
  const addRow = (row: Omit<SheetRow, "id">) => {
    setSheetData(prevData => rowOps.addRow(prevData, row));
  };

  const updateRow = (rowId: string, updatedRow: Partial<SheetRow>) => {
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

  // Refresh data from backend
  const refreshSheet = async () => {
    if (!sheetId) return;
    
    try {
      setLoading(true);
      // V produkci použít SpacetimeDB client
      // const client = useSpacetime();
      // const updatedSheet = await client.getSheetData(sheetId);
      // setSheetData(updatedSheet);
      
      // Zatím načteme data ručně - později nahradit SpacetimeDB klientem
      const updatedSheet = await saveSheetData(sheetId, sheetData);
      setSheetData(updatedSheet);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
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
    loading,
    error,
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
    addRowBefore,
    refreshSheet
  };

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}
