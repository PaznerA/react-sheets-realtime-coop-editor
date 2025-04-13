import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for the identity management
export interface Identity {
  userId: string;
  activeUnitId: string | null;
}

// Interface for our client that will call SpacetimeDB reducers
interface SpacetimeClient {
  // Core reducers
  createUser: (email: string, name: string, password: string) => Promise<any>;
  createUnit: (name: string, description: string, userId: string) => Promise<any>;
  addUserToUnit: (unitId: string, userId: string, role: string) => Promise<any>;
  
  // Project reducers
  createProject: (unitId: string, name: string, description: string) => Promise<any>;
  updateProject: (id: string, name: string, description: string) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
  
  // Sheet reducers
  createSheet: (projectId: string, name: string, description: string, type: string, columnsJson: string) => Promise<any>;
  updateSheet: (id: string, name: string, description: string, type: string, columnsJson: string) => Promise<any>;
  deleteSheet: (id: string) => Promise<any>;
  
  // Row reducers
  createRow: (sheetId: string, groupId: string, orderIndex: number) => Promise<any>;
  
  // Cell reducers
  updateCell: (rowId: string, columnId: string, value: string, format: string) => Promise<any>;
  
  // Savepoint reducers
  createSavepoint: (sheetId: string, message: string) => Promise<string>;
  getSavepoints: (sheetId: string) => Promise<any>;
  revertToSavepoint: (savepointId: string) => Promise<any>;
  
  // Enum reducers
  createEnum: (unitId: string, name: string, description: string) => Promise<any>;
  addEnumItem: (enumId: string, value: string, label: string, color: string, orderIndex: number) => Promise<any>;
  deleteEnum: (id: string) => Promise<any>;
  
  // Optimized reducers 
  getEnumOptions: (enumId: string) => Promise<any>;
  getAllEnumsForUnit: (unitId: string) => Promise<any>;
  updateMultipleCells: (cellUpdates: Array<{rowId: string, columnId: string, value: string, format?: string}>) => Promise<any>;
  getProjectList: (unitId: string, sheetIdsForData: string[], columnMapping: Record<string, string>) => Promise<any>;
  getSheetData: (sheetId: string) => Promise<any>;
}

// Helper to create mock client - will be replaced with actual SpacetimeDB client
class MockClient implements SpacetimeClient {
  private mockReducer: (name: string, ...args: any[]) => Promise<any>;
  private waitForQueryResult: (queryId: string) => Promise<any>;

  constructor() {
    this.mockReducer = async (name: string, ...args: any[]) => {
      console.log(`Mock client called ${name} with args:`, args);
      // For now, just log and return an empty successful response
      return { success: true };
    };

    this.waitForQueryResult = async (queryId: string) => {
      // Simulate waiting for query result
      await new Promise(resolve => setTimeout(resolve, 100));
      return { StatusCode: 200, JsonData: '{}' };
    };
  }

  // Core reducers
  createUser(email: string, name: string, password: string): Promise<any> {
    return this.mockReducer('CreateUser', email, name, password);
  }

  createUnit(name: string, description: string, userId: string): Promise<any> {
    return this.mockReducer('CreateUnit', name, description, userId);
  }

  addUserToUnit(unitId: string, userId: string, role: string): Promise<any> {
    return this.mockReducer('AddUserToUnit', unitId, userId, role);
  }

  // Project reducers
  createProject(unitId: string, name: string, description: string): Promise<any> {
    return this.mockReducer('CreateProject', unitId, name, description);
  }

  updateProject(id: string, name: string, description: string): Promise<any> {
    return this.mockReducer('UpdateProject', id, name, description);
  }

  deleteProject(id: string): Promise<any> {
    return this.mockReducer('DeleteProject', id);
  }

  // Sheet reducers
  createSheet(projectId: string, name: string, description: string, type: string, columnsJson: string): Promise<any> {
    return this.mockReducer('CreateSheet', projectId, name, description, type, columnsJson);
  }

  updateSheet(id: string, name: string, description: string, type: string, columnsJson: string): Promise<any> {
    return this.mockReducer('UpdateSheet', id, name, description, type, columnsJson);
  }

  deleteSheet(id: string): Promise<any> {
    return this.mockReducer('DeleteSheet', id);
  }

  // Row reducers
  createRow(sheetId: string, groupId: string, orderIndex: number): Promise<any> {
    return this.mockReducer('CreateRow', sheetId, groupId, orderIndex);
  }

  // Cell reducers
  updateCell(rowId: string, columnId: string, value: string, format: string): Promise<any> {
    return this.mockReducer('UpdateCell', rowId, columnId, value, format);
  }

