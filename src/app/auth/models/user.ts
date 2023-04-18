import { Role } from './role';

export class User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  persona: any;
  roles: Array<any>;
  token?: string;
  estado: string;
  tokenExpiracion: string;
}
