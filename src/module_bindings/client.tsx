import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as moduleBindings from './index';

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

// Real SpacetimeDB client implementation
class SpacetimeDBClient implements SpacetimeClient {
  private dbConnection: any;
  private userId: string;
  private queryResultListeners: Map<string, (result: any) => void>;
  
  constructor() {
    this.queryResultListeners = new Map();
    this.userId = localStorage.getItem('userId') || '';
  }
  
  async connect(address: string, namespace: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // Use the DbConnection builder from the generated moduleBindings
        this.dbConnection = moduleBindings.DbConnection.builder()
          .withUri(address)
          .withModuleName(namespace)
          .onConnect((connection: any, identity: any, token: string) => {
            console.log('Connected to SpacetimeDB', { identity });
            localStorage.setItem('spacetimeToken', token);
            resolve({ success: true, identity, token });
          })
          .onConnectError((ctx: any, error: Error) => {
            console.error('Connection error:', error);
            reject(error);
          })
          .onDisconnect((ctx: any, error: Error | null) => {
            console.log('Disconnected from SpacetimeDB', error);
          })
          .build();

        // Set up subscription for QueryResult table
        const subscriptionBuilder = this.dbConnection.subscriptionBuilder();
        subscriptionBuilder.subscribe(["SELECT * FROM QueryResult"]);

        // Setup listener for QueryResult table updates
        this.dbConnection.db.queryResult.onInsert((ctx: any, row: any) => {
          if (row.QueryId && this.queryResultListeners.has(row.QueryId)) {
            const callback = this.queryResultListeners.get(row.QueryId);
            if (callback) callback(row);
          }
        });
      } catch (err) {
        console.error('Failed to connect to SpacetimeDB:', err);
        reject(err);
      }
    });
  }
  
  // Helper to call a reducer and return a promise
  private async callReducer(name: string, ...args: any[]): Promise<any> {
    if (!this.dbConnection) {
      throw new Error('SpacetimeDB client not connected');
    }
    
    return new Promise((resolve, reject) => {
      try {
        console.log(`Calling reducer ${name} with args:`, args);
        // Use the reducers field from DbConnection
        this.dbConnection.reducers[name](...args);
        resolve({ success: true });
      } catch (err) {
        console.error(`Error calling reducer ${name}:`, err);
        reject(err);
      }
    });
  }
  
  // Helper to call a reducer that returns a result via QueryResult table
  private async callReducerWithResult(name: string, ...args: any[]): Promise<any> {
    if (!this.dbConnection) {
      throw new Error('SpacetimeDB client not connected');
    }
    
    const queryId = uuidv4();
    
    return new Promise((resolve, reject) => {
      // Setup a timeout to reject the promise if no response is received
      const timeoutId = setTimeout(() => {
        this.queryResultListeners.delete(queryId);
        reject(new Error(`Timeout waiting for ${name} result`));
      }, 10000); // 10 seconds timeout
      
      // Set up the listener for this query
      this.queryResultListeners.set(queryId, (result) => {
        clearTimeout(timeoutId);
        this.queryResultListeners.delete(queryId);
        
        if (result.StatusCode >= 400) {
          reject(new Error(result.ErrorMessage || `Error ${result.StatusCode} from ${name}`));
        } else {
          try {
            // Parse the JSON data if it exists
            const jsonData = result.JsonData ? JSON.parse(result.JsonData) : {};
            resolve({
              ...result,
              data: jsonData
            });
          } catch (err) {
            reject(new Error(`Failed to parse result from ${name}: ${err}`));
          }
        }
      });
      
      // Call the reducer with the queryId
      try {
        const reducerArgs = [...args, queryId];
        this.dbConnection.reducers[name](...reducerArgs);
      } catch (err) {
        clearTimeout(timeoutId);
        this.queryResultListeners.delete(queryId);
        reject(err);
      }
    });
  }

  // Core reducers
  createUser(email: string, name: string, password: string): Promise<any> {
    return this.callReducer('CreateUser', email, name, password);
  }

  createUnit(name: string, description: string, userId: string): Promise<any> {
    return this.callReducer('CreateUnit', name, description, userId);
  }

  addUserToUnit(unitId: string, userId: string, role: string): Promise<any> {
    return this.callReducer('AddUserToUnit', unitId, userId, role);
  }

  // Project reducers
  createProject(unitId: string, name: string, description: string): Promise<any> {
    return this.callReducer('CreateProject', unitId, name, description);
  }

  updateProject(id: string, name: string, description: string): Promise<any> {
    return this.callReducer('UpdateProject', id, name, description);
  }

  deleteProject(id: string): Promise<any> {
    return this.callReducer('DeleteProject', id);
  }

  // Sheet reducers
  createSheet(projectId: string, name: string, description: string, type: string, columnsJson: string): Promise<any> {
    return this.callReducer('CreateSheet', projectId, name, description, type, columnsJson);
  }

  updateSheet(id: string, name: string, description: string, type: string, columnsJson: string): Promise<any> {
    return this.callReducer('UpdateSheet', id, name, description, type, columnsJson);
  }

  deleteSheet(id: string): Promise<any> {
    return this.callReducer('DeleteSheet', id);
  }

  // Row reducers
  createRow(sheetId: string, groupId: string, orderIndex: number): Promise<any> {
    return this.callReducer('CreateRow', sheetId, groupId, orderIndex);
  }

  // Cell reducers
  updateCell(rowId: string, columnId: string, value: string, format: string): Promise<any> {
    return this.callReducer('UpdateCell', rowId, columnId, value, format);
  }

  // Savepoint reducers
  async createSavepoint(sheetId: string, message: string): Promise<string> {
    const result = await this.callReducerWithResult('CreateSavepoint', sheetId, message, this.userId);
    return result.data?.SavepointId || '';
  }

  async getSavepoints(sheetId: string): Promise<any> {
    const result = await this.callReducerWithResult('GetSavepoints', sheetId);
    return result.data?.Savepoints || [];
  }

  async revertToSavepoint(savepointId: string): Promise<any> {
    const result = await this.callReducerWithResult('RevertToSavepoint', savepointId);
    return result.data;
  }

  // Enum reducers
  createEnum(unitId: string, name: string, description: string): Promise<any> {
    return this.callReducer('CreateEnum', unitId, name, description);
  }

  addEnumItem(enumId: string, value: string, label: string, color: string, orderIndex: number): Promise<any> {
    return this.callReducer('AddEnumItem', enumId, value, label, color, orderIndex);
  }

  deleteEnum(id: string): Promise<any> {
    return this.callReducer('DeleteEnum', id);
  }

  // Optimized reducers
  async getEnumOptions(enumId: string): Promise<any> {
    const queryId = uuidv4();
    const result = await this.callReducerWithResult('GetEnumOptions', enumId, queryId);
    return result.data || [];
  }

  async getAllEnumsForUnit(unitId: string): Promise<any> {
    const queryId = uuidv4();
    await this.callReducerWithResult('GetAllEnumsForUnit', unitId, queryId);
    
    // Here we need to collect all the enum data from multiple QueryResult entries
    // This would need additional implementation to aggregate the results
    // For now return empty result
    return { enums: [], items: {} };
  }

  updateMultipleCells(cellUpdates: Array<{rowId: string, columnId: string, value: string, format?: string}>): Promise<any> {
    const cellUpdatesJson = JSON.stringify(cellUpdates);
    return this.callReducer('UpdateMultipleCells', cellUpdatesJson);
  }

  async getProjectList(unitId: string, sheetIdsForData: string[], columnMapping: Record<string, string>): Promise<any> {
    const queryId = uuidv4();
    const sheetIdsJson = JSON.stringify(sheetIdsForData);
    const columnMappingJson = JSON.stringify(
      Object.entries(columnMapping).map(([key, value]) => ({ Key: key, Value: value }))
    );
    
    const result = await this.callReducerWithResult('GetProjectList', unitId, sheetIdsJson, columnMappingJson, queryId);
    return result.data?.Savepoints || [];
  }

  async getSheetData(sheetId: string): Promise<any> {
    const queryId = uuidv4();
    await this.callReducerWithResult('GetSheetData', sheetId, queryId);
    
    // This is a complex query that returns multiple results
    // Would need additional implementation to aggregate all the QueryResult entries
    // For now return empty result
    return {
      sheet: {},
      groups: [],
      rows: [],
      cells: {}
    };
  }
}

