
export interface EnumValue {
  id: string;
  value: string;
  label?: string;
  color?: string;
  order: number;
}

export interface Enum {
  id: string;
  name: string;
  values: EnumValue[];
  createdAt: Date;
  updatedAt: Date;
}

export type EnumsState = {
  enums: Enum[];
};

// Types for using enums in cell values
export type EnumValueId = string; // The ID of an enum value
export type EnumValues = EnumValueId[]; // For multiselect values
