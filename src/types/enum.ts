
export interface EnumValue {
  id: string;
  value: string;
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
