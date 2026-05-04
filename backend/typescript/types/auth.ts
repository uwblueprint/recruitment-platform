import { UserDTO } from "./user";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type AuthDTO = Token & UserDTO;
