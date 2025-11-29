export interface RegisterDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}