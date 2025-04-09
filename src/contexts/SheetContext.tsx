
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SheetData, SheetRow, Cell, CellDefinition, SheetRevision } from '../types/sheet';

type SheetAction = 
  | { type: 'UPDATE_CELL'; rowId: string; columnId: string; value: string | number | string[] | null }
  | { type: 'ADD_ROW'; row: SheetRow }
  | { type: 'DELETE_ROW'; rowId: string }
  | { type: 'MOVE_ROW'; rowId: string; newOrder: number }
  | { type: 'TOGGLE_GROUP'; rowId: string }
  | { type: 'CREATE_GROUP'; name: string; rowIds: string[] }
  | { type: 'SAVE_REVISION'; description: string }
  | { type: 'LOAD_REVISION'; revisionIndex: number }
  | { type: 'REORDER_ROWS'; rows: SheetRow[] };

interface SheetContextType {
  sheetData: SheetData;
  dispatch: React.Dispatch<SheetAction>;
  addRowAfter: (rowId: string) => void;
  addRowBefore: (rowId: string) => void;
  editRow: (rowId: string, values: Record<string, any>) => void;
  createGroup: (name: string, rowIds: string[]) => void;
  toggleGroup: (rowId: string) => void;
  saveRevision: (description: string) => void;
  loadRevision: (revisionIndex: number) => void;
  updateCell: (rowId: string, columnId: string, value: string | number | string[] | null) => void;
  deleteRow: (rowId: string) => void;
  reorderRows: (rows: SheetRow[]) => void;
}

const defaultColumns: CellDefinition[] = [
  { id: 'name', name: 'Název', type: 'text', required: true },
  { id: 'type', name: 'Typ', type: 'select', options: ['String', 'Number', 'Boolean', 'Date', 'Object'] },
  { id: 'value', name: 'Hodnota', type: 'text' },
  { id: 'required', name: 'Povinné', type: 'select', options: ['Ano', 'Ne'] },
  { id: 'date', name: 'Datum', type: 'date' },
];

const initialRows: SheetRow[] = [
  {
    id: 'group1',
    cells: [{ id: 'cell1', columnId: 'name', value: 'Položky' }],
    isGroup: true,
    groupName: 'Položky',
    expanded: true,
    order: 0,
  },
  {
    id: 'row1',
    cells: [
      { id: 'cell2', columnId: 'name', value: 'Jméno' },
      { id: 'cell3', columnId: 'type', value: 'String' },
      { id: 'cell4', columnId: 'value', value: 'Jan Novák' },
      { id: 'cell5', columnId: 'required', value: 'Ano' },
      { id: 'cell6', columnId: 'date', value: '2023-01-01' },
    ],
    parentId: 'group1',
    order: 1,
  },
  {
    id: 'row2',
    cells: [
      { id: 'cell7', columnId: 'name', value: 'Věk' },
      { id: 'cell8', columnId: 'type', value: 'Number' },
      { id: 'cell9', columnId: 'value', value: 30 },
      { id: 'cell10', columnId: 'required', value: 'Ne' },
      { id: 'cell11', columnId: 'date', value: '2023-01-02' },
    ],
    parentId: 'group1',
    order: 2,
  },
  {
    id: 'group2',
    cells: [{ id: 'cell12', columnId: 'name', value: 'Nastavení' }],
    isGroup: true,
    groupName: 'Nastavení',
    expanded: false,
    order: 3,
  },
  {
    id: 'row3',
    cells: [
      { id: 'cell13', columnId: 'name', value: 'Aktivní' },
      { id: 'cell14', columnId: 'type', value: 'Boolean' },
      { id: 'cell15', columnId: 'value', value: 'true' },
      { id: 'cell16', columnId: 'required', value: 'Ano' },
      { id: 'cell17', columnId: 'date', value: '2023-01-03' },
    ],
    parentId: 'group2',
    order: 4,
  },
];

const initialState: SheetData = {
  columns: defaultColumns,
  rows: initialRows,
  revisions: [],
  currentRevision: -1,
};

const SheetContext = createContext<SheetContextType | undefined>(undefined);

