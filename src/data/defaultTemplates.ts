import { v4 as uuidv4 } from 'uuid';
import { SheetData, ColumnDefinition, Row, RowGroup } from '@/types/sheet';

/**
 * Creates an empty sheet with default structure
 */
export const createEmptySheet = (): SheetData => {
  // Create default columns
  const columns: ColumnDefinition[] = [
    {
      id: uuidv4(),
      name: 'Name',
      type: 'text',
      width: 200,
      orderIndex: 0,
    },
    {
      id: uuidv4(),
      name: 'Description',
      type: 'text',
      width: 300,
      orderIndex: 1,
    },
    {
      id: uuidv4(),
      name: 'Status',
      type: 'select',
      width: 150,
      orderIndex: 2,
      enumId: 'status', // Default enum, should exist in the system
    },
    {
      id: uuidv4(),
      name: 'Priority',
      type: 'select',
      width: 150,
      orderIndex: 3,
      enumId: 'priority', // Default enum, should exist in the system
    },
  ];

  // Create a default group
  const defaultGroup: RowGroup = {
    id: uuidv4(),
    sheetId: '',
    name: 'Tasks',
    orderIndex: 0,
    isExpanded: true,
  };

  // Create a single empty row
  const emptyRow: Row = {
    id: uuidv4(),
    sheetId: '',
    orderIndex: 0,
    cells: {},
    groupId: defaultGroup.id,
  };

  // Initialize with column cells
  columns.forEach(column => {
    emptyRow.cells[column.id] = {
      id: uuidv4(),
      columnId: column.id,
      value: '',
    };
  });

  // Create sheet structure
  const sheetData: SheetData = {
    id: uuidv4(),
    name: 'New Sheet',
    description: 'A new blank sheet',
    type: 'standard',
    columns: columns,
    groups: [defaultGroup],
    rows: [emptyRow],
  };

  // Update the references
  sheetData.groups.forEach(group => {
    group.sheetId = sheetData.id;
  });
  
  sheetData.rows.forEach(row => {
    row.sheetId = sheetData.id;
  });

  return sheetData;
};

/**
 * Creates a project task tracking sheet
 */
export const createProjectTaskSheet = (): SheetData => {
  const sheet = createEmptySheet();
  sheet.name = 'Project Tasks';
  sheet.description = 'Track tasks and their progress';
  
  // Replace columns with project-specific ones
  sheet.columns = [
    {
      id: uuidv4(),
      name: 'Task',
      type: 'text',
      width: 250,
      orderIndex: 0,
    },
    {
      id: uuidv4(),
      name: 'Description',
      type: 'text',
      width: 300,
      orderIndex: 1,
    },
    {
      id: uuidv4(),
      name: 'Status',
      type: 'select',
      width: 150,
      orderIndex: 2,
      enumId: 'status',
    },
    {
      id: uuidv4(),
      name: 'Priority',
      type: 'select',
      width: 120,
      orderIndex: 3,
      enumId: 'priority',
    },
    {
      id: uuidv4(),
      name: 'Assigned To',
      type: 'user',
      width: 150,
      orderIndex: 4,
    },
    {
      id: uuidv4(),
      name: 'Due Date',
      type: 'date',
      width: 150,
      orderIndex: 5,
    }
  ];
  
  // Update rows with new structure
  sheet.groups = [
    {
      id: uuidv4(),
      sheetId: sheet.id,
      name: 'Planning',
      orderIndex: 0,
      isExpanded: true,
    },
    {
      id: uuidv4(),
      sheetId: sheet.id,
      name: 'Implementation',
      orderIndex: 1,
      isExpanded: true,
    },
    {
      id: uuidv4(),
      sheetId: sheet.id,
      name: 'Testing',
      orderIndex: 2,
      isExpanded: true,
    }
  ];
  
  // Empty rows array - let user create their own tasks
  sheet.rows = [];
  
  return sheet;
};

/**
 * Creates a team schedule sheet
 */
export const createTeamScheduleSheet = (): SheetData => {
  const sheet = createEmptySheet();
  sheet.name = 'Team Schedule';
  sheet.description = 'Track team availability and scheduling';
  
  // Replace columns with schedule-specific ones
  sheet.columns = [
    {
      id: uuidv4(),
      name: 'Team Member',
      type: 'user',
      width: 200,
      orderIndex: 0,
    },
    {
      id: uuidv4(),
      name: 'Monday',
      type: 'select',
      width: 120,
      orderIndex: 1,
      enumId: 'availability',
    },
    {
      id: uuidv4(),
      name: 'Tuesday',
      type: 'select',
      width: 120,
      orderIndex: 2,
      enumId: 'availability',
    },
    {
      id: uuidv4(),
      name: 'Wednesday',
      type: 'select',
      width: 120,
      orderIndex: 3,
      enumId: 'availability',
    },
    {
      id: uuidv4(),
      name: 'Thursday',
      type: 'select',
      width: 120,
      orderIndex: 4,
      enumId: 'availability',
    },
    {
      id: uuidv4(),
      name: 'Friday',
      type: 'select',
      width: 120,
      orderIndex: 5,
      enumId: 'availability',
    },
    {
      id: uuidv4(),
      name: 'Notes',
      type: 'text',
      width: 200,
      orderIndex: 6,
    }
  ];
  
  // No groups for this template
  sheet.groups = [];
  
  // Empty rows array
  sheet.rows = [];
  
  return sheet;
};

