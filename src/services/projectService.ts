
import { SPACETIME_CONFIG } from "@/config/spaceTimeConfig";
import { Project } from "@/types/project";
import { SheetData } from "@/types/sheet";

// Local storage keys
const PROJECTS_KEY = "sheet-editor-projects";
const SHEETS_KEY = "sheet-editor-sheets";

// Helper to generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Initial sample data for demonstration
const getSampleProjects = (): Project[] => [
  {
    id: "proj-1",
    name: "Marketing Campaign",
    description: "Q2 2023 marketing campaign planning",
    createdAt: new Date(2023, 3, 15),
    updatedAt: new Date(2023, 5, 20),
    sheetId: "sheet-1"
  },
  {
    id: "proj-2",
    name: "Product Roadmap",
    description: "Product feature planning for next release",
    createdAt: new Date(2023, 1, 10),
    updatedAt: new Date(2023, 6, 5),
    sheetId: "sheet-2"
  },
  {
    id: "proj-3",
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

// SpaceTimeDB integration placeholder - to be implemented
// This would be replaced with actual SpaceTimeDB implementation
export const syncWithSpaceTimeDB = () => {
  console.log("Syncing with SpaceTimeDB...");
  // Actual implementation would go here
};


class SpaceTimeClient {
  private apiUrl: string;
  private apiKey: string;
  private projectId: string;

  constructor() {
    this.apiUrl = SPACETIME_CONFIG.API_URL;
    this.apiKey = SPACETIME_CONFIG.API_KEY;
    this.projectId = SPACETIME_CONFIG.PROJECT_ID;
  }

  private async request<T>(endpoint: string, method: string = 'GET', data?: any): Promise<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-SpaceTime-Project': this.projectId,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`SpaceTimeDB API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  }

  // Projekty
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('projects');
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`projects/${id}`);
  }

  async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    return this.request<Project>('projects', 'POST', project);
  }

  async updateProject(project: Project): Promise<Project> {
    return this.request<Project>(`projects/${project.id}`, 'PUT', project);
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`projects/${id}`, 'DELETE');
  }

  // Sheets
  async getSheetData(sheetId: string): Promise<SheetData> {
    return this.request<SheetData>(`sheets/${sheetId}`);
  }

  async saveSheetData(sheetId: string, data: SheetData): Promise<void> {
    return this.request<void>(`sheets/${sheetId}`, 'PUT', data);
  }

  // Synchronizace
  async sync(): Promise<void> {
    return this.request<void>('sync', 'POST');
  }
}


export const spaceTimeClient = new SpaceTimeClient();

export const getProjectsFromCloud = () => spaceTimeClient.getProjects();
export const getProjectFromCloud = (id: string) => spaceTimeClient.getProject(id);
export const createProjectInCloud = (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => spaceTimeClient.createProject(project);
export const updateProjectInCloud = (project: Project) => spaceTimeClient.updateProject(project);
export const deleteProjectFromCloud = (id: string) => spaceTimeClient.deleteProject(id);
export const getSheetDataFromCloud = (sheetId: string) => spaceTimeClient.getSheetData(sheetId);
export const saveSheetDataToCloud = (sheetId: string, data: SheetData) => spaceTimeClient.saveSheetData(sheetId, data);
export const syncWithCloud = () => spaceTimeClient.sync();
