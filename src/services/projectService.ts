
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
