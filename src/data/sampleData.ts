
import { Project } from "@/types/project";
import { SheetData } from "@/types/sheet";
import { createDefaultSheet, createTaskSheet } from "./defaultTemplates";
import { createEmptySheet } from "./sheetTemplates";

// Sample projects
export const getSampleProjects = (): Project[] => {
  return [
    {
      id: "sample-project-1",
      name: "Ukázkový projekt",
      description: "Ukázkový projekt pro demonstraci funkcionality",
      createdAt: new Date(2023, 0, 15),
      updatedAt: new Date(2023, 1, 20),
      sheetId: "sample-sheet-1",
      unitId: ""
    },
    {
      id: "sample-project-2",
      name: "Projektový plán",
      description: "Plánování a sledování projektu",
      createdAt: new Date(2023, 2, 5),
      updatedAt: new Date(2023, 3, 10),
      sheetId: "sample-sheet-2",
      unitId: ""
    }
  ];
};

// Sample sheet for a project
export const getSampleSheet = (sheetId: string): SheetData => {
  switch (sheetId) {
    case "sample-sheet-1":
      return createSampleProjectSheet();
    case "sample-sheet-2":
      return createTaskSheet();
    default:
      return createEmptySheet();
  }
};

const createSampleProjectSheet = (): SheetData => {
  return {
    id: "sample-sheet-1",
    name: "Ukázkový sheet",
    description: "Ukázkový sheet s daty pro demonstraci",
    type: "sample",
    columns: [
      {
        id: "name",
        name: "Název",
        type: "text",
        width: 200,
        orderIndex: 0
      },
      {
        id: "status",
        name: "Status",
        type: "select",
        enumId: "project-status",
        width: 150,
        orderIndex: 1
      },
      {
        id: "start",
        name: "Začátek",
        type: "date",
        width: 120,
        orderIndex: 2
      },
      {
        id: "end",
        name: "Konec",
        type: "date",
        width: 120,
        orderIndex: 3
      },
      {
        id: "owner",
        name: "Zodpovědný",
        type: "user",
        width: 150,
        orderIndex: 4
      }
    ],
    rows: [],
    groups: [],
    revisions: []
  };
};

// Export create functions for direct use
export { createDefaultSheet, createTaskSheet };
