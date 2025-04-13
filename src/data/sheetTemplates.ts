
import { v4 as uuidv4 } from 'uuid';
import { SheetData, ColumnDefinition } from "@/types/sheet";

// Define basic template structure 
export interface SheetTemplate {
  id: string;
  name: string;
  description: string;
  data: Omit<SheetData, "id">;
}

// Basic requirements template inspired by IBM DOORS
export const requirementsTemplate: SheetTemplate = {
  id: "requirements-template",
  name: "Requirements Template",
  description: "Basic requirements management template inspired by IBM DOORS",
  data: {
    name: "Requirements",
    description: "Track project requirements",
    type: "requirements",
    columns: [
      {
        id: "id",
        name: "ID",
        type: "text",
        width: 100,
        orderIndex: 0
      },
      {
        id: "description",
        name: "Description",
        type: "text",
        width: 300,
        orderIndex: 1
      },
      {
        id: "type",
        name: "Type",
        type: "select",
        enumId: "enum-requirement-type",
        width: 150,
        orderIndex: 2
      },
      {
        id: "priority",
        name: "Priority",
        type: "select",
        enumId: "enum-priority",
        width: 100,
        orderIndex: 3
      },
      {
        id: "status",
        name: "Status",
        type: "select",
        enumId: "enum-status",
        width: 120,
        orderIndex: 4
      },
      {
        id: "assignee",
        name: "Assigned To",
        type: "user",
        width: 150,
        orderIndex: 5
      },
      {
        id: "comments",
        name: "Comments",
        type: "text",
        width: 200,
        orderIndex: 6
      }
    ],
    groups: [],
    rows: [
      {
        id: "row-1",
        sheetId: "",
        orderIndex: 0,
        cells: {
          "id": { id: "cell-1-1", columnId: "id", value: "REQ-001" },
          "description": { id: "cell-1-2", columnId: "description", value: "The system shall..." },
          "type": { id: "cell-1-3", columnId: "type", value: "req-functional" },
          "priority": { id: "cell-1-4", columnId: "priority", value: "priority-high" },
          "status": { id: "cell-1-5", columnId: "status", value: "status-not-started" },
          "assignee": { id: "cell-1-6", columnId: "assignee", value: null },
          "comments": { id: "cell-1-7", columnId: "comments", value: null }
        }
      }
    ]
  }
};

// Test cases template
export const testCasesTemplate: SheetTemplate = {
  id: "test-cases-template",
  name: "Test Cases Template",
  description: "Template for defining and tracking test cases",
  data: {
    name: "Test Cases",
    description: "Track test cases and their execution",
    type: "test-cases",
    columns: [
      {
        id: "id",
        name: "ID",
        type: "text",
        width: 100,
        orderIndex: 0
      },
      {
        id: "description",
        name: "Description",
        type: "text",
        width: 250,
        orderIndex: 1
      },
      {
        id: "steps",
        name: "Test Steps",
        type: "text",
        width: 300,
        orderIndex: 2
      },
      {
        id: "expectedResult",
        name: "Expected Result",
        type: "text",
        width: 250,
        orderIndex: 3
      },
      {
        id: "relatedReqs",
        name: "Related Requirements",
        type: "text",
        width: 150,
        orderIndex: 4
      },
      {
        id: "status",
        name: "Status",
        type: "select",
        enumId: "enum-test-status",
        width: 120,
        orderIndex: 5
      },
      {
        id: "assignee",
        name: "Tester",
        type: "user",
        width: 150,
        orderIndex: 6
      }
    ],
    groups: [],
    rows: [
      {
        id: "row-1",
        sheetId: "",
        orderIndex: 0,
        cells: {
          "id": { id: "cell-1-1", columnId: "id", value: "TC-001" },
          "description": { id: "cell-1-2", columnId: "description", value: "Test that..." },
          "steps": { id: "cell-1-3", columnId: "steps", value: "1. Step one\n2. Step two" },
          "expectedResult": { id: "cell-1-4", columnId: "expectedResult", value: "Expected outcome is..." },
          "relatedReqs": { id: "cell-1-5", columnId: "relatedReqs", value: "REQ-001" },
          "status": { id: "cell-1-6", columnId: "status", value: "test-not-run" },
          "assignee": { id: "cell-1-7", columnId: "assignee", value: null }
        }
      }
    ]
  }
};

// All available templates
export const templates: SheetTemplate[] = [
  requirementsTemplate,
  testCasesTemplate
];

// Get a template by ID
export const getTemplateById = (id: string): SheetTemplate | undefined => {
  return templates.find(template => template.id === id);
};

// Create sheet data from template
export const createSheetFromTemplate = (templateId: string): SheetData => {
  const template = getTemplateById(templateId) || requirementsTemplate;
  
  // Create a new sheet with a unique ID based on the template
  return {
    id: uuidv4(),
    ...template.data
  };
};
