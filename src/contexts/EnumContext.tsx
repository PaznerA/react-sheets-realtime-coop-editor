
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Enum, EnumValue, EnumsState } from '@/types/enum';

// Default NullableBool enum
const defaultEnums: Enum[] = [
  {
    id: 'nullable-bool',
    name: 'NullableBool',
    values: [
      { id: uuidv4(), value: 'yes', order: 0 },
      { id: uuidv4(), value: 'no', order: 1 },
      { id: uuidv4(), value: 'not-set', order: 2 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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
}

const EnumContext = createContext<EnumContextType | undefined>(undefined);

export const useEnums = () => {
  const context = useContext(EnumContext);
  if (!context) {
    throw new Error('useEnums must be used within an EnumProvider');
  }
  return context;
};

const STORAGE_KEY = 'sheet-editor-enums';

export const EnumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EnumsState>(() => {
    // Try to load from localStorage
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
    return { enums: defaultEnums };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getEnum = (id: string) => {
    return state.enums.find(e => e.id === id);
  };

  const getEnumValues = (enumId: string) => {
    const foundEnum = getEnum(enumId);
    return foundEnum ? foundEnum.values : [];
  };

  const addEnum = (name: string) => {
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
  };

  const updateEnum = (id: string, name: string) => {
    setState(prev => ({
      ...prev,
      enums: prev.enums.map(e => 
        e.id === id 
          ? { ...e, name, updatedAt: new Date() } 
          : e
      )
    }));
  };

  const deleteEnum = (id: string) => {
    // Prevent deletion of NullableBool
    if (id === 'nullable-bool') return;
    
    setState(prev => ({
      ...prev,
      enums: prev.enums.filter(e => e.id !== id)
    }));
  };

  const addEnumValue = (enumId: string, value: string) => {
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
  };

  const updateEnumValue = (enumId: string, valueId: string, newValue: string) => {
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
  };

  const deleteEnumValue = (enumId: string, valueId: string) => {
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
  };

  const reorderEnumValue = (enumId: string, valueId: string, newOrder: number) => {
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
  };

  const value = {
    enums: state.enums,
    getEnum,
    getEnumValues,
    addEnum,
    updateEnum,
    deleteEnum,
    addEnumValue,
    updateEnumValue,
    deleteEnumValue,
    reorderEnumValue
  };

  return <EnumContext.Provider value={value}>{children}</EnumContext.Provider>;
};
