export type Role = "User" | "Admin" | "SuperAdmin";

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  position?: string | null;
};
