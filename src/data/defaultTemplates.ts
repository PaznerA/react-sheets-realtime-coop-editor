
import { SheetData, ColumnDefinition, RowGroup } from "@/types/sheet";

export const createDefaultSheet = (name = "Default Sheet"): SheetData => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    name,
    description: "Výchozí tabulka pro správu dat",
    type: "default",
    columns: [
      {
        id: "name",
        name: "Název",
        type: "text",
        width: 200,
        orderIndex: 0
      },
      {
        id: "type",
        name: "Typ",
        type: "select",
        enumId: "data-types",
        width: 150,
        orderIndex: 1
      },
      {
        id: "dueDate",
        name: "Datum",
        type: "date",
        width: 120,
        orderIndex: 2
      },
      {
        id: "owner",
        name: "Vlastník",
        type: "user",
        width: 150,
        orderIndex: 3
      },
      {
        id: "description",
        name: "Popis",
        type: "text",
        width: 300,
        orderIndex: 4
      }
    ],
    rows: [],
    groups: [],
    revisions: []
  };
};

export const createTaskSheet = (): SheetData => {
  const baseSheet = createDefaultSheet("Task List");
  
  return {
    ...baseSheet,
    description: "Správa úkolů projektu",
    columns: [
      {
        id: "title",
        name: "Název úkolu",
        type: "text",
        width: 250,
        orderIndex: 0
      },
      {
        id: "status",
        name: "Stav",
        type: "select",
        enumId: "task-status",
        width: 150,
        orderIndex: 1
      },
      {
        id: "priority",
        name: "Priorita",
        type: "select",
        enumId: "task-priority",
        width: 120,
        orderIndex: 2
      },
      {
        id: "assignee",
        name: "Přiřazeno",
        type: "user",
        width: 150,
        orderIndex: 3
      },
      {
        id: "dueDate",
        name: "Termín",
        type: "date",
        width: 120,
        orderIndex: 4
      },
      {
        id: "description",
        name: "Popis",
        type: "text",
        width: 300,
        orderIndex: 5
      }
    ],
    revisions: []
  };
};
