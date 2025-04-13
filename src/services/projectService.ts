
import { SPACETIME_CONFIG } from "@/config/spaceTimeConfig";
import { Project } from "@/types/project";
import { SheetData } from "@/types/sheet";
import { getSampleProjects, createEmptySheet } from "@/data/sampleData";

// Local storage keys
const PROJECTS_KEY = "sheet-editor-projects";
const SHEETS_KEY = "sheet-editor-sheets";
const USE_CLOUD_KEY = "sheet-editor-use-cloud";

// Helper to generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Initialize local storage with sample data if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem(PROJECTS_KEY)) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(getSampleProjects()));
  }
};

// Project methods
export const getProjects = (): Project[] => {
  initializeLocalStorage();
  const projects = localStorage.getItem(PROJECTS_KEY);
  return projects ? JSON.parse(projects) : [];
};

export const getProject = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
};

export const createProject = (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project => {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify([...projects, newProject]));
  return newProject;
};

export const updateProject = (project: Project): Project => {
  const projects = getProjects();
  const updatedProjects = projects.map(p => 
    p.id === project.id ? { ...project, updatedAt: new Date() } : p
  );
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
  return { ...project, updatedAt: new Date() };
};

export const deleteProject = (id: string): void => {
  const projects = getProjects();
  const filteredProjects = projects.filter(project => project.id !== id);
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(filteredProjects));
};

// Sheet data methods
export const getSheetData = (sheetId: string): SheetData | undefined => {
  const sheetsData = localStorage.getItem(SHEETS_KEY);
  const sheets = sheetsData ? JSON.parse(sheetsData) : {};
  return sheets[sheetId] || createEmptySheet();
};

export const saveSheetData = (sheetId: string, data: SheetData): void => {
  const sheetsData = localStorage.getItem(SHEETS_KEY);
  const sheets = sheetsData ? JSON.parse(sheetsData) : {};
  
  sheets[sheetId] = data;
  localStorage.setItem(SHEETS_KEY, JSON.stringify(sheets));
};

// SpaceTimeDB integration
import { DbConnection } from '../module_bindings';

// Initialize SpaceTimeDB client
export const initSpacetimeDB = async (
  host: string, 
  namespace: string,
  onConnected?: () => void,
  onDisconnected?: () => void,
) => {
  try {
    console.log(`Attempting to connect to SpaceTimeDB at ${host}/${namespace}`);
    
    // Connect to SpaceTimeDB
    const connection = await (DbConnection.builder() as any).build({
      host,
      namespace,
      clientId: "spacetime-sheet-" + Math.random().toString(36).substring(2, 9),
      onConnect: () => {
        console.log("Connected to SpaceTimeDB");
        if (onConnected) onConnected();
      },
      onDisconnect: () => {
        console.log("Disconnected from SpaceTimeDB");
        if (onDisconnected) onDisconnected();
      },
    });
    
    // Save connection to global context for use in other parts of the application
    window.spacetimedb = connection;
    
    return true;
  } catch (error) {
    console.error("Error connecting to SpaceTimeDB:", error);
    return false;
  }
};

// Extend Window interface for type safety
declare global {
  interface Window {
    spacetimedb: any;
  }
}

// SpaceTimeClient class
class SpaceTimeClient {
  // Projects
  async getProjects(): Promise<Project[]> {
    if (!window.spacetimedb) {
      return getProjects();
    }

    try {
      // Get projects from SpaceTimeDB
      const projects: Project[] = [];
      window.spacetimedb.tables.project().forEach((proj: any) => {
        projects.push({
          id: proj.Id,
          unitId: proj.UnitId,
          name: proj.Name,
          description: proj.Description,
          createdAt: new Date(Number(proj.CreatedAt)),
          updatedAt: new Date(Number(proj.UpdatedAt)),
          sheetId: "" // This will need to be filled in with your logic
        });
      });
      return projects;
    } catch (error) {
      console.error("Error fetching projects from SpaceTimeDB:", error);
      return getProjects(); // Fallback to local data
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    if (!window.spacetimedb) {
      return getProject(id);
    }

    try {
      // Alternatively you can implement searching in SpaceTimeDB
      return getProject(id);
    } catch (error) {
      console.error(`Error fetching project ${id} from SpaceTimeDB:`, error);
      return getProject(id);
    }
  }

  async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    try {
      if (window.spacetimedb) {
        // Call SpaceTimeDB reducer to create project
        window.spacetimedb.reducers.createProject(
          project.unitId || "", // unitId
          project.name,         // name
          project.description   // description
        );
      }
      
      // Create project locally as well for immediate UI response
      return createProject(project);
    } catch (error) {
      console.error("Error creating project in SpaceTimeDB:", error);
      throw error;
    }
  }

  async updateProject(project: Project): Promise<Project> {
    try {
      if (window.spacetimedb) {
        // Call SpaceTimeDB reducer to update project
        window.spacetimedb.reducers.updateProject(
          project.id,         // id
          project.name,       // name
          project.description // description
        );
      }
      
      // Update locally
      return updateProject(project);
    } catch (error) {
      console.error("Error updating project in SpaceTimeDB:", error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      if (window.spacetimedb) {
        // Call SpaceTimeDB reducer to delete project
        window.spacetimedb.reducers.deleteProject(id);
      }
      
      // Delete locally
      deleteProject(id);
    } catch (error) {
      console.error("Error deleting project in SpaceTimeDB:", error);
      throw error;
    }
  }

  // Sheets
  async getSheetData(sheetId: string): Promise<SheetData | undefined> {
    // Implementation using SpaceTimeDB will be more complex
    return getSheetData(sheetId);
  }

  async saveSheetData(sheetId: string, data: SheetData): Promise<void> {
    try {
      // Implementation for saving data to SpaceTimeDB
      // This will require more complex logic for rows, cells, etc.
      
      // For now use local implementation
      saveSheetData(sheetId, data);
    } catch (error) {
      console.error("Error saving sheet data in SpaceTimeDB:", error);
      throw error;
    }
  }

  // Synchronization
  async sync(): Promise<void> {
    console.log("Synchronizing with SpaceTimeDB...");
    // If connected to SpaceTimeDB, data will sync automatically
    if (!window.spacetimedb) {
      console.warn("Not connected to SpaceTimeDB, can't synchronize");
    }
  }
}

export const spaceTimeClient = new SpaceTimeClient();

// Exported functions for frontend use
export const updateProjectInCloud = (project: Project) => spaceTimeClient.updateProject(project);
export const deleteProjectFromCloud = (id: string) => spaceTimeClient.deleteProject(id);
export const getSheetDataFromCloud = (sheetId: string) => spaceTimeClient.getSheetData(sheetId);
export const saveSheetDataToCloud = (sheetId: string, data: SheetData) => spaceTimeClient.saveSheetData(sheetId, data);
export const syncWithCloud = () => spaceTimeClient.sync();

// Settings for cloud usage
export const isUsingCloud = (): boolean => {
  const useCloud = localStorage.getItem(USE_CLOUD_KEY);
  return useCloud ? JSON.parse(useCloud) : false;
};

export const setUseCloud = (useCloud: boolean): void => {
  localStorage.setItem(USE_CLOUD_KEY, JSON.stringify(useCloud));
};
