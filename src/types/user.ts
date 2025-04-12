export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserSession {
  userId: string;
  token: string;
  expiry: Date;
}
