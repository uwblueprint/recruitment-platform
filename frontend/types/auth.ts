import type { UserDTO } from "./user";

export type TokenInfo = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResult = TokenInfo & UserDTO;