// Create the React contexts
const ClientContext = createContext<SpacetimeClient | null>(null);
const IdentityContext = createContext<Identity | null>(null);

// Provider component to manage the client
export const SpacetimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<SpacetimeClient | null>(null);
  const [identity, setIdentity] = useState<Identity>({
    userId: localStorage.getItem('userId') || '',
    activeUnitId: localStorage.getItem('activeUnitId') || null
  });
  
  useEffect(() => {
    const initClient = async () => {
      try {
        // Get address and namespace from env vars or use defaults
        const address = import.meta.env.VITE_SPACETIME_ADDRESS || 'http://localhost:3000';
        const namespace = import.meta.env.VITE_SPACETIME_NAMESPACE || 'spacetime_sheets';
        
        const spacetimeClient = new SpacetimeDBClient();
        const result = await spacetimeClient.connect(address, namespace);
        
        // Update the identity if we received it from the connection
        if (result?.identity) {
          setIdentity({
            ...identity,
            userId: result.identity
          });
        }
        
        setClient(spacetimeClient);
        console.log('Connected to SpacetimeDB');
      } catch (err) {
        console.error('Failed to initialize SpacetimeDB client:', err);
        // Create a client anyway for local development fallback
        setClient(new SpacetimeDBClient());
      }
    };
    
    initClient();
  }, []);
  
  // Update localStorage when identity changes
  useEffect(() => {
    if (identity.userId) {
      localStorage.setItem('userId', identity.userId);
    }
    if (identity.activeUnitId) {
      localStorage.setItem('activeUnitId', identity.activeUnitId);
    }
  }, [identity]);
  
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
  const client = useClient();
  const identity = useIdentity();
  
  if (!client) {
    throw new Error('useSpacetime must be used within a SpacetimeProvider');
  }
  
  return {
    client,
    identity
  };
};
