import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Enum, EnumValue, EnumsState } from '@/types/enum';
import { getSampleEnums } from '@/data/sampleData';
import { useClient, useIdentity } from '@/module_bindings/client';

interface EnumContextType {
  enums: Enum[];
  getEnum: (id: string) => Enum | undefined;
  getEnumValues: (enumId: string) => EnumValue[];
  addEnum: (name: string) => void;
  updateEnum: (id: string, name: string) => void;
  deleteEnum: (id: string) => void;
  addEnumValue: (enumId: string, value: string) => void;
  updateEnumValue: (enumId: string, valueId: string, newValue: string) => void;
  deleteEnumValue: (enumId: string, valueId: string) => void;
  reorderEnumValue: (enumId: string, valueId: string, newOrder: number) => void;
  loadEnumsForUnit: (unitId: string) => Promise<void>;
  loading: boolean;
}

const EnumContext = createContext<EnumContextType | undefined>(undefined);

export const useEnums = () => {
  const context = useContext(EnumContext);
  if (!context) {
    throw new Error('useEnums must be used within an EnumProvider');
  }
  return context;
};

// Legacy storage key - will be removed once we use server-side data
const STORAGE_KEY = 'sheet-editor-enums';

export const EnumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useClient();
  const identity = useIdentity();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<EnumsState>(() => {
    // Try to load from localStorage - legacy support until fully migrated
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        const enums = parsed.enums.map((e: any) => ({
          ...e,
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt)
        }));
        return { enums };
      } catch (e) {
        console.error('Failed to parse saved enums', e);
      }
    }
    // Default to initial state if nothing is saved
    return { enums: getSampleEnums() };
  });

  // Legacy - save to localStorage until fully migrated
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Load all enums for a unit in a single request
  const loadEnumsForUnit = async (unitId: string) => {
    if (!client || !unitId) return;
    
    setLoading(true);
    try {
      const result = await client.getAllEnumsForUnit(unitId);
      
      if (result) {
        // Transform the data to our internal format
        const enums = (result.enums as any[]).map(enumItem => {
          const enumId = enumItem.id;
          const enumItems = result.enumItems?.[enumId] as any[] || [];
          
          return {
            id: enumId,
            name: enumItem.name,
            values: enumItems.map(item => ({
              id: item.id,
              value: item.value,
              label: item.label || item.value,
              color: item.color,
              order: item.orderIndex
            })),
            createdAt: new Date(),
            updatedAt: new Date()
          };
        });
        
        setState({ enums });
      }
    } catch (error) {
      console.error('Error loading enums:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEnum = (id: string) => {
    return state.enums.find(e => e.id === id);
  };

  const getEnumValues = (enumId: string) => {
    const foundEnum = getEnum(enumId);
    return foundEnum ? foundEnum.values : [];
  };

  const addEnum = async (name: string) => {
    // Legacy local state update
    const newEnum: Enum = {
      id: uuidv4(),
      name,
      values: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setState(prev => ({
      ...prev,
      enums: [...prev.enums, newEnum]
    }));
    
    // Server-side update if client and identity exist
    if (client && identity && identity.activeUnitId) {
      try {
        await client.createEnum(identity.activeUnitId, name, '');
      } catch (error) {
        console.error('Error creating enum on server:', error);
      }
    }
  };

  const updateEnum = async (id: string, name: string) => {
    // Legacy local state update
    setState(prev => ({
      ...prev,
      enums: prev.enums.map(e => 
        e.id === id 
          ? { ...e, name, updatedAt: new Date() } 
          : e
      )
    }));
    
    // TODO: Add server-side update once API is available
  };

  const deleteEnum = async (id: string) => {
    // Prevent deletion of special enums
    if (id === 'nullable-bool') return;
    
    // Legacy local state update
    setState(prev => ({
      ...prev,
      enums: prev.enums.filter(e => e.id !== id)
    }));
    
    // Server-side delete
    if (client) {
      try {
        await client.deleteEnum(id);
      } catch (error) {
        console.error('Error deleting enum on server:', error);
      }
    }
  };

  const addEnumValue = async (enumId: string, value: string) => {
    // Legacy local state update
    setState(prev => ({
      ...prev,
      enums: prev.enums.map(e => {
        if (e.id === enumId) {
          const maxOrder = Math.max(-1, ...e.values.map(v => v.order));
          return {
            ...e,
            values: [
              ...e.values,
              { id: uuidv4(), value, order: maxOrder + 1 }
            ],
            updatedAt: new Date()
          };
        }
        return e;
      })
    }));
    
    // Server-side update
    if (client) {
      try {
        const enumData = getEnum(enumId);
        if (enumData) {
          const maxOrder = Math.max(-1, ...enumData.values.map(v => v.order));
          await client.addEnumItem(enumId, value, value, '', maxOrder + 1);
        }
      } catch (error) {
        console.error('Error adding enum value on server:', error);
      }
    }
  };

  const updateEnumValue = async (enumId: string, valueId: string, newValue: string) => {
    // Legacy local state update
    setState(prev => ({
      ...prev,
      enums: prev.enums.map(e => {
        if (e.id === enumId) {
          return {
            ...e,
            values: e.values.map(v => 
              v.id === valueId ? { ...v, value: newValue } : v
            ),
            updatedAt: new Date()
          };
        }
        return e;
      })
    }));
    
    // TODO: Add server-side update once API is available
  };

  const deleteEnumValue = async (enumId: string, valueId: string) => {
    // Legacy local state update
    setState(prev => ({
      ...prev,
      enums: prev.enums.map(e => {
        if (e.id === enumId) {
          return {
            ...e,
            values: e.values.filter(v => v.id !== valueId),
            updatedAt: new Date()
          };
        }
        return e;
      })
    }));
    
    // TODO: Add server-side delete once API is available
  };

  const reorderEnumValue = async (enumId: string, valueId: string, newOrder: number) => {
    // Legacy local state update
    setState(prev => ({
      ...prev,
      enums: prev.enums.map(e => {
        if (e.id === enumId) {
          const values = [...e.values];
          const valueIndex = values.findIndex(v => v.id === valueId);
          
          if (valueIndex !== -1) {
            const value = values[valueIndex];
            values.splice(valueIndex, 1);
            values.splice(newOrder, 0, value);
            
            // Recalculate orders
            const updatedValues = values.map((v, index) => ({
              ...v,
              order: index
            }));
            
            return {
              ...e,
              values: updatedValues,
              updatedAt: new Date()
            };
          }
        }
        return e;
      })
    }));
    
    // TODO: Add server-side reorder once API is available
  };

  const contextValue = useMemo(() => ({
    ...state,
    getEnum,
    getEnumValues,
    addEnum,
    updateEnum,
    deleteEnum,
    addEnumValue,
    updateEnumValue,
    deleteEnumValue,
    reorderEnumValue,
    loadEnumsForUnit,
    loading
  }), [state, loading]);

  return (
    <EnumContext.Provider value={contextValue}>
      {children}
    </EnumContext.Provider>
  );
};
