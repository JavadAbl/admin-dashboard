import type { User } from "./UserType";

export interface Auth {
  refreshToken: string;
  accessToken: string;
  user: User;
}
