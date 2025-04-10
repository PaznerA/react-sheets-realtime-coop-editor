// src/services/spaceTimeService.ts
import { SPACETIME_CONFIG } from "@/config/spaceTimeConfig";
import { Project } from "@/types/project";
import { SheetData } from "@/types/sheet";

// Základní třída pro SpaceTimeDB API
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

// Export jednotlivých funkcí pro snadnější použití
export const getProjectsFromCloud = () => spaceTimeClient.getProjects();
export const getProjectFromCloud = (id: string) => spaceTimeClient.getProject(id);
export const createProjectInCloud = (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => spaceTimeClient.createProject(project);
export const updateProjectInCloud = (project: Project) => spaceTimeClient.updateProject(project);
export const deleteProjectFromCloud = (id: string) => spaceTimeClient.deleteProject(id);
export const getSheetDataFromCloud = (sheetId: string) => spaceTimeClient.getSheetData(sheetId);
export const saveSheetDataToCloud = (sheetId: string, data: SheetData) => spaceTimeClient.saveSheetData(sheetId, data);
export const syncWithCloud = () => spaceTimeClient.sync();