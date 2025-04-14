
export type CellDataType = 
  | 'text' 
  | 'int' 
  | 'float' 
  | 'select' 
  | 'multiselect' 
  | 'user' 
  | 'link' 
  | 'email' 
  | 'date';

export interface ColumnDefinition {
  id: string;
  name: string;
  type: CellDataType;
  width: number;
  enumId?: string;    // Reference to an Enum for select/multiselect types
  isReadOnly?: boolean;
  orderIndex: number;
}

export interface Cell {
  id: string;
  columnId: string;
  value: any; // Can be string, number, EnumValueId, EnumValueId[], etc.
  format?: string;
}

export interface Row {
  id: string;
  sheetId: string;
  groupId?: string; // Optional - může být prázdný pokud není v žádné skupině
  orderIndex: number;
  cells: { [columnId: string]: Cell };
  isGroup?: boolean;
  expanded?: boolean;
  parentId?: string;
}

export interface RowGroup {
  id: string;
  sheetId: string;
  name: string;
  orderIndex: number;
  isExpanded: boolean;
}

// Struktura pro verzování pomocí savepoints
export interface Savepoint {
  id: string;
  sheetId: string;
  createdAt: Date;
  message: string;
  createdByUserId: string;
  timestampAlias?: string; // Uživatelský alias pro jednoduché odkazování (v1.0, v2.1, ...)
}

// Rozšířená verze dat sheetu
export interface SheetData {
  id: string;
  name: string;
  description: string;
  type: string;
  columns: ColumnDefinition[];
  groups: RowGroup[];
  rows: Row[];
  currentSavepointId?: string; // Aktuální savepoint - pro time-travel
}

// For creating a new row
export type SheetRow = Omit<Row, "id">;

// For creating a new cell
export type CellDefinition = Omit<Cell, "id">;

// For revision handling
export interface SheetRevision {
  id: string;
  timestamp: Date;
  message: string;
  author: string;
}
