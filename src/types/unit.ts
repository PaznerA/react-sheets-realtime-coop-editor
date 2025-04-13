export interface Unit {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnitMember {
  id: string;
  unitId: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: Date;
}
