export interface Person {
  name: string;
  famliy: string;
  phone: number;
  email: string;
  age: number;
}

export interface Customer {
  person: Person;
  idCustomer: string;
  grade: number;
  isCustomer: boolean;
}
