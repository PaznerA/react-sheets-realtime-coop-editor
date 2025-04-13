export interface Project {
  id: string;
  unitId: string; // Projekt patří do organizační jednotky
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sheet patřící do projektu
export interface Sheet {
  id: string;
  projectId: string;
  name: string;
  description: string;
  type: string; // Typ sheetu ('schedule', 'budget', 'resources', etc.)
  createdAt: Date;
  updatedAt: Date;
}
