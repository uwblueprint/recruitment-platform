import type { UserDTO } from "./user";

export type TokenInfo = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResult = TokenInfo & UserDTO;

export interface AuthStatus {
  loading: boolean;
  isAuthorized: boolean;
}
