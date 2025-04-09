
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

export interface CellDefinition {
  id: string;
  name: string;
  type: CellDataType;
  required?: boolean;
  options?: string[]; // For select/multiselect types
  enumId?: string;    // Reference to an Enum for select/multiselect types
  validation?: RegExp | string; // For validation rules (email, etc.)
}

export interface Cell {
  id: string;
  value: string | number | string[] | null;
  columnId: string;
}

export interface SheetRow {
  id: string;
  cells: Cell[];
  isGroup?: boolean;
  groupName?: string;
  parentId?: string | null;
  expanded?: boolean;
  order: number;
}

export interface SheetRevision {
  id: string;
  timestamp: Date;
  description: string;
  rows: SheetRow[];
}

export interface SheetData {
  columns: CellDefinition[];
  rows: SheetRow[];
  revisions: SheetRevision[];
  currentRevision: number;
}
