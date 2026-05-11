export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  position?: string;
  isArchived: boolean;
};

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<
  CreateUserDTO,
  "role" | "position" | "isArchived"
>;

export type Role = "User" | "Admin" | "SuperAdmin";

export type SignUpMethod = "PASSWORD" | "GOOGLE";
