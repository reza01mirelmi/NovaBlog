export interface ModelAuthorsType {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: RoleType;
  createdAt?: Date;
  updatedAt?: Date;
}
export type RoleType = "ADMIN" | "USER";