/**
 * Creates a requirements tracking sheet
 */
export const createRequirementsSheet = (): SheetData => {
  const sheet = createEmptySheet();
  sheet.name = 'Requirements Tracking';
  sheet.description = 'Track project requirements and their status';
  
  // Replace columns with requirements-specific ones
  sheet.columns = [
    {
      id: uuidv4(),
      name: 'ID',
      type: 'text',
      width: 80,
      orderIndex: 0,
    },
    {
      id: uuidv4(),
      name: 'Requirement',
      type: 'text',
      width: 300,
      orderIndex: 1,
    },
    {
      id: uuidv4(),
      name: 'Type',
      type: 'select',
      width: 130,
      orderIndex: 2,
      enumId: 'requirement-type',
    },
    {
      id: uuidv4(),
      name: 'Status',
      type: 'select',
      width: 140,
      orderIndex: 3,
      enumId: 'requirement-status',
    },
    {
      id: uuidv4(),
      name: 'Priority',
      type: 'select',
      width: 120,
      orderIndex: 4,
      enumId: 'priority',
    },
    {
      id: uuidv4(),
      name: 'Owner',
      type: 'user',
      width: 150,
      orderIndex: 5,
    },
    {
      id: uuidv4(),
      name: 'Notes',
      type: 'text',
      width: 200,
      orderIndex: 6,
    }
  ];
  
  // Requirement type groups
  sheet.groups = [
    {
      id: uuidv4(),
      sheetId: sheet.id,
      name: 'Functional Requirements',
      orderIndex: 0,
      isExpanded: true,
    },
    {
      id: uuidv4(),
      sheetId: sheet.id,
      name: 'Non-Functional Requirements',
      orderIndex: 1,
      isExpanded: true,
    },
    {
      id: uuidv4(),
      sheetId: sheet.id,
      name: 'Business Requirements',
      orderIndex: 2,
      isExpanded: true,
    }
  ];
  
  // Empty rows array
  sheet.rows = [];
  
  return sheet;
};

/**
 * Template definitions for the template selector
 */
export const templates = [
  {
    id: 'empty',
    name: 'Prázdný projekt',
    description: 'Začněte s čistým listem',
    data: createEmptySheet(),
  },
  {
    id: 'project-tasks',
    name: 'Projektové úkoly',
    description: 'Pro sledování projektových úkolů a jejich stavu',
    data: createProjectTaskSheet(),
  },
  {
    id: 'team-schedule',
    name: 'Rozvrh týmu',
    description: 'Pro sledování dostupnosti členů týmu',
    data: createTeamScheduleSheet(),
  },
  {
    id: 'requirements-template',
    name: 'Požadavky',
    description: 'Pro sledování a správu požadavků',
    data: createRequirementsSheet(),
  }
];

/**
 * Creates a sheet from a selected template
 * @param templateId ID of the template to use
 * @returns A new sheet instance based on the template
 */
export const createSheetFromTemplate = (templateId: string): SheetData => {
  // Find the template by ID
  const template = templates.find(t => t.id === templateId);
  
  // If template not found, return empty sheet
  if (!template) {
    console.warn(`Template with ID ${templateId} not found, using empty sheet instead.`);
    return createEmptySheet();
  }
  
  // Create a deep copy of the template data to avoid reference issues
  // This ensures each new sheet has unique IDs and references
  const templateData = template.data;
  const newSheet: SheetData = {
    ...templateData,
    id: uuidv4(), // Always generate a new unique ID
  };
  
  // Return the new sheet based on the template
  return newSheet;
};

/**
 * Migrates template data to the database
 * This function should be called when the backend is available
 * @param client SpacetimeDB client to use for migration
 */
export const migrateTemplatesToDatabase = async (client: any) => {
  try {
    console.info('Starting migration of templates to the database...');
    
    // First check if templates already exist in the database
    const existingTemplates = await client.getTemplates();
    
    if (existingTemplates && existingTemplates.length > 0) {
      console.info('Templates already exist in the database, skipping migration.');
      return;
    }
    
    // Migrate each template
    for (const template of templates) {
      console.info(`Migrating template: ${template.name}`);
      await client.createTemplate({
        id: template.id,
        name: template.name,
        description: template.description,
        data: JSON.stringify(template.data)
      });
    }
    
    console.info('Template migration completed successfully.');
  } catch (error) {
    console.error('Error migrating templates to database:', error);
    throw new Error('Template migration failed');
  }
};

/**
 * Loads templates from the database if available, otherwise uses local templates
 * @param client SpacetimeDB client to use for loading
 * @returns Array of templates
 */
export const loadTemplates = async (client: any) => {
  try {
    // Try to load from database first
    const dbTemplates = await client.getTemplates();
    
    if (dbTemplates && dbTemplates.length > 0) {
      console.info('Loaded templates from database');
      return dbTemplates.map((dbTemplate: any) => ({
        ...dbTemplate,
        data: typeof dbTemplate.data === 'string' 
          ? JSON.parse(dbTemplate.data)
          : dbTemplate.data
      }));
    }
    
    // Fallback to local templates
    console.info('Using local templates (database templates not available)');
    return templates;
  } catch (error) {
    console.warn('Error loading templates from database, using local fallback:', error);
    return templates;
  }
};
