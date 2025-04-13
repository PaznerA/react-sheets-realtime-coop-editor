
import { SheetData } from "@/types/sheet";

export const createEmptySheet = (): SheetData => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    name: "Nový sheet",
    description: "Prázdný sheet pro zadávání dat",
    type: "custom",
    columns: [
      {
        id: "col1",
        name: "Název",
        type: "text",
        width: 200,
        orderIndex: 0
      },
      {
        id: "col2",
        name: "Popis",
        type: "text",
        width: 300,
        orderIndex: 1
      }
    ],
    rows: [],
    groups: [],
    revisions: []
  };
};

export const createTaskSheet = (): SheetData => {
  const sheet = createEmptySheet();
  sheet.name = "Task List";
  sheet.description = "Project tasks management";
  sheet.columns = [
    {
      id: "title",
      name: "Task Title",
      type: "text",
      width: 250,
      orderIndex: 0
    },
    {
      id: "status",
      name: "Status",
      type: "select",
      enumId: "task-status",
      width: 150,
      orderIndex: 1
    },
    {
      id: "priority",
      name: "Priority",
      type: "select",
      enumId: "task-priority",
      width: 120,
      orderIndex: 2
    },
    {
      id: "assigned",
      name: "Assigned To",
      type: "user",
      width: 150,
      orderIndex: 3
    },
    {
      id: "dueDate",
      name: "Due Date",
      type: "date",
      width: 120,
      orderIndex: 4
    }
  ];
  return sheet;
};
