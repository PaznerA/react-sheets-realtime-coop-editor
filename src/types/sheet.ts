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
  rowId: string;
  columnId: string;
  value: string;
  format?: string;
}

export interface Row {
  id: string;
  sheetId: string;
  groupId?: string; // Optional - může být prázdný pokud není v žádné skupině
  orderIndex: number;
  cells: { [columnId: string]: Cell };
}

export interface RowGroup {
  id: string;
  sheetId: string;
  name: string;
  orderIndex: number;
  isExpanded: boolean;
}

// Interface pro Enum (výběrový seznam)
export interface Enum {
  id: string;
  unitId: string;
  name: string;
  description: string;
  items: EnumItem[];
}

export interface EnumItem {
  id: string;
  enumId: string;
  value: string;
  label: string;
  color?: string;
  orderIndex: number;
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

// Rozšířená verze dat sheetu - nahrazuje starou SheetData
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
