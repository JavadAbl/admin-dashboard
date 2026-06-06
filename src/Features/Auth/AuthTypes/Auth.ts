import type { User } from "./User";

export interface Auth {
  refreshToken: string;
  accessToken: string;
  user: User;
}