function sheetReducer(state: SheetData, action: SheetAction): SheetData {
  switch (action.type) {
    case 'UPDATE_CELL': {
      const { rowId, columnId, value } = action;
      const newRows = state.rows.map(row => {
        if (row.id === rowId) {
          const cellIndex = row.cells.findIndex(cell => cell.columnId === columnId);
          if (cellIndex >= 0) {
            // Update existing cell
            const newCells = [...row.cells];
            newCells[cellIndex] = { ...newCells[cellIndex], value };
            return { ...row, cells: newCells };
          } else {
            // Create new cell
            return {
              ...row,
              cells: [...row.cells, { id: `cell_${Date.now()}`, columnId, value }]
            };
          }
        }
        return row;
      });
      return { ...state, rows: newRows };
    }

    case 'ADD_ROW': {
      return { ...state, rows: [...state.rows, action.row] };
    }

    case 'DELETE_ROW': {
      return { 
        ...state, 
        rows: state.rows.filter(row => row.id !== action.rowId && row.parentId !== action.rowId) 
      };
    }

    case 'MOVE_ROW': {
      const { rowId, newOrder } = action;
      const newRows = state.rows.map(row => {
        if (row.id === rowId) {
          return { ...row, order: newOrder };
        }
        return row;
      });
      newRows.sort((a, b) => a.order - b.order);
      return { ...state, rows: newRows };
    }

    case 'REORDER_ROWS': {
      return { ...state, rows: action.rows };
    }

    case 'TOGGLE_GROUP': {
      const newRows = state.rows.map(row => {
        if (row.id === action.rowId && row.isGroup) {
          return { ...row, expanded: !row.expanded };
        }
        return row;
      });
      return { ...state, rows: newRows };
    }

    case 'CREATE_GROUP': {
      const { name, rowIds } = action;
      const newGroupId = `group_${Date.now()}`;
      const maxOrder = Math.max(...state.rows.map(r => r.order), 0);
      
      // Create new group
      const newGroup: SheetRow = {
        id: newGroupId,
        cells: [{ id: `cell_${Date.now()}`, columnId: 'name', value: name }],
        isGroup: true,
        groupName: name,
        expanded: true,
        order: maxOrder + 1,
      };
      
      // Update rows to be part of the group
      const updatedRows = state.rows.map(row => {
        if (rowIds.includes(row.id)) {
          return { ...row, parentId: newGroupId, order: row.order + 1 };
        }
        return row;
      });
      
      return { ...state, rows: [...updatedRows, newGroup].sort((a, b) => a.order - b.order) };
    }

    case 'SAVE_REVISION': {
      const { description } = action;
      const newRevision: SheetRevision = {
        id: `rev_${Date.now()}`,
        timestamp: new Date(),
        description,
        rows: JSON.parse(JSON.stringify(state.rows)), // Deep clone rows
      };
      
      return {
        ...state,
        revisions: [...state.revisions, newRevision],
        currentRevision: state.revisions.length,
      };
    }

    case 'LOAD_REVISION': {
      const { revisionIndex } = action;
      if (revisionIndex >= 0 && revisionIndex < state.revisions.length) {
        return {
          ...state,
          rows: JSON.parse(JSON.stringify(state.revisions[revisionIndex].rows)),
          currentRevision: revisionIndex,
        };
      }
      return state;
    }

    default:
      return state;
  }
}

export const SheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sheetData, dispatch] = useReducer(sheetReducer, initialState);

  const addRowAfter = (rowId: string) => {
    const targetRow = sheetData.rows.find(r => r.id === rowId);
    if (!targetRow) return;

    const newId = `row_${Date.now()}`;
    const newOrder = targetRow.order + 0.5; // Place it between this row and the next
    
    const emptyCells = sheetData.columns.map(col => ({
      id: `cell_${col.id}_${Date.now()}`,
      columnId: col.id,
      value: null
    }));

    dispatch({
      type: 'ADD_ROW',
      row: {
        id: newId,
        cells: emptyCells,
        parentId: targetRow.parentId,
        order: newOrder,
      }
    });

    // Normalize order numbers after adding
    const sortedRows = [...sheetData.rows, {
      id: newId,
      cells: emptyCells,
      parentId: targetRow.parentId,
      order: newOrder,
    }].sort((a, b) => a.order - b.order);

    const normalizedRows = sortedRows.map((row, index) => ({
      ...row,
      order: index
    }));

    dispatch({ type: 'REORDER_ROWS', rows: normalizedRows });
  };

  const addRowBefore = (rowId: string) => {
    const targetRow = sheetData.rows.find(r => r.id === rowId);
    if (!targetRow) return;

    const newId = `row_${Date.now()}`;
    const newOrder = targetRow.order - 0.5; // Place it just before this row
    
    const emptyCells = sheetData.columns.map(col => ({
      id: `cell_${col.id}_${Date.now()}`,
      columnId: col.id,
      value: null
    }));

    dispatch({
      type: 'ADD_ROW',
      row: {
        id: newId,
        cells: emptyCells,
        parentId: targetRow.parentId,
        order: newOrder,
      }
    });

    // Normalize order numbers after adding
    const sortedRows = [...sheetData.rows, {
      id: newId,
      cells: emptyCells,
      parentId: targetRow.parentId,
      order: newOrder,
    }].sort((a, b) => a.order - b.order);

    const normalizedRows = sortedRows.map((row, index) => ({
      ...row,
      order: index
    }));

    dispatch({ type: 'REORDER_ROWS', rows: normalizedRows });
  };

  const editRow = (rowId: string, values: Record<string, any>) => {
    // Update multiple cells at once
    Object.entries(values).forEach(([columnId, value]) => {
      dispatch({ type: 'UPDATE_CELL', rowId, columnId, value });
    });
  };

  const createGroup = (name: string, rowIds: string[]) => {
    dispatch({ type: 'CREATE_GROUP', name, rowIds });
  };

  const toggleGroup = (rowId: string) => {
    dispatch({ type: 'TOGGLE_GROUP', rowId });
  };

  const saveRevision = (description: string) => {
    dispatch({ type: 'SAVE_REVISION', description });
  };

  const loadRevision = (revisionIndex: number) => {
    dispatch({ type: 'LOAD_REVISION', revisionIndex });
  };

  const updateCell = (rowId: string, columnId: string, value: string | number | string[] | null) => {
    dispatch({ type: 'UPDATE_CELL', rowId, columnId, value });
  };

  const deleteRow = (rowId: string) => {
    dispatch({ type: 'DELETE_ROW', rowId });
  };

  const reorderRows = (rows: SheetRow[]) => {
    dispatch({ type: 'REORDER_ROWS', rows });
  };

  return (
    <SheetContext.Provider
      value={{
        sheetData,
        dispatch,
        addRowAfter,
        addRowBefore,
        editRow,
        createGroup,
        toggleGroup,
        saveRevision,
        loadRevision,
        updateCell,
        deleteRow,
        reorderRows
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (context === undefined) {
    throw new Error('useSheet must be used within a SheetProvider');
  }
  return context;
};
