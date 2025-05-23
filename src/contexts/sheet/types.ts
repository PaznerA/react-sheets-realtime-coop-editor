// src/contexts/sheet/types.ts
import { SheetData } from "@/types/sheet";

export interface SheetContextType {
  sheetData: SheetData;
  loading: boolean;
  error: Error | null;
  
  // Row operations
  addRow: (row: any) => void;
  updateRow: (rowId: string, updatedRow: any) => void;
  deleteRow: (rowId: string) => void;
  moveRow: (rowId: string, targetIndex: number) => void;
  addRowAfter: (rowId: string) => void;
  addRowBefore: (rowId: string) => void;
  
  // Column operations
  addColumn: (column: any) => void;
  updateColumn: (columnId: string, updatedColumn: any) => void;
  deleteColumn: (columnId: string) => void;
  moveColumn: (columnId: string, targetIndex: number) => void;
  
  // Cell operations
  updateCell: (rowId: string, columnId: string, value: any) => void;
  
  // Group operations
  toggleGroupExpanded: (groupId: string) => void;
  createGroup: (name: string, rowIds: string[]) => void;
  toggleGroup: (groupId: string) => void;
  
  // Savepoints/verzování
  saveRevision: (description: string) => void;
  loadRevision: (revisionIndex: number) => void;
  
  // Refresh funkce pro načtení aktuálních dat z backendu
  refreshSheet: () => Promise<void>;
}

export interface SheetProviderProps {
  children: React.ReactNode;
  initialData?: SheetData;
  sheetId?: string;
}