  // Savepoint reducers
  async createSavepoint(sheetId: string, message: string): Promise<string> {
    const queryId = uuidv4();
    console.log(`Creating savepoint for sheet ${sheetId} with message: ${message}`);
    
    // V produkci by zde byl skutečný SpacetimeDB call
    await this.mockReducer("CreateSavepoint", [sheetId, message, "current-user", queryId]);
    
    // Počkat na výsledek
    const result = await this.waitForQueryResult(queryId);
    if (result.StatusCode !== 200) {
      throw new Error(result.ErrorMessage || 'Failed to create savepoint');
    }
    
    try {
      const data = JSON.parse(result.JsonData);
      return data.SavepointId;
    } catch (error) {
      console.error('Error parsing savepoint data:', error);
      throw new Error('Failed to parse savepoint response');
    }
  }

  async getSavepoints(sheetId: string): Promise<{ 
    savepoints: Array<{
      id: string;
      sheetId: string;
      createdAt: number;
      message: string;
      createdByUserId: string;
      timestampAlias: string;
    }>;
    currentSavepointId: string;
  }> {
    const queryId = uuidv4();
    console.log(`Getting savepoints for sheet ${sheetId}`);
    
    // V produkci by zde byl skutečný SpacetimeDB call
    await this.mockReducer("GetSavepoints", [sheetId, queryId]);
    
    // Počkat na výsledek
    const result = await this.waitForQueryResult(queryId);
    if (result.StatusCode !== 200) {
      throw new Error(result.ErrorMessage || 'Failed to get savepoints');
    }
    
    try {
      const data = JSON.parse(result.JsonData);
      return {
        savepoints: data.Savepoints,
        currentSavepointId: data.CurrentSavepointId
      };
    } catch (error) {
      console.error('Error parsing savepoints data:', error);
      throw new Error('Failed to parse savepoints response');
    }
  }

  async revertToSavepoint(savepointId: string): Promise<boolean> {
    const queryId = uuidv4();
    console.log(`Reverting to savepoint ${savepointId}`);
    
    // V produkci by zde byl skutečný SpacetimeDB call
    await this.mockReducer("RevertToSavepoint", [savepointId, queryId]);
    
    // Počkat na výsledek
    const result = await this.waitForQueryResult(queryId);
    if (result.StatusCode !== 200) {
      throw new Error(result.ErrorMessage || 'Failed to revert to savepoint');
    }
    
    try {
      const data = JSON.parse(result.JsonData);
      return data.Success === true;
    } catch (error) {
      console.error('Error parsing revert response:', error);
      throw new Error('Failed to parse revert response');
    }
  }

  // Enum reducers
  createEnum(unitId: string, name: string, description: string): Promise<any> {
    return this.mockReducer('CreateEnum', unitId, name, description);
  }

  addEnumItem(enumId: string, value: string, label: string, color: string, orderIndex: number): Promise<any> {
    return this.mockReducer('AddEnumItem', enumId, value, label, color, orderIndex);
  }

  deleteEnum(id: string): Promise<any> {
    return this.mockReducer('DeleteEnum', id);
  }

  // Optimized reducers 
  getEnumOptions(enumId: string): Promise<any> {
    return this.mockReducer('GetEnumOptions', enumId);
  }

  getAllEnumsForUnit(unitId: string): Promise<any> {
    return this.mockReducer('GetAllEnumsForUnit', unitId);
  }

  updateMultipleCells(cellUpdates: Array<{rowId: string, columnId: string, value: string, format?: string}>): Promise<any> {
    return this.mockReducer('UpdateMultipleCells', cellUpdates);
  }

  getProjectList(unitId: string, sheetIdsForData: string[], columnMapping: Record<string, string>): Promise<any> {
    return this.mockReducer('GetProjectList', unitId, sheetIdsForData, columnMapping);
  }

  getSheetData(sheetId: string): Promise<any> {
    return this.mockReducer('GetSheetData', sheetId);
  }
}

// Create the React contexts
const ClientContext = createContext<SpacetimeClient | null>(null);
const IdentityContext = createContext<Identity | null>(null);

// Provider component to manage the client
export const SpacetimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client] = useState<SpacetimeClient>(new MockClient());
  const [identity, setIdentity] = useState<Identity | null>(null);

  // In a real app, we'd initialize the client and identity from SpacetimeDB here
  useEffect(() => {
    // For demo, create a mock identity
    setIdentity({
      userId: 'user-1',
      activeUnitId: 'unit-1'
    });
  }, []);

  return (
    <ClientContext.Provider value={client}>
      <IdentityContext.Provider value={identity}>
        {children}
      </IdentityContext.Provider>
    </ClientContext.Provider>
  );
};

// Custom hooks to access the client and identity
export const useClient = () => useContext(ClientContext);
export const useIdentity = () => useContext(IdentityContext);

// Hook pro snadnější použití v komponentách
export const useSpacetime = () => {
  const client = useContext(ClientContext);
  
  if (!client) {
    throw new Error("useSpacetime musí být použit uvnitř SpacetimeProvider");
  }
  
  return client;
};
