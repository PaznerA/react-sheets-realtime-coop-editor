
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

// Alias pro CellDefinition pro zachování zpětné kompatibility
export type ColumnDefinition = {
  id: string;
  name: string;
  type: CellDataType;
  width: number;
  enumId?: string;
  isReadOnly?: boolean;
  orderIndex: number;
};

export type Cell = {
  id: string;
  columnId: string;
  value: any; // Může být string, number, EnumValueId, EnumValueId[], atd.
  format?: string;
};

export type Row = {
  id: string;
  sheetId: string;
  groupId?: string; // Volitelné - může být prázdné pokud není v žádné skupině
  orderIndex: number; // Používáme orderIndex místo order pro konzistenci
  cells: { [columnId: string]: Cell };
  isGroup?: boolean;
  expanded?: boolean;
  parentId?: string;
};

export type RowGroup = {
  id: string;
  sheetId: string;
  name: string;
  orderIndex: number;
  isExpanded: boolean;
};

// Struktura pro verzování pomocí savepoints
export type Savepoint = {
  id: string;
  sheetId: string;
  createdAt: Date;
  message: string;
  createdByUserId: string;
  timestampAlias?: string; // Uživatelský alias pro jednoduché odkazování (v1.0, v2.1, ...)
};

// Typ pro revize - používá se interně
export type SheetRevision = {
  id: string;
  timestamp: Date;
  description: string;
  rows: Row[];
};

// Export typů pro zpětnou kompatibilitu
export type SheetRow = Row;
export type CellDefinition = ColumnDefinition;

// Rozšířená verze dat sheetu včetně revizí
export type SheetData = {
  id: string;
  name: string;
  description: string;
  type: string;
  columns: ColumnDefinition[];
  groups: RowGroup[];
  rows: Row[];
  revisions: SheetRevision[];
  currentRevision?: number;
  currentSavepointId?: string; // Aktuální savepoint - pro time-travel
};

// Export typů pro používání enum hodnot v select/multiselect polích
export type EnumValueId = string;
export type EnumValues = EnumValueId[];
