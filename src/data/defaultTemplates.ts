
import { SheetData, CellDefinition } from "@/types/sheet";

// Define basic template structure 
export interface SheetTemplate {
  id: string;
  name: string;
  description: string;
  data: Omit<SheetData, "revisions" | "currentRevision">;
}

// Basic requirements template inspired by IBM DOORS
export const requirementsTemplate: SheetTemplate = {
  id: "requirements-template",
  name: "Requirements Template",
  description: "Basic requirements management template inspired by IBM DOORS",
  data: {
    columns: [
      {
        id: "id",
        name: "ID",
        type: "text",
        required: true
      },
      {
        id: "description",
        name: "Description",
        type: "text",
        required: true
      },
      {
        id: "type",
        name: "Type",
        type: "select",
        options: ["Functional", "Non-functional", "Performance", "Security", "User Interface"],
        required: true
      },
      {
        id: "priority",
        name: "Priority",
        type: "select",
        options: ["Critical", "High", "Medium", "Low"],
        required: true
      },
      {
        id: "status",
        name: "Status",
        type: "select",
        options: ["Proposed", "Approved", "Implemented", "Verified", "Deferred", "Rejected"],
        required: true
      },
      {
        id: "assignee",
        name: "Assigned To",
        type: "user",
        required: false
      },
      {
        id: "comments",
        name: "Comments",
        type: "text",
        required: false
      }
    ],
    rows: [
      {
        id: "row-1",
        cells: [
          { id: "cell-1-1", columnId: "id", value: "REQ-001" },
          { id: "cell-1-2", columnId: "description", value: "The system shall..." },
          { id: "cell-1-3", columnId: "type", value: "Functional" },
          { id: "cell-1-4", columnId: "priority", value: "High" },
          { id: "cell-1-5", columnId: "status", value: "Proposed" },
          { id: "cell-1-6", columnId: "assignee", value: null },
          { id: "cell-1-7", columnId: "comments", value: null }
        ],
        order: 0
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
    columns: [
      {
        id: "id",
        name: "ID",
        type: "text",
        required: true
      },
      {
        id: "description",
        name: "Description",
        type: "text",
        required: true
      },
      {
        id: "steps",
        name: "Test Steps",
        type: "text",
        required: true
      },
      {
        id: "expectedResult",
        name: "Expected Result",
        type: "text",
        required: true
      },
      {
        id: "relatedReqs",
        name: "Related Requirements",
        type: "text",
        required: false
      },
      {
        id: "status",
        name: "Status",
        type: "select",
        options: ["Not Run", "Passed", "Failed", "Blocked"],
        required: true
      },
      {
        id: "assignee",
        name: "Tester",
        type: "user",
        required: false
      }
    ],
    rows: [
      {
        id: "row-1",
        cells: [
          { id: "cell-1-1", columnId: "id", value: "TC-001" },
          { id: "cell-1-2", columnId: "description", value: "Test that..." },
          { id: "cell-1-3", columnId: "steps", value: "1. Step one\n2. Step two" },
          { id: "cell-1-4", columnId: "expectedResult", value: "Expected outcome is..." },
          { id: "cell-1-5", columnId: "relatedReqs", value: "REQ-001" },
          { id: "cell-1-6", columnId: "status", value: "Not Run" },
          { id: "cell-1-7", columnId: "assignee", value: null }
        ],
        order: 0
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
  
  return {
    ...template.data,
    revisions: [],
    currentRevision: 0
  };
};

// Default columns if no template is selected
export const defaultColumns: CellDefinition[] = [
  {
    id: "name",
    name: "Name",
    type: "text",
    required: true
  },
  {
    id: "description",
    name: "Description",
    type: "text",
    required: false
  }
];

// Create empty sheet with default columns
export const createEmptySheet = (): SheetData => {
  return {
    columns: defaultColumns,
    rows: [],
    revisions: [],
    currentRevision: 0
  };
};
