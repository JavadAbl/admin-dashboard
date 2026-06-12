export type UserRole = "admin" | "manager" | "user" | "viewer";

export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  role: UserRole;
  isActive: UserStatus;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
}
