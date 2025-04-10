// src/contexts/sheet/types.ts
import { SheetData, SheetRow, CellDefinition, Cell, SheetRevision } from "@/types/sheet";

export interface SheetContextType {
  sheetData: SheetData;
  loading: boolean;
  error: Error | null;
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

export interface SheetProviderProps {
  children: React.ReactNode;
  initialData?: SheetData;
  sheetId?: string;
}