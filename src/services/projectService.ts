import { SPACETIME_CONFIG } from "@/config/spaceTimeConfig";
import { Project } from "@/types/project";
import { SheetData } from "@/types/sheet";

// Local storage keys
const PROJECTS_KEY = "sheet-editor-projects";
const SHEETS_KEY = "sheet-editor-sheets";
const USE_CLOUD_KEY = "sheet-editor-use-cloud";

// Helper to generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Initial sample data for demonstration
const getSampleProjects = (): Project[] => [
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
  return sheets[sheetId];
};

export const saveSheetData = (sheetId: string, data: SheetData): void => {
  const sheetsData = localStorage.getItem(SHEETS_KEY);
  const sheets = sheetsData ? JSON.parse(sheetsData) : {};
  
  sheets[sheetId] = data;
  localStorage.setItem(SHEETS_KEY, JSON.stringify(sheets));
};

// SpaceTimeDB integration
import { DbConnection } from '../module_bindings';

// Inicializace SpaceTimeDB klienta
export const initSpacetimeDB = async (
  host: string, 
  namespace: string,
  onConnected?: () => void,
  onDisconnected?: () => void,
) => {
  try {
    console.log(`Attempting to connect to SpaceTimeDB at ${host}/${namespace}`);
    
    // Připojení k SpaceTimeDB - použijeme any aby se TypeScript nerozčiloval
    // Vygenerované API se může lišit od dokumentace, proto používáme tento přístup
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
    
    // Uložení spojení do globálního kontextu pro použití v ostatních částech aplikace
    window.spacetimedb = connection;
    
    return true;
  } catch (error) {
    console.error("Error connecting to SpaceTimeDB:", error);
    return false;
  }
};

// Rozšíření Window interface pro typovou bezpečnost
declare global {
  interface Window {
    spacetimedb: any;
  }
}

// Nahrazuje původní SpaceTimeClient
class SpaceTimeClient {
  // Projekty
  async getProjects(): Promise<Project[]> {
    if (!window.spacetimedb) {
      return getProjects();
    }

    try {
      // Získání projektů ze SpaceTimeDB
      const projects: Project[] = [];
      window.spacetimedb.tables.project().forEach((proj: any) => {
        projects.push({
          id: proj.Id,
          unitId: proj.UnitId,
          name: proj.Name,
          description: proj.Description,
          createdAt: new Date(Number(proj.CreatedAt)),
          updatedAt: new Date(Number(proj.UpdatedAt)),
          sheetId: "" // Toto bude potřeba doplnit podle vaší logiky
        });
      });
      return projects;
    } catch (error) {
      console.error("Error fetching projects from SpaceTimeDB:", error);
      return getProjects(); // Fallback na lokální data
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    if (!window.spacetimedb) {
      return getProject(id);
    }

    try {
      // Alternativně můžete implementovat vyhledávání v SpaceTimeDB
      return getProject(id);
    } catch (error) {
      console.error(`Error fetching project ${id} from SpaceTimeDB:`, error);
      return getProject(id);
    }
  }

  async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    try {
      if (window.spacetimedb) {
        // Volání SpaceTimeDB reduceru pro vytvoření projektu
        window.spacetimedb.reducers.createProject(
          project.unitId || "", // unitId
          project.name,         // name
          project.description   // description
        );
      }
      
      // Lokálně vytvoříme projekt i když používáme SpaceTimeDB
      // To zajistí okamžitou odezvu UI, i když čekáme na potvrzení ze serveru
      return createProject(project);
    } catch (error) {
      console.error("Error creating project in SpaceTimeDB:", error);
      throw error;
    }
  }

  async updateProject(project: Project): Promise<Project> {
    try {
      if (window.spacetimedb) {
        // Volání SpaceTimeDB reduceru pro aktualizaci projektu
        window.spacetimedb.reducers.updateProject(
          project.id,         // id
          project.name,       // name
          project.description // description
        );
      }
      
      // Aktualizujeme lokálně
      return updateProject(project);
    } catch (error) {
      console.error("Error updating project in SpaceTimeDB:", error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      if (window.spacetimedb) {
        // Volání SpaceTimeDB reduceru pro smazání projektu
        window.spacetimedb.reducers.deleteProject(id);
      }
      
      // Smažeme lokálně
      deleteProject(id);
    } catch (error) {
      console.error("Error deleting project in SpaceTimeDB:", error);
      throw error;
    }
  }

  // Sheets
  async getSheetData(sheetId: string): Promise<SheetData | undefined> {
    // Implementace pomocí SpacetimeDB bude složitější, 
    // protože potřebujeme získat sloupce, řádky a buňky
    return getSheetData(sheetId);
  }

  async saveSheetData(sheetId: string, data: SheetData): Promise<void> {
    try {
      // Implementace uložení dat do SpaceTimeDB
      // Zde bude složitější logika, která bude muset uložit řádky, buňky, atd.
      
      // Pro teď použijeme lokální implementaci
      saveSheetData(sheetId, data);
    } catch (error) {
      console.error("Error saving sheet data in SpaceTimeDB:", error);
      throw error;
    }
  }

  // Synchronizace
  async sync(): Promise<void> {
    console.log("Synchronizing with SpaceTimeDB...");
    // Pokud jsme připojeni k SpaceTimeDB, data se synchronizují automaticky
    if (!window.spacetimedb) {
      console.warn("Not connected to SpaceTimeDB, can't synchronize");
    }
  }
}

export const spaceTimeClient = new SpaceTimeClient();

// Exportované funkce pro použití ve front-endu
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
