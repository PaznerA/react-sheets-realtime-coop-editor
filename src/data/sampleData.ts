
import { v4 as uuidv4 } from 'uuid';
import { Project } from "@/types/project";
import { SheetData, ColumnDefinition } from "@/types/sheet";
import { Enum, EnumValue, EnumValueId } from "@/types/enum";

// Sample enum data
export const getSampleEnums = (): Enum[] => {
  // Basic enums that will be used in templates
  const priorityEnum: Enum = {
    id: "enum-priority",
    name: "Priority",
    values: [
      { id: "priority-critical", value: "Critical", color: "#FF0000", order: 0 },
      { id: "priority-high", value: "High", color: "#FFA500", order: 1 },
      { id: "priority-medium", value: "Medium", color: "#FFFF00", order: 2 },
      { id: "priority-low", value: "Low", color: "#00FF00", order: 3 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const statusEnum: Enum = {
    id: "enum-status",
    name: "Status",
    values: [
      { id: "status-not-started", value: "Not Started", color: "#C0C0C0", order: 0 },
      { id: "status-in-progress", value: "In Progress", color: "#0000FF", order: 1 },
      { id: "status-completed", value: "Completed", color: "#008000", order: 2 },
      { id: "status-blocked", value: "Blocked", color: "#800000", order: 3 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const requirementTypeEnum: Enum = {
    id: "enum-requirement-type",
    name: "Requirement Type",
    values: [
      { id: "req-functional", value: "Functional", order: 0 },
      { id: "req-non-functional", value: "Non-functional", order: 1 },
      { id: "req-performance", value: "Performance", order: 2 },
      { id: "req-security", value: "Security", order: 3 },
      { id: "req-ui", value: "User Interface", order: 4 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const testStatusEnum: Enum = {
    id: "enum-test-status",
    name: "Test Status",
    values: [
      { id: "test-not-run", value: "Not Run", color: "#C0C0C0", order: 0 },
      { id: "test-passed", value: "Passed", color: "#008000", order: 1 },
      { id: "test-failed", value: "Failed", color: "#FF0000", order: 2 },
      { id: "test-blocked", value: "Blocked", color: "#800000", order: 3 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const nullableBoolEnum: Enum = {
    id: "nullable-bool",
    name: "NullableBool",
    values: [
      { id: "bool-yes", value: "yes", order: 0 },
      { id: "bool-no", value: "no", order: 1 },
      { id: "bool-not-set", value: "not-set", order: 2 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return [
    priorityEnum,
    statusEnum,
    requirementTypeEnum,
    testStatusEnum,
    nullableBoolEnum
  ];
};

// Sample projects data
export const getSampleProjects = (): Project[] => [
  {
    id: "proj-1",
    unitId: "unit-1",
    name: "Marketing Campaign",
    description: "Q2 2023 marketing campaign planning",
    createdAt: new Date(2023, 3, 15),
    updatedAt: new Date(2023, 5, 20),
    sheetId: "sheet-1"
  },
  {
    id: "proj-2",
    unitId: "unit-1",
    name: "Product Roadmap",
    description: "Product feature planning for next release",
    createdAt: new Date(2023, 1, 10),
    updatedAt: new Date(2023, 6, 5),
    sheetId: "sheet-2"
  },
  {
    id: "proj-3",
    unitId: "unit-1",
    name: "Budget Overview",
    description: "Annual department budget allocation",
    createdAt: new Date(2023, 0, 5),
    updatedAt: new Date(2023, 4, 12),
    sheetId: "sheet-3"
  }
];

// Default columns if no template is selected
export const defaultColumns: ColumnDefinition[] = [
  {
    id: "name",
    name: "Name",
    type: "text",
    width: 200,
    orderIndex: 0
  },
  {
    id: "description",
    name: "Description",
    type: "text",
    width: 300,
    orderIndex: 1
  }
];

// Create empty sheet with default columns
export const createEmptySheet = (): SheetData => {
  return {
    id: uuidv4(),
    name: "New Sheet",
    description: "",
    type: "generic",
    columns: defaultColumns,
    groups: [],
    rows: []
  };
};